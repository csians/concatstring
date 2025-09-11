"use client";
import React from "react";

interface Props {
  post: any;
}

const Comments: React.FC<Props> = ({ post }) => {
  return (
    <></>
    // <section className="pt-[80px]">
    //   <div className="container max-w-[1400px] px-[20px] mx-auto">
    //     <div className="2xl:max-w-[1030px] xl:max-w-[1030px] lg:max-w-[1030px] md:max-w-full sm:max-w-full max-w-full">
    //       <h6 className="font-denton font-lato text-[36px] leading-[36px] text-white 2xl:mb-[40px] xl:mb-[40px] lg:mb-[40px] md:mb-[30px] sm:mb-[25px] mb-[20px]">
    //         {post?.commentCount} Comments{" "}
    //       </h6>
    //       <form className="flex flex-col 2xl:gap-[60px] xl:gap-[60px] lg:gap-[40px] md:gap-[30px] sm:gap-[25px] gap-[20px] items-center">
    //         <div className="flex flex-col gap-[24px] w-full">
    //           <div className="flex items-start flex-col">
    //             <div className="flex items-center gap-[14px]">
    //               <img src="/images/blog/t1.png" width="56" height="56" />
    //               <div className="flex flex-col gap-[5px]">
    //                 <h6 className="font-denton font-bold text-[20px] leading-[25px] text-white">
    //                   Parth Patil
    //                 </h6>
    //                 <p className="font-denton font-normal text-[16px] leading-[100%] text-white">
    //                   WordPress Developer
    //                 </p>
    //               </div>
    //             </div>
    //             <textarea
    //               className="font-normal text-[18px] leading-[28px] text-[#C3C3C3] bg-[#292929] rounded-[14px] py-[26px] px-[24px] mt-[20px] mb-[16px] w-full h-[136px]"
    //               defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore."
    //             />

    //             <a
    //               href="#"
    //               className="font-denton font-bold text-[20px] leading-[100%] text-white flex items-center gap-[8px]"
    //             >
    //               Reply
    //               <svg
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 width="20"
    //                 height="16"
    //                 viewBox="0 0 20 16"
    //                 fill="none"
    //               >
    //                 <path
    //                   d="M1 7C0.447715 7 0 7.44772 0 8C0 8.55228 0.447715 9 1 9V7ZM19.7071 8.70711C20.0976 8.31658 20.0976 7.68342 19.7071 7.29289L13.3431 0.928932C12.9526 0.538408 12.3195 0.538408 11.9289 0.928932C11.5384 1.31946 11.5384 1.95262 11.9289 2.34315L17.5858 8L11.9289 13.6569C11.5384 14.0474 11.5384 14.6805 11.9289 15.0711C12.3195 15.4616 12.9526 15.4616 13.3431 15.0711L19.7071 8.70711ZM1 8V9H19V8V7H1V8Z"
    //                   fill="white"
    //                 />
    //               </svg>
    //             </a>
    //           </div>
    //           <div className="flex items-start flex-col 2xl:ms-[60px] xl:ms-[60px] lg:ms-[50px] md:ms-[40px] sm:ms-[30px] ms-[20px]">
    //             <div className="flex items-center gap-[14px]">
    //               <img src="/images/blog/t1.png" width="56" height="56" />
    //               <div className="flex flex-col gap-[5px]">
    //                 <h6 className="font-denton font-bold text-[20px] leading-[25px] text-white">
    //                   Parth Patil
    //                 </h6>
    //                 <p className="font-denton font-normal text-[16px] leading-[100%] text-white">
    //                   WordPress Developer
    //                 </p>
    //               </div>
    //             </div>

    //             <textarea
    //               className="font-normal text-[18px] leading-[28px] text-[#C3C3C3] bg-[#292929] rounded-[14px] py-[26px] px-[24px] mt-[20px] mb-[16px] w-full h-[136px]"
    //               defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore."
    //             />

    //             <a
    //               href="#"
    //               className="font-denton font-bold text-[20px] leading-[100%] text-white flex items-center gap-[8px]"
    //             >
    //               Reply
    //               <svg
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 width="20"
    //                 height="16"
    //                 viewBox="0 0 20 16"
    //                 fill="none"
    //               >
    //                 <path
    //                   d="M1 7C0.447715 7 0 7.44772 0 8C0 8.55228 0.447715 9 1 9V7ZM19.7071 8.70711C20.0976 8.31658 20.0976 7.68342 19.7071 7.29289L13.3431 0.928932C12.9526 0.538408 12.3195 0.538408 11.9289 0.928932C11.5384 1.31946 11.5384 1.95262 11.9289 2.34315L17.5858 8L11.9289 13.6569C11.5384 14.0474 11.5384 14.6805 11.9289 15.0711C12.3195 15.4616 12.9526 15.4616 13.3431 15.0711L19.7071 8.70711ZM1 8V9H19V8V7H1V8Z"
    //                   fill="white"
    //                 />
    //               </svg>
    //             </a>
    //           </div>
    //         </div>
    //         <div className="flex flex-col 2xl:gap-[40px] xl:gap-[40px] lg:gap-[30px] md:gap-[30px] sm:gap-[20px] gap-[20px] w-full">
    //           <h3 className="font-lato font-bold 2xl:text-[38px] xl:text-[38px] lg:text-[30px] md:text-[30px] sm:text-[25px] text-[20px] leading-[100%] text-white">
    //             Add Comment
    //           </h3>
    //           <div className="flex flex-col 2xl:gap-[30px] xl:gap-[30px] lg:gap-[30px] md:gap-[20px] sm:gap-[20px] gap-[20px]">
    //             <div className="flex 2xl:gap-[30px] xl:gap-[30px] lg:gap-[30px] md:gap-[20px] sm:gap-[20px] gap-[20px] 2xl:flex-row xl:flex-row lg:flex-row md:flex-col sm:flex-col flex-col">
    //               <input
    //                 type="text"
    //                 placeholder="Add Your Full Name"
    //                 required
    //                 className="rounded-[12px] py-[20px] px-[20px] text-left font-lato font-medium text-white text-[20px] leading-[17px] bg-[#FFFFFF1A] w-full focus:bg-#FFFFFF1A focus:border-[#FFFFFF4D] focus:outline-none focus:ring-0 autofill:bg-transparent placeholder:text-[#F9F9F9] border border-[#FFFFFF4D]"
    //               />
    //               <input
    //                 type="email"
    //                 placeholder="Enter Your Email "
    //                 required
    //                 className="rounded-[12px] py-[20px] px-[20px] text-left font-lato font-medium text-white text-[20px] leading-[17px] bg-[#FFFFFF1A] w-full focus:bg-#FFFFFF1A focus:border-[#FFFFFF4D] focus:outline-none focus:ring-0 autofill:bg-transparent placeholder:text-[#F9F9F9] border border-[#FFFFFF4D]"
    //               />
    //             </div>
    //             <textarea
    //               className="rounded-[12px] py-[20px] px-[20px] text-left font-lato font-medium text-white text-[20px] leading-[17px] bg-[#FFFFFF1A] w-full focus:bg-#FFFFFF1A focus:border-[#FFFFFF4D] focus:outline-none focus:ring-0 autofill:bg-transparent placeholder:text-[#F9F9F9] border border-[#FFFFFF4D] h-[155px]"
    //               defaultValue="Add Your Comment here"
    //             />
    //           </div>
    //         </div>
    //         <div className="items-center justify-center w-max">
    //           <a href="#" className="inline-block group w-max">
    //             <div className="btn-primary-outline">
    //               <div className="btn-primary 2xl:px-[40px] xl:px-[40px] lg:px-[30px] md:px-[30px] sm:px-[20px] px-[20px]">
    //                 Leave a Comment
    //               </div>
    //             </div>
    //           </a>
    //         </div>
    //       </form>
    //     </div>
    //   </div>
    // </section>
  );
};

export default Comments;
