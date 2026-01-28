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
import { Helmet } from "react-helmet-async";
import Fam from "../components/OurFam/Fam";

const OurFam = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900">
      <Helmet>
              {/* Standard metadata */}
              <title>Our Family | DAAN KGP</title>
              <meta name="description" content="Explore the DAAN KGP family across batches at IIT Kharagpur. Discover scholars by year, department, and hall, and get an overview of our growing Dakshana alumni and student community." />
              <meta name="keywords" content="DAAN KGP, Dakshana Foundation, Dakshana Alumni Network, Dakshana IIT Kharagpur, Dakshana scholars IIT KGP, IIT Kharagpur alumni network, DAAN IIT Kharagpur, student mentorship IIT Kharagpur, career guidance Dakshana alumni, higher studies guidance IIT KGP, alumni mentorship programs IIT, student support Dakshana scholars, Dakshana community Kharagpur, alumni-student connect IIT KGP, networking for Dakshana alumni, IIT Kharagpur student-alumni network, collaboration among Dakshana scholars, social initiatives Dakshana alumni, outreach programs IIT KGP, volunteering at IIT Kharagpur, giving back to society IIT alumni, awareness campaigns by DAAN, how Dakshana alumni help IIT Kharagpur students, mentorship opportunities for Dakshana scholars, alumni guidance network at IIT Kharagpur, career counseling by Dakshana alumni, Dakshana student community at IIT KGP, daan kgp, daan-kgp, kgpian dakshanite, dakshanites at kgp, dakshanites at iit kgp, kgpian dakshanites, dakshana alumni network at Indian institute of technology Kharagpur, daan at iit kgp, daan at kgp, kgp dakshana, dakshana, iitkgp, kgp, kharagpur" />
              <link rel="canonical" href="https://daan-kgp.vercel.app/our-fam" />
              {/* Open Graph / Facebook / LinkedIn */}
              <meta property="og:type" content="website" />
              <meta property="og:url" content="https://daan-kgp.vercel.app/our-fam" />
              <meta property="og:title" content="Our Family | DAAN KGP" />
              <meta property="og:description" content="Explore the DAAN KGP family across batches at IIT Kharagpur. Discover scholars by year, department, and hall, and get an overview of our growing Dakshana alumni and student community." />
              <meta property="og:image" content="https://res.cloudinary.com/dhv0sckmq/image/upload/v1769529398/Logo_NoBG_op55cy.avif" /> {/* Add a real path to your logo/banner */}
              {/* The Thumbnail Image - This is what shows up in the WhatsApp chat bubble */}
              <meta property="og:image:type" content="image/png" />
              <meta property="og:image:width" content="1200" />
              <meta property="og:image:height" content="630" />
              {/* Twitter */}
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content="Our Family | DAAN KGP" />
              <meta name="twitter:description" content="Explore the DAAN KGP family across batches at IIT Kharagpur. Discover scholars by year, department, and hall, and get an overview of our growing Dakshana alumni and student community." />
              <meta name="twitter:image" content="https://res.cloudinary.com/dhv0sckmq/image/upload/v1769529398/Logo_NoBG_op55cy.avif" />
            </Helmet>
      <Fam />
    </div>
  );
};

export default OurFam;
