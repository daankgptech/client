import { Link } from "react-router-dom";

const notices = [
  // {
  //   text: (
  //     <>
  //       DAAN Council Election{" "}
  //       <Link
  //         rel="noopener noreferrer"
  //         className="text-rose-900 dark:text-rose-600 hover:text-rose-300 transition-colors duration-300 font-bold text-sm md:text-md"
  //         to="/council"
  //       >
  //         Result
  //       </Link>{" "}Declaration: Oct 18, 2025.
  //     </>
  //   ),
  // },
  // { text: "DAAN Council Election Result Declaration: Oct 18, 2025." },
  // { text: "Illu IIT KGP: Oct 20, 2025." },
  { text: "Shaurya Sports Fest: Oct 31-Nov 02, 2025." },
  { text: "End Sems: Nov 17-Nov 25, 2025." },
  { text: "Winter Break: Nov 26-Jan 01, 2026." },
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
              <h1 className="mb-2 font-bold text-red-800 dark:text-red-500 text-lg md:text-xl lg:text-2xl">
                Notices:-
              </h1>
              <div className="space-y-3">
                {notices.map((notice, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-sm md:text-md"
                  >
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
