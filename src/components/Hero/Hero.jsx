import AnimatedCounter from "../../utils/AnimationCounter";
import FlashingNoticesCard from "./FlashingNoticesCard";

const stats = [
  { target: 170, label: "Currently in campus" },
  { target: 40, label: "Joined this year" },
];

export default function Hero() {
  return (
    <div className="bg-transparent flex justify-center items-center p-4">
      <div className="container grid gap-4">
        {/* Heading */}
        <div className="text-gray-900 dark:text-gray-300 text-center mb-10">
          <p
            data-aos="fade-up"
            className="text-2xl md:text-4xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-900 to-red-500"
          >
            Congratulations on being a DAAN KGPian!
          </p>
          <p
            data-aos="fade-up"
            data-aos-delay="300"
            className="mt-4 md:mt-6 text-sm md:text-md lg:text-lg"
          >
            Warmest greetings on joining the esteemed community of KGPians and
            proudly embracing your Dakshanite heritage!
          </p>
        </div>

        {/* Stats */}
        {/* <div className="flex justify-center gap-3 md:gap-8 mt-8">
          {stats.map(({ target, label }, i) => (
            <div
              key={i}
              data-aos="fade-up"
              data-aos-delay="600"
              className="bg-gradient-to-tr from-red-700 to-red-400 rounded-lg p-4 md:p-6 lg:p-8 flex flex-col items-center"
            >
              <span className="text-3xl md:text-4xl lg:text-6xl font-bold flex items-center text-center text-gray-900">
                <AnimatedCounter target={target} duration={2500} /> +
              </span>
              <p className="text-sm text-center text-gray-900">{label}</p>
            </div>
          ))}
        </div> */}

        {/* Notices */}
        <FlashingNoticesCard />
      </div>
    </div>
  );
}
