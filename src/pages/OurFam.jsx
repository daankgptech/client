import SEO, { seoConfig, Breadcrumbs } from "../utils/SEO";
import Fam from "../components/OurFam/Fam";

const OurFam = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-950">
      <SEO {...seoConfig.ourFam} />
      {/* <div className="container py-6">
        <Breadcrumbs items={seoConfig.ourFam.breadcrumbs} />
      </div> */}
      <Fam />
    </div>
  );
};

export default OurFam;
