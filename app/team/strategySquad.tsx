"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useQuery, useApolloClient } from "@apollo/client";
import { GET_TEAM_LISTING } from "@/lib/queries";
import { StrategySquadSkeleton } from "@/components/skeletons";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { setTeamData } from "@/store/slices/teamSlice";
import Link from "next/link";
import Image from "next/image";

interface TeamMember {
  teamSetting: {
    memberName: string;
    memberShortDesignation: string | null;
    memberImage: {
      node: {
        altText: string;
        sourceUrl: string;
      };
    };
    memberGif: {
      node: {
        altText: string;
        sourceUrl: string;
      };
    };
    memberFullName: string | null;
    memberDesignation: string;
    memberDescription: string | null;
    memberInfo: Array<{
      infoTitle: string;
      infoValue: string;
    }> | null;
    socialLinkTitle: string | null;
    socialLink: {
      title: string;
      url: string;
    } | null;
    socialSvg: {
      node: {
        altText: string;
        sourceUrl: string;
      };
    } | null;
    memberExperienceTitle: string | null;
    memberExperienceDiscription: string | null;
    profileSkillTitle: string | null;
    skillsDetail: Array<{
      skillEndColour: string;
      skillPercentage: string;
      skillStartColour: string;
      skillTitle: string;
    }> | null;
    memberDetailBackgroundImage: {
      node: {
        altText: string;
        sourceUrl: string;
      };
    } | null;
    memberExperienceInfo: Array<{
      experienceTitle: string;
      experienceDate: string;
    }> | null;
  };
}

interface TeamGroup {
  teamGroupTitle: string;
  teamMember: {
    nodes: TeamMember[];
  };
}

const StrategySquad = () => {
  const dispatch = useDispatch();
  const apolloClient = useApolloClient();
  const cachedTeamData = useSelector((state: RootState) => state.team.teamData);
  const { data, loading, error } = useQuery(GET_TEAM_LISTING, {
    fetchPolicy: 'cache-first', // Use cache first for faster loading
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true
  });
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupDataReady, setIsPopupDataReady] = useState(false);

  // Helper function to split name and return JSX with last name in red
  const renderNameWithRedLastName = (fullName: string) => {
    if (!fullName) return null;
    
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length <= 1) {
      return <span>{fullName}</span>;
    }
    
    const firstName = nameParts.slice(0, -1).join(' ');
    const lastName = nameParts[nameParts.length - 1];
    
    return (
      <>
        {firstName} <span style={{ color: 'rgb(231 33 37 / var(--tw-text-opacity, 1))' }}>{lastName}</span>
      </>
    );
  };

  // Helper function to calculate experience duration from date
  const calculateExperience = (startDate: string): string => {
    // Parse date assuming format is yyyy-dd-mm from WordPress
    const dateStr = startDate.split('T')[0]; // Get just the date part (2025-01-10)
    const [year, day, month] = dateStr.split('-').map(Number);
    
    // Create date object with correct format: yyyy-mm-dd
    const start = new Date(year, month - 1, day); // month - 1 because JS months are 0-indexed
    const now = new Date();
    
    // Calculate difference in milliseconds
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // If less than 30 days, show days
    if (diffDays < 30) {
      return diffDays === 0 ? "Today" : diffDays === 1 ? "1 Day" : `${diffDays} Days`;
    }
    
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();
    
    // Adjust if days is negative
    if (days < 0) {
      months--;
      // Get days in previous month
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    
    // Adjust if months is negative
    if (months < 0) {
      years--;
      months += 12;
    }
    
    // Format the output
    if (years === 0) {
      return months === 1 ? "1 Month" : `${months} Months`;
    } else if (months === 0) {
      return years === 1 ? "1 Year" : `${years} Years`;
    } else {
      const yearText = years === 1 ? "1 Year" : `${years} Years`;
      const monthText = months === 1 ? "1 Month" : `${months} Months`;
      return `${yearText} and ${monthText}`;
    }
  };

  // Prefetch data for better performance
  const prefetchTeamData = useCallback(async () => {
    if (!cachedTeamData) {
      try {
        await apolloClient.query({
          query: GET_TEAM_LISTING,
          fetchPolicy: 'cache-first'
        });
      } catch (error) {
        console.warn('Failed to prefetch team data:', error);
      }
    }
  }, [apolloClient, cachedTeamData]);

  // Prefetch data on component mount
  useEffect(() => {
    prefetchTeamData();
  }, [prefetchTeamData]);
  useEffect(() => {
    if (data) {
      dispatch(setTeamData(data));
    }
  }, [data, dispatch]);

  // Use Redux first
  const finalData = cachedTeamData || data;
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPopupOpen) {
        closePopup();
      }
    };

    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isPopupOpen]);

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedMember(null);
    setIsPopupDataReady(false);
    document.body.style.overflow = "auto";
  };

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
    setIsPopupDataReady(false);
    setIsPopupOpen(true);
    document.body.style.overflow = "hidden";
    
    // Check if data is already available, if so, show immediately
    if (finalData && member) {
      setIsPopupDataReady(true);
    } else {
      // Small delay to ensure data is ready
      setTimeout(() => {
        setIsPopupDataReady(true);
      }, 50);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closePopup();
    }
  };



  // Show error message if there's an error
  // if (error) {
  //   return (
  //     <section className="2xl:py-[120px] xl:py-[120px] lg:py-[100px] md:py-[80px] sm:py-[60px] py-[60px] bg-[#2E0707]">
  //       <div className="container max-w-[1400px] px-[20px] mx-auto w-full">
  //         <div className="text-center">
  //           <h3 className="font-denton text-[24px] font-bold text-white mb-[16px]">
  //             Error loading strategy squad
  //           </h3>
  //           <p className="text-[#C3C3C3]">Please try again later.</p>
  //         </div>
  //       </div>
  //     </section>
  //   );
  // }

  // Extract data from the GraphQL response
  const teamListingData =
    finalData?.page?.flexibleContent?.flexibleContent?.find(
      (item: any) => item?.teamListTitle
    );

  const teamGroups: TeamGroup[] = teamListingData?.teamGroup || [];

  // Get all groups except the first one (Vision Architects)
  const remainingGroups = teamGroups.slice(1);

  // if (remainingGroups.length === 0) {
  //   return null;
  // }
    // Show skeleton while loading
    if (remainingGroups.length === 0) {
      return <StrategySquadSkeleton />;
    }

  return (
    <>
      {remainingGroups.map((group, groupIndex) => (
        <section
          key={groupIndex}
          className="meet-the-mind bg-black pb-[50px] sm:pb-[60px] md:pb-[80px] lg:pb-[120px]"
        >
          <div className="container max-w-[1440px] px-[20px] mx-auto">
            <div className="flex flex-col items-center justify-center gap-[30px] sm:gap-[40px] md:gap-[60px]">
              <h3 className="h3 text-[22px] sm:text-[28px] md:text-[36px] lg:text-[48px] xl:text-[58px] 2xl:text-[66px] font-bold leading-[28px] sm:leading-[35px] md:leading-[45px] lg:leading-[60px] xl:leading-[75px] 2xl:leading-[87px] font-denton text-white text-center max-w-[1045px]">
                {group.teamGroupTitle}
              </h3>
              <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-[16px] sm:gap-[24px] md:gap-[30px] w-full 2xl:pb-[100px] xl:pb-[100px] lg:pb-0 md:pb-0 sm:pb-0 pb-0">
                {group.teamMember?.nodes?.map(
                  (member: TeamMember, memberIndex: number) => (
                    <div
                      key={memberIndex}
                      className={`group relative aspect-[447/587] rounded-xl overflow-hidden transition-all duration-500 py-[15px] sm:py-[15px] md:py-[20px] px-[15px] sm:px-[15px] md:px-[15px] flex items-end cursor-pointer ${memberIndex % 2 === 1
                        ? "2xl:translate-y-[100px] xl:translate-y-[100px] lg:translate-y-0 md:translate-y-0 sm:translate-y-0 translate-y-0"
                        : "translate-y-0"
                        }`}
                      onClick={() => handleMemberClick(member)}
                    >
                      {/* Static Background Image */}
                      {member.teamSetting.memberImage?.node?.sourceUrl && (
                        <Image
                          src={member.teamSetting.memberImage.node.sourceUrl}
                          alt={member.teamSetting.memberImage.node.altText || member.teamSetting.memberName}
                          fill
                          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0 object-top"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          loading="lazy"
                          fetchPriority="low"
                        />
                      )}

                      {/* GIF on Hover */}
                      {member.teamSetting.memberGif?.node?.sourceUrl && (
                        <Image
                          src={member.teamSetting.memberGif.node.sourceUrl}
                          alt={member.teamSetting.memberGif.node.altText || member.teamSetting.memberName}
                          fill
                          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          loading="lazy"
                          fetchPriority="low"
                        />
                      )}

                      {/* Content Area */}
                      <div className="bg-white rounded-[12px] p-[8px] sm:p-[12px] md:p-[15px] relative w-full z-10 flex items-center gap-[6px] sm:gap-[10px]">
                        <span className="bg-gradient-to-b from-[#E72125] to-[#8E1D1D] text-white rounded-[6px] flex items-center justify-center text-[16px] sm:text-[18px] md:text-[22px] font-denton leading-[100%] p-[8px] sm:p-[10px] w-max">
                          {renderNameWithRedLastName(member.teamSetting.memberName)}
                        </span>
                        <p className="text-[#707070] font-lato text-[12px] sm:text-[14px] md:text-[15px] leading-[18px] sm:leading-[22px] md:leading-[26px] transition-all duration-500">
                          {member.teamSetting.memberShortDesignation ||
                            member.teamSetting.memberDesignation}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Team Member Popup */}
      {isPopupOpen && selectedMember && (
        <div className="fixed inset-0 z-50 z-[9999999]">
          {/* Backdrop with blur effect */}
          <div
            className="absolute inset-0 bg-black bg-opacity-[0.02] backdrop-blur-[20px] bg-cover"
            style={{
              backgroundImage: `url(${selectedMember?.teamSetting.memberDetailBackgroundImage?.node?.sourceUrl})`,
            }}
            onClick={handleBackdropClick}
          ></div>

          {/* Modal Container */}
          <div className="relative flex items-center justify-center min-h-screen p-[20px]">
          <div className="fixed inset-0" onClick={closePopup}></div>
          <div className="bg-[#292929] max-h-[calc(100vh-80px)] overflow-y-auto rounded-[20px] shadow-[0px_24px_54px_0px_rgba(0,0,0,0.65)] w-full max-w-[1400px] xl:h-[744px] xl:h-[auto] md:h-auto sm:h-auto h-auto relative overflow-hidden custom-scrollbar sm:pt-[20px] md:pt-[20px] lg:pt-0 ">
              {/* Close Button */}
              <button
                onClick={closePopup}
                className="absolute xl:top-[40px] xl:right-[40px] top-[20px] right-[20px] z-20 w-[43.84px] h-[43.84px] rounded-full flex items-center justify-center opacity-75 hover:opacity-100 transition-opacity duration-300 group"
              >
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 44 44"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="1" className="group-hover:opacity-100 transition-opacity duration-300">
                    <path
                      d="M10.9603 10.9601C11.7413 10.1791 12.905 10.0764 13.5594 10.7308L33.1099 30.2813C33.7643 30.9357 33.6617 32.0994 32.8806 32.8804C32.0996 33.6615 30.9359 33.7641 30.2815 33.1098L10.731 13.5592C10.0766 12.9048 10.1792 11.7412 10.9603 10.9601Z"
                      fill="#E72125"
                    />
                    <path
                      d="M32.8802 10.9598C33.6613 11.7409 33.7639 12.9045 33.1096 13.5589L13.559 33.1094C12.9046 33.7638 11.741 33.6612 10.9599 32.8801C10.1789 32.0991 10.0762 30.9354 10.7306 30.281L30.2811 10.7305C30.9355 10.0761 32.0992 10.1788 32.8802 10.9598Z"
                      fill="#E72125"
                    />
                  </g>
                </svg>
              </button>

              {/* Loading State */}
              {!isPopupDataReady && (
                <div className="flex lg:flex-row flex-col h-auto">
                  {/* Profile Image Skeleton */}
                  <div className="xl:w-[auto] lg:w-[auto] max-h-[calc(100vh-80px)] w-full xl:h-[auto] lg:h-[100%] h-[auto] relative xl:pr-[20px] pr-[20px] lg:pr-[0px] rounded-[10px] overflow-hidden sm:max-w-[520px] lg:m-[0] sm:m-[auto] max-lg:pe-[0] aspect-[400/470]">
                    <div className="w-full h-full bg-gray-700 animate-pulse rounded-[10px]"></div>
                  </div>

                  {/* Content Skeleton */}
                  <div className="flex-1 relative lg:p-[50px] md:p-[40px] p-[20px] lg:pl-[40px] xl:pr-[86px] xl:pt-[50px] xl:pb-[50px] lg:pr-[40px] lg:pt-[60px] md:pr-[40px] lg:pb-[20px] custom-scrollbar max-h-none !ml-0 max-sm:px-[15px] max-sm:py-[20px]">
                    <div className="space-y-[16px] custom-scrollbar max-h-none overflow-y-auto md:pr-[20px] pr-[0px] absolute top-[80px] right-[80px] left-[40px] bottom-[80px] max-xl:top-[50px] max-xl:right-[60px] max-xl:left-[40px] max-xl:bottom-[40px] max-lg:relative max-lg:top-[0px] max-lg:right-[0px] max-lg:left-[0px] max-lg:bottom-[0px]">
                      {/* Name and Title Skeleton */}
                      <div className="space-y-4">
                        <div className="h-16 bg-gray-700 animate-pulse rounded w-3/4"></div>
                        <div className="h-8 bg-gray-700 animate-pulse rounded w-1/2"></div>
                      </div>

                      {/* Description Skeleton */}
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-700 animate-pulse rounded w-full"></div>
                        <div className="h-4 bg-gray-700 animate-pulse rounded w-5/6"></div>
                        <div className="h-4 bg-gray-700 animate-pulse rounded w-4/5"></div>
                      </div>

                      {/* Details Skeleton */}
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-700 animate-pulse rounded w-2/3"></div>
                        <div className="h-4 bg-gray-700 animate-pulse rounded w-3/4"></div>
                        <div className="h-4 bg-gray-700 animate-pulse rounded w-1/2"></div>
                      </div>

                      {/* Skills Skeleton */}
                      <div className="space-y-4 mt-8">
                        <div className="h-10 bg-gray-700 animate-pulse rounded w-1/3"></div>
                        <div className="space-y-3">
                          <div className="h-12 bg-gray-700 animate-pulse rounded w-full"></div>
                          <div className="h-12 bg-gray-700 animate-pulse rounded w-4/5"></div>
                          <div className="h-12 bg-gray-700 animate-pulse rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Popup Content - Only show when data is ready */}
              {isPopupDataReady && (
                <div className="flex lg:flex-row flex-col h-auto">
                  {/*  Profile Image Section  */}
                  <div className="xl:w-[auto] lg:w-[auto] max-h-[calc(100vh-80px)] w-full xl:h-[auto] lg:h-[100%] h-[auto] relative  xl:pr-[20px] pr-[20px] lg:pr-[0px] rounded-[10px] overflow-hidden sm:max-w-[520px] lg:m-[0] sm:m-[auto] max-lg:pe-[0] aspect-[400/470]">
                    <div className="w-full h-full">
                      <div className="w-full h-full overflow-hidden rounded-[10px]">
                        {selectedMember?.teamSetting?.memberImage?.node?.sourceUrl && (
                          <Image
                            src={selectedMember.teamSetting.memberImage.node.sourceUrl}
                            alt={selectedMember.teamSetting.memberImage.node.altText || selectedMember.teamSetting.memberName}
                            width={400}
                            height={470}
                            className="w-full h-full object-cover object-top aspect-[400/470]"
                            sizes="(max-width: 768px) 100vw, 400px"
                            loading="lazy"
                            fetchPriority="low"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/*  Content Section  */}
                  <div className="flex-1 relative lg:p-[50px] md:p-[40px] p-[20px] lg:pl-[40px] xl:pr-[86px]  xl:pt-[50px] xl:pb-[50px] lg:pr-[40px]  lg:pt-[60px] md:pr-[40px] lg:pb-[20px] custom-scrollbar max-h-none !ml-0 max-sm:px-[15px] max-sm:py-[20px]">
                    {/*  Vertical Scroll Indicator (Desktop Only)  */}

                    <div className="space-y-[16px] custom-scrollbar max-h-none overflow-y-auto md:pr-[20px] pr-[0px] absolute top-[80px] right-[80px] left-[40px] bottom-[80px] max-xl:top-[50px] max-xl:right-[60px] max-xl:left-[40px] max-xl:bottom-[40px] max-lg:relative max-lg:top-[0px] max-lg:right-[0px] max-lg:left-[0px] max-lg:bottom-[0px]">
                      {/*  Name and Title  */}
                      <div>
                        <h2 className="font-denton font-bold text-[36px] lg:text-[48px] xl:text-[58px] 2xl:text-[66px] leading-[1.325] text-white mb-0">
                          {renderNameWithRedLastName(selectedMember?.teamSetting?.memberFullName ||
                            selectedMember?.teamSetting?.memberName)}
                        </h2>
                        <p className="font-lato md:text-[27px] text-[20px] text-[#E72125] mb-[16px]">
                          {selectedMember?.teamSetting?.memberDesignation}
                        </p>
                      </div>

                      {/*  Description  */}
                      {selectedMember?.teamSetting?.memberDescription && (
                        <p className="font-lato text-[16px] leading-[1.625] mt-[16px] text-[#C3C3C3]">
                          {selectedMember.teamSetting.memberDescription}
                        </p>
                      )}

                    {/*  Details  */}
                    <div className="space-y-2">
                      {/* Dynamic Experience Info */}
                      {selectedMember?.teamSetting?.memberExperienceInfo?.map(
                        (info: any, index: number) => (
                          <p
                            key={index}
                            className="font-lato text-[17px] leading-[1.647] text-[#E9E9E9]"
                          >
                            {info.experienceTitle}: {calculateExperience(info.experienceDate)}
                          </p>
                        )
                      )}
                      
                      {/* Email Info */}
                      {selectedMember?.teamSetting?.memberInfo?.map(
                        (info: any, index: number) => {
                          // Only show email info
                          if (info.infoTitle.toLowerCase().includes('email')) {
                            return (
                              <p
                                key={index}
                                className="font-lato text-[17px] leading-[1.647] text-[#E9E9E9]"
                              >
                                {info.infoTitle}: {
                                  <Link
                                    href={`mailto:${info.infoValue}`}
                                    className="hover:underline transition-all duration-300"
                                  >
                                    {info.infoValue}
                                  </Link>
                                }
                              </p>
                            );
                          }
                          return null;
                        }
                      )}
                    </div>

                      {/*  Social Links  */}
                      {selectedMember?.teamSetting?.socialLinkTitle &&
                        selectedMember?.teamSetting?.socialLink && (
                          <div className="flex items-center justify-start gap-[10px]">
                            <h4 className="font-denton font-bold text-[22px] leading-[1.273] text-white">
                              {selectedMember.teamSetting.socialLinkTitle}
                            </h4>
                            <div className="flex mt-[-4px]">
                              <Link
                                href={selectedMember.teamSetting.socialLink.url}
                                target="_blank"
                                className="group w-[25px] h-[25px] flex items-center justify-center"
                              >
                                {selectedMember.teamSetting.socialSvg && (
                                  <Image
                                    src={selectedMember.teamSetting.socialSvg.node.sourceUrl}
                                    alt={selectedMember.teamSetting.socialSvg.node.altText || "Social link"}
                                    width={20}
                                    height={20}
                                    className="w-[20px] h-[20px] group-hover:scale-[1.1]"
                                    loading="lazy"
                                    fetchPriority="low"
                                  />
                                )}
                              </Link>
                            </div>
                          </div>
                        )}

                      {/*  Experience Section  */}
                      {selectedMember?.teamSetting?.memberExperienceTitle &&
                        selectedMember?.teamSetting
                          ?.memberExperienceDiscription && (
                          <div className="!mt-[50px]">
                            <h3 className="font-denton font-medium md:text-[40px] text-[30px] leading-[1.325] text-white">
                              {selectedMember.teamSetting.memberExperienceTitle}
                            </h3>
                            <p className="font-lato text-[16px] leading-[1.625] text-[#C3C3C3]">
                              {
                                selectedMember.teamSetting
                                  .memberExperienceDiscription
                              }
                            </p>
                          </div>
                        )}

                      {/*  Skills Section  */}
                      {selectedMember?.teamSetting?.profileSkillTitle &&
                        selectedMember?.teamSetting?.skillsDetail &&
                        selectedMember.teamSetting.skillsDetail.length > 0 && (
                          <div className="space-y-6">
                            <h3 className="font-denton font-medium md:text-[40px] text-[30px] leading-[1.325] text-white">
                              {selectedMember.teamSetting.profileSkillTitle}
                            </h3>

                            {selectedMember.teamSetting.skillsDetail.map(
                              (skill: any, index: number) => (
                                <div key={index} className="relative">
                                  <div className="bg-[#D9D9D9] bg-opacity-50 border border-white rounded-[20px] h-[46px] relative overflow-hidden">
                                    <div
                                      className="absolute inset-0 rounded-[50px] h-[38px] top-[4px] left-[4px]"
                                      style={{
                                        background: `linear-gradient(to right, ${skill.skillStartColour}, ${skill.skillEndColour})`,
                                        width: skill.skillPercentage,
                                      }}
                                    ></div>
                                    <div className="absolute inset-0 flex items-center justify-between px-6">
                                      <span className="font-denton font-normal text-[18px] text-white">
                                        {skill.skillTitle}
                                      </span>
                                      <span className="font-denton font-normal text-[18px] text-white">
                                        {skill.skillPercentage}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StrategySquad;
