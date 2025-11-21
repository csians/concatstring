"use client";
import React, { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@/css/blog.css";
import { useQuery } from "@apollo/client";
import { GET_BLOG_SETTINGS } from "@/lib/queries";
import { useRouter } from "next/navigation";
import { MeetWritersSkeleton } from "@/components/skeletons";
import { setBlogSettingsData, setUsersData } from "@/store/slices/blogSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";

const MeetWriters = () => {
  const dispatch = useDispatch();
  const cachedData = useSelector((state: RootState) => state.blog.blogSettings);
  const cachedUsersData = useSelector((state: RootState) => state.blog.users);
  const { data, error, loading } = useQuery(GET_BLOG_SETTINGS);
  const router = useRouter();

  // Use cached data from Redux if available, otherwise use fresh data from query
  const blogData = cachedData || data;

  // Store data in Redux when it comes from query
  useEffect(() => {
    if (data) {
      dispatch(setBlogSettingsData(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (data?.users) {
      dispatch(setUsersData(data.users));
    }
  }, [data?.users, dispatch]);

  // Show loading skeleton if data is loading and no cached data is available
  if (loading && !cachedData && !cachedUsersData) {
    return <MeetWritersSkeleton />;
  }

  // Show error message if there's an error
  // if (error)
  //   return (
  //     <div className="flex items-center justify-center min-h-[400px]">
  //       <div className="text-center">
  //         <h3 className="font-denton text-[24px] font-bold text-white mb-[16px]">
  //           Error loading writers
  //         </h3>
  //         <p className="text-[#C3C3C3]">Please try again later.</p>
  //       </div>
  //     </div>
  //   );

  const writersList = blogData?.page?.blogSettings?.writersList;
  const users = cachedUsersData?.nodes || blogData?.users?.nodes;

  // Don't show section if no data
  if (
    !writersList ||
    !writersList.title ||
    !writersList.description ||
    !users ||
    users.length === 0
  )
    return null;

  // Filter out csadmin user - check multiple properties to be sure
  const filteredUsers = users?.filter((user: any) => {
    return (
      user.username !== "csadmin" &&
      user.name !== "csadmin" &&
      user.slug !== "csadmin"
    );
  });

  // Don't show section if no filtered users
  if (!filteredUsers || filteredUsers.length === 0) {
    return null;
  }

  const settings = {
    slidesToShow: 4,
    infinite: false,
    arrows: false,
    autoplay: false,
    autoplaySpeed: 2500,
    dots: true,
    dotsClass: "slick-dots custom-slick-dots",
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
          infinite: false,
        },
      },
      {
        breakpoint: 950,
        settings: {
          slidesToShow: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 650,
        settings: {
          slidesToShow: 1,
          infinite: false,
        },
      },
    ],
  };

  return (
    <>
      {
        filteredUsers.length > 0 && (
          <section className="lg:pt-[120px] md:pt-[100px] pt-[60px]">
            <div className="container max-w-[1400px] px-[20px] mx-auto w-full">
              <div className="flex flex-col items-center justify-center gap-[16px] 2xl:mb-[60px] xl:mb-[60px] lg:mb-[50px] md:mb-[40px] sm:mb-[30px] mb-[30px]">
                <h2 className="h2 text-white text-center">{writersList?.title}</h2>
                <p className="font-lato font-normal text-[17px] leading-[26px] text-[#C3C3C3] text-center max-w-[1000px]">
                  {writersList?.description}
                </p>
              </div>

              <Slider {...settings} className="team-slider">
                {filteredUsers?.map((user: any) => (
                  <div
                    key={user.id}
                    className="rounded-[10px] py-[36px] px-[24px] flex flex-col items-center justify-center 2xl:mx-[15px] xl:me-[15px] lg:mx-[15px] md:mx-[10px] sm:mx-[10px] me-0 team-box hover:bg-[#D9D9D933] h-full"
                  >
                    <div className="flex flex-col gap-[18px] items-center justify-center gap-[24px] pb-[16px]">
                      <img
                        src={
                          user.userProfileImage?.userProfileImage?.node?.sourceUrl ||
                          user.avatar?.url
                        }
                        alt={user.name}
                        width="84"
                        height="84"
                        loading="lazy"
                        fetchPriority="low"
                        className="rounded-full object-cover w-[84px] h-[84px] object-top"
                      />
                      <h3 className="font-denton font-bold text-[24px] text-white leading-[100%]">
                        {user.name}
                      </h3>
                    </div>
                    <p className="font-lato font-normal text-[22px] leading-[36px] text-[#C3C3C3] text-center clamp-4">
                      {user.description}
                    </p>
                    <a
                      // href={`/author-details`}
                      onClick={() => {
                        const authorSlug = user?.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                        localStorage.setItem("selectedAuthorSlug", authorSlug);
                        router.push(`/author/${authorSlug}`);
                      }}
                      className="mt-[37px] flex items-center justify-center gap-[10px] text-white font-denton font-bold text-[18px] leading-[100%] cursor-pointer"
                    >
                      {writersList?.buttonLabel}
                      {writersList?.buttonIcon?.node?.sourceUrl && (
                        <img
                          src={writersList.buttonIcon.node.sourceUrl}
                          alt={writersList.buttonIcon.node.altText}
                          width="15"
                          height="20"
                          loading="lazy"
                          fetchPriority="low"
                        />
                      )}
                    </a>
                  </div>
                ))}
              </Slider>
            </div>
          </section>
        )
      }
    </>
  );
};

export default MeetWriters;
