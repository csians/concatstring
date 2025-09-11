"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProjectClientFeedback } from "@/store/slices/projectDetailsSlice";
import { RootState } from "@/store";

interface Props {
  project: any;
}

const ClientFeedback: React.FC<Props> = ({ project }) => {
  const dispatch = useDispatch();

  // Get data from Redux store
  const cachedData = useSelector(
    (state: RootState) => state.projectDetails.projectClientFeedback
  );

  // Dispatch data to Redux when it arrives
  useEffect(() => {
    if (project) {
      dispatch(setProjectClientFeedback(project));
    }
  }, [project, dispatch]);

  // Use Redux data if available, otherwise use prop data
  const displayData = cachedData || project;

  const feedbackData = displayData?.projectSettings;

  if (
    !feedbackData ||
    !feedbackData.clientFeedbackTiitle ||
    !feedbackData.clientFeedbacks?.nodes?.length
  ) {
    return null;
  }

  // Filter out feedbacks that don't have all required fields
  const validFeedbacks = feedbackData.clientFeedbacks.nodes.filter((feedbackNode: any) => {
    const feedback = feedbackNode.testimonialSettings;
    return feedback &&
      feedback.clientFeedback &&
      feedback.clientFeedback.trim() !== '' &&
      feedback.clientName &&
      feedback.clientName.trim() !== '' &&
      feedback.clientDesignation &&
      feedback.clientDesignation.trim() !== '';
  });

  // If no valid feedbacks, don't display the section
  if (!validFeedbacks.length) {
    return null;
  }

  // Debug logging to see what data we're receiving
  console.log('Project Client Feedback Data:', {
    feedbackData,
    validFeedbacks,
    firstFeedback: validFeedbacks[0],
    firstFeedbackImage: validFeedbacks[0]?.featuredImage,
    hasImage: validFeedbacks[0]?.featuredImage?.node?.sourceUrl
  });

  return (
    <>
      {
        validFeedbacks.length > 0 &&
        <section className="feedback 2xl:pt-[120px] xl:pt-[120px] lg:pt-[100px] md:pt-[80px] sm:pt-[80px] pt-[80px]">
          <div className="container max-w-[1432px] px-[20px] mx-auto">
            <div className="flex flex-col gap-[60px] items-center justify-center">
              <h2 className="h2 text-white text-center">
                {feedbackData.clientFeedbackTiitle}
              </h2>
              {validFeedbacks.map(
                (feedbackNode: any, index: number) => {
                  const feedback = feedbackNode.testimonialSettings;
                  return (
                    feedback.clientFeedback &&
                    <div
                      key={index}
                      className="bg-[#0F0F0F] 2xl:py-[76px] xl:py-[76px] lg:py-[70px] md:py-[50px] sm:py-[30px] py-[30px] 2xl:px-[70px] xl:px-[70px] lg:px-[70px] lg:px-[70px] md:px-[50px] sm:px-[30px] px-[20px] rounded-[14px] shadow-[0px_24px_124px_rgba(231,33,37,0.22),_inset_0px_0px_20px_rgba(255,255,255,0.06)] 2xl:max-w-[1200px] xl:max-w-[1200px] lg:max-w-[1200px] md:max-w-full lg:max-w-full sm:max-w-full max-w-full w-full"
                    >
                      <div className="flex flex-col 2xl:gap-[50px] xl:gap-[50px] lg:gap-[40px] md:gap-[30px] sm:gap-[30px] gap-[20px] items-center justify-center">
                        <p
                          className="font-lato font-normal 2xl:text-[24px] xl:text-[24px] lg:text-[24px] md:text-[24px] sm:text-[20px] text-[16px] 2xl:leading-[40px] xl:leading-[40px] lg:leading-[40px] md:leading-[40px] sm:leading-[40px] leading-[24px] text-white text-center 2xl:full  xl:max-w-full lg:max-w-full md:max-w-full sm:max-w-full max-w-full"
                          dangerouslySetInnerHTML={{
                            __html: feedback.clientFeedback,
                          }}
                        />
                        <div className="flex flex-col gap-[6px]">
                          {/* Client Image and Info Container */}
                          <div className="flex flex-row items-center gap-[15px]">
                            {/* Client Image */}
                            {feedbackNode?.featuredImage?.node?.sourceUrl && (
                              <div className="md:w-[80px] md:h-[80px] w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-[#FFFFFF]">
                                <img
                                  src={feedbackNode.featuredImage.node.sourceUrl}
                                  alt={feedbackNode.featuredImage.node.altText || feedback.clientName || 'Client'}
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
                                {feedback.clientName}
                              </h4>
                              {
                                feedback.clientDesignation &&
                                <p className="font-lato text-[16px] font-medium leading-[26px] text-[#C3C3C3] text-left">
                                  {feedback.clientDesignation}
                                </p>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </section>
      }
    </>
  );
};

export default ClientFeedback;
