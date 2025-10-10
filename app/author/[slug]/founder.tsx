"use client";
import React, { useEffect } from "react";
import "@/css/author-details.css";
import { useQuery, gql } from "@apollo/client";
import { GET_AUTHORS } from "@/lib/queries";
import { AuthorProfileSkeleton } from "@/components/skeletons";
import { setAuthorsData } from "@/store/slices/authorSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import Link from "next/link";

interface FounderProps {
  userId?: string | null;
}

const Founder: React.FC<FounderProps> = ({ userId }) => {
  const dispatch = useDispatch();
  const cachedData = useSelector((state: RootState) => state.author.authors);
  const { data, loading } = useQuery(GET_AUTHORS);

  // Use cached data from Redux if available, otherwise use fresh data from query
  const authorsData = cachedData || data;

  // Store data in Redux when it comes from query
  useEffect(() => {
    if (data) {
      dispatch(setAuthorsData(data));
    }
  }, [data, dispatch]);

  // Find the author by userId
  const author = authorsData?.users?.nodes?.find(
    (user: any) => user.id === userId
  );

  // Comment out the "Author not found" message to avoid showing it during navigation
  // if (!author) {
  //   return (
  //     <section className="pt-[140px] pb-[120px]">
  //       <div className="container max-w-[1400px] px-[20px] mx-auto w-full">
  //         <div className="text-center">
  //           <h3 className="font-denton text-[24px] font-bold text-white mb-[16px]">
  //             Author not found
  //           </h3>
  //           <p className="text-[#C3C3C3]">
  //             The requested author could not be found.
  //           </p>
  //         </div>
  //       </div>
  //     </section>
  //   );
  // }

  // Show loading state if data is loading and no cached data is available
  if (loading && !cachedData) {
    return (
      <section className="pt-[140px] pb-[120px]">
        <div className="container max-w-[1400px] px-[20px] mx-auto w-full">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E72125] mx-auto mb-4"></div>
              <p className="text-[#C3C3C3]">Loading author information...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Don't render anything if we don't have author data yet
  if (!author) {
    return null;
  }
  
  const { name, userProfileImage } = author;

  const {
    userRole,
    userProfileImage: profileImage,
    socialTitle,
    socialMedia,
    hour,
    honors,
    authorDetailDescription,
    authorDescription,
  } = userProfileImage || {};

  return (
    <section className="pt-[140px] pb-[120px]">
      <div className="container max-w-[1400px] px-[20px] mx-auto w-full">        
        <div className="flex flex-col 2xl:gap-[60px] xl:gap-[60px] lg:gap-[50px] md:gap-[40px] sm:gap-[30px] gap-[30px] items-center">
          <div className="flex flex-col 2xl:gap-[80px] xl:gap-[80px] lg:gap-[60px] md:gap-[50px] sm:gap-[40px] gap-[30px]">
            <div className="flex flex-col 2xl:gap-[44px] xl:gap-[44px] lg:gap-[30px] md:gap-[25px] sm:gap-[25px] gap-[25px] items-center justify-center">
              <div className="flex flex-col items-center justify-center">
                <h2 className="font-denton text-white font-bold 2xl:text-[80px] xl:text-[80px] lg:text-[70px] md:text-[60px] sm:text-[50px] text-[40px] 2xl:leading-[106px] xl:leading-[106px] lg:leading-[80px] md:leading-[80px] sm:leading-[70px] leading-[60px] text-center">
                  {name}
                </h2>
                <p className="font-lato text-center text-white font-normal text-[17px] leading-[26px]">
                  {userRole}
                </p>
              </div>
              <div className="flex items-start 2xl:gap-[60px] xl:gap-[60px] lg:gap-[50px] md:gap-[40px] sm:gap-[30px] gap-[30px] 2xl:flex-row xl:flex-row lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="2xl:w-[50%] xl:w-[50%] lg:w-[50%] md:w-[50%] sm:w-full w-full flex flex-col items-start justify-between h-full 2xl:gap-[75px] xl:gap-[75px] lg:gap-[50px] md:gap-[50px] sm:gap-[30px] gap-[20px]">
                  <p className="font-lato font-normal 2xl:text-[22px] xl:text-[22px] lg:text-[20px] md:text-[18px] sm:text-[18px] text-[18px] 2xl:leading-[36px] xl:leading-[36px] lg:leading-[25px] md:leading-[20px] sm:leading-[20px] leading-[30px] text-[#C3C3C3] text-left">
                    {authorDescription}
                  </p>
                  {socialMedia && socialMedia.length > 0 && (
                    <div className="flex flex-col gap-[16px] items-start">
                      <div className="flex items-center space-x-4">
                        <h4 className="font-lato font-bold text-[28px] leading-[36px] text-white">
                          {socialTitle}
                        </h4>
                        <ul className="flex items-center 2xl:gap-[40px] xl:gap-[40px] lg:gap-[30px] md:gap-[20px] sm:gap-[20px] gap-[10px]">
                          {socialMedia.map((social: any, index: number) => (
                            <li key={index}>
                              <Link
                                href={social.socialLink?.url}
                                target={social.socialLink?.target}
                                className="group w-[25px] h-[25px] flex items-center justify-center"
                              >
                                {social.socialSvg?.node?.sourceUrl ? (
                                  <img
                                    src={social.socialSvg.node.sourceUrl}
                                    alt={social.socialSvg.node.altText}
                                    width="20"
                                    height="22"
                                    className="w-[22px] h-[22px] group-hover:scale-[1.1]"
                                  />
                                ) : (
                                  <span className="text-white text-sm">
                                    {social.socialLink?.title}
                                  </span>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
                <div className="2xl:w-[50%] xl:w-[50%] lg:w-[50%] md:w-[50%] sm:w-full w-full">
                  {profileImage?.node?.sourceUrl ? (
                    <img
                      src={profileImage.node.sourceUrl}
                      alt={profileImage.node.altText}
                      width="630"
                      height="438"
                      className="border border-[#2E0707] border-[20px] rounded-[16px] h-[478px] object-cover object-top"
                    />
                  ) : (
                    <div className="border border-[#2E0707] border-[20px] rounded-[16px] w-full h-[438px] bg-gray-600 flex items-center justify-center">
                      <span className="text-white text-lg">
                        No Image Available
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[16px]">
              <h3 className="font-denton font-bold 2xl:text-[66px] xl:text-[66px] lg:text-[50px] md:text-[40px] sm:text-[40px] text-[30px] 2xl:leading-[87px] lg:leading-[87px] md:leading-[50px] sm:leading-[50px] leading-[40px] text-white">
                About {name}
              </h3>
              <p className="font-lato font-normal 2xl:text-[22px] xl:text-[22px] lg:text-[20px] md:text-[18px] sm:text-[18px] text-[18px] text-[#C3C3C3] 2xl:leading-[36px] xl:leading-[36px] lg:leading-[25px] md:leading-[20px] sm:leading-[20px] leading-[30px]">
                {authorDetailDescription}
              </p>
              {/* <p className="font-lato font-normal 2xl:text-[22px] xl:text-[22px] lg:text-[20px] md:text-[18px] sm:text-[18px] text-[18px] text-[#C3C3C3] 2xl:leading-[36px] xl:leading-[36px] lg:leading-[25px] md:leading-[20px] sm:leading-[20px] leading-[30px]">
                {authorDescription}
              </p> */}
            </div>
          </div>
          {honors && honors.length > 0 && (
            <div className="2xl:max-w-[1200px] xl:max-w-[1200px] lg:max-w-full md:max-w-full sm:max-w-full max-w-full w-full bg-[#2E0707] rounded-[16px] 2xl:py-[30px] xl:py-[30px] lg:py-[25px] md:py-[25px] sm:py-[20px] py-[20px] 2xl:px-[60px] xl:px-[40px] lg:px-[25px] md:px-[25px] sm:px-[20px] px-[20px] flex items-center 2xl:flex-row xl:flex-row lg:flex-row md:flex-col sm:flex-col flex-col gap-[20px]">
              <h3 className="font-denton 2xl:text-[34px] xl:text-[34px] lg:text-[25px] md:text-[25px] sm:text-[20px] text-[20px] 2xl:leading-[48px] xl:leading-[48px] lg:leading-[30px] md:leading-[30px] sm:leading-[25px] leading-[25px] text-white 2xl:max-w-[230px] xl:max-w-[230px] lg:max-w-[230px] md:max-w-full sm:max-w-full max-w-full 2xl:pe-[56px] xl:pe-[56px] lg:pe-[50px] md:pe-0 sm:pe-0 pe-0">
                {hour}
              </h3>
              <ul className="2xl:ps-[74px] xl:ps-[74px] lg:ps-[74px] md:ps-0 sm:ps-0 ps-0 flex items-center 2xl:gap-[100px] xl:gap-[100px] lg:gap-[60px] md:gap-[50px] sm:gap-[40px] gap-[30px] border-l-white 2xl:border-l xl:border-l lg:border-l md:border-l-none sm:border-l-none border-l-none">
                {honors.map((honor: any, index: number) => (
                  <li key={index}>
                    {honor.honorsImages?.node?.sourceUrl && (
                      <img
                        src={honor.honorsImages.node.sourceUrl}
                        alt={honor.honorsImages.node.altText}
                        width="77"
                        height="64"
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Founder;
