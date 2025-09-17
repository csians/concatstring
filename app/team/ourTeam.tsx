"use client";
import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setTeamData } from "@/store/slices/teamSlice";
import { GET_TEAM_LISTING } from "@/lib/queries";
import { TeamBannerSkeleton } from "@/components/skeletons";

const OurTeam = () => {
  const dispatch = useDispatch();
  const cachedTeamData = useSelector((state: RootState) => state.team.teamData);

  const { data, loading, error } = useQuery(GET_TEAM_LISTING);
  // When data arrives, save to Redux
  useEffect(() => {
    if (data) {
      dispatch(setTeamData(data));
    }
  }, [data, dispatch]);

  // Use Redux first, otherwise GraphQL response
  const finalData = cachedTeamData || data;

  const teamListingData =
    finalData?.page?.flexibleContent?.flexibleContent?.find(
      (item: any) => item?.teamListTitle
    );

  const teamListTitle = teamListingData?.teamListTitle;
  const bannerImage = teamListingData?.teamListBannerImage?.node?.sourceUrl;
  const bannerAltText = teamListingData?.teamListBannerImage?.node?.altText;

  const titleWords = teamListTitle ? teamListTitle.split(" ") : [];

  if (loading && !cachedTeamData) {
    return <TeamBannerSkeleton />;
  }

  if (error && !cachedTeamData) {
    return (
      <section className="pt-[160px] pb-[180px] bg-[#2E0707]">
        <div className="container mx-auto text-center">
          <h3 className="text-white font-bold text-[24px]">
            Error loading team data
          </h3>
          <p className="text-[#C3C3C3]">Please try again later.</p>
        </div>
      </section>
    );
  }

  if (!teamListTitle || !bannerImage) return null;

  return (
    <section
      className="mt-[114px] bg-cover lg:pt-[100px] sm:pt-[40px] pt-[20px] lg:pb-[100px] sm:pb-[40px] pb-[20px] bg-no-repeat bg-left aspect-[1700/800] rounded-bl-[20px] rounded-br-[20px]"
      style={{ backgroundImage: `url(${bannerImage})` }}
    >
      <div className="container max-w-[1440px] 2xl:px-[20px] xl:px-[20px] lg:px-[20px] md:px-[15px] sm:px-[12px] px-[10px] mx-auto">        
        <div className="flex justify-center items-center">
          <h1 className="h1 text-white leading-[100%] xl:text-[100px] max-sm:text-[30px]">
            {titleWords.map((word: string, index: number) => (
              <React.Fragment key={index}>
                {word}
                {
                  index < titleWords.length - 1 && (index === 1 ? " " : " ") // line break after 3rd word
                }
              </React.Fragment>
            ))}
          </h1>
        </div>
      </div>
    </section>
  );
};

export default OurTeam;
