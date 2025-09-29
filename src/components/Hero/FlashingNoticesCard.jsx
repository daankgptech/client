"use client";

import { VscDiffIgnored } from "react-icons/vsc";
import { Link } from "react-router-dom";

const notices = [
  // {
  //   text: (
  //     <>
  //       Register{" "}
  //       <Link
  //         rel="noopener noreferrer"
  //         className="text-blue-900 dark:text-blue-700 hover:text-blue-500 transition-colors duration-300"
  //         to="/tshirt-form"
  //       >
  //         here
  //       </Link>{" "}
  //       for Dakshana T-Shirt 2025.
  //     </>
  //   ),
  // },
  { text: "Autumn Break: Sep 27-Oct 05, 2025." },
  { text: "Dakshana Day: Oct 15, 2025." },
  { text: "Shaurya Sports Fest: Oct 17(AN)-Oct 19, 2025." },
  { text: "End Sems: Nov 17-Nov 25, 2025." },
  { text: "DST: Dec 14, 2025." },
];

export default function FlashingNoticesCard() {
  return (
    <>
      <style jsx>{`
        @property --border-angle {
          syntax: "<angle>";
          inherits: true;
          initial-value: 0deg;
        }
        @keyframes border-spin {
          to {
            --border-angle: 360deg;
          }
        }
        .animate-border {
          animation: border-spin 6s linear infinite;
        }
      `}</style>

      <div className="w-full flex justify-center p-4">
        <div className="w-full max-w-[600px] mx-auto rounded-2xl border border-transparent animate-border [background:linear-gradient(45deg,#080b11,theme(colors.slate.800)_50%,#172033)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate.600/.48)_80%,theme(colors.teal.500)_86%,theme(colors.cyan.300)_90%,theme(colors.teal.500)_94%,theme(colors.slate.600/.48))_border-box]">
          <div className="relative z-10 p-4 rounded-2xl bg-gray-500 dark:bg-gray-900 text-gray-950 dark:text-gray-400 shadow-lg">
            <div
              id="flashing-notices"
              data-aos="fade-right"
              data-aos-delay="900"
              className="scroll-mt-[100px] text-left"
            >
              <h1 className="mb-2 font-semibold underline bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                Flashing Notices
              </h1>

              <div className="space-y-3">
                {notices.map((notice, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-sm md:text-md"
                  >
                    {/* <VscDiffIgnored className="mt-[3px]" /> */}
                    <div>✦ {notice.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
