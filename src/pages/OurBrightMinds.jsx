import { Helmet } from "react-helmet";
import TopPerformers from "../components/OurBrightMinds/TopPerformers";

const OurBrightMinds = () => {
  return (
    <div className="dark:bg-gray-900 dark:text-gray-400 py-8">
      <Helmet>
        <title>Our Bright Minds | DAAN KGP</title>
        <meta
          name="description"
          content="This page highlights our bright minds and their hard work, the reason behind our success."
        />
      </Helmet>

      <section data-aos="fade-up" className="container">
        <h1 className="mt-0 mb-8 border-l-8 border-red-300 dark:border-gray-300 dark:text-gray-200 py-2 pl-2 text-3xl font-bold">
          Our Bright Minds
        </h1>

        <TopPerformers />
      </section>
    </div>
  );
};

export default OurBrightMinds;