import React from "react";
import { motion } from "framer-motion";
import { contestants } from "./CouncilData"; // your data.js file

export default function ContestantTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full flex justify-center p-4"
    >
      <div className="w-full max-w-3xl shadow-lg rounded-2xl bg-gradient-to-br from-rose-100 to-red-100 dark:from-rose-900/30 dark:to-red-900/20 border border-red-300 dark:border-rose-800 transition-all duration-300">
        <div className="p-4 sm:p-6">
          <h2 className="text-2xl font-bold mb-4 text-center text-rose-700 dark:text-rose-300">
            Contestants List
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm sm:text-base border-collapse">
              <thead>
                <tr className="bg-rose-200/70 dark:bg-rose-800/50 text-rose-900 dark:text-rose-100">
                  <th className="py-2 px-3 text-center">#</th>
                  <th className="py-2 px-3 text-left">Name</th>
                  <th className="py-2 px-3 text-center">Position</th>
                </tr>
              </thead>

              <tbody>
                {contestants.map((c, index) => (
                  <motion.tr
                    key={c.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-rose-300/40 dark:border-rose-800 hover:bg-rose-100/70 dark:hover:bg-rose-900/40 transition-colors"
                  >
                    <td className="py-2 px-3 text-center font-semibold text-rose-700 dark:text-rose-300">
                      {index + 1}
                    </td>
                    <td className="py-2 px-3 text-rose-800 dark:text-rose-100">
                      {c.name}
                    </td>
                    <td className="py-2 px-3 text-center text-rose-600 dark:text-rose-400 font-medium">
                      {c.position}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
