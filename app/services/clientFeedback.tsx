"use client";
import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { GET_CLIENT_FEEDBACK_SERVICES } from "@/lib/queries";
import { setClientFeedbackServices } from "@/store/slices/servicesSlice";
import { RootState } from "@/store";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ClientFeedback = () => {
  const dispatch = useDispatch();

  const cachedData = useSelector(
    (state: RootState) => state?.services?.clientFeedbackServices
  );

  const { data } = useQuery(GET_CLIENT_FEEDBACK_SERVICES);

  useEffect(() => {
    if (data) {
      dispatch(setClientFeedbackServices(data));
    }
  }, [data, dispatch]);

  const displayData = cachedData || data;

  // Find the client feedback layout from the flexible content
  const clientFeedbackLayout =
    displayData?.page?.flexibleContent?.flexibleContent?.find(
      (layout: any) => layout.feedbackTitle
    );

  const feedbackTitle =
    clientFeedbackLayout?.feedbackTitle || "Client Feedback";
  
  // Filter out incomplete feedback entries
  const validTestimonials = clientFeedbackLayout?.clientFeedback?.nodes?.filter(
    (node: any) => {
      const settings = node?.testimonialSettings;
      return (
        settings?.clientFeedback &&
        settings.clientFeedback.trim() !== "" &&
        settings?.clientName &&
        settings.clientName.trim() !== "" &&
        settings?.clientDesignation &&
        settings.clientDesignation.trim() !== ""
      );
    }
  ) || [];

  // Check if we have any valid testimonials
  if (validTestimonials.length === 0) {
    return null;
  }

  // Slick Slider settings
  const sliderSettings = {
    dots: validTestimonials.length > 1,
    infinite: validTestimonials.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: validTestimonials.length > 1,
    autoplaySpeed: 5000,
    adaptiveHeight: true,
    pauseOnHover: true,
    arrows: false,
    customPaging: (i: number) => (
      <div className="w-3 h-3 rounded-full bg-[#555] hover:bg-[#777] transition-all duration-300" />
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          dots: validTestimonials.length > 1,
          arrows: false,
        }
      },
      {
        breakpoint: 768,
        settings: {
          dots: validTestimonials.length > 1,
          arrows: false,
        }
      }
    ]
  };

  return (
    <section className="feedback 2xl:pb-[120px] xl:pb-[120px] lg:pb-[100px] md:pb-[80px] sm:pb-[80px] pb-[80px]">
      <div className="container max-w-[1432px] px-4 mx-auto">
        <div className="flex flex-col gap-[60px] items-center justify-center">
          <h2 className="h2 text-white text-center">{feedbackTitle}</h2>
          
          {/* Slick Slider Container */}
          <div className="feedback-slider bg-[#0F0F0F] 2xl:py-[76px] xl:py-[70px] lg:py-[70px] md:py-[50px] sm:py-[30px] py-[30px] 2xl:px-[76px] xl:px-[70px] lg:px-[70px] md:px-[50px] sm:px-[30px] px-[20px] md:pb-[70px] sm:pb-[70px] pb-[70px] rounded-[14px] shadow-[0px_24px_124px_rgba(231,33,37,0.22),_inset_0px_0px_20px_rgba(255,255,255,0.06)] 2xl:max-w-[1200px] xl:max-w-[1200px] lg:max-w-[1200px] md:max-w-full lg:max-w-full sm:max-w-full max-w-full">
            <Slider {...sliderSettings}>
              {validTestimonials.map((testimonial: any, index: number) => {
                const settings = testimonial?.testimonialSettings;
                return (
                  <div key={index} className="outline-none">
                    <div className="flex flex-col 2xl:gap-[50px] xl:gap-[50px] lg:gap-[40px] md:gap-[30px] sm:gap-[30px] gap-[20px] items-center justify-center">
                      <p className="font-lato font-normal 2xl:text-[24px] xl:text-[24px] lg:text-[24px] md:text-[24px] sm:text-[20px] text-[16px] 2xl:leading-[40px] xl:leading-[40px] lg:leading-[40px] md:leading-[40px] sm:leading-[40px] leading-[24px] text-white text-center 2xl:full  xl:max-w-full lg:max-w-full md:max-w-full sm:max-w-full max-w-full">
                        {settings?.clientFeedback}
                      </p>
                      
                      <div className="flex flex-col gap-[6px]">
                        {/* Client Image and Info Container */}
                        <div className="flex flex-row items-center gap-[15px]">
                          {/* Client Image */}
                          {testimonial?.featuredImage?.node?.sourceUrl && (
                            <div className="md:w-[80px] md:h-[80px] w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-[#FFFFFF]">
                              <img
                                src={testimonial.featuredImage.node.sourceUrl}
                                alt={testimonial.featuredImage.node.altText || settings?.clientName || 'Client'}
                                loading="lazy"
                                fetchPriority="low"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Hide image on error
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          
                          {/* Client Name and Designation */}
                          <div className="flex flex-col gap-[6px] items-start">
                            <h4 className="font-denton font-bold 2xl:text-[30px] xl:text-[30px] lg:text-[25px] md:text-[25px] lg:text-[20px] sm:text-[18px] text-[18px] 2xl:leading-[42px] xl:leading-[42px] lg:leading-[40px] md:leading-[30px] sm:leading-[25px] leading-[20px] text-center text-white">
                              {settings?.clientName}
                            </h4>
                            <p className="font-lato text-[16px] font-medium leading-[26px] text-[#C3C3C3] text-left">
                              {settings?.clientDesignation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientFeedback;
