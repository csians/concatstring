"use client";
import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_AUTHORS } from "@/lib/queries";
import { ConnectNowSkeleton } from "@/components/skeletons";
import { setAuthorsData } from "@/store/slices/authorSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import Link from "next/link";

interface ConnectNowProps {
  userId?: string | null;
}

const ConnectNow: React.FC<ConnectNowProps> = ({ userId }) => {
  const dispatch = useDispatch();
  const cachedData = useSelector((state: RootState) => state.author.authors);
  const { data: authorsData, error, loading } = useQuery(GET_AUTHORS);

  // Use cached data from Redux if available, otherwise use fresh data from query
  const data = cachedData || authorsData;

  // Store data in Redux when it comes from query
  useEffect(() => {
    if (authorsData) {
      dispatch(setAuthorsData(authorsData));
    }
  }, [authorsData, dispatch]);

  const author = React.useMemo(() => {
    if (!data?.users?.nodes || !userId) return null;
    return data.users.nodes.find((user: any) => user.id === userId);
  }, [data, userId]);

  // Show loading state if data is loading and no cached data is available
  if (loading && !cachedData) {
    return <ConnectNowSkeleton />;
  }

  // Show error message if there's an error
  // if (error) {
  //   return (
  //     <section className="mb-[100px]">
  //       <div className="container max-w-[1400px] px-[20px] mx-auto w-full">
  //         <div className="bg-white/10 2xl:p-[100px] xl:p-[100px] lg:p-[80px] md:p-[60px] sm:p-[40px] p-[30px] rounded-[16px]">
  //           <div className="text-center">
  //             <h3 className="font-denton text-[24px] font-bold text-white mb-[16px]">
  //               Error loading contact information
  //             </h3>
  //             <p className="text-[#C3C3C3]">Please try again later.</p>
  //           </div>
  //         </div>
  //       </div>
  //     </section>
  //   );
  // }

  const contactSection = author?.userProfileImage?.contactSection;
  const contactTitle = contactSection?.contactTitle;
  const contactDescription = contactSection?.contactDescription;
  const contactLink = contactSection?.contactLink;
  const bgImage = contactSection?.bgImage?.node?.sourceUrl;
  if (!contactSection || !contactTitle || !contactDescription) {
    return null;
  }
  return (
    <>
      {
        (bgImage || contactTitle || contactDescription) && (
          <section
            className="bg-cover 2xl:py-[165px] xl:py-[165px] lg:py-[150px] lg:py-[140px] md:py-[120px] sm:py-[120px] py-[120px] mb-[120px]"
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            <div className="container max-w-[1177px] px-[20px] mx-auto">
              <div className="flex items-center justify-center flex-col">
                <h2 className="h2 text-white text-center mb-[16px] normal-case">
                  {contactTitle}
                </h2>
                <p className="font-lato font-medium text-white text-[16px] leading-[26px] 2xl:mb-[60px] xl:mb-[60px] lg:mb-[40px] md:mb-[30px] sm:mb-[30px] mb-[20px] text-center max-w-[1019px]">
                  {contactDescription}
                </p>
                {contactLink && (
                  <Link
                    href={contactLink.url}
                    target={contactLink.target}
                    className="inline-block group"
                  >
                    <div className="btn-primary-outline">
                      <div className="btn-primary">{contactLink.title}</div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </section>
        )
      }
    </>
  );
};

export default ConnectNow;
