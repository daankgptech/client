// import { Helmet } from "react-helmet";
// import { useParams } from "react-router-dom";
// import Fam from "../components/OurFam/Fam";

// const OurFam = () => {
//   const { year } = useParams();

//   return (
//     <div className="bg-gray-100 dark:bg-gray-900">
//       <Helmet>
//         <title>Our Fam | DAAN KGP</title>
//         <meta
//           name="description"
//           content="Meet our God-Gifted Family of KGPian Dakshanites. Proud, organized, and thriving together!"
//         />
//       </Helmet>
//       <Fam yearParam={year} />
//     </div>
//   );
// };

// export default OurFam;
import { Helmet } from "react-helmet";
import Fam from "../components/OurFam/Fam";

const OurFam = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900">
      <Helmet>
        <title>Our Family | DAAN KGP</title>
        <meta
          name="description"
          content="Explore the DAAN KGP family across batches at IIT Kharagpur. Discover scholars by year, department, and hall, and get an overview of our growing Dakshana alumni and student community."
        />
        <meta property="og:title" content="Our Family | DAAN KGP" />
        <meta
          property="og:description"
          content="Explore the DAAN KGP family across batches at IIT Kharagpur. Discover scholars by year, department, and hall, and get an overview of our growing Dakshana alumni and student community."
        />
      </Helmet>
      <Fam />
    </div>
  );
};

export default OurFam;
