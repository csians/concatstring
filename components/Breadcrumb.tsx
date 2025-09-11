'use client';

import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  variant?: 'default' | 'minimal' | 'with-icons' | 'modern' | 'contrast';
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  items, 
  variant = 'default',
  className = '' 
}) => {
  const renderBreadcrumbItem = (item: BreadcrumbItem, index: number) => {
    const isLast = index === items.length - 1;
    
    if (isLast || !item.href) {
      return (
        <span 
          key={index}
          className={`text-[1.2rem] ${
            variant === 'contrast'
              ? 'text-[#E72125] font-semibold' 
              : className?.includes('text-white') 
              ? 'text-white' 
              : variant === 'minimal' 
              ? 'text-gray-600' 
              : variant === 'modern'
              ? 'text-gray-500'
              : 'text-gray-700'
          }`}
        >
          {item.label}
        </span>
      );
    }

    return (
      <Link
        key={index}
        href={item.href}
        className={`hover:text-[#E72125] transition-colors duration-200 ${
          variant === 'contrast'
            ? 'text-[#7B7B7B] hover:text-[#E72125] font-medium' 
            : className?.includes('text-white') 
            ? 'text-white/80 hover:text-white' 
            : variant === 'minimal' 
            ? 'text-gray-500 hover:text-gray-700' 
            : variant === 'modern'
            ? 'text-gray-400 hover:text-gray-600'
            : 'text-gray-600 hover:text-[#E72125]'
        }`}
      >
        {item.label}
      </Link>
    );
  };

  const ChevronRightIcon = () => {
    const iconClass = variant === 'contrast' 
      ? 'text-[#7B7B7B]' 
      : className?.includes('text-white') 
      ? 'text-white/60' 
      : 'text-gray-400';
    return (
      <svg className={`w-4 h-4 ${iconClass} mx-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    );
  };

  const renderSeparator = () => {
    const separatorClass = variant === 'contrast' 
      ? 'text-[#7B7B7B]' 
      : className?.includes('text-white') 
      ? 'text-white/60' 
      : 'text-gray-400';
    
    switch (variant) {
      case 'minimal':
        return <span className={`${separatorClass} mx-2`}>/</span>;
      case 'modern':
        return <ChevronRightIcon />;
      case 'with-icons':
        return <ChevronRightIcon />;
      case 'contrast':
        return <span className={`${separatorClass} mx-2`}>&gt;</span>;
      default:
        return <span className={`${separatorClass} mx-2`}>/</span>;
    }
  };

  const getContainerClasses = () => {
    const baseClasses = 'flex items-center text-[1.2rem] font-lato relative z-10';
    
    switch (variant) {
      case 'minimal':
        return `${baseClasses} text-gray-500`;
      case 'modern':
        return `${baseClasses} text-gray-400 bg-gray-50 px-4 py-2 rounded-lg`;
      case 'with-icons':
        return `${baseClasses} text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm border`;
      case 'contrast':
        return `${baseClasses} text-[#7B7B7B]`;
      default:
        return `${baseClasses} text-gray-600`;
    }
  };

  return (
    <nav 
      className={`${getContainerClasses()} ${className}`}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && renderSeparator()}
          {renderBreadcrumbItem(item, index)}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
