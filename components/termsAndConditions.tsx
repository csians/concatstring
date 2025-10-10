'use client'
import { useEffect } from "react";
import "../css/termsAndConditions.css";
import Link from "next/link";
const termsandconditions = () => {

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
          <h1 className="h2 text-white text-center">Terms and Conditions</h1>
        </div>
      </section>
      <section className="pt-[60px] pb-[120px]">
        <div className="container max-w-[1400px] px-[20px] mx-auto">
          <div className="flex items-top 2xl:gap-[70px] xl:gap-[70px] lg:gap-[30px] md:gap-[30px] sm:gap-[20px] gap-[20px] 2xl:flex-row xl:flex-row lg:flex-col md:flex-col sm:flex-col flex-col">
            {/* Left Sticky Nav  */}
            <nav className="2xl:block xl:block lg:hidden md:hidden sm:hidden hidden 2xl:w-[400px] xl:w-[300px] lg:w-[300px] sticky top-[436px]  pr-[20px] box-content">
              <ul className="flex flex-col gap-[16px] 2xl:w-[400px] xl:w-[300px] lg:w-[300px] sticky sticky-list top-[120px] max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar pr-[10px]">
                <li className="cursor-pointer">
                  <Link href="#about" className="p-[20px] rounded-[10px] bg-[#292929] text-[24px] leading-[32px] font-bold font-denton leading-[100%] hover:bg-[#E7212580] text-left !text-white w-full flex">
                    About Us
                  </Link>
                </li>
                <li className="cursor-pointer">
                  <Link href="#eligibility" className="p-[20px] rounded-[10px] bg-[#292929] text-[24px] leading-[32px] font-bold font-denton leading-[100%] hover:bg-[#E7212580] text-left !text-white w-full flex">
                    Eligibility
                  </Link>
                </li>
                <li className="cursor-pointer">
                  <Link href="#service" className="p-[20px] rounded-[10px] bg-[#292929] text-[24px] leading-[32px] font-bold font-denton leading-[100%] hover:bg-[#E7212580] text-left !text-white w-full flex">
                    Scope of Services
                  </Link>

                </li>
                <li className="cursor-pointer">
                  <Link href="#responsibilities" className="p-[20px] rounded-[10px] bg-[#292929] text-[24px] leading-[32px] font-bold font-denton leading-[100%] hover:bg-[#E7212580] text-left !text-white w-full flex">
                    User Responsibilities
                  </Link>

                </li>
                <li className="cursor-pointer">

                  <Link href="#property" className="p-[20px] rounded-[10px] bg-[#292929] text-[24px] leading-[32px] font-bold font-denton leading-[100%] hover:bg-[#E7212580] text-left !text-white w-full flex">
                    Intellectual Property
                  </Link>
                </li>
                <li className="cursor-pointer">
                  <Link href="#payment" className="p-[20px] rounded-[10px] bg-[#292929] text-[24px] leading-[32px] font-bold font-denton leading-[100%] hover:bg-[#E7212580] text-left !text-white w-full flex">
                    Payments and Invoicing
                  </Link>

                </li>
                <li className="cursor-pointer">
                  <Link href="#confidentiality" className="p-[20px] rounded-[10px] bg-[#292929] text-[24px] leading-[32px] font-bold font-denton leading-[100%] hover:bg-[#E7212580] text-left !text-white w-full flex">
                    Confidentiality
                  </Link>

                </li>
                <li className="cursor-pointer">

                  <Link href="#rivision" className="p-[20px] rounded-[10px] bg-[#292929] text-[24px] leading-[32px] font-bold font-denton leading-[100%] hover:bg-[#E7212580] text-left !text-white w-full flex">
                    Revisions and Support
                  </Link>
                </li>
                <li className="cursor-pointer">

                  <Link href="#termination" className="p-[20px] rounded-[10px] bg-[#292929] text-[24px] leading-[32px] font-bold font-denton leading-[100%] hover:bg-[#E7212580] text-left !text-white w-full flex">
                    Termination
                  </Link>
                </li>
                <li className="cursor-pointer">

                  <Link href="#warranties" className="p-[20px] rounded-[10px] bg-[#292929] text-[24px] leading-[32px] font-bold font-denton leading-[100%] hover:bg-[#E7212580] text-left !text-white w-full flex">
                    Disclaimer of Warranties
                  </Link>
                </li>
                <li className="cursor-pointer">

                  <Link href="#limitation" className="p-[20px] rounded-[10px] bg-[#292929] text-[24px] leading-[32px] font-bold font-denton leading-[100%] hover:bg-[#E7212580] text-left !text-white w-full flex">
                    Limitation of Liability
                  </Link>
                </li>
                <li className="cursor-pointer">

                  <Link href="#third" className="p-[20px] rounded-[10px] bg-[#292929] text-[24px] leading-[32px] font-bold font-denton leading-[100%] hover:bg-[#E7212580] text-left !text-white w-full flex">
                    Third-Party Services
                  </Link>
                </li>
                <li className="cursor-pointer">

                  <Link href="#modification" className="p-[20px] rounded-[10px] bg-[#292929] text-[24px] leading-[32px] font-bold font-denton leading-[100%] hover:bg-[#E7212580] text-left !text-white w-full flex">
                    Modifications to Terms
                  </Link>
                </li>
                <li className="cursor-pointer">

                  <Link href="#governing" className="p-[20px] rounded-[10px] bg-[#292929] text-[24px] leading-[32px] font-bold font-denton leading-[100%] hover:bg-[#E7212580] text-left !text-white w-full flex">
                    Governing Laws
                  </Link>
                </li>
                <li className="cursor-pointer">

                  <Link href="#contact" className="p-[20px] rounded-[10px] bg-[#292929] text-[24px] leading-[32px] font-bold font-denton leading-[100%] hover:bg-[#E7212580] text-left !text-white w-full flex">
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Right Content  */}
            <div className="2xl:w-[930px] xl:w-[930px] lg:w-full md:w-full sm:w-full w-full" id="scrollable-content">
              <div className="flex flex-col 2xl:gap-[60px] xl:gap-[60px] lg:gap-[40px] md:gap-[30px] sm:gap-[25px] gap-[20px] terms-content">
                <p>Please read these Terms and Conditions ("Terms") carefully before using the services provided by <b>Concatstring</b> ("Company", "we", "us", or "our"). By accessing or using our website and services, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you must not use our services.</p>
                <section id="about">
                  <div className="flex flex-col gap-[16px] scroll-mt-[436px]">
                    <h3 className="h4 text-white">1. About Concatstring</h3>
                    <p>Concatstring is a full-service IT company offering solutions in website design, web and mobile application development, and software development. We serve clients worldwide, building custom IT solutions using a wide range of programming languages and frameworks.</p>
                  </div>
                </section>
                <section id="eligibility">
                  <div className="flex flex-col gap-[16px] scroll-mt-[100px]" >
                    <h3 className="h4 text-white">2. Eligibility</h3>
                    <p>By using our services, you represent and warrant that you are at least 18 years of age and have the legal authority to enter into a binding contract.</p>
                  </div>
                </section>
                <section id="service">
                  <div className="flex flex-col gap-[16px] scroll-mt-[100px]">
                    <h3 className="h4 text-white">3. Scope of Services</h3>
                    <p>We provide the following services, which may vary based on individual agreements:</p>
                    <ol>
                      <li>Website design and development</li>
                      <li>E-commerce development</li>
                      <li>Mobile application development</li>
                      <li>Custom software development</li>
                      <li>UI/UX design</li>
                      <li>API development and integrations</li>
                      <li>IT consulting and support</li>
                      <li>Digital marketing and SEO</li>
                    </ol>
                    <p>Each project will be governed by a separate agreement or scope of work, including timelines, deliverables, and pricing.</p>
                  </div>
                </section>
                <section id="responsibilities">
                  <div className="flex flex-col gap-[16px] scroll-mt-[100px]">
                    <h3 className="h4 text-white">4. User Responsibilities</h3>
                    <p>By using our services, you agree to:</p>
                    <ol>
                      <li>Provide accurate and complete information for project execution</li>
                      <li>Cooperate with our team and provide necessary feedback</li>
                      <li>Make timely payments as per the agreed-upon schedule</li>
                      <li>Not use our services for any unlawful or unauthorized purposes</li>
                      <li>Maintain the confidentiality of any credentials provided to access systems or services</li>
                    </ol>
                  </div>
                </section>
                <section id="property">
                  <div className="flex flex-col gap-[16px] scroll-mt-[100px]" >
                    <h3 className="h4 text-white">5. Intellectual Property</h3>
                    <div className="flex flex-col gap-[20px]">
                      <h4 className="h5 text-white">a. Ownership</h4>
                      <p>All intellectual property rights in the original designs, code, software, or content created by Concatstring for the client will be transferred upon full payment, unless otherwise agreed.</p>
                    </div>
                    <div className="flex flex-col gap-[20px]">
                      <h4 className="h5 text-white">b. Client Materials</h4>
                      <p>You confirm that any materials (text, images, videos, data, etc.) you provide do not infringe on the intellectual property rights of any third party.</p>
                    </div>
                  </div>
                </section>
                <section id="payment">
                  <div className="flex flex-col gap-[16px] scroll-mt-[100px]">
                    <h3 className="h4 text-white">6. Payments and Invoicing</h3>
                    <ol>
                      <li>Payment terms will be outlined in the project proposal or service agreement.</li>
                      <li>Late payments may incur interest charges or service delays.</li>
                      <li>All prices are exclusive of applicable taxes unless otherwise mentioned.</li>
                    </ol>
                  </div>
                </section>
                <section id="confidentiality">
                  <div className="flex flex-col gap-[16px] scroll-mt-[100px]">
                    <h3 className="h4 text-white">7. Confidentiality</h3>
                    <p>We respect the confidentiality of your business information. Any data shared with us during the project will be kept confidential and used solely for the purpose of project execution, unless disclosure is required by law.</p>
                  </div>
                </section>
                <section id="rivision">
                  <div className="flex flex-col gap-[16px] scroll-mt-[100px]">
                    <h3 className="h4 text-white">8. Revisions and Support</h3>
                    <p>Depending on the region where you reside, in combination with some applicable laws, you could possibly have the following rights:</p>
                    <ol>
                      <li>We generally offer a limited number of revisions as part of our service.</li>
                      <li>Post-delivery support or maintenance is subject to the terms of the project agreement or may be billed additionally.</li>
                    </ol>
                  </div>
                </section>
                <section id="termination">
                  <div className="flex flex-col gap-[16px] scroll-mt-[100px]">
                    <h3 className="h4 text-white">9. Termination</h3>
                    <p>Either party may terminate the agreement in writing under the following circumstances:</p>
                    <ol>
                      <li>Breach of contract</li>
                      <li>Failure to make payments</li>
                      <li>Mutual agreement</li>
                      <li>Misuse of services or unlawful activity</li>
                    </ol>
                    <p>Upon termination, all unpaid dues must be settled, and access to services may be revoked.</p>
                  </div>
                </section>
                <section id="warranties">
                  <div className="flex flex-col gap-[16px] scroll-mt-[100px]">
                    <h3 className="h4 text-white">10. Disclaimer of Warranties</h3>
                    <p>All services are provided on an "as-is" and "as-available" basis. We do not guarantee that the services will be error-free, secure, or uninterrupted. We disclaim all warranties, express or implied, including merchantability and fitness for a particular purpose.</p>
                  </div>
                </section>
                <section id="limitation">
                  <div className="flex flex-col gap-[16px] scroll-mt-[100px]">
                    <h3 className="h4 text-white">11. Limitation of Liability</h3>
                    <p>To the fullest extent permitted by law, Concatstring shall not be liable for any indirect, incidental, special, or consequential damages resulting from:</p>
                    <ol>
                      <li>Use or inability to use the services</li>
                      <li>Unauthorized access to your data</li>
                      <li>Errors or omissions in the service</li>
                    </ol>
                  </div>
                </section>
                <section id="third">
                  <div className="flex flex-col gap-[16px] scroll-mt-[100px]">
                    <h3 className="h4 text-white">12. Third-Party Services</h3>
                    <p>We may use or integrate third-party services and tools as part of your project. We are not responsible for any third-party content, functionality, or security. Use of such services will be subject to their respective terms and conditions.</p>
                  </div>
                </section>
                <section id="modification">
                  <div className="flex flex-col gap-[16px] scroll-mt-[100px]">
                    <h3 className="h4 text-white">13. Modifications to Terms</h3>
                    <p>We reserve the right to update or modify these Terms at any time without prior notice. Any changes will be effective upon posting on our website. Continued use of our services after changes are made indicates your acceptance of the revised Terms.</p>
                  </div>
                </section>
                <section id="governing">
                  <div className="flex flex-col gap-[16px] scroll-mt-[100px]">
                    <h3 className="h4 text-white">14. Governing Law</h3>
                    <p>These Terms shall be governed and interpreted in accordance with the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts in Ahmedabad, India.</p>
                  </div>
                </section>
                <section id="contact">
                  <div className="flex flex-col gap-[16px] scroll-mt-[100px]">
                    <h3 className="h4 text-white">15. Contact Information</h3>
                    <p>For questions, feedback, or legal matters related to these Terms, please contact us at: <Link href="mailto:info@concatstring.com" className="text-white w-max">info@concatstring.com</Link>.</p>
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

export default termsandconditions;
