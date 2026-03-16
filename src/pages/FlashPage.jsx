import { useEffect } from "react";

const FlashPage = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-400 flex flex-col items-center justify-center z-50">
      <h1 className="text-[18vw] font-bold opacity-0 animate-fade-in">
        DAAN KGP
      </h1>
      <h3 className="text-[4vw] mt-0 opacity-0 animate-fade-in-delay">
        DakshanA Alumni Network at IIT Kharagpur
      </h3>
      <h1 className="text-[3vw] md:text-[2vw] lg:text-[1vw] mt-2 text-gray-700 opacity-0 animate-fade-in-delay-2">
        Welcomes you ...
      </h1>
      <style>
        {`
          @keyframes fadeIn { 
            from { opacity:0; transform:scale(0.95); } 
            to { opacity:1; transform:scale(1); } 
          }
          .animate-fade-in { animation: fadeIn 1s ease forwards; }
          .animate-fade-in-delay { animation: fadeIn 1s ease forwards; animation-delay: 0.5s; }
          .animate-fade-in-delay-2 { animation: fadeIn 1s ease forwards; animation-delay: 1s; }
        `}
      </style>
    </div>
  );
};

export default FlashPage;
