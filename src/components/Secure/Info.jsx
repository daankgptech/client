import { Helmet } from "react-helmet";
import { FiMail, FiUser, FiPhone, FiCheckCircle } from "react-icons/fi";

export default function Info() {
  const subject = "New Account Registration";
  const body = `Hello DAAN KGP Tech Team,

Full Name:
Email Address:
Phone Number:
`;

  const mailto = `mailto:daan.kgp.tech@gmail.com?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-8">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* header */}
        <div>
          <h1 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            New Account Registration
          </h1>
          <p className="text-[12px] text-gray-500 mt-1">
            Submit your details to request access.
          </p>
        </div>

        {/* card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 space-y-5">
          {/* section */}
          <div>
            <h2 className="text-[13px] font-medium text-gray-800 dark:text-gray-200 mb-1">
              Request
            </h2>
            <p className="text-[12px] text-gray-600 dark:text-gray-400">
              Click register and send your details via email.
            </p>
          </div>

          {/* info */}
          <div className="space-y-2">
            <InfoItem icon={<FiUser size={14} />} title="Full Name" />
            <InfoItem icon={<FiMail size={14} />} title="Email" />
            <InfoItem icon={<FiPhone size={14} />} title="Phone" />
          </div>

          {/* steps */}
          <div className="space-y-2">
            <Step text="We review your request" />
            <Step text="You get confirmation" />
            <Step text="Your data stays private" />
          </div>

          {/* button */}
          <div className="pt-2">
            <a
              href={mailto}
              className="
                w-full block text-center
                px-3 py-1.5 text-[12px]
                rounded-md
                bg-rose-500 text-white
                hover:bg-rose-600
              "
            >
              Register
            </a>
            <p className="text-[11px] text-gray-400 mt-2 text-center">
              Opens your email app
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* helpers */

const InfoItem = ({ icon, title }) => (
  <div className="flex items-center gap-2 text-[12px] text-gray-700 dark:text-gray-300">
    <span className="text-rose-500">{icon}</span>
    {title}
  </div>
);

const Step = ({ text }) => (
  <div className="flex items-start gap-2 text-[12px] text-gray-600 dark:text-gray-400">
    <FiCheckCircle size={14} className="text-rose-500 mt-[2px]" />
    {text}
  </div>
);
