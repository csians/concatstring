"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const StickyButton = () => {
  const pathname = usePathname();

  // Don't show the button on contact-us page
  if (pathname === "/contact-us") {
    return null;
  }

  return (
    <div className="fixed bottom-[1.5rem] right-4 lg:right-6 z-[9999]">
      {/* Desktop Button (Large screens only) */}
      <Link
        href="/contact-us"
        className="hidden lg:block btn-primary bg-gradient-to-b from-[#DA2124] to-[#8E1D1D] hover:from-[#DA2124] hover:to-[#DA2124] transition-all duration-300 ease-in-out [background-size:100%_153.5%] shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        Get in Touch
      </Link>
      
      {/* Mobile & Tablet Button with Call Icon */}
      <Link
        href="/contact-us"
        className="lg:hidden flex items-center justify-center w-14 h-14 bg-gradient-to-b from-[#DA2124] to-[#8E1D1D] hover:from-[#DA2124] hover:to-[#DA2124] transition-all duration-300 ease-in-out rounded-full shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
        >
          <path 
            d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59531 1.99522 8.06691 2.16708 8.43376 2.48353C8.80061 2.79999 9.04207 3.23945 9.11999 3.72C9.28562 4.68007 9.56937 5.62273 9.96999 6.53C10.1 6.92 10.15 7.34 10.09 7.75C10.03 8.16 9.87 8.55 9.61999 8.88L8.38999 10.11C9.41234 12.2955 10.9968 14.1853 12.99 15.59C13.18 15.74 13.4 15.85 13.64 15.91C13.88 15.97 14.13 15.97 14.37 15.91C14.61 15.85 14.83 15.74 15.02 15.59L16.25 14.36C16.58 14.11 16.97 13.95 17.38 13.89C17.79 13.83 18.21 13.88 18.6 14.01C19.5073 14.4106 20.4499 14.6944 21.41 14.86C21.8966 14.938 22.1742 15.3986 22.08 15.88C22.0024 16.2508 21.9171 16.6201 21.82 16.99L22 16.92Z" 
            fill="white"
          />
        </svg>
      </Link>
    </div>
  );
};

export default StickyButton;
