"use client";

import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";

const SmsUpdatesForm = () => {
  const [phone, setPhone] = useState("");
  const [dialCode, setDialCode] = useState("1");
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // For now we don't send this anywhere – just reset the form
    setPhone(dialCode || "");
    setAgreed(false);
  };

  return (
    <section className="pt-10 pb-20 bg-black">
      <div className="container max-w-[1640px] px-[20px] w-full mx-auto">
        <div className="mx-auto max-w-[1200px] flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-8">
          {/* Opt-in / Opt-out card */}
          <div className="flex">
            <div className="rounded-[24px] bg-[#050308] border border-white/10 shadow-[0_18px_40px_rgba(0,0,0,0.85)] px-6 py-8 sm:px-8 sm:py-8 w-full flex flex-col">
              <h3 className="font-denton font-bold text-[24px] sm:text-[26px] leading-[1.2] text-white mb-4">
                Opt-In &amp; Opt-Out
              </h3>
              <div className="space-y-2 text-[14px] sm:text-[15px] font-lato text-[#d5d5d5]">
                <p>
                  • To opt in, text{" "}
                  <span className="font-semibold">START</span> to{" "}
                  <a
                    href="tel:+15744442746"
                    className="font-semibold underline underline-offset-2"
                  >
                    +1-574-444-2746
                  </a>
                </p>
                <p>
                  • To opt out, text{" "}
                  <span className="font-semibold">STOP</span> or{" "}
                  <span className="font-semibold">CANCEL</span> to end all SMS
                  communications.
                </p>
                <p>
                  • For help, text{" "}
                  <span className="font-semibold">HELP</span> or contact us at{" "}
                  <a
                    href="mailto:info@concatstring.com"
                    className="underline underline-offset-2"
                  >
                    info@concatstring.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Get updates via SMS card */}
          <div className="flex">
            <div className="relative rounded-[24px] bg-[#050308] border border-white/10 shadow-[0_18px_40px_rgba(0,0,0,0.85)] px-6 py-8 sm:px-8 sm:py-8 w-full flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-[56px] w-[56px] items-center justify-center rounded-[18px] bg-[#151824]">
                  <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[16px] bg-black/40">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-6 w-6 text-white"
                    >
                      <path
                        fill="currentColor"
                        d="M18.5 2h-13A1.5 1.5 0 0 0 4 3.5v17A1.5 1.5 0 0 0 5.5 22h13a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 18.5 2Zm-3 18h-4a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2Zm4-4H6V4h13Z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-denton font-bold text-[24px] sm:text-[26px] leading-[1.2] text-white">
                    Get Project Updates via SMS
                  </h3>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <label className="block font-lato text-[15px] text-white/85">
                    Phone Number:
                  </label>
                  <div className="rounded-[14px] bg-[#050308] px-[2px] py-[2px]">
                    <PhoneInput
                      country="us"
                      value={phone}
                      onChange={(value, data: any) => {
                        setPhone(value);
                        if (data?.dialCode) {
                          setDialCode(data.dialCode);
                        }
                      }}
                      inputProps={{
                        name: "phone",
                        required: true,
                      }}
                      containerClass="w-full react-tel-input !text-black"
                      inputClass="!w-full !bg-[#111218] !border-none !text-white !h-[56px] !text-[15px] !rounded-[12px] !pl-[64px] !pr-4 font-lato placeholder:!text-white/40 focus:!outline-none"
                      buttonClass="!bg-[#151824] !border-none !rounded-l-[12px] !px-3"
                      dropdownClass="!bg-[#1b1b25] !text-white"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 text-[13px] text-white/80 font-lato">
                  <input
                    id="sms-agree"
                    type="checkbox"
                    className="mt-0.5 h-[18px] w-[18px] cursor-pointer rounded border border-white/40 bg-black/60 accent-[#E72125]"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <label
                    htmlFor="sms-agree"
                    className="cursor-pointer leading-[1.5]"
                  >
                    <span className="font-semibold text-white">I agree</span>{" "}
                    to receive SMS messages from{" "}
                    <span className="font-semibold text-white">
                      Concatstring Solutions
                    </span>{" "}
                    regarding my inquiry. Message frequency varies. Msg &amp;
                    data rates may apply. Reply STOP to opt out.
                  </label>
                </div>

                <div className="space-y-4 text-[13px] font-lato text-[#e1e1e1]">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-[#b9c2ff]">
                    <div className="space-x-2">
                      <a
                        href="/privacy"
                        className="underline underline-offset-2 hover:text-white"
                      >
                        Privacy Policy
                      </a>
                      <span>|</span>
                      <a
                        href="/terms"
                        className="underline underline-offset-2 hover:text-white"
                      >
                        Terms &amp; Conditions
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!phone || !agreed}
                    className="w-full rounded-[999px] px-6 py-3.5 text-center font-denton text-[18px] font-bold text-white btn-primary bg-[#E72125] hover:bg-gradient-to-r from-[#E72125] to-[#8E1D1D] transition-all duration-300 ease-in-out [background-size:100%_153.5%] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Subscribe via SMS
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
 };

 export default SmsUpdatesForm;

