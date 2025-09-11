# Components

This directory contains reusable React components for the website.

## New Components

### 1. NotFound.tsx (404 Component)
A 404 Not Found page component with:
- Clean, centered design
- 404 image display
- Error message and description
- Action buttons (Go Home, Contact Us)
- Responsive design with Tailwind CSS

**Usage:**
```tsx
import NotFound from '@/components/NotFound';

// In your page or route
<NotFound />
```

**Required Images:**
- `/images/404.png` - 404 error image (400x300px recommended)

**Note:** This component is automatically used by Next.js for 404 pages via `app/not-found.tsx`

### 2. ComingSoon.tsx (Coming Soon Component)
A coming soon page component with:
- Header with logo and navigation
- Main coming soon image
- Interactive countdown timer (days, hours, minutes, seconds)
- Newsletter subscription form
- Responsive design with Tailwind CSS
- Gradient borders and modern styling

### 3. Error500.tsx (500 Error Component)
A 500 Internal Server Error component with:
- Clean, centered design matching the 404 component
- 500 error display
- Error message and description
- Action buttons (Go Home, Try Again)
- Responsive design with Tailwind CSS

**Usage:**
```tsx
import Error500 from '@/components/Error500';

// In your page or route
<Error500 />
```

**Required Images:**
- `/images/404.png` - Can use the same image as 404 component

**Usage:**
```tsx
import ComingSoon from '@/components/ComingSoon';

// In your page or route
<ComingSoon />
```

**Required Images:**
- `/images/comming/comming.png` - Main coming soon image (1034x389px recommended)
- `/images/comming/comming-bg.png` - Background image for the section

**Features:**
- Countdown timer with customizable target date
- Responsive grid layout
- Gradient color scheme matching the website theme
- Newsletter subscription form
- Mobile-friendly design

## Customization

### Countdown Timer
To change the target date in the Coming Soon component, modify this line in `ComingSoon.tsx`:
```tsx
const targetDate = new Date('2025-02-01T00:00:00').getTime();
```

### Colors
All components use the website's color scheme:
- Primary gradient: `from-[#E72125] to-[#54A3DA]` (red to blue)
- Background: `bg-black`
- Text: `text-white`

## Error Handling

### 404 Pages (Not Found)
- **File:** `app/not-found.tsx`
- **Component:** `NotFound.tsx`
- **Triggered:** When a page route doesn't exist

### 500 Pages (Server Errors)
- **File:** `app/global-error.tsx`
- **Component:** `Error500.tsx`
- **Triggered:** When there's a server error or unhandled exception

## Notes

⚠️ **Important**: Make sure to add the required images before using these components, otherwise they will show broken image placeholders.
