import React from "react";

const PasswordUpdationForm = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-8">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Password Updation
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Submit this form for Password approval and we will get back to your mail after updating your password. After Approval, you will receive a dummy password via email. Use that password to sign in and reset your password from your profile.
          </p>
        </div>

        {/* Form Section */}
        <form action="https://formspree.io/f/mjgjgoaw" method="POST" className="space-y-5">
          
          {/* Full Name */}
          <div>
            <label htmlFor="FullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              id="FullName"
              name="FullName"
              required
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-transparent text-gray-900 dark:text-white transition-colors outline-none placeholder-gray-400 dark:placeholder-gray-600"
              placeholder="Enter your full name"
            />
          </div>

          {/* Institute Roll No */}
          <div>
            <label htmlFor="InstituteRollNo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Institute Roll No.
            </label>
            <input
              type="text"
              id="InstituteRollNo"
              name="InstituteRollNo"
              required
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-transparent text-gray-900 dark:text-white transition-colors outline-none placeholder-gray-400 dark:placeholder-gray-600"
              placeholder="e.g., 23IM10033"
            />
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-transparent text-gray-900 dark:text-white transition-colors outline-none placeholder-gray-400 dark:placeholder-gray-600"
              placeholder="Enter your email"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-lg transition-colors duration-300 focus:ring-4 focus:ring-rose-500/50 shadow-md"
            >
              Request Password Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordUpdationForm;