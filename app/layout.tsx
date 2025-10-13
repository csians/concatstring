import type { Metadata } from "next";
import Script from "next/script";
import "@/app/globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ApolloWrapper from "@/components/apollo-provider";
import ScrollToTop from "@/components/ScrollToTop";
import StickyButton from "@/components/StickyButton";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { generateSeoMetadata } from "@/components/SEOComponent";
import CookieConsent from "@/components/CookieConsent";
import CookiePreferencesButton from "@/components/CookiePreferencesButton";
import { lato, montserrat } from "@/app/fonts";
// export const metadata: Metadata = {
//   title: "White Label Web Design & Development Service - Concatstring",
//   description:
//     "Discover seamless Ecommerce solutions tailored for your business with Shopify and WooCommerce services. Empower your online store with robust features, flexible customization, and reliable support.",
//   icons: {
//     icon: "/favicon.png", // Or favicon.ico if you have that
//   },
// };

export async function generateMetadata(): Promise<Metadata> {
  return await generateSeoMetadata("cG9zdDoyMA=="); // Home page ID
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lato.className} ${montserrat.className}`}>
      <head>
        {/* Unpkg CDN - large Lottie script */}
        <link rel="preconnect" href="https://unpkg.com" crossOrigin="anonymous" />
        {/* <link
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        /> */}
        <meta name="google-site-verification" content="v8yl-AwGz9it1y8ph-q7gQL4MXAwSWq6JBiPqh7REgc" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon-precomposed" href="/apple-touch-icon-precomposed.png" />
        {/* Removed poster preload per UX preference (no poster visible) */}
        {/* Removed video preload to reduce initial bandwidth */}
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-55FER8PNWF"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-55FER8PNWF');
            `,
          }}
        />
        {/* B2B Tracking Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(key) {
                if (window.reb2b) return;
                window.reb2b = {loaded: true};
                var s = document.createElement("script");
                s.async = true;
                s.src = "https://b2bjsstore.s3.us-west-2.amazonaws.com/b/" + key + "/" + key + ".js.gz";
                document.getElementsByTagName("script")[0].parentNode.insertBefore(s, document.getElementsByTagName("script")[0]);
              }("GNLKQHPQ176Q");
            `,
          }}
        />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-W3GWN8VV');
            `,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body className="bg-black overflow-x-hidden">
        {/* Load heavy Lottie script lazily to avoid render blocking */}
        <Script
          src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"
          strategy="afterInteractive"
        />
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-W3GWN8VV"
            height="0" 
            width="0" 
            style={{display:'none',visibility:'hidden'}}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <ApolloWrapper>
          {/* <ScrollToTop /> */}
          <Header />
          {children}
          <Footer />
          <StickyButton />
          <CookieConsent />
          <CookiePreferencesButton />
          <ToastContainer
            position="top-right"
            autoClose={8000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={true}
            draggable
            pauseOnHover={true}
            theme="dark"
            style={{ zIndex: 9999999 }}
            toastClassName="!z-[9999999]"
          />
        </ApolloWrapper>
      </body>
    </html>
  );
}
