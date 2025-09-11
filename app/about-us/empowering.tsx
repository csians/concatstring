"use client";
import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_ABOUT_BANNER } from "@/lib/queries";
import { EmpoweringSkeleton } from "@/components/skeletons";
import { setEmpoweringData } from "@/store/slices/aboutSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import Breadcrumb from "@/components/Breadcrumb";

const Empowering = () => {
  const dispatch = useDispatch();
  const cachedData = useSelector((state: RootState) => state.about.empowering);
  const { data, loading, error } = useQuery(GET_ABOUT_BANNER);

  // Get fresh data from query
  const freshData = data?.page?.flexibleContent?.flexibleContent?.find(
    (item: any) => item?.aboutBannerTitle
  );

  // Use cached data from Redux if available, otherwise use fresh data from query
  const bannerData = cachedData || freshData;

  // Store data in Redux when it comes from query
  useEffect(() => {
    if (data) {
      const empoweringBlock = data?.page?.flexibleContent?.flexibleContent?.find(
        (item: any) => item?.aboutBannerTitle
      );
      if (empoweringBlock) {
        dispatch(setEmpoweringData(empoweringBlock));
      }
    }
  }, [data, dispatch]);

  // Show skeleton while loading
  if (loading) return <EmpoweringSkeleton />;

  // Show error message if there's an error
  if (error)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="font-denton text-[24px] font-bold text-white mb-[16px]">
            Error loading banner
          </h3>
          <p className="text-[#C3C3C3]">Please try again later.</p>
        </div>
      </div>
    );
  if (!bannerData) return <EmpoweringSkeleton />;

  const title = bannerData?.aboutBannerTitle;
  const videoUrl = bannerData?.aboutBannerVideo?.node?.mediaItemUrl;
  const videoType = bannerData?.aboutBannerVideo?.node?.mimeType;

  return (
    <section className="min-h-full">
      <div className="about1 relative rounded-b-[34px] rounded-[34px] 2xl:pt-[390px] xl:pt-[390px] lg:pt-[350px] lg:pt-[320px] md:pt-[300px] sm:pt-[300px] pt-[250px] 2xl:pb-[310px] xl:pb-[310px] lg:pb-[300px] md:pb-[250px] sm:pb-[200px] pb-[200px] overflow-hidden">
        <video
          muted
          autoPlay
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover object-center"
        >
          <source src={videoUrl} type={videoType} />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div className="relative z-10 mx-auto px-[20px] flex flex-col items-center justify-center">
          {/* Breadcrumb Navigation */}
          <div className="mb-8">
            <Breadcrumb 
              items={[
                { label: 'Home', href: '/' },
                { label: 'About Us', isActive: true }
              ]}
              variant="contrast"
            />
          </div>
          
          <h1 className="h1 text-center text-white text-[45px] sm:text-[60px] md:text-[70px] lg:text-[80px] xl:text-[100px] 2xl:text-[100px] max-w-[1272px] max-h-[244px]">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
};

export default Empowering;
