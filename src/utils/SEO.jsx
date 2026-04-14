import { Helmet } from "react-helmet-async";

/**
 * SEO Component - Centralized SEO management with JSON-LD schema support
 * 
 * @param {Object} props
 * @param {string} props.title - Page title (will append "| DAAN KGP")
 * @param {string} props.description - Meta description (150-160 chars recommended)
 * @param {string} props.keywords - Meta keywords
 * @param {string} props.canonical - Canonical URL path (e.g., "/our-fam")
 * @param {string} props.image - OG image URL (optional, defaults to logo)
 * @param {string} props.type - Page type: "website" or "article"
 * @param {boolean} props.noindex - Set true for protected pages
 * @param {Array} props.breadcrumbs - Breadcrumb items [{name, path}]
 * @param {Object} props.schema - Additional JSON-LD schema data
 */
const SEO = ({
  title,
  description,
  keywords = "",
  canonical = "",
  image = "https://res.cloudinary.com/dhv0sckmq/image/upload/v1769529398/Logo_NoBG_op55cy.avif",
  type = "website",
  noindex = false,
  breadcrumbs = [],
  schema = null,
}) => {
  const siteUrl = "https://daankgp.vercel.app";
  const fullTitle = title ? `${title} | DAAN KGP` : "DAAN KGP";
  const fullCanonical = `${siteUrl}${canonical}`;
  const fullImage = image.startsWith("http") ? image : `${siteUrl}${image}`;

  // Base JSON-LD schema for Organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DAAN KGP",
    "alternateName": "DakshanA Alumni Network IIT Kharagpur",
    "url": siteUrl,
    "logo": fullImage,
    "description": "DAAN KGP is the DakshanA Alumni Network at IIT Kharagpur, uniting Dakshana scholars for mentorship, guidance, and community service.",
    "sameAs": [],
  };

  // Website schema for the site
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DAAN KGP",
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}/our-fam?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  // Breadcrumb schema
  const breadcrumbSchema =
    breadcrumbs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbs.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: `${siteUrl}${item.path}`,
          })),
        }
      : null;

  // WebPage schema
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": type === "article" ? "Article" : "WebPage",
    name: fullTitle,
    description: description,
    url: fullCanonical,
    image: fullImage,
    isPartOf: {
      "@type": "WebSite",
      name: "DAAN KGP",
      url: siteUrl,
    },
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullCanonical} />

      {/* Robots directive */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="DAAN KGP" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullCanonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* JSON-LD Structured Data */}
      {!noindex && (
        <>
          <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
          <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
          <script type="application/ld+json">{JSON.stringify(webPageSchema)}</script>
          {breadcrumbSchema && <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>}
          {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
        </>
      )}
    </Helmet>
  );
};

export default SEO;

/**
 * Breadcrumb Component - Displays breadcrumb navigation
 */
export const Breadcrumbs = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        {items.map((item, index) => (
          <li key={item.path} className="flex items-center gap-2">
            {index > 0 && <span className="text-gray-400 dark:text-gray-600">/</span>}
            {index === items.length - 1 ? (
              <span className="text-gray-900 dark:text-white font-medium" aria-current="page">
                {item.name}
              </span>
            ) : (
              <a
                href={item.path}
                className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
              >
                {item.name}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

/**
 * Page-specific SEO configurations
 */
export const seoConfig = {
  home: {
    title: "",
    description:
      "DAAN KGP unites IIT Kharagpur Dakshana scholars, providing mentorship, career guidance, and service opportunities within a supportive, collaborative community.",
    keywords:
      "DAAN KGP, Dakshana Foundation, Dakshana Alumni Network, IIT Kharagpur, mentorship, career guidance, Dakshana scholars",
    canonical: "/",
    breadcrumbs: [],
  },
  ourFam: {
    title: "Our Family",
    description:
      "Explore the DAAN KGP family across batches at IIT Kharagpur. Discover scholars by year, department, and hall in our growing Dakshana alumni community.",
    keywords:
      "DAAN KGP family, Dakshana scholars, IIT Kharagpur students, alumni directory, batch members",
    canonical: "/our-fam",
    breadcrumbs: [{ name: "Home", path: "/" }, { name: "Our Family", path: "/our-fam" }],
  },
  academicStars: {
    title: "Academic Stars",
    description:
      "Meet the top academic performers at DAAN KGP. Celebrating batch-wise toppers and Dakshana scholars at IIT Kharagpur who excel in their studies.",
    keywords:
      "academic toppers, DAAN KGP scholars, IIT Kharagpur CGPA, academic excellence, Dakshana achievers",
    canonical: "/academic-stars",
    breadcrumbs: [{ name: "Home", path: "/" }, { name: "Academic Stars", path: "/academic-stars" }],
  },
  toolkit: {
    title: "Toolkit",
    description:
      "Complete resource toolkit for DAAN KGPians at IIT Kharagpur. Access ERP guides, fresher resources, academic materials, and CDC internship preparation.",
    keywords:
      "DAAN KGP toolkit, IIT Kharagpur resources, ERP guide, CDC preparation, academic resources",
    canonical: "/toolkit",
    breadcrumbs: [{ name: "Home", path: "/" }, { name: "Toolkit", path: "/toolkit" }],
  },
  forms: {
    title: "Forms",
    description:
      "Access all DAAN KGP forms in one place. Submit responses, track deadlines, and stay updated with campus initiatives and community activities.",
    keywords:
      "DAAN KGP forms, registration forms, event registration, campus forms, student forms",
    canonical: "/forms",
    breadcrumbs: [{ name: "Home", path: "/" }, { name: "Forms", path: "/forms" }],
  },
  events: {
    title: "Events",
    description:
      "Discover DAAN KGP events and activities at IIT Kharagpur. Stay updated with alumni gatherings, workshops, celebrations, and community initiatives.",
    keywords:
      "DAAN KGP events, IIT Kharagpur events, alumni gatherings, Dakshana events, workshops",
    canonical: "/events",
    breadcrumbs: [{ name: "Home", path: "/" }, { name: "Events", path: "/events" }],
  },
  signup: {
    title: "Sign Up",
    description:
      "Join DAAN KGP - the DakshanA Alumni Network at IIT Kharagpur. Create your account to connect with fellow Dakshana scholars and access exclusive resources.",
    keywords: "DAAN KGP signup, register, create account, Dakshana alumni, IIT Kharagpur",
    canonical: "/signup",
    noindex: true,
  },
  signin: {
    title: "Sign In",
    description:
      "Sign in to DAAN KGP to access your dashboard, personal tools, and exclusive features for Dakshana scholars at IIT Kharagpur.",
    keywords: "DAAN KGP login, sign in, access account, Dakshana portal",
    canonical: "/signin",
    noindex: true,
  },
  forgotPassword: {
    title: "Forgot Password",
    description: "Reset your DAAN KGP password. Enter your email to receive password reset instructions.",
    canonical: "/forgot-password",
    noindex: true,
  },
  profile: {
    title: "My Profile",
    description: "Manage your DAAN KGP profile, update personal information, and track your activity.",
    canonical: "/profile",
    noindex: true,
  },
  dashboard: {
    title: "Dashboard",
    description: "Your personal DAAN KGP dashboard with tools, tasks, and resources for IIT Kharagpur students.",
    canonical: "/dashboard",
    noindex: true,
  },
  diary: {
    title: "My Diary",
    description: "Your personal diary on DAAN KGP - capture thoughts, memories, and reflections.",
    canonical: "/diary",
    noindex: true,
  },
  notFound: {
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist or has been moved.",
    canonical: "",
    noindex: true,
  },
};
