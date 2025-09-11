import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Skeleton configuration for consistent styling across the app
export const skeletonConfig = {
  baseColor: "#404040",
  highlightColor: "#606060",
  duration: 1.5,
  enableAnimation: true,
};

// Base skeleton component with consistent styling
export const StyledSkeleton = ({
  width,
  height,
  borderRadius,
  className = "",
  count = 1,
  circle = false,
}: {
  width: string | number;
  height: string | number;
  borderRadius?: number;
  className?: string;
  count?: number;
  circle?: boolean;
}) => (
  <Skeleton
    width={width}
    height={height}
    borderRadius={circle ? "50%" : borderRadius}
    count={count}
    className={className}
    baseColor={skeletonConfig.baseColor}
    highlightColor={skeletonConfig.highlightColor}
    duration={skeletonConfig.duration}
    enableAnimation={skeletonConfig.enableAnimation}
  />
);

// Skeleton for category buttons
export const CategorySkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="flex flex-row flex-wrap gap-[12px]">
    {Array.from({ length: count }, (_, index) => (
      <div key={index} className="rounded-[84px] py-[20px] px-[24px]">
        <StyledSkeleton width={80} height={20} borderRadius={84} />
      </div>
    ))}
  </div>
);

// Skeleton for blog post cards
export const BlogPostSkeleton = () => (
  <div className="bg-[#FFFF]/10 pt-[24px] px-[24px] pb-[30px] backdrop-blur-sm rounded-[16px]">
    <div className="flex flex-col justify-between gap-[32px] h-full">
      <div className="flex flex-col flex-grow">
        {/* Featured Image */}
        <StyledSkeleton
          width="100%"
          height={270}
          className="rounded-[16px] mb-[16px]"
        />

        {/* Category Tags and Date */}
        <div className="flex flex-row flex-wrap justify-between gap-[10px] mb-[20px]">
          <div className="flex flex-row flex-wrap gap-[14px]">
            <StyledSkeleton width={80} height={24} borderRadius={84} />
            <StyledSkeleton width={70} height={24} borderRadius={84} />
          </div>
          <StyledSkeleton width={100} height={20} />
        </div>

        {/* Title */}
        <StyledSkeleton width="90%" height={32} className="mb-[6px]" />

        {/* View and Comment Counts */}
        <div className="flex items-center justify-between gap-[10px] w-full mb-[16px]">
          <StyledSkeleton width={100} height={18} />
          <StyledSkeleton width={120} height={18} />
        </div>

        {/* Excerpt */}
        <StyledSkeleton
          count={3}
          width="100%"
          height={20}
          className="mb-[8px]"
        />
      </div>

      {/* Read More Button */}
      <StyledSkeleton width={120} height={20} />
    </div>
  </div>
);

// Skeleton grid for multiple blog posts
export const BlogPostsSkeletonGrid = ({
  count = 6,
  columns = 3,
}: {
  count?: number;
  columns?: number;
}) => (
  <div className={`grid lg:grid-cols-${columns} sm:grid-cols-2 grid-cols-1 gap-[30px] mb-[30px]`}>
    {Array.from({ length: count }, (_, index) => (
      <BlogPostSkeleton key={index} />
    ))}
  </div>
);

// Skeleton for author profile section
export const AuthorProfileSkeleton = () => (
  <section className="pt-[140px] pb-[120px]">
    <div className="container max-w-[1400px] px-[20px] mx-auto w-full">
      <div className="flex flex-col 2xl:gap-[60px] xl:gap-[60px] lg:gap-[50px] md:gap-[40px] sm:gap-[30px] gap-[30px] items-center">
        <div className="flex flex-col 2xl:gap-[80px] xl:gap-[80px] lg:gap-[60px] md:gap-[50px] sm:gap-[40px] gap-[30px]">
          <div className="flex flex-col 2xl:gap-[44px] xl:gap-[44px] lg:gap-[30px] md:gap-[25px] sm:gap-[25px] gap-[25px] items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              <StyledSkeleton width={400} height={80} className="mb-[20px]" />
              <StyledSkeleton width={200} height={26} />
            </div>
            <div className="flex items-start 2xl:gap-[60px] xl:gap-[60px] lg:gap-[50px] md:gap-[40px] sm:gap-[30px] gap-[30px] 2xl:flex-row xl:flex-row lg:flex-row md:flex-row sm:flex-col flex-col">
              <div className="2xl:w-[50%] xl:w-[50%] lg:w-[50%] md:w-[50%] sm:w-full w-full flex flex-col items-start justify-between h-full 2xl:gap-[124px] xl:gap-[124px] lg:gap-[100px] md:gap-[50px] sm:gap-[30px] gap-[20px]">
                <StyledSkeleton
                  count={3}
                  width="100%"
                  height={22}
                  className="mb-[20px]"
                />
                <div className="flex flex-col gap-[16px] items-start">
                  <StyledSkeleton width={150} height={28} />
                  <div className="flex items-center gap-[20px]">
                    {Array.from({ length: 4 }, (_, index) => (
                      <StyledSkeleton
                        key={index}
                        width={20}
                        height={22}
                        circle
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="2xl:w-[50%] xl:w-[50%] lg:w-[50%] md:w-[50%] sm:w-full w-full">
                <StyledSkeleton
                  width="100%"
                  height={438}
                  className="border border-[#2E0707] border-[20px] rounded-[16px]"
                />
              </div>
            </div>
            <div className="flex flex-col gap-[16px]">
              <StyledSkeleton width={300} height={66} className="mb-[16px]" />
              <StyledSkeleton
                count={4}
                width="100%"
                height={22}
                className="mb-[8px]"
              />
            </div>
          </div>
          <div className="2xl:max-w-[1200px] xl:max-w-[1200px] lg:max-w-full md:max-w-full sm:max-w-full max-w-full w-full bg-[#2E0707] rounded-[16px] 2xl:py-[30px] xl:py-[30px] lg:py-[25px] md:py-[25px] sm:py-[20px] py-[20px] 2xl:px-[60px] xl:px-[40px] lg:px-[25px] md:px-[25px] sm:px-[20px] px-[20px] flex items-center 2xl:flex-row xl:flex-row lg:flex-row md:flex-col sm:flex-col flex-col gap-[20px]">
            <StyledSkeleton width={230} height={34} />
            <div className="2xl:ps-[74px] xl:ps-[74px] lg:ps-[74px] md:ps-0 sm:ps-0 ps-0 flex items-center 2xl:gap-[100px] xl:gap-[100px] lg:gap-[60px] md:gap-[50px] sm:gap-[40px] gap-[30px]">
              {Array.from({ length: 3 }, (_, index) => (
                <StyledSkeleton key={index} width={77} height={64} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Skeleton for author blog posts section
export const AuthorBlogPostsSkeleton = () => (
  <section className="mb-[100px]">
    <div className="container max-w-[1600px] px-[20px] mx-auto w-full">
      <div className="bg-white/10 2xl:p-[100px] xl:p-[100px] lg:p-[80px] md:p-[60px] sm:p-[40px] p-[30px] rounded-[16px]">
        {/* Section Title */}
        <StyledSkeleton width={400} height={66} className="mx-auto mb-[60px]" />

        {/* Blog Posts Grid */}
        <div className="grid 2xl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-[30px] mb-[30px]">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="bg-[#FFFF]/10 px-[20px] pt-[20px] pb-[26px] backdrop-blur-sm 2xl:rounded-[16px] xl:rounded-[16px] lg:rounded-[16px] md:rounded-[15px] sm:rounded-[10px] rounded-[10px]"
            >
              <div className="flex flex-col justify-between gap-[32px] h-full">
                <div className="flex flex-col flex-grow">
                  {/* Featured Image */}
                  <StyledSkeleton
                    width="100%"
                    height={270}
                    className="2xl:rounded-[16px] xl:rounded-[16px] lg:rounded-[16px] md:rounded-[15px] sm:rounded-[10px] rounded-[10px] mb-[18px]"
                  />
                  {/* Post Title */}
                  <StyledSkeleton
                    width="90%"
                    height={32}
                    className="mb-[6px]"
                  />
                  {/* View and Comment Counts */}
                  <div className="flex items-center justify-between gap-[10px] w-full mb-[30px]">
                    <StyledSkeleton width={100} height={18} />
                    <StyledSkeleton width={120} height={18} />
                  </div>
                  {/* Post Excerpt */}
                  <StyledSkeleton
                    count={3}
                    width="100%"
                    height={20}
                    className="mb-[8px]"
                  />
                </div>
                {/* Read More Button */}
                <StyledSkeleton width={120} height={20} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// Skeleton for connect now section
export const ConnectNowSkeleton = () => (
  <section className="mb-[100px]">
    <div className="container max-w-[1400px] px-[20px] mx-auto w-full">
      <div className="bg-white/10 2xl:p-[100px] xl:p-[100px] lg:p-[80px] md:p-[60px] sm:p-[40px] p-[30px] rounded-[16px]">
        <div className="flex flex-col items-center justify-center gap-[40px]">
          {/* Section Title */}
          <StyledSkeleton width={500} height={66} className="text-center" />
          {/* Description */}
          <StyledSkeleton
            count={2}
            width="80%"
            height={22}
            className="text-center"
          />
          {/* Connect Button */}
          <StyledSkeleton width={200} height={50} className="rounded-[84px]" />
        </div>
      </div>
    </div>
  </section>
);

// Skeleton for team banner section (OurTeam)
export const TeamBannerSkeleton = () => (
  <section className="2xl:pt-[311px] xl:pt-[274px] lg:pt-[250px] md:pt-[200px] sm:pt-[180px] pt-[160px] 2xl:pb-[351px] xl:pb-[344px] lg:pb-[330px] md:pb-[250px] sm:pb-[200px] pb-[180px] bg-[#2E0707]">
    <div className="container max-w-[1440px] 2xl:px-[20px] xl:px-[20px] lg:px-[20px] md:px-[15px] sm:px-[12px] px-[10px] mx-auto">
      <div className="flex justify-between items-center">
        {/* Team Title */}
        <StyledSkeleton width={662} height={80} className="max-w-[662px]" />
      </div>
    </div>
  </section>
);

// Skeleton for team section
export const TeamSectionSkeleton = () => (
  <section className="2xl:py-[120px] xl:py-[120px] lg:py-[100px] md:py-[80px] sm:py-[60px] py-[60px]">
    <div className="container max-w-[1400px] px-[20px] mx-auto w-full">
      {/* Section Title */}
      <div className="text-center mb-[60px]">
        <StyledSkeleton width={400} height={66} className="mx-auto mb-[20px]" />
        <StyledSkeleton width={600} height={22} className="mx-auto" />
      </div>

      {/* Team Members Grid */}
      <div className="grid 2xl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-[30px]">
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            className="bg-white/10 rounded-[16px] p-[20px] backdrop-blur-sm"
          >
            <div className="flex flex-col items-center text-center">
              {/* Profile Image */}
              <StyledSkeleton
                width={120}
                height={120}
                circle
                className="mb-[20px]"
              />
              {/* Name */}
              <StyledSkeleton width={150} height={24} className="mb-[10px]" />
              {/* Position */}
              <StyledSkeleton width={120} height={18} className="mb-[15px]" />
              {/* Description */}
              <StyledSkeleton count={3} width="100%" height={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Skeleton for strategy squad section
export const StrategySquadSkeleton = () => (
  <section className="2xl:py-[120px] xl:py-[120px] lg:py-[100px] md:py-[80px] sm:py-[60px] py-[60px] bg-[#2E0707]">
    <div className="container max-w-[1400px] px-[20px] mx-auto w-full">
      {/* Section Title */}
      <div className="text-center mb-[60px]">
        <StyledSkeleton width={500} height={66} className="mx-auto mb-[20px]" />
        <StyledSkeleton width={700} height={22} className="mx-auto" />
      </div>

      {/* Strategy Team Grid */}
      <div className="grid 2xl:grid-cols-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-[40px]">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="bg-white/10 rounded-[16px] p-[30px] backdrop-blur-sm"
          >
            <div className="flex flex-col items-center text-center">
              {/* Profile Image */}
              <StyledSkeleton
                width={150}
                height={150}
                circle
                className="mb-[25px]"
              />
              {/* Name */}
              <StyledSkeleton width={180} height={28} className="mb-[12px]" />
              {/* Position */}
              <StyledSkeleton width={140} height={20} className="mb-[20px]" />
              {/* Description */}
              <StyledSkeleton
                count={4}
                width="100%"
                height={18}
                className="mb-[8px]"
              />
              {/* Social Links */}
              <div className="flex gap-[15px] mt-[20px]">
                {Array.from({ length: 3 }, (_, socialIndex) => (
                  <StyledSkeleton
                    key={socialIndex}
                    width={24}
                    height={24}
                    circle
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Skeleton for empowering section - NEWLY ADDED
export const EmpoweringSkeleton = () => (
  <section className="min-h-full">
    <div className="about1 relative rounded-b-[34px] rounded-[34px] 2xl:pt-[390px] xl:pt-[390px] lg:pt-[350px] lg:pt-[320px] md:pt-[300px] sm:pt-[300px] pt-[250px] 2xl:pb-[310px] xl:pb-[310px] lg:pb-[300px] md:pb-[250px] sm:pb-[200px] pb-[200px] overflow-hidden">
      <div className="text-center">
        <StyledSkeleton width={600} height={66} className="mx-auto mb-[20px]" />
        <StyledSkeleton count={2} width="80%" height={22} className="mx-auto" />
      </div>
    </div>
  </section>
);

// Skeleton for who we are section - NEWLY ADDED
export const WhoWeAreSkeleton = () => (
  <section className="2xl:pt-[220px] xl:pt-[200px] lg:pt-[200px] md:pt-[100px] sm:pt-[100px] pt-[100px] 2xl:pb-[220px] xl:pb-[220px] lg:pb-[200px] md:pb-[100px] sm:pb-[100px] pb-[100px]">
    <div className="container max-w-[1432px] mx-auto px-[20px]">
      <div className="flex flex-col justify-center items-center">
        {/* Title */}
        <StyledSkeleton width={800} height={86} className="mb-[16px]" />
        {/* Description */}
        <div className="flex flex-col gap-[36px] max-w-[1012px]">
          <StyledSkeleton count={3} width="100%" height={22} />
          <StyledSkeleton count={2} width="90%" height={22} />
        </div>
        {/* Button */}
        <StyledSkeleton width={200} height={50} className="mt-[60px] rounded-[50px]" />
      </div>
    </div>
  </section>
);

// Skeleton for culture section - NEWLY ADDED
export const CultureSkeleton = () => (
  <section className="become pt-[120px] pb-[100px]">
    <div className="max-w-[1432px] px-4 mx-auto">
      {/* Main title box */}
      <div className="box-border max-w-[862.57px] bg-[#0F0F0F] shadow-[0px_24px_124px_rgba(231,33,37,0.22),_inset_0px_0px_20px_rgba(255,255,255,0.06)] rounded-[14px] py-[62px] px-[20px] pb-[42px] mx-auto">
        {/* Subtitle skeleton */}
        <StyledSkeleton 
          width="60%" 
          height={26} 
          className="font-denton font-bold text-[26px] uppercase max-w-[400px] mx-auto text-left mb-4"
        />
        {/* Main title skeleton */}
        <StyledSkeleton 
          width="80%" 
          height={120} 
          className="font-denton text-center font-normal 2xl:text-[151px] xl:text-[130px] lg:text-[120px] md:text-[100px] sm:text-[90px] text-[80px] max-w-[488px] mx-auto leading-[100%]"
        />
      </div>

      {/* Perks grid skeleton */}
      <div className="flex flex-wrap gap-[24px] pt-[60px] overflow-hidden">
        {Array.from({ length: 7 }, (_, index) => {
          // Use the same card class names as the real component
          const cardClassNames = [
            "2xl:w-[calc(33.333333%-16px)] xl:w-[calc(33.333333%-16px)] lg:w-[calc(50%-12px)] md:w-[calc(50%-12px)] sm:w-full w-full",
            "2xl:w-[calc(33.333333%-16px)] xl:w-[calc(33.333333%-16px)] lg:w-[calc(50%-12px)] md:w-[calc(50%-12px)] sm:w-full w-full",
            "2xl:w-[calc(33.333333%-16px)] xl:w-[calc(33.333333%-16px)] lg:w-[calc(50%-12px)] md:w-[calc(50%-12px)] sm:w-full w-full",
            "2xl:w-[calc(20%-7px)] xl:w-[calc(20%-7px)] lg:w-[calc(50%-12px)] md:w-[calc(50%-12px)] sm:w-full w-full",
            "2xl:w-[calc(20%-7px)] xl:w-[calc(20%-7px)] lg:w-[calc(50%-12px)] md:w-[calc(50%-12px)] sm:w-full w-full",
            "2xl:w-[calc(29%-20px)] xl:w-[calc(29%-20px)] lg:w-[calc(50%-12px)] md:w-[calc(50%-12px)] sm:w-full w-full",
            "2xl:w-[calc(29%-12px)] xl:w-[calc(29%-14px)] lg:w-[calc(50%-12px)] md:w-[calc(50%-12px)] sm:w-full w-full",
          ];

          return (
            <div
              key={index}
              className={`border border-borderclr rounded-[14px] border-opacity-[50%] p-[30px] 
              ${cardClassNames[index] || "w-full"} 
              relative 2xl:h-[276px] xl:h-[260px] lg:h-[250px] md:h-[230px] sm:h-[200px] h-[200px] group overflow-hidden`}
            >
              {/* Title skeleton */}
              <StyledSkeleton 
                width="90%" 
                height={40} 
                className="text-[20px] sm:text-[20px] md:text-[20px] lg:text-[25px] xl:text-[30px] 2xl:text-[36px] font-bold 2xl:leading-[48px] xl:leading-[40px] lg:leading-[35px] md:leading-[30px] sm:leading-[30px] leading-[30px] pb-[2px] max-w-[328px] font-denton mb-4"
              />
              {/* Description skeleton */}
              <StyledSkeleton 
                count={3}
                width="100%" 
                height={16} 
                className="font-lato text-[16px] font-medium leading-[26px] mb-4"
              />
              {/* GIF placeholder skeleton */}
              <div className="absolute bottom-[50px] right-1/2 translate-x-1/2 max-w-max">
                <StyledSkeleton 
                  width={86} 
                  height={86} 
                  className="2xl:w-[86px] xl:w-[86px] lg:w-[80px] md:w-[70px] sm:w-[50px] w-[50px] 2xl:h-[86px] xl:h-[86px] lg:h-[70px] md:h-[70px] sm:h-[50px] h-[50px] rounded-full"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Button skeleton */}
      <div className="flex justify-center items-center pt-[60px]">
        <StyledSkeleton 
          width={200} 
          height={50} 
          className="btn-primary-outline rounded-[8px]"
        />
      </div>
    </div>
  </section>
);

// Skeleton for why choose section - NEWLY ADDED
export const WhyChooseSkeleton = () => (
  <section className="why-choose pt-[100px] relative overflow-hidden h-full">
    {/* Scrolling background skeleton */}
    <div className="absolute top-0 left-0 w-[200%] h-full bg-gray-800 animate-pulse"></div>

    {/* Content wrapper */}
    <div className="container max-w-[1440px] px-[20px] mx-auto z-10 relative">
      <div className="flex flex-col items-center justify-center 2xl:gap-[60px] xl:gap-[60px] lg:gap-[50px] md:gap-[40px] sm:gap-[30px] gap-[25px] pt-[100px] pb-[200px]">
        {/* Title skeleton */}
        <StyledSkeleton 
          width="60%" 
          height={66} 
          className="h2 text-black"
        />

        {/* Grid Boxes skeleton */}
        <div className="grid 2xl:grid-cols-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 2xl:gap-[30px] xl:gap-[30px] lg:gap-[25px] md:gap-[25px] sm:gap-[20px] gap-[20px] w-full justify-center items-center min-h-[225px]">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="h-full cursor-auto box px-[30px] py-[30px] rounded-[10px] bg-[#B9B9B9]/30 border border-white flex flex-col items-start justify-center gap-[10px] shadow-custom h-[178px]"
            >
              {/* Statistic number skeleton */}
              <StyledSkeleton 
                width="80%" 
                height={40} 
                className="h3"
              />
              {/* Statistic label skeleton */}
              <StyledSkeleton 
                width="100%" 
                height={24} 
                className="font-denton text-[22px]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// Skeleton for technologies section - UPDATED
export const TechnologiesSkeleton = () => (
  <section className="explore-technologies md:pt-[100px] pt-[60px]">
    <div className="max-w-[1432px] px-4 mx-auto">
      {/* Title and Button Row */}
      <div className="flex justify-between items-start gap-[20px] flex-col lg:flex-row">
        {/* Title */}
        <StyledSkeleton 
          width="60%" 
          height={66} 
          className="title text-white h2 tracking-normal"
        />
        {/* Button */}
        <StyledSkeleton 
          width={410} 
          height={82} 
          className="btn-primary btn-primary 2xl:h-[82px] xl:h-[82px] lg:h-[80px] md:h-[70px] sm:h-[60px] h-[60px] rounded-[8px]"
        />
      </div>
      
      {/* Description */}
      <StyledSkeleton 
        width="100%" 
        height={20} 
        className="text-[#C3C3C3] font-lato text-[16px] font-medium max-w-[1019px] mt-[16px] mb-[50px]"
      />
      <StyledSkeleton 
        width="80%" 
        height={20} 
        className="text-[#C3C3C3] font-lato text-[16px] font-medium max-w-[1019px] mb-[50px]"
      />

      {/* Technologies Container */}
      <div className="border-gradient rounded-[40px] p-[1px]">
        <div className="bg-black 2xl:py-[70px] xl:py-[70px] lg:py-[60px] md:py-[50px] sm:py-[40px] py-[30px] rounded-[40px] 2xl:px-[105px] xl:px-[100px] lg:px-[80px] md:px-[60px] sm:px-[50px] px-[30px] flex">
          <div className="min-h-[375px] h-[375px] max-lg:h-[450px] max-lg:min-h-[450px] overflow-y-auto custom-scrollbar w-full">
            {/* Technology Cards */}
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="flex gap-[66px] max-lg:gap-[30px] justify-between items-center mb-12 2xl:flex-row xl:flex-row lg:flex-row md:flex-col-reverse sm:flex-col-reverse flex-col-reverse me-[5px] last:mb-[4px] md:first:mt-[35px]"
              >
                {/* Content Section */}
                <div className="2xl:w-[832px] xl:w-[832px] lg:w-[832px] md:w-full sm:w-full w-full">
                  {/* Technology Title */}
                  <StyledSkeleton 
                    width="70%" 
                    height={32} 
                    className="h3 tracking-normal mb-4"
                  />
                  {/* Technology Description */}
                  <StyledSkeleton 
                    count={3}
                    width="100%" 
                    height={20} 
                    className="font-lato font-medium 2xl:text-[24px] xl:text-[24px] lg:text-[24px] md:text-[20px] sm:text-[20px] text-[20px] mb-10"
                  />
                  {/* Read More Button */}
                  <StyledSkeleton 
                    width={150} 
                    height={50} 
                    className="btn-primary-outline rounded-[8px]"
                  />
                </div>
                
                {/* Image Section */}
                <div className="image-box max-md:w-[80px] max-md:h-[80px] max-lg:w-[120px] max-lg:h-[120px]">
                  <StyledSkeleton 
                    width={298} 
                    height={298} 
                    className="float-left rounded-[8px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Skeleton for timeline section - NEWLY ADDED
export const TimelineSkeleton = () => (
  <section className="2xl:pt-[120px] xl:pt-[120px] lg:pt-[100px] md:pt-[80px] sm:pt-[60px] py-[60px]">
    <div className="container max-w-[1400px] px-[20px] mx-auto w-full">
      {/* Section Title */}
      <div className="text-center mb-[60px]">
        <StyledSkeleton width={500} height={66} className="mx-auto mb-[20px]" />
        <StyledSkeleton width={700} height={22} className="mx-auto" />
      </div>
      
      {/* Timeline items */}
      <div className="space-y-[40px]">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex items-start gap-[30px]">
            {/* Year */}
            <StyledSkeleton width={80} height={40} className="rounded-[8px]" />
            {/* Content */}
            <div className="flex-1">
              <StyledSkeleton width={300} height={28} className="mb-[10px]" />
              <StyledSkeleton count={2} width="100%" height={18} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Skeleton for working method section - NEWLY ADDED
export const WorkingMethodSkeleton = () => (
  <section className="2xl:pt-[120px] xl:pt-[120px] lg:pt-[100px] md:pt-[80px] sm:pt-[60px] py-[60px]">
    <div className="container max-w-[1400px] px-[20px] mx-auto w-full">
      {/* Section Title */}
      <div className="text-center mb-[60px]">
        <StyledSkeleton width={600} height={66} className="mx-auto mb-[20px]" />
        <StyledSkeleton width={800} height={22} className="mx-auto" />
      </div>
      
      {/* Method cards */}
      <div className="grid 2xl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-[30px]">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="bg-white/10 rounded-[16px] p-[30px] backdrop-blur-sm">
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <StyledSkeleton width={80} height={80} circle className="mb-[20px]" />
              {/* Title */}
              <StyledSkeleton width={180} height={28} className="mb-[15px]" />
              {/* Description */}
              <StyledSkeleton count={3} width="100%" height={18} className="mb-[8px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Skeleton for meet the mind section - NEWLY ADDED
export const MeetTheMindSkeleton = () => (
  <section className="bg-black py-[120px]">
    <div className="container max-w-[1440px] px-[20px] mx-auto">
      <div className="flex flex-col items-center justify-center gap-[60px]">
        {/* Section Title */}
        <StyledSkeleton width={800} height={66} className="max-w-[1045px]" />
        
        {/* Team members grid */}
        <div className="grid 2xl:grid-cols-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 grid-cols-1 gap-[30px] w-full">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className={`group relative 2xl:h-[430px] xl:h-[430px] lg:h-[430px] md:h-[430px] sm:h-full h-full rounded-xl overflow-hidden py-[20px] px-[10px] flex items-end ${
                index % 2 === 1
                  ? "2xl:translate-y-[100px] xl:translate-y-[100px] lg:translate-y-0 md:translate-y-0 sm:translate-y-0 translate-y-0"
                  : "translate-y-0"
              }`}
            >
              {/* Background skeleton */}
              <StyledSkeleton
                width={400}
                height={430}
                className="absolute inset-0"
              />
              
              {/* Content area skeleton */}
              <div className="bg-white rounded-[12px] p-[15px] relative w-full z-10 flex items-center gap-[10px]">
                <StyledSkeleton width={120} height={40} className="rounded-[6px]" />
                <StyledSkeleton width={100} height={20} />
              </div>
            </div>
          ))}
        </div>
        
        {/* Button */}
        <StyledSkeleton width={200} height={50} className="rounded-[8px]" />
      </div>
    </div>
  </section>
);

// Skeleton for blog title section - NEWLY ADDED
export const BlogTitleSkeleton = () => (
  <section className="hero-section bg-cover 2xl:pt-[361px] xl:pt-[361px] lg:pt-[250px] md:pt-[230px] sm:pt-[200px] pt-[200px] 2xl:pb-[453px] xl:pb-[453px] lg:pb-[330px] md:pb-[300px] sm:pb-[280px] pb-[250px] bg-no-repeat bg-bottom-left">
    <div className="container max-w-[1440px] px-[20px] mx-auto">
      <div className="flex justify-between items-center">
        <StyledSkeleton width={662} height={80} className="max-w-[662px]" />
      </div>
    </div>
  </section>
);

// Skeleton for tech talks section - NEWLY ADDED
export const TechTalksSkeleton = () => (
  <section className="pt-[120px]">
    <div className="container max-w-[1400px] px-[20px] mx-auto w-full">
      <div className="flex flex-col items-center justify-center gap-[16px] 2xl:mb-[60px] xl:mb-[50px] lg:mb-[50px] md:mb-[40px] sm:mb-[30px] mb-[30px]">
        <StyledSkeleton width={400} height={66} className="mx-auto" />
        <StyledSkeleton width={800} height={22} className="mx-auto max-w-[1000px]" />
      </div>
      <div className="blog-img bg-[#2E0707] border border-[20px] rounded-[30px] border-[#2E0707]">
        <div className="relative bg-cover h-[746px] px-[30px] pt-[30px] pb-[60px] flex items-end rounded-[20px] overflow-hidden">
          <StyledSkeleton width="100%" height={746} className="absolute inset-0" />
          <div className="absolute top-[30px] right-[30px]">
            <StyledSkeleton width={138} height={138} className="rounded-full" />
          </div>
          <div className="w-full relative z-10">
            <div className="flex flex-col gap-[23px]">
              <div className="flex flex-col gap-[10px]">
                <div className="flex justify-between items-center w-full flex-row flex-wrap gap-[10px]">
                  <div className="flex flex-row flex-wrap gap-[10px]">
                    <StyledSkeleton width={100} height={36} className="rounded-[84px]" />
                    <StyledSkeleton width={120} height={36} className="rounded-[84px]" />
                  </div>
                  <StyledSkeleton width={120} height={36} className="rounded-[84px]" />
                </div>
              </div>
              <StyledSkeleton width="80%" height={48} className="mb-[16px]" />
              <StyledSkeleton count={3} width="100%" height={20} className="mb-[8px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Skeleton for TechTalks section (home page) - matches exact structure
export const TechTalksSectionSkeleton = () => (
  <section className="tech-talk">
    <div className="container max-[1400px] mx-auto px-[20px]">
      <div className="flex flex-col items-center justify-center 2xl:gap-[60px] xl:gap-[50px] lg:gap-[40px] md:gap-[30px] sm:gap-[20px] gap-[20px]">
        {/* Section Title */}
        <StyledSkeleton width={400} height={66} className="h2 text-white text-center" />

        {/* Blog Posts Grid */}
        <div className="grid 2xl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-[30px] mb-[0px]">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="bg-[#FFFF]/10 2xl:pt-[24px] xl:pt-[24px] lg:pt-[24px] md:pt-[20px] sm:pt-[20px] pt-[15px] 2xl:px-[24px] xl:px-[24px] lg:px-[24px] md:px-[20px] sm:px-[20px] px-[15px] 2xl:pb-[30px] xl:pb-[30px] lg:pb-[24px] md:pb-[20px] sm:pb-[20px] pb-[15px] backdrop-blur-sm 2xl:rounded-[16px] xl:rounded-[16px] lg:rounded-[16px] md:rounded-[15px] sm:rounded-[10px] rounded-[10px]"
            >
              <div className="flex flex-col justify-between gap-[32px] h-full">
                <div className="flex flex-col flex-grow height-full">
                  {/* Featured Image */}
                  <StyledSkeleton
                    width="100%"
                    height={270}
                    className="2xl:rounded-[16px] xl:rounded-[16px] lg:rounded-[16px] md:rounded-[15px] sm:rounded-[10px] rounded-[10px] mb-[16px]"
                  />
                  
                  {/* Category Tags and Date */}
                  <div className="flex flex-row flex-wrap justify-between gap-[10px] mb-[20px] items-start">
                    <div className="flex flex-row flex-wrap gap-[14px] max-w-[calc(100%-130px)]">
                      <StyledSkeleton width={80} height={24} borderRadius={84} />
                      <StyledSkeleton width={70} height={24} borderRadius={84} />
                    </div>
                    <StyledSkeleton width={100} height={20} />
                  </div>

                  {/* Title */}
                  <StyledSkeleton width="90%" height={32} className="mb-[6px]" />

                  {/* Excerpt */}
                  <StyledSkeleton
                    count={3}
                    width="100%"
                    height={20}
                    className="mb-[8px]"
                  />
                </div>

                {/* Read More Button */}
                <StyledSkeleton width={120} height={20} />
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <StyledSkeleton width={200} height={50} className="rounded-[8px]" />
      </div>
    </div>
  </section>
);

// Skeleton for meet writers section - NEWLY ADDED
export const MeetWritersSkeleton = () => (
  <section className="pt-[120px]">
    <div className="container max-w-[1400px] px-[20px] mx-auto w-full">
      <div className="flex flex-col items-center justify-center gap-[16px] 2xl:mb-[60px] xl:mb-[60px] lg:mb-[50px] md:mb-[40px] sm:mb-[30px] mb-[30px]">
        <StyledSkeleton width={400} height={66} className="mx-auto" />
        <StyledSkeleton width={800} height={22} className="mx-auto max-w-[1000px]" />
      </div>
      
      {/* Writers slider skeleton */}
      <div className="flex gap-[15px] overflow-hidden">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="rounded-[10px] py-[36px] px-[24px] flex flex-col items-center justify-center 2xl:mx-[15px] xl:me-[15px] lg:mx-[15px] md:mx-[10px] sm:mx-[10px] me-0 team-box h-full min-w-[280px]"
          >
            <div className="flex flex-col gap-[18px] items-center justify-center gap-[24px] pb-[16px]">
              <StyledSkeleton width={84} height={84} circle />
              <StyledSkeleton width={150} height={24} />
            </div>
            <StyledSkeleton count={4} width="100%" height={18} className="mb-[37px]" />
            <StyledSkeleton width={120} height={18} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Skeleton for story to share section - NEWLY ADDED
export const StoryToShareSkeleton = () => (
  <section className="pt-[120px]">
    <div className="container max-w-[1400px] px-[20px] mx-auto w-full">
      <div className="flex flex-col items-center justify-center gap-[16px] 2xl:mb-[60px] xl:mb-[60px] lg:mb-[50px] md:mb-[40px] sm:mb-[30px] mb-[30px]">
        <StyledSkeleton width={500} height={66} className="mx-auto" />
        <StyledSkeleton width={900} height={22} className="mx-auto max-w-[1000px]" />
      </div>
      
      <div className="bg-white/10 rounded-[16px] p-[40px] backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-[20px]">
          <StyledSkeleton width="100%" height={50} className="rounded-[8px]" />
          <StyledSkeleton width="100%" height={50} className="rounded-[8px]" />
          <StyledSkeleton width="100%" height={50} className="rounded-[8px]" />
          <StyledSkeleton width="100%" height={50} className="rounded-[8px]" />
          <div className="col-span-2">
            <StyledSkeleton width="100%" height={120} className="rounded-[8px]" />
          </div>
          <div className="col-span-2">
            <StyledSkeleton width={200} height={50} className="rounded-[8px]" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Skeleton for trusted brands section - NEWLY ADDED
export const TrustedSkeleton = () => (
  <section className="trusted-section relative py-[7.97vw]">
    <div className="max-w-[1632px] mx-auto px-4">
      {/* Title skeleton */}
      <StyledSkeleton 
        width="60.94vw" 
        height="8.333vw" 
        className="mx-auto pt-[14.43vw] pb-[15.57vw] text-center"
      />
    </div>
  </section>
);

// Skeleton for home banner section - NEWLY ADDED
export const BannerSkeleton = () => (
  <section className="banner relative min-h-screen max-lg:min-h-[auto] overflow-hidden">
    {/* Video background - same as actual banner */}
    <video
      muted
      autoPlay
      loop
      playsInline
      className="absolute top-[42px] left-0 w-full h-full object-cover object-center z-0"
    >
      <source src="/video/banner_background.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    {/* Dark Overlay */}
    <div className="absolute inset-0 bg-black/40 z-0" />

    {/* Content Skeleton */}
    <div className="relative z-10 max-w-[1432px] px-4 mx-auto pt-[200px] md:pt-[200px] lg:pt-[267px] pb-[100px] px-4 lg:pb-[227px]">
      <div className="text-left px-4 md:px-0">
        {/* Title skeleton */}
        <div className="title mb-[30px] md:mb-[40px]">
          <StyledSkeleton 
            width="100%" 
            height={60} 
            className="max-w-full md:max-w-[970px] lg:max-w-[1200px] mx-auto md:mx-0"
          />
          <StyledSkeleton 
            width="80%" 
            height={60} 
            className="max-w-full md:max-w-[970px] lg:max-w-[1200px] mx-auto md:mx-0 mt-2"
          />
        </div>

        {/* Description skeleton */}
        <div className="description max-w-full md:max-w-[677px] mb-[30px] md:mb-[60px] mx-auto md:mx-0">
          <StyledSkeleton 
            width="100%" 
            height={20} 
            className="mb-2"
          />
          <StyledSkeleton 
            width="90%" 
            height={20} 
            className="mb-2"
          />
          <StyledSkeleton 
            width="75%" 
            height={20} 
          />
        </div>

        {/* Button skeleton */}
        <div className="button">
          <StyledSkeleton 
            width={200} 
            height={50} 
            className="rounded-[8px]"
          />
        </div>
      </div>
    </div>
  </section>
);

// Skeleton for footer section - NEWLY ADDED
export const FooterSkeleton = () => (
  <>
    <footer className="footer 2xl:px-[110px] xl:px-[100px] lg:px-[80px] md:px-[60px] sm:px-[40px] px-[20px]">
      <div className="mx-auto overflow-hidden px-[20px] w-full rounded-[20px] 2xl:pt-[100px] xl:pt-[100px] lg:pt-[100px] md:pt-[100px] sm:pt-[80px] pt-[60px] bg-[radial-gradient(62.87%_106.71%_at_50%_15.94%,_#E72125_0%,_rgba(231,_33,_37,_0)_100%)]">
        <div className="container max-w-[1432px] mx-auto w-full 2xl:pb-[50px] xl:pb-[50px] lg:pb-[40px] md:pb-[40px] sm:pb-[30px] pb-[30px]">
          {/* Newsletter Section */}
          <div className="flex flex-col items-center justify-center 2xl:gap-[30px] xl:gap-[30px] lg:gap-[30px] md:gap-[25px] sm:gap-[25px] gap-[20px]">
            {/* Newsletter Title */}
            <StyledSkeleton 
              width={400} 
              height={46} 
              className="font-denton font-semibold text-white"
            />
            
            {/* Newsletter Form */}
            <div className="w-full flex flex-col justify-center items-center gap-[10px] max-w-[823px]">
              <div className="2xl:w-[823px] xl:w-[823px] lg:w-[700px] md:w-full sm:w-full w-full">
                <div className="input flex items-center rounded-full py-[10px] px-[10px] h-full 2xl:w-[823px] xl:w-[823px] lg:w-[700px] leading-[34px] 2xl:px-[10px] xl:px-[10px] lg:px-[10px] md:px-[10px] sm:px-0 px-0 md:w-full sm:w-full w-full">
                  <StyledSkeleton 
                    width="100%" 
                    height={50} 
                    className="rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <ul className="flex flex-wrap justify-center items-center 2xl:gap-[46px] xl:gap-[46px] lg:gap-[40px] md:gap-[40px] sm:gap-[30px] gap-[20px] 2xl:pt-[80px] xl:pt-[60px] lg:pt-[50px] md:pt-[40px] sm:pt-[30px] pt-[30px] 2xl:pb-[60px] xl:pb-[60px] lg:pb-[50px] md:pb-[40px] sm:pb-[30px] pb-[30px] border-b border-[#D9D9D9]">
            {Array.from({ length: 6 }, (_, index) => (
              <li key={index}>
                <StyledSkeleton width={80} height={22} />
              </li>
            ))}
          </ul>

          {/* Services Section */}
          <div className="py-[50px] flex flex-wrap flex-col gap-[20px]">
            {/* Services Title */}
            <StyledSkeleton 
              width={200} 
              height={30} 
              className="font-denton font-bold"
            />
            
            {/* Desktop Marquee Skeleton */}
            <div className="hidden lg:block w-full marquee-container">
              <div className="flex gap-[20px] overflow-hidden">
                {Array.from({ length: 8 }, (_, index) => (
                  <div key={index} className="flex items-center gap-[10px] flex-shrink-0 whitespace-nowrap">
                    <StyledSkeleton width={6} height={6} circle />
                    <StyledSkeleton width={120} height={20} />
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Services Skeleton */}
            <ul className="flex flex-wrap items-center gap-[20px] lg:hidden">
              {Array.from({ length: 6 }, (_, index) => (
                <li key={index} className="flex items-center gap-[10px]">
                  <StyledSkeleton width={6} height={6} circle />
                  <StyledSkeleton width={100} height={18} />
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Cards */}
          <div className="grid 2xl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 2xl:gap-[30px] xl:gap-[30px] lg:gap-[25px] md:gap-[20px] sm:gap-[20px] gap-[20px]">
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="p-[1px] rounded-[12px] bg-[linear-gradient(180deg,_#54A3DA_0%,_#E72125_100%)] h-full"
              >
                <div className="flex items-center bg-[#2B2B2B] rounded-[12px] h-full gap-[15px] w-full 2xl:py-[24px] xl:py-[24px] lg:py-[24px] md:py-[20px] sm:py-[20px] py-[20px] 2xl:px-[30px] xl:px-[30px] lg:px-[24px] md:px-[20px] sm:px-[20px] px-[20px]">
                  <StyledSkeleton width={50} height={50} circle />
                  <StyledSkeleton width="calc(100% - 65px)" height={24} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-transparent">
          <div className="container max-w-[1432px] px-[20] relative py-[0] xl:pb-[0px] mb-[12px] mx-auto w-full flex items-center justify-between">
            {/* Social Media Links */}
            <ul className="relative flex items-center gap-[14px] 2xl:flex-row xl:flex-row lg:flex-row md:flex-row sm:flex-row flex-row">
              {Array.from({ length: 2 }, (_, index) => (
                <li key={index}>
                  <StyledSkeleton width={50} height={50} circle />
                </li>
              ))}
            </ul>
          </div>

          {/* Copyright Section */}
          <div className="container max-w-[1420px] px-[20] py-[30px] pt-[0px] mx-auto w-full">
            <div className="flex justify-end items-center gap-[10px] 2xl:flex-row xl:flex-row lg:flex-row md:flex-col sm:flex-col flex-col">
              <StyledSkeleton width={200} height={18} />
              <ul className="flex items-center gap-[5px] 2xl:flex-row xl:flex-row lg:flex-row md:flex-row sm:flex-col flex-col">
                <li><StyledSkeleton width={1} height={18} /></li>
                <li><StyledSkeleton width={80} height={18} /></li>
                <li><StyledSkeleton width={1} height={18} /></li>
                <li><StyledSkeleton width={100} height={18} /></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
    <div className="w-full h-[16px] bg-[linear-gradient(180deg,_#E72125_0%,_#811215_100%)]"></div>
  </>
);
