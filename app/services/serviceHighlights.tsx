"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_DISCOVER_OUR_SERVICES } from "@/lib/queries";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { setDiscoverOurServices } from "@/store/slices/servicesSlice";
import Link from "next/link";

const ServiceHighlights = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const cachedData = useSelector(
    (state: RootState) => state.services.discoverOurServices
  );
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState("Select Services You Want");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data } = useQuery(GET_DISCOVER_OUR_SERVICES);
  useEffect(() => {
    if (data) {
      dispatch(setDiscoverOurServices(data));
    }
  }, [data, dispatch]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const displayData = cachedData || data;
  const servicesData =
    displayData?.page?.flexibleContent?.flexibleContent?.find(
      (item: any) => item.discoverServicesTitle
    );
  const services = servicesData?.ourServicesTechnology?.nodes || [];
  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const selectService = (service: any, serviceSlug: any) => {
    setSelected(service);
    setIsOpen(false);
    if (serviceSlug) {
      router.push(`/services/${serviceSlug}`);
    }
  };
  return (
    <>
      {
        services?.length > 0 && (
          <section className="flex flex-col gap-[60px] items-center justify-center 2xl:pt-[60px] xl:pt-[60px] lg:pt-[60px] md:pt-[60px] sm:pt-[60px] pt-[50px]">
            <div className="container max-w-[1400px] px-[20px] mx-auto w-full">
              <div className="flex flex-col 2xl:gap-[60px] xl:gap-[60px] lg:gap-[50px] md:gap-[50px] sm:gap-[40px] gap-[30px] items-center justify-center">
                {/* <h2 className="h2 text-white text-center">
                  {servicesData?.discoverServicesTitle ||
                    "Discover our services that are vital for us:"}
                </h2> */}
                <div className="flex flex-col 2xl:gap-[60px] xl:gap-[60px] lg:gap-[50px] md:gap-[50px] sm:gap-[40px] gap-[30px]  max-w-[1400px] md:px-[20px] px-[0px] mx-auto w-full">
                  {services.map((service: any, index: any) => {
                    const settings = service.technologiesSettings;
                    const isEven = index % 2 === 0;
                    const bgColor = isEven ? "bg-[#1a3141]" : "bg-[#FF00004D]";
                    const webServicesList = settings?.webServicesList?.nodes || [];

                    return (
                      <div
                        key={index}
                        className={`${bgColor} 2xl:p-[80px] xl:p-[80px] lg:p-[60px] md:p-[50px] sm:p-[40px] p-[20px] rounded-[30px] flex items-center gap-[12px] w-full 2xl:flex-row xl:flex-row lg:flex-row md:flex-row sm:flex-col flex-col`}
                      >
                        {isEven ? (
                          <>
                            <div className="flex flex-col gap-[24px] items-start 2xl:w-[calc(100%-310px)] xl:w-[calc(100%-310px)] lg:w-[calc(100%-310px)] md:w-[calc(100%-310px)] sm:w-full w-full 2xl:order-1 xl:order-1 lg:order-1 md:order-1 sm:order-2 order-2">
                              <div className="flex flex-col gap-[20px]">
                                <h3 className="h3 text-white text-[25px] sm:text-[30px] md:text-[40px] lg:text-[50px] xl:text-[60px] 2xl:text-[66px]">
                                  {settings.ourServiceTitle}
                                </h3>
                                <p className="font-lato font-medium text-[18px] leading-[28px] text-white">
                                  {settings.ourServiceDescription}
                                </p>
                              </div>
                              <div className="flex flex-row flex-wrap gap-[20px] items-center">
                                {Array.isArray(webServicesList) &&
                                  webServicesList.length > 0 && (
                                    <div ref={dropdownRef} className="relative 2xl:w-[330px] xl:w-[330px] lg:w-[330px] md:w-[330px] sm:w-full w-full">
                                      <button
                                        type="button"
                                        onClick={toggleDropdown}
                                        aria-haspopup="listbox"
                                        aria-expanded={isOpen}
                                        aria-controls={`services-listbox-${index}`}
                                        aria-labelledby={`selected-service-${index}`}
                                        className={`cursor-pointer flex items-center font-denton justify-between w-full px-[20px] py-[14px] rounded-full text-white text-[17px] font-normal leading-[18px] bg-gradient-to-r from-[#E72125] to-[#8E1D1D] transition-all duration-300 ${isOpen ? "bg-[#E72125]" : "bg-[#E72125]/20"
                                          }`}
                                      >
                                        <div className="absolute inset-0 bg-[#1a3141] top-[1px] left-[1px] right-[1px] bottom-[1px] rounded-full z-[0]"></div>
                                        <div className="absolute inset-0 bg-[#e7212533] top-[1px] left-[1px] right-[1px] bottom-[1px] rounded-full z-[2]"></div>
                                        <span id={`selected-service-${index}`} className="z-[3]">{selected}</span>
                                        <svg
                                          className={`w-4 h-4 transition-transform duration-300 z-[3] ${isOpen ? "rotate-180" : ""
                                            }`}
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="3"
                                          viewBox="0 0 24 24"
                                          aria-hidden="true"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19 9l-7 7-7-7"
                                          />
                                        </svg>
                                      </button>

                                      <div
                                        className="font-lato absolute top-full w-full rounded-[10px] bg-[#2B2B2B] text-white z-10 overflow-hidden transform transition-all duration-300 ease-in-out origin-top"
                                        style={{
                                          transform: isOpen ? 'scaleY(1) translateY(0)' : 'scaleY(0) translateY(-10px)',
                                          opacity: isOpen ? 1 : 0,
                                          maxHeight: isOpen ? '500px' : '0px',
                                          pointerEvents: isOpen ? 'auto' : 'none'
                                        }}
                                        role="listbox"
                                        tabIndex={-1}
                                        aria-label="Services dropdown"
                                        id={`services-listbox-${index}`}
                                      >
                                        <div className="p-[20px]">
                                          <ul role="presentation" className="flex flex-col gap-[8px] text-[18px] font-medium text-white">
                                            {webServicesList.map((serviceItem) => (
                                              <li
                                                key={serviceItem.id}
                                                onClick={() =>
                                                  selectService(
                                                    serviceItem.technologiesSettings
                                                      .ourServiceTitle,
                                                    serviceItem.slug
                                                  )
                                                }
                                                className="hover:text-[#E72125] cursor-pointer transition-colors duration-200"
                                                role="option"
                                                aria-selected={
                                                  selected ===
                                                  serviceItem.technologiesSettings
                                                    .ourServiceTitle
                                                }
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                  if (
                                                    e.key === "Enter" ||
                                                    e.key === " "
                                                  ) {
                                                    selectService(
                                                      serviceItem
                                                        .technologiesSettings
                                                        .ourServiceTitle,
                                                      serviceItem.slug
                                                    );
                                                  }
                                                }}
                                              >
                                                {
                                                  serviceItem.technologiesSettings
                                                    .ourServiceTitle
                                                }
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                <Link
                                  // href={
                                  //   settings.ourServiceLink?.url || "/service-detail"
                                  // }
                                  href={`/services/${service?.slug}`}
                                  className="flex items-center gap-[16px] font-denton text-[18px] leading-[100%] font-bold text-white hover:opacity-80"
                                >
                                  Read More
                                  {/* <img
                                    src={
                                      settings.redirectSvg?.node?.sourceUrl ||
                                      "./images/gif/progress.gif"
                                    }
                                    alt={
                                      settings.redirectSvg?.node?.altText ||
                                      "progress"
                                    }
                                    width="46"
                                    height="46"
                                  /> */}
                                  <img alt="view more" width="15" height="20" loading="lazy" fetchPriority="low" className="w-[15px] h-[20px]" src="https://staging1.concatstring.com/wp-content/uploads/2025/07/svgviewer-png-output.png"></img>
                                </Link>
                              </div>
                            </div>
                            <div className="flex 2xl:w-[298px] xl:w-[298px] lg:w-[298px] md:w-[298px] md:justify-end md:items-end items-center justify-center sm:w-full w-full 2xl:order-2 xl:order-2 lg:order-2 md:order-2 sm:order-1 order-1">
                              <img
                                src={settings.ourServiceSvg?.node?.sourceUrl}
                                alt={settings.ourServiceSvg?.node?.altText}
                                width="298"
                                height="298"
                                loading="lazy"
                                fetchPriority="low"
                                className="2xl:w-[298px] xl:w-[298px] lg:w-[298px] md:w-[298px] sm:w-[200px] w-[150px]"
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex 2xl:w-[298px] xl:w-[298px] lg:w-[298px] md:w-[298px] sm:w-full w-full">
                              <img
                                src={settings.ourServiceSvg?.node?.sourceUrl}
                                alt={settings.ourServiceSvg?.node?.altText}
                                width="298"
                                height="298"
                                className="2xl:w-[298px] xl:w-[298px] lg:w-[298px] md:w-[298px] sm:w-[200px] w-[200px]"
                                loading="lazy"
                                fetchPriority="low"
                              />
                            </div>
                            <div className="flex flex-col gap-[24px] items-start 2xl:w-[calc(100%-310px)] xl:w-[calc(100%-310px)] lg:w-[calc(100%-310px)] md:w-[calc(100%-310px)] sm:w-full w-full">
                              <div className="flex flex-col gap-[20px]">
                                <h3 className="h3 text-white">
                                  {settings.ourServiceTitle}
                                </h3>
                                <p className="font-lato font-medium text-[18px] leading-[28px] text-white">
                                  {settings.ourServiceDescription}
                                </p>
                              </div>
                              {Array.isArray(webServicesList) &&
                                webServicesList.length > 0 && (
                                  <div ref={dropdownRef} className="relative w-[330px]">
                                    <button
                                      type="button"
                                      onClick={toggleDropdown}
                                      aria-haspopup="listbox"
                                      aria-expanded={isOpen}
                                      aria-controls={`services-listbox-${index}`}
                                      aria-labelledby={`selected-service-${index}`}
                                      className={`cursor-pointer flex items-center justify-between w-full px-[20px] py-[12px] rounded-full text-white text-[17px] font-normal leading-[100%] border border-[#E72125] transition-all duration-300 ${isOpen ? "bg-[#E72125]" : "bg-[#E72125]/20"
                                        }`}
                                    >
                                      <span id={`selected-service-${index}`}>{selected}</span>
                                      <svg
                                        className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                          }`}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M19 9l-7 7-7-7"
                                        />
                                      </svg>
                                    </button>

                                    <div
                                      className="font-lato absolute top-full mt-2 w-full rounded-[10px] bg-[#2B2B2B] text-white z-10 overflow-hidden transform transition-all duration-300 ease-in-out origin-top"
                                      style={{
                                        transform: isOpen ? 'scaleY(1) translateY(0)' : 'scaleY(0) translateY(-10px)',
                                        opacity: isOpen ? 1 : 0,
                                        maxHeight: isOpen ? '500px' : '0px',
                                        pointerEvents: isOpen ? 'auto' : 'none'
                                      }}
                                      role="listbox"
                                      tabIndex={-1}
                                      aria-label="Services dropdown"
                                      id={`services-listbox-${index}`}
                                    >
                                      <div className="p-[20px]">
                                        <ul role="presentation" className="flex flex-col gap-[8px] text-[18px] font-medium text-white">
                                          {webServicesList.map((serviceItem) => (
                                            <li
                                              key={serviceItem.id}
                                              onClick={() =>
                                                selectService(
                                                  serviceItem.technologiesSettings
                                                    .ourServiceTitle,
                                                  serviceItem.slug
                                                )
                                              }
                                              className="hover:text-[#E72125] cursor-pointer transition-colors duration-200"
                                              role="option"
                                              aria-selected={
                                                selected ===
                                                serviceItem.technologiesSettings
                                                  .ourServiceTitle
                                              }
                                              tabIndex={0}
                                              onKeyDown={(e) => {
                                                if (
                                                  e.key === "Enter" ||
                                                  e.key === " "
                                                ) {
                                                  selectService(
                                                    serviceItem
                                                      .technologiesSettings
                                                      .ourServiceTitle,
                                                    serviceItem.slug
                                                  );
                                                }
                                              }}
                                            >
                                              {
                                                serviceItem.technologiesSettings
                                                  .ourServiceTitle
                                              }
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              <Link
                                href={`/services/${service?.slug}`}
                                // href={
                                //   settings.ourServiceLink?.url || "/service-detail"
                                // }
                                className="flex items-center gap-[16px] font-denton text-[18px] leading-[100%] font-bold text-white hover:opacity-80"
                              >
                                Read More
                                {/* <img
                                  src={
                                    settings.redirectSvg?.node?.sourceUrl ||
                                    "./images/gif/progress.gif"
                                  }
                                  alt={
                                    settings.redirectSvg?.node?.altText || "progress"
                                  }
                                  width="46"
                                  height="46"
                                /> */}
                                <img alt="view more" width="15" height="20" loading="lazy" fetchPriority="low" className="w-[15px] h-[20px]" src="https://staging1.concatstring.com/wp-content/uploads/2025/07/svgviewer-png-output.png"></img>
                              </Link>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )
      }
    </>
  );
};
export default ServiceHighlights;
