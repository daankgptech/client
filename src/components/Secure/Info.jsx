import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { FiMail, FiUser, FiPhone, FiCheckCircle } from "react-icons/fi";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Info() {
  // CTA mailto template
  const subject = "New Account Registration";
  const body = `Hello DAAN KGP Tech Team,

Please find the details for my account registration below.
This account has been submitted for your review and system integration.

My Profile Information
Full Name: [Insert Full Name]
Email Address: [Insert Email Address]
Phone Number: [Insert Phone Number]

Thank you.`;

  const mailto = `mailto:daan.kgp.tech@gmail.com?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 px-4 py-16">
      <Helmet>
        <title>Sign Up | DAAN KGP</title>
        <meta
          name="description"
          content="Request a new DAAN KGP account by submitting your basic details for verification. This page guides users through the account registration process, required information, and next steps to securely join the DAAN KGP platform."
        />
        <meta property="og:title" content="Sign Up | DAAN KGP" />
        <meta
          property="og:description"
          content="Request a new DAAN KGP account by submitting your basic details for verification. This page guides users through the account registration process, required information, and next steps to securely join the DAAN KGP platform."
        />
      </Helmet>
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={item} className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            New Account Registration
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed">
            Welcome! Before you request a new account with DAAN KGP, please
            carefully review the required information.
          </p>
        </motion.div>

        {/* Floating Card */}
        <motion.div
          variants={item}
          className="relative rounded-3xl border border-rose-200/60 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-xl p-6 md:p-10"
        >
          {/* Glow */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-rose-400/20 via-red-400/10 to-rose-400/20 blur-xl pointer-events-none" />

          <div className="relative space-y-10">
            {/* Section: Contact Info */}
            <motion.section variants={item}>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Request a New Account?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                To create a new account, please click the "Register" button at
                the end. Use the following informations for your registration
                request.
              </p>
            </motion.section>

            {/* Section: Required Info */}
            <motion.section variants={item}>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
                Information You Should Provide
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <InfoItem
                  icon={<FiUser />}
                  title="Full Name"
                  desc="Enter your complete name as you want it to appear on your profile."
                />
                <InfoItem
                  icon={<FiMail />}
                  title="Email Address"
                  desc="Provide a valid personal email address we can securely associate with your account."
                />
                <InfoItem
                  icon={<FiPhone />}
                  title="Phone Number"
                  desc="Include your primary phone number so we can contact you if needed."
                />
              </div>
            </motion.section>

            {/* Section: Next Steps */}
            <motion.section variants={item}>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                What Happens Next
              </h2>
              <div className="mt-6 flex items-start gap-3">
                <FiCheckCircle className="text-rose-500 mt-1" size={18} />
                <p className="text-gray-600 dark:text-gray-400">
                  Once your email is sent, our team will review the information
                  for completeness and accuracy. We will ensure your account is
                  integrated properly into our system and respond promptly.
                </p>
              </div>
              <div className="mt-6 flex items-start gap-3">
                <FiCheckCircle className="text-rose-500 mt-1" size={18} />
                <p className="text-gray-600 dark:text-gray-400">
                  You will receive confirmation or further instructions if
                  needed. We aim for a smooth and transparent process.
                </p>
              </div>

              <div className="mt-6 flex items-start gap-3">
                <FiCheckCircle className="text-rose-500 mt-1" size={18} />
                <p className="text-gray-600 dark:text-gray-400">
                  Your information is kept secure and private.
                </p>
              </div>
            </motion.section>

            {/* CTA Button */}
            <motion.section variants={item} className="text-center mt-8">
              <motion.a
                href={mailto}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-8 py-3 font-medium text-white bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700 rounded-3xl shadow-lg transition"
              >
                Register
              </motion.a>
              <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm">
                Clicking the button will open your email with a pre-filled
                registration template. Fill in your details and send.
              </p>
            </motion.section>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ----------------------------- Helper Component ----------------------------- */

const InfoItem = ({ icon, title, desc }) => (
  <div className="flex gap-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 hover:shadow-md transition">
    <div className="text-rose-500 mt-1">{icon}</div>
    <div>
      <h3 className="font-medium text-gray-800 dark:text-gray-200">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{desc}</p>
    </div>
  </div>
);
