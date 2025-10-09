"use client";
import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { GET_OUR_SERVICE_BANNER } from "@/lib/queries";
import { setOurServiceBanner } from "@/store/slices/servicesSlice";
import { RootState } from "@/store";

const OurServices = () => {
  const dispatch = useDispatch();

  const cachedData = useSelector(
    (state: RootState) => state.services.ourServiceBanner
  );
  console.log("Cached Data:", cachedData);
  const { data, loading, error } = useQuery(GET_OUR_SERVICE_BANNER, {
    errorPolicy: 'all', // Allow partial data even if there are errors
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (data) {
      console.log("Fetched Data:", data);
      dispatch(setOurServiceBanner(data));
    }
  }, [data, dispatch]);

  const displayData = cachedData || data;

  const bannerData = displayData?.page?.flexibleContent?.flexibleContent?.find(
    (block: any) => block?.ourServiceTitle && block?.serviceVideo
  );

  const title = bannerData?.ourServiceTitle || "Our Services";
  const videoUrl = bannerData?.serviceVideo?.node?.mediaItemUrl;
  const videoType = bannerData?.serviceVideo?.node?.mimeType || "video/mp4";

  return (
    <section className="min-h-full">
      <div className="service1 relative rounded-b-[34px] rounded-[34px] 2xl:pt-[390px] xl:pt-[390px] lg:pt-[350px] lg:pt-[320px] md:pt-[300px] sm:pt-[300px] pt-[250px] 2xl:pb-[310px] xl:pb-[310px] lg:pb-[300px] md:pb-[250px] sm:pb-[200px] pb-[200px] overflow-hidden">
        {videoUrl && (
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
        )}
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 mx-auto px-[20px] flex flex-col items-center justify-center">         
          <h1 className="h1 text-center text-white text-[45px] sm:text-[60px] md:text-[70px] lg:text-[80px] xl:text-[100px] 2xl:text-[100px] max-w-[1200px]">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
};
export default OurServices;
