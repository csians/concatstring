"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_EVENTS_BANNER, GET_LIFE_AT_COMPANY } from "@/lib/queries";
import { setEventsBannerData } from "@/store/slices/eventsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";

const Banner = () => {
    const dispatch = useDispatch();
    const cachedData = useSelector(
        (state: RootState) => state.events.eventsBanner
    );

    const [cacheData, setCacheData] = useState<any>(null);
    const [cacheLoading, setCacheLoading] = useState(true);
    const [cacheError, setCacheError] = useState(false);

    // Try to fetch from cache API first
    useEffect(() => {
        const fetchCache = async () => {
            try {
                const response = await fetch("/api/life-cache");
                const result = await response.json();
                if (result.success && result.data) {
                    setCacheData(result.data);
                    setCacheError(false);
                } else {
                    setCacheError(true);
                }
            } catch (error) {
                console.error("Failed to fetch from cache:", error);
                setCacheError(true);
            } finally {
                setCacheLoading(false);
            }
        };
        fetchCache();
    }, []);

    // Skip GraphQL if cache is available (wait for cache to load first)
    const shouldSkipGraphQL = cacheLoading ? true : !!cacheData;
    
    // Fallback to GraphQL only if cache is not available
    const { data: eventsBannerData } = useQuery(GET_EVENTS_BANNER, {
        skip: shouldSkipGraphQL,
    });
    const { data: lifeAtCompanyQueryData } = useQuery(GET_LIFE_AT_COMPANY, {
        skip: shouldSkipGraphQL,
    });

    // Use cache data if available, otherwise use GraphQL data
    const data = cacheData?.eventsBanner || eventsBannerData;
    const lifeAtCompanyData = cacheData?.lifeAtCompany || lifeAtCompanyQueryData;

    const title = lifeAtCompanyData?.page?.flexibleContent?.flexibleContent?.find(
        (item: any) => item.lifeAtCompanyTitle
    )?.lifeAtCompanyTitle;
    const content =
        lifeAtCompanyData?.page?.flexibleContent?.flexibleContent?.find(
            (item: any) => item.lifeAtCompanyTitle
        )?.lifeAtCompanyContent;
    // Store data in Redux when it comes from query_
    useEffect(() => {
        if (data) {
            dispatch(setEventsBannerData(data));
        }
    }, [data, dispatch]);

    // Use cached data from Redux if available, otherwise use fresh data from query_
    const bannerData = cachedData || data;

    const bannerContent =
        bannerData?.page?.flexibleContent?.flexibleContent?.find(
            (item: any) => item.eventBannerTitle
        );

    const backgroundImage = bannerContent?.eventBannerImage?.node?.sourceUrl;

    return (
        <section
            className="hero-section bg-cover 2xl:pt-[240px] xl:pt-[200px] lg:pt-[200px] md:pt-[200px] sm:pt-[180px] pt-[160px] 2xl:pb-[280px] xl:pb-[250px] lg:pb-[250px] md:pb-[200px] sm:pb-[180px] pb-[180px] bg-no-repeat bg-bottom-left"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="container max-w-[1440px] 2xl:px-[20px] xl:px-[20px] lg:px-[20px] md:px-[15px] sm:px-[12px] px-[10px] mx-auto">
                <div className="flex justify-between items-start flex-col ">
                    <h1 className="h1 text-white max-w-[662px] leading-[100%] mb-10 normal-case">
                        {title}
                    </h1>
                    <p className="font-lato font-medium text-[17px] leading-[26px] text-[#ffffff] text-left max-w-[1000px] max-w-[662px]">
                        {content}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Banner;