import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import FamCard from "./FamCard";
import DeptPieChart from "./PieChart";
import DeptPolarChart from "./PolarChart";
import Overview from "./Overview"; // import your overview component
import { api } from "../../utils/Secure/api";
import batchDataMap from "./JSFiles/BatchDataMap";
import LoaderOverlay from "../../utils/LoaderOverlay";
import { FaFileDownload } from "react-icons/fa";
import { Helmet } from "react-helmet-async";

const searchFields = [
  { key: "name", placeholder: "Name" },
  { key: "branch", placeholder: "Branch" },
  { key: "hall", placeholder: "Hall" },
];

const Fam = () => {
  const navigate = useNavigate();
  const { year } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeYear, setActiveYear] = useState(
    year ? 2000 + Number(year) : null,
  );

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    api
      .get("/v1/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);
  const canAccessBatch = (userBatch, targetBatch) =>
    Math.abs(Number(userBatch) - Number(targetBatch)) <= 1;

  const [filters, setFilters] = useState(
    searchFields.reduce((acc, { key }) => {
      acc[key] = searchParams.get(key) || "";
      return acc;
    }, {}),
  );
  useEffect(() => {
    if (year) setActiveYear(2000 + Number(year));
    else setActiveYear(null);
  }, [year]);
  useEffect(() => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v),
    );
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);
  useEffect(() => {
    if (!activeYear) return;

    setMembers([]);
    setLoading(true);

    const params = Object.fromEntries(
      Object.entries({ year: activeYear, ...filters }).filter(([_, v]) => v),
    );

    api
      .get("/our-fam/members", { params })
      .then((res) => setMembers(res.data))
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, [activeYear, filters]);

  const handleChange = (key) => (e) =>
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));

  const goToYear = (y) => navigate(`/our-fam/${y.toString().slice(-2)}`);
  const backToOverview = () => navigate("/our-fam");

  const batchMeta = activeYear ? batchDataMap[activeYear] : null;
  const defaultCount = batchMeta?.defaultCount ?? 0;
  const yearLabel = batchMeta?.year ?? "";
  const filteredItems = members;

  const totalMembers = Object.values(filters).some(Boolean)
    ? filteredItems.length
    : defaultCount;
  if (!user) {
    return (
      <Overview
        batchDataMap={batchDataMap}
        goToYear={goToYear}
        className="container"
      />
    );
  }
  if (!activeYear) {
    return (
      <Overview
        batchDataMap={batchDataMap}
        goToYear={goToYear}
        className="container"
      />
    );
  }
  const pageTitle = activeYear
    ? `Batch '${activeYear.toString().slice(-2)} | DAAN KGP`
    : "Overview | Our Fam | DAAN KGP";

  const pageDescription = activeYear
    ? `Explore the ${activeYear} batch of the DAAN KGP family at IIT Kharagpur. View member profiles, department and hall distribution, batch statistics, and connect with Dakshana scholars from this year.`
    : "Explore the DAAN KGP family across batches at IIT Kharagpur. Discover scholars by year, department, and hall, and get an overview of our growing Dakshana alumni and student community.";

  return (
    <div className="dark:bg-gray-900 bg-gray-100 text-gray-900 dark:text-gray-400 min-h-screen container py-8">
      <Helmet>
        {/* Standard metadata */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="DAAN KGP, Dakshana Foundation, Dakshana Alumni Network, Dakshana IIT Kharagpur, Dakshana scholars IIT KGP, IIT Kharagpur alumni network, DAAN IIT Kharagpur, student mentorship IIT Kharagpur, career guidance Dakshana alumni, higher studies guidance IIT KGP, alumni mentorship programs IIT, student support Dakshana scholars, Dakshana community Kharagpur, alumni-student connect IIT KGP, networking for Dakshana alumni, IIT Kharagpur student-alumni network, collaboration among Dakshana scholars, social initiatives Dakshana alumni, outreach programs IIT KGP, volunteering at IIT Kharagpur, giving back to society IIT alumni, awareness campaigns by DAAN, how Dakshana alumni help IIT Kharagpur students, mentorship opportunities for Dakshana scholars, alumni guidance network at IIT Kharagpur, career counseling by Dakshana alumni, Dakshana student community at IIT KGP, daan kgp, daan-kgp, kgpian dakshanite, dakshanites at kgp, dakshanites at iit kgp, kgpian dakshanites, dakshana alumni network at Indian institute of technology Kharagpur, daan at iit kgp, daan at kgp, kgp dakshana, dakshana, iitkgp, kgp, kharagpur"
        />
        <link
          rel="canonical"
          href={`https://daankgp.vercel.app/our-fam/${activeYear}/`}
        />
        {/* Open Graph / Facebook / LinkedIn */}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://daankgp.vercel.app/our-fam/${activeYear}/`}
        />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dhv0sckmq/image/upload/v1769529398/Logo_NoBG_op55cy.avif"
        />{" "}
        {/* Add a real path to your logo/banner */}
        {/* The Thumbnail Image - This is what shows up in the WhatsApp chat bubble */}
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/dhv0sckmq/image/upload/v1769529398/Logo_NoBG_op55cy.avif"
        />
      </Helmet>
      {/* Header */}
      <div className="flex flex-col justify-center items-center mb-6">
        {canAccessBatch(user.batch, activeYear) && (
          <a
            href={`${api.defaults.baseURL}/v1/vcf/${activeYear}`}
            className="inline-flex fixed bottom-4 left-4 z-50 items-center gap-2 px-3 py-1 rounded-3xl bg-gray-300 dark:bg-gray-800 text-rose-600 dark:text-rose-400 hover:scale-105 transition"
          >
            VCF <FaFileDownload />
          </a>
        )}
        <div>
          {/* Year Buttons */}
          <h2 className="text-sm text-center font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Other Years
          </h2>

          <div className="w-full overflow-x-auto no-scrollbar">
            <div
              className="
      flex gap-2 flex-nowrap
      w-max min-w-full
      justify-start md:justify-center
      pb-1
    "
            >
              {Object.keys(batchDataMap)
                .sort((a, b) => b - a)
                .map((y) => {
                  const isActive = Number(y) === activeYear;

                  return (
                    <button
                      key={y}
                      onClick={() => goToYear(Number(y))}
                      className={`
              shrink-0
              px-2 md:px-3 lg:px-4 py-1.5
              text-xs font-medium
              rounded-md
              border
              whitespace-nowrap
              transition-all duration-150

              ${
                isActive
                  ? "bg-gray-900 text-white border-gray-900 dark:bg-gray-100 dark:text-black dark:border-gray-100"
                  : "bg-white text-gray-700 border-gray-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 hover:bg-rose-500 hover:text-white hover:border-rose-500 active:scale-95"
              }
            `}
                    >
                      {batchDataMap[y].label}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
        <h1 className="text-2xl font-semibold mt-4">{yearLabel}</h1>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 my-14">
        <DeptPieChart data={filteredItems} deptKey="branch" />
        <DeptPolarChart data={filteredItems} deptKey="hall" />
      </div>
      {/* Filters */}
      <div className="flex gap-2 items-center justify-center flex-wrap mb-4 container">
        {searchFields.map(({ key, placeholder }) => (
          <input
            key={key}
            type="text"
            placeholder={placeholder}
            value={filters[key]}
            onChange={handleChange(key)}
            className="px-3 py-2 border border-red-200 dark:border-gray-500 rounded-3xl shadow-sm placeholder-red-300 text-red-600
            focus:outline-none focus:ring-2 focus:ring-red-200 dark:focus:ring-gray-500 
            transition-all duration-300 ease-in-out
            dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400
            hover:shadow-md w-[30%]"
          />
        ))}
      </div>
      <h3 className="mb-6 italic text-center">
        Total : {totalMembers} Members
      </h3>
      {loading && <LoaderOverlay />}
      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 container">
        {filteredItems.map((item) => (
          <FamCard key={item._id} _id={item._id} {...item} />
        ))}
      </div>
      <div className="flex justify-center items-center w-full mt-6">
        <button
          onClick={backToOverview}
          className="
    px-5 py-2.5
    text-sm font-medium
    rounded-lg
    transition-all duration-200
    bg-gray-200 text-gray-800
    hover:bg-rose-300 hover:text-gray-900
    active:bg-red-400
    focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 focus:ring-offset-gray-100

    dark:bg-gray-700 dark:text-gray-100
    dark:hover:bg-rose-500 dark:hover:text-white
    dark:active:bg-red-600
    dark:focus:ring-rose-500 dark:focus:ring-offset-gray-900
  "
        >
          Back to Overview
        </button>
      </div>
    </div>
  );
};

export default Fam;
