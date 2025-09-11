'use client'
import { useEffect } from "react";
import "../css/privacyPolicy.css";

const privacypolicy = () => {
  useEffect(() => {
    const offset = 140;
    const navLinks = document.querySelectorAll<HTMLAnchorElement>(".sticky-list a");

    const onScroll = () => {
      const scrollPos = window.scrollY + offset;

      const sections = document.querySelectorAll<HTMLElement>("section[id]");
      sections.forEach((sec) => {
        const top = sec.offsetTop;
        const bottom = top + sec.offsetHeight;

        if (scrollPos >= top && scrollPos < bottom) {
          navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${sec.id}`;
            if (isActive) {
              link.classList.add("bg-[#E7212580]");
              link.classList.add("text-white");
            } else {
              link.classList.remove("bg-[#E7212580]");
              link.classList.remove("text-white");
            }
          });
        }
      });
    };

    const handleClick = (e: Event) => {
      const link = e.currentTarget as HTMLAnchorElement;
      const href = link.getAttribute("href");

      // ✅ Only intercept if it's an in-page anchor (starts with "#")
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const id = href.slice(1);
        const target = document.getElementById(id);
        if (target) {
          const targetPosition = target.offsetTop - offset;
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    };

    navLinks.forEach((link) => {
      link.addEventListener("click", handleClick);
    });


    window.addEventListener("scroll", onScroll);

    return () => {
      navLinks.forEach((link) => {
        link.removeEventListener("click", handleClick);
      });
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <section className="2xl:pt-[254px] xl:pt-[254px] lg:pt-[200px] md:pt-[170px] sm:pt-[150px] pt-[150px]">
        <div className="container max-w-[1400px] px-[20px] mx-auto">
          <h1 className="h2 text-white text-center">Privacy Policy</h1>
        </div>
      </section>
      <section className="pt-[60px] pb-[120px]">
        <div className="container max-w-[1400px] px-[20px] mx-auto">
          <div className="flex items-top 2xl:gap-[70px] xl:gap-[70px] lg:gap-[30px] md:gap-[30px] sm:gap-[20px] gap-[20px] 2xl:flex-row xl:flex-row lg:flex-col md:flex-col sm:flex-col flex-col">
            {/* Left Sticky Nav  */}
            <nav className="2xl:block xl:block lg:hidden md:hidden sm:hidden hidden 2xl:w-[400px] xl:w-[300px] lg:w-[300px] sticky top-[436px]  pr-[20px] box-content">
              <ul className="flex flex-col gap-[16px] 2xl:w-[400px] xl:w-[300px] lg:w-[300px] sticky sticky-list top-[120px] max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar pr-[10px]">
                <li className="cursor-pointer">
                  <a
                    href="#about"
                    className="p-[20px] rounded-[10px] bg-[#292929] text-[24px] leading-[32px] font-bold font-denton leading-[100%] hover:bg-[#E7212580] text-left !text-white w-full flex"
                  >
                    About Us
                  </a>
                </li>
                <li className="cursor-pointer">
                  <a
                    href="#information"
                    className="p-[20px] rounded-[10px] bg-[#292929] text-[24px] leading-[32px] font-bold font-denton leading-[100%] hover:bg-[#E7212580] text-left !text-white w-full flex"
                  >
                    Information We Collect
                  </a>
                </li>
                <li className="cursor-pointer">
                  <a
                    href="#service"
                    className="p-[20px] rounded-[10px] bg-[#292929] text-[24px] leading-[32px] font-bold font-denton leading-[100%] hover:bg-[#E7212580] text-left !text-white w-full flex"
                  >
                    Services
                  </a>
                </li>
                <li className="cursor-pointer">
                  <a
                    href="#limitation"
                    className="p-[20px] rounded-[10px] bg-[#292929] text-[24px] leading-[32px] font-bold font-denton leading-[100%] hover:bg-[#E7212580] text-left !text-white w-full flex"
                  >
                    Limitation
                  </a>
                </li>
                <li className="cursor-pointer">
                  <a
                    href="#data-security"
                    className="p-[20px] rounded-[10px] bg-[#292929] text-[24px] leading-[32px] font-bold font-denton leading-[100%] hover:bg-[#E7212580] text-left !text-white w-full flex"
                  >
                    Data Security
                  </a>
                </li>
                <li className="cursor-pointer">
                  <a
                    href="#data-retention"
                    className="p-[20px] rounded-[10px] bg-[#292929] text-[24px] leading-[32px] font-bold font-denton leading-[100%] hover:bg-[#E7212580] text-left !text-white w-full flex"
                  >
                    Data Retention
                  </a>
                </li>
                {/* <li className="cursor-pointer">
                  <a
                    href="#security"
                    className="p-[20px] rounded-[10px] bg-[#292929] text-[24px] leading-[32px] font-bold font-denton leading-[100%] hover:bg-[#E7212580] text-left !text-white w-full flex"
                  >
                    Data Security
                  </a>
                </li> */}
                <li className="cursor-pointer">
                  <a
                    href="#user-right"
                    className="p-[20px] rounded-[10px] bg-[#292929] text-[24px] leading-[32px] font-bold font-denton leading-[100%] hover:bg-[#E7212580] text-left !text-white w-full flex"
                  >
                    User Rights
                  </a>
                </li>
                <li className="cursor-pointer">
                  <a
                    href="#cross"
                    className="p-[20px] rounded-[10px] bg-[#292929] text-[24px] leading-[32px] font-bold font-denton leading-[100%] hover:bg-[#E7212580] text-left !text-white w-full flex"
                  >
                    Cross-border Data Flow
                  </a>
                </li>
                <li className="cursor-pointer">
                  <a
                    href="#links"
                    className="p-[20px] rounded-[10px] bg-[#292929] text-[24px] leading-[32px] font-bold font-denton leading-[100%] hover:bg-[#E7212580] text-left !text-white w-full flex"
                  >
                    Links from Other Websites
                  </a>
                </li>
                <li className="cursor-pointer">
                  <a
                    href="#parental"
                    className="p-[20px] rounded-[10px] bg-[#292929] text-[24px] leading-[32px] font-bold font-denton leading-[100%] hover:bg-[#E7212580] text-left !text-white w-full flex"
                  >
                    Parental Control
                  </a>
                </li>
                <li className="cursor-pointer">
                  <a
                    href="#update"
                    className="p-[20px] rounded-[10px] bg-[#292929] text-[24px] leading-[32px] font-bold font-denton leading-[100%] hover:bg-[#E7212580] text-left !text-white w-full flex"
                  >
                    Updates to the Privacy Policy
                  </a>
                </li>
                <li className="cursor-pointer">
                  <a
                    href="#inquiries"
                    className="p-[20px] rounded-[10px] bg-[#292929] text-[24px] leading-[32px] font-bold font-denton leading-[100%] hover:bg-[#E7212580] text-left !text-white w-full flex"
                  >
                    Inquiries
                  </a>
                </li>
              </ul>
            </nav>

            {/* Right Content  */}
            <div className="2xl:w-[930px] xl:w-[930px] lg:w-full md:w-full sm:w-full w-full" id="scrollable-content">
              <div className="flex flex-col 2xl:gap-[60px] xl:gap-[60px] lg:gap-[40px] md:gap-[30px] sm:gap-[25px] gap-[20px] privacy-content">
                <p>
                  Your privacy is very important to us at Concatstring
                  This Privacy Policy describes the ways we gather, utilize,
                  save, and secure your private information. It also explains
                  the ways we protect your personal information while using our
                  services, visiting our website, or interacting with us in any
                  form. If you access or utilize our website and services, you
                  consent to the terms of this Privacy Policy.
                </p>
                <section id="about">
                  <div className="flex flex-col gap-[16px] scroll-mt-[436px]">
                    <h3 className="h4 text-white">1. Who We Are </h3>
                    <p>
                      Concatstring is one of the foremost IT
                      enterprises located in India, proficient in providing
                      comprehensive services such as website designing, web
                      development, mobile application development, and bespoke
                      software development. We offer services to clients from
                      different industrial sectors. Our projects are developed
                      in different languages and frameworks.
                    </p>
                  </div>
                </section>
                <section id="information">
                  <div className="flex flex-col gap-[16px] scroll-mt-[100px]">
                    <h3 className="h4 text-white">2. Information We Collect</h3>
                    <p>We may collect the following types of information:</p>
                    <div className="flex flex-col gap-[20px]">
                      <h4 className="h5 text-white">a. Personal Information</h4>
                      <ol>
                        <li>Full name</li>
                        <li>Email address</li>
                        <li>Phone number</li>
                        <li>Company name</li>
                        <li>Billing address</li>
                        <li>Communication preferences</li>
                      </ol>
                    </div>
                    <div className="flex flex-col gap-[20px]">
                      <h4 className="h5 text-white">
                        b. Technical Information
                      </h4>
                      <ol>
                        <li>IP address</li>
                        <li>Browser type and version</li>
                        <li>Device type</li>
                        <li>Operating system</li>
                        <li>Referring URLs</li>
                        <li>Access times and dates</li>
                      </ol>
                    </div>
                    <div className="flex flex-col gap-[20px]">
                      <h4 className="h5 text-white">c. Usage Data</h4>
                      <ol>
                        <li>Pages visited</li>
                        <li>Time spent on the website</li>
                        <li>Click behavior</li>
                        <li>Forms submitted</li>
                      </ol>
                    </div>
                    <div className="flex flex-col gap-[20px]">
                      <h4 className="h5 text-white">
                        d. Use of Cookies and Tracking
                      </h4>
                      <p>
                        In order to enhance user experience, we collect data
                        using cookies, pixels, and other similar tracking
                        technologies. Users are also able to manage their cookie
                        preferences in website settings.
                      </p>
                    </div>
                  </div>
                </section>
                <section id="service">
                  <div className="flex flex-col gap-[16px] scroll-mt-[100px]">
                    <h3 className="h4 text-white">
                      3. Services For Which Information Is Collected
                    </h3>
                    <p>We put the information collected to use to:</p>
                    <ol>
                      <li>Provide IT and web development services</li>
                      <li>Support the customer and respond to inquiries</li>
                      <li>Process payments and issue invoices</li>
                      <li>
                        Enhance the functions of the website and improve the
                        overall user experience
                      </li>
                      <li>Conduct research and analyze markets</li>
                      <li>
                        Send newsletters, service updates and marketing
                        communications (for those who opted in)
                      </li>
                      <li>Comply with rules of the law and Terms of service</li>
                    </ol>
                  </div>
                </section>
                <section id="limitation">
                  <div className="flex flex-col gap-[16px] scroll-mt-[100px]">
                    <h3 className="h4 text-white">
                      4. Limitations of the Information Collected
                    </h3>
                    <p>
                      No information will is sold to a third party. The
                      information may, however, be disclosed in the following
                      situations:
                    </p>
                    <ol>
                      <li>
                        To service providers, where the information is needed to
                        assist in functions such as hosting, analytics,
                        payments, and marketing
                      </li>
                      <li>
                        Legal authorities, where permitted by law, legal
                        processes, or government request
                      </li>
                      <li>
                        During any business transfer, like merging with,
                        acquiring, or selling an asset
                      </li>
                      <li>
                        To all third parties, the information is to be kept
                        confidential and secure.
                      </li>
                    </ol>
                  </div>
                </section>
                <section id="data-security">
                  <div className="flex flex-col gap-[16px] scroll-mt-[100px]">
                    <h3 className="h4 text-white">
                      5. Data Security Measures Implemented
                    </h3>
                    <p>
                      We have taken steps to ensure robust data protection
                      against unauthorized access, misuse, disclosure, or
                      destruction. These measures comprise:
                    </p>
                    <ol>
                      <li>Secure server infrastructure</li>
                      <li>SSL encryption</li>
                      <li>Access controls</li>
                      <li>Regular data backups</li>
                    </ol>
                    <p>
                      As much as the above measures can help secure data, there
                      are no completely secure methods of electronic storage or
                      transmission over the internet.
                    </p>
                  </div>
                </section>
                <section id="data-retention">
                  <div className="flex flex-col gap-[16px] scroll-mt-[100px]">
                    <h3 className="h4 text-white">6. Data Retention</h3>
                    <p>
                      We will retain your personal information for the shortest
                      time possible to achieve the objectives listed in this
                      policy.
                    </p>
                  </div>
                </section>
                <section id="user-right">
                  <div className="flex flex-col gap-[16px] scroll-mt-[100px]">
                    <h3 className="h4 text-white">7. User Rights</h3>
                    <p>
                      Depending on the region where you reside, in combination
                      with some applicable laws, you could possibly have the
                      following rights:
                    </p>
                    <ol>
                      <li>Access, update, or delete the personal data</li>
                      <li>Restrict, or object to, data processing</li>
                      <li>Data portability </li>
                      <li>Withdraw consent anytime granted</li>
                      <li>
                        Lodge a complaint with a data protection authority
                      </li>
                    </ol>
                    <p>
                      We can be contacted via email at <a href="mailto:info@concatstring.com">info@concatstring.com</a> to exercise any of the above rights
                    </p>
                  </div>
                </section>
                <section id="cross">
                  <div className="flex flex-col gap-[16px] scroll-mt-[100px]">
                    <h3 className="h4 text-white">8. Cross-border Data Flow</h3>
                    <p>
                      Your data might be stored and processed in the countries
                      where we are located or are located with the third party
                      service providers. You will be deemed to have consented to
                      such transfers when you use our services. These transfers
                      will be done in accordance with the applicable data
                      protection regulations.
                    </p>
                  </div>
                </section>
                <section id="links">
                  <div className="flex flex-col gap-[16px] scroll-mt-[100px]">
                    <h3 className="h4 text-white">
                      9. Links from Other Websites
                    </h3>
                    <p>
                      Your data might be stored and processed in the countries
                      where we are located or are located with the third party
                      service providers. You will be deemed to have consented to
                      such transfers when you use our services. These transfers
                      will be done in accordance with the applicable data
                      protection regulations.
                    </p>
                  </div>
                </section>
                <section id="parental">
                  <div className="flex flex-col gap-[16px] scroll-mt-[100px]">
                    <h3 className="h4 text-white">10. Parental Control</h3>
                    <p>
                      Our services do not cater to children below the ages of
                      13. We do not intentionally gather private information
                      from children. If you believe that a minor has submitted
                      private information to us, reach out to us so we can take
                      appropriate measures.
                    </p>
                  </div>
                </section>
                <section id="update">
                  <div className="flex flex-col gap-[16px] scroll-mt-[100px]">
                    <h3 className="h4 text-white">
                      11. Updates to the Privacy Policy{" "}
                    </h3>
                    <p>
                      Concatstring can change the privacy policy
                      anytime. All the changes are noted down and marked with a
                      renewal date. We recommend checking the site regularly, so
                      you are always aware of what measures are taken in
                      securing your information.
                    </p>
                  </div>
                </section>
                <section id="inquiries">
                  <div className="flex flex-col gap-[16px] scroll-mt-[100px]">
                    <h3 className="h4 text-white">12. Inquiries</h3>
                    <p>
                      For any inquiries, concerns, or changes regarding the
                      privacy policy and data collection procedures, reach out
                      to us through: Please feel free to <a href="https://concatstring.com/contact-us" className="text-white w-max">contact us</a> or email us directly at <a href="mailto:info@concatstring.com" className="text-white w-max">info@concatstring.com</a>.
                    </p>
                    
                    
                    
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default privacypolicy;