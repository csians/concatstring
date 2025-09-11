"use client";
import { GET_START_BUILDING } from "@/lib/queries";
import { useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setServiceStartBuilding } from "@/store/slices/serviceDetailsSlice";
import { RootState } from "@/store";

interface Props {
  data: any;
}

const StartBuilding: React.FC<Props> = ({ data }) => {
  const dispatch = useDispatch();
  
  // Get data from Redux store
  const cachedData = useSelector(
    (state: RootState) => state.serviceDetails.serviceStartBuilding
  );
  
  // Dispatch data to Redux when it arrives
  useEffect(() => {
    if (data) {
      dispatch(setServiceStartBuilding(data));
    }
  }, [data, dispatch]);

  // Use Redux data if available, otherwise use prop data
  const displayData = cachedData || data;
  
  const techSettings = displayData?.technology?.technologiesSettings;
  if (!techSettings) return null;

  return (
    <section className="building py-[120px]">
      <div className="container max-w-[1328px] px-[20px] mx-auto w-full">
        <div className="flex flex-col items-center justify-center 2xl:gap-[60px] xl:gap-[60px] lg:gap-[50px] md:gap-[40px] sm:gap-[30px] gap-[30px]">
          <div className="flex flex-col items-center justify-center gap-[16px]">
            <h2 className="h2 text-white text-center">
              {techSettings.startBuildingTitle}
            </h2>
            <p className="font-lato font-medium text-[16px] leading-[26px] text-[#C3C3C3] text-center max-w-[1020px]">
              {techSettings.startBuildingDescription}
            </p>
          </div>
          <div className="flex items-center justify-between 2xl:flex-row xl:flex-row lg:flex-row md:flex-col sm:flex-col flex-col w-full 2xl:gap-0 xl:gap-0 lg:gap-0 md:gap-[30px] sm:gap-[30px] gap-[30px]">
            <div className="flex flex-col items-start 2xl:pe-[40px] xl:pe-[40px] lg:pe-[40px] md:pe-0 sm:pe-0 pe-0 2xl:border-r border-[#D9D9D9] xl:border-r lg:border-r md:border-r-0 sm:border-r-0 border-r-0 2xl:py-[30px] xl:py-[30px] lg:py-[30px] md:py-0 sm:py-0 py-0 2xl:w-[920px] xl:w-[920px] lg:w-full md:w-full sm:w-full w-full">
              <h3 className="h4 text-white mb-[22px] leading-[normal]">
                {techSettings.digitalPresenceTitle}
              </h3>
              <p className="font-normal font-lato 2xl:text-[25px] xl:text-[25px] lg:text-[20px] md:text-[20px] sm:text-[18px] text-[18px] leading-[100%] text-white mb-[32px]">
                {techSettings.getInTouchTitle}
              </p>
              <a
                href={techSettings.getInTouchButton?.url}
                className="inline-block group"
              >
                <div className="btn-primary-outline">
                  <div className="btn-primary">
                    {techSettings.getInTouchButton?.title}
                  </div>
                </div>
              </a>
              <ul className="flex flex-col gap-[16px] hidden">
                {techSettings.contactDetails?.map(
                  (
                    item: { contactTitle: { title: string; url: string } },
                    idx: number
                  ) => (
                    <li key={idx} className="flex items-center gap-[16px]">
                      {/* Use a static SVG or replace with dynamic if available */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="29"
                        height="16"
                        viewBox="0 0 29 16"
                        fill="none"
                      >
                        <path
                          d="M1.78581 9.16089L21.0316 11.2976L19.3512 14.1712C18.8413 15.0464 19.9423 15.9624 20.7101 15.3049L28.4371 8.68244C28.5352 8.59809 28.614 8.49352 28.668 8.3759C28.722 8.25828 28.75 8.13038 28.75 8.00095C28.75 7.87152 28.722 7.74362 28.668 7.626C28.614 7.50837 28.5352 7.40381 28.4371 7.31945L20.7101 0.697042C19.9417 0.035968 18.8413 0.95552 19.3512 1.82723L21.0281 4.70433L1.78581 6.83809C0.405314 6.98746 0.404147 9.01094 1.78581 9.16089Z"
                          fill="url(#paint0_linear_985_7791)"
                        />
                        <defs>
                          <linearGradient
                            id="paint0_linear_985_7791"
                            x1="14.75"
                            y1="0.47168"
                            x2="14.75"
                            y2="15.5287"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#E72125" />
                            <stop offset="1" stopColor="#8E1D1D" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <a
                        href={item.contactTitle.url}
                        className="font-lato font-bold text-[18px] leading-[100%] text-white hover:text-red-500 transition-colors duration-300"
                      >
                        {item.contactTitle.title}
                      </a>
                    </li>
                  )
                )}
              </ul> 
            </div>
            <div className="2xl:ps-[15px] xl:ps-[15px] lg:ps-[15px] md:ps-0 sm:ps-0 pe-0 2xl:py-[30px] xl:py-[30px] lg:py-[30px] md:py-0 sm:py-0 py-0 flex 2xl:flex-col xl:flex-col lg:flex-col md:flex-row sm:flex-col flex-col gap-[50px] 2xl:items-start xl:items-start lg:items-start md:items-center sm:items-start items-start 2xl:w-[calc(100%-960px)] xl:w-[calc(100%-900px)] lg:w-full md:w-full sm:w-full w-full flex-wrap">
              <ul className="flex 2xl:flex-col xl:flex-col lg:flex-col md:flex-row sm:flex-col flex-col gap-[28px] items-start">
                <li className="flex items-center 2xl:gap-[15px] xl:gap-[15px] lg:gap-[15px] md:gap-[15px] sm:gap-[10px] gap-[10px]">
                  <img
                    src={techSettings.phoneSvg?.node?.sourceUrl}
                    alt={techSettings.phoneSvg?.node?.altText || "Phone"}
                    width={26}
                    height={26}
                    className="md:w-[26px] md:h-[auto] w-[26px] h-[auto]"
                  />
                  <a
                    href={`tel:${techSettings.contactNumber}`}
                    className="font-lato text-white font-bold text-[20px] leading-[100%] hover:underline"
                  >
                    {techSettings.contactNumber}
                  </a>
                </li>
                <li className="flex items-center 2xl:gap-[15px] xl:gap-[15px] lg:gap-[15px] md:gap-[15px] sm:gap-[10px] gap-[10px]">
                  <img
                    src={techSettings.mailSvg?.node?.sourceUrl}
                    alt={techSettings.mailSvg?.node?.altText || "Mail"}
                    width={26}
                    height={26}
                    className="md:w-[26px] md:h-[auto] w-[26px] h-[auto]"
                  />
                  <a
                    href={`mailto:${techSettings.emailAddress}`}
                    className="font-lato text-white font-bold text-[20px] leading-[100%] hover:underline"
                  >
                    {techSettings.emailAddress}
                  </a>
                </li>
              </ul>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartBuilding;
