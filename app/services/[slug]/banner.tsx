"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setServiceBanner } from "@/store/slices/serviceDetailsSlice";
import { RootState } from "@/store";
import Breadcrumb from "@/components/Breadcrumb";

interface Props {
  data: any;
}

const Banner: React.FC<Props> = ({ data }) => {
  const dispatch = useDispatch();

  // Get data from Redux store
  const cachedData = useSelector(
    (state: RootState) => state.serviceDetails.serviceBanner
  );

  // Dispatch data to Redux when it arrives
  useEffect(() => {
    if (data) {
      dispatch(setServiceBanner(data));
    }
  }, [data, dispatch]);

  // Use Redux data if available, otherwise use prop data
  const displayData = cachedData || data;

  const serviceName = displayData?.technology?.title;
  const bannerImage = displayData?.technology?.featuredImage?.node?.sourceUrl;
  const bannerAlt = displayData?.technology?.featuredImage?.node?.altText;

  return (
    <section
      className="hero-section bg-cover 2xl:pt-[254px] xl:pt-[254px] lg:pt-[250px] md:pt-[230px] sm:pt-[200px] pt-[200px] 2xl:pb-[334px] xl:pb-[334px] lg:pb-[330px] md:pb-[300px] sm:pb-[280px] pb-[250px] bg-no-repeat bg-bottom-left bg-white relative"
      style={{ backgroundImage: `url('${bannerImage}')` }}
      aria-label={bannerAlt}
    >
      <div className="container max-w-[1440px] px-[20px] mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="mb-10">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Services', href: '/services' },
              { label: serviceName || 'Service', isActive: true }
            ]}
            variant="contrast"
          />
        </div>
        
        <div className="flex justify-between items-center">
          <h1 className="h1 text-white max-w-[662px] leading-[100%]">
            {serviceName}
          </h1>
        </div>
      </div>
    </section>
  );
};

export default Banner;
