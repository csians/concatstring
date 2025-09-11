'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const NotFound: React.FC = () => {
  const [countdown, setCountdown] = useState(7);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <section 
        className="bg-[url('/images/404-bg.png')] bg-no-repeat 2xl:pt-[160px] xl:pt-[160px] lg:pt-[130px] md:pt-[120px] sm:pt-[120px] pt-[120px] 2xl:pb-[198px] xl:pb-[198px] lg:pb-[180px] md:pb-[150px] sm:pb-[140px] pb-[120px] mt-[100px]"
        style={{
          backgroundImage: "url('/images/404-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container max-w-[1280px] px-[20px] mx-auto">
          <div className="flex flex-col 2xl:gap-[64px] xl:gap-[64px] lg:gap-[50px] md:gap-[40px] sm:gap-[30px] gap-[25px] items-center justify-center">
            <Image 
              src="/images/404.png" 
              alt="404 Not Found"
              width={850} 
              height={396}
              className="w-full max-w-[850px] h-auto"
            />
            <div className="flex flex-col gap-[20px] items-center justify-center">
              <h2 className="h2 text-white text-center">Lost in Space?</h2>
              <p className="font-lato text-white text-center 2xl:text-[24px] xl:text-[24px] lg:text-[22px] md:text-[20px] sm:text-[18px] text-[16px] 2xl:leading-[36px] xl:leading-[36px] lg:leading-[33px] md:leading-[30px] sm:leading-[27px] leading-[24px] font-normal 2xl:max-w-[800px] xl:max-w-[800px] lg:max-w-[700px] md:max-w-[600px] sm:max-w-[500px] max-w-[400px]">
                Looks like you've ventured into uncharted territory! Don't worry, we're redirecting you back to <span className="text-[#E72125] font-semibold">Home Base</span> in{' '}
                <span className="rounded-full bg-[#E72125]/50 w-[38px] h-[38px] inline-flex items-center justify-center text-[23px] font-bold text-white mx-2">
                  {countdown}
                </span>{' '}
                {countdown === 1 ? 'second' : 'seconds'}.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFound;
