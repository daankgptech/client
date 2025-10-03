import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { contestants } from "./CouncilData";

const Election = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300">
      <Helmet>
        <title>Election | DAAN KGP</title>
        <meta
          name="description"
          content="Announcement for DAAN Council Elections 2025-26 for Junior Secretary positions. Includes eligibility, rules, important dates, and voting process."
        />
      </Helmet>

      <section className="container mx-auto px-4 py-10">
        {/* Heading */}
        <motion.h1
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="my-8 border-l-8 border-rose-500 dark:border-red-400 py-2 pl-4 text-3xl md:text-4xl font-extrabold tracking-wide"
        >
          DAAN Council Election 2025-26
        </motion.h1>

        {/* Announcement */}
        {/* <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold mb-2 text-rose-600 dark:text-red-300">
            Announcement for Junior Secretary Elections
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Dear DAAN members, we are happy to announce the{" "}
            <span className="font-semibold">
              DAAN Council Elections 2025-26
            </span>{" "}
            for the post of Junior Secretaries.
          </p>
        </motion.div> */}
        {/* Contestants Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="my-12"
        >
          <h3 className="text-2xl font-bold text-rose-600 dark:text-red-300 mb-6">
            Contestants from KGP
          </h3>

          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {contestants.map((c, index) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col items-center p-4"
              >
                <img
                  src={c.img}
                  alt={c.name}
                  className="w-32 h-32 object-cover rounded-full border-4 border-rose-400 dark:border-red-500 mb-4"
                />
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {c.name}
                  </h4>
                  <p className="text-sm text-rose-600 dark:text-red-300 font-medium mt-1">
                    {c.position}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 px-2">
                    {c.agenda}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* Positions */}
        <h3 className="text-2xl font-bold text-rose-600 dark:text-red-300 mb-6">
          Election Board
        </h3>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <div className="bg-gradient-to-r from-rose-500 to-red-500 dark:from-red-600 dark:to-rose-500 text-white shadow-lg rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-3">Total Positions: 17</h3>
            <ul className="space-y-2">
              <li>DST (JNV) – 3</li>
              <li>DST (non-JNV) – 3</li>
              <li>Public Relations – 3</li>
              <li>Inspire – 3</li>
              <li>Freshman Assistance – 3</li>
              <li>DAAN Khabar – 2</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-md rounded-2xl p-6">
            <h3 className="text-xl font-bold text-rose-600 dark:text-red-300 mb-3">
              Election Platform
            </h3>
            <p>
              The election process will be conducted online at:{" "}
              <a
                href="https://alumni.dakshana.org/election/"
                className="underline text-rose-600 dark:text-red-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                alumni.dakshana.org/election
              </a>
            </p>
            <p className="mt-2">
              Rules:{" "}
              <a
                href="https://alumni.dakshana.org/election/rules"
                className="underline text-rose-600 dark:text-red-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                Check here
              </a>
            </p>
          </div>
        </motion.div>

        {/* Important Dates */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mt-10 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold mb-4">Important Dates</h3>
          <ul className="space-y-2">
            <li>
              <strong>Nominations:</strong> Oct 02 – Oct 06, 2025 (till 5 PM)
            </li>
            <li>
              <strong>Final List:</strong> Oct 08, 2025 (after 11 AM)
            </li>
            <li>
              <strong>Voting:</strong> Oct 10 – Oct 12, 2025 (via email link)
            </li>
          </ul>
        </motion.div>

        {/* Eligibility + Nomination Form */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-10 bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-rose-600 dark:text-red-300 mb-3">
            Eligibility & Nomination
          </h3>
          <p>
            Engineering students in their{" "}
            <span className="font-semibold">second year</span> and medical
            students from{" "}
            <span className="font-semibold">2023 & 2024 batch</span>
            are eligible.
          </p>
          <p className="mt-2">
            Nominate yourself here:{" "}
            <a
              href="https://alumni.dakshana.org/election/nomination-form"
              className="underline text-rose-600 dark:text-red-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nomination Form
            </a>
          </p>
        </motion.div>

        {/* Resources */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mt-10 grid md:grid-cols-2 gap-6"
        >
          <div className="bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold mb-2">DAAN Council Manual</h3>
            <a
              href="https://tinyurl.com/DAAN-Election-2025-26"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Click here!
            </a>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold mb-2">Current DAAN Council</h3>
            <a
              href="https://docs.google.com/spreadsheets/d/1BIJwqFV_7au6KPHp2FoAkSCFSiJT0DRD1aHl1t6pKiI/edit?gid=0#gid=0"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Click here!
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Election;
