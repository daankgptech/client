import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SEO, { seoConfig, Breadcrumbs } from "../utils/SEO";
import { api } from "../utils/Secure/api";
import { cache } from "../utils/cache";

const DEFAULT_CATEGORIES = [
  { key: "erp", label: "ERP" },
  { key: "fresher", label: "Fresher" },
  { key: "academic", label: "Academic" },
  { key: "cdc", label: "CDC" },
];

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes cache TTL

// Lightweight, updated skeleton matching exact Toolkit item box design
const SkeletonCard = () => (
  <div className="flex flex-col justify-between bg-transparent border-white/10 border-[0.5px] p-5 animate-pulse min-h-[220px]">
    <div>
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="w-20 h-5 rounded-full bg-white/10" />
        <div className="w-14 h-5 rounded-full bg-white/5" />
      </div>
      <div className="w-4/5 h-6 rounded bg-white/10 mb-3" />
      <div className="space-y-2 mt-2">
        <div className="w-full h-3.5 rounded bg-white/5" />
        <div className="w-11/12 h-3.5 rounded bg-white/5" />
        <div className="w-3/4 h-3.5 rounded bg-white/5" />
      </div>
    </div>
    <div className="mt-6 border-t border-white/10 pt-3">
      <div className="w-32 h-5 mx-auto rounded bg-white/10" />
    </div>
  </div>
);

const SkeletonTabs = () => (
  <div className="flex justify-start md:justify-center flex-nowrap overflow-x-auto gap-0 mb-10 no-scrollbar select-none animate-pulse">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className="h-11 w-32 bg-white/5 border-[0.5px] border-white/10 flex-shrink-0"
      />
    ))}
  </div>
);

const Toolkit = () => {
  const { tab } = useParams();
  const navigate = useNavigate();

  // 1. Categories State initialized from cache if available
  const [tabs, setTabs] = useState(() => {
    const cachedCats = cache.get("/toolkit/categories");
    if (Array.isArray(cachedCats) && cachedCats.length > 0) {
      return cachedCats;
    }
    return [];
  });
  const [categoriesLoading, setCategoriesLoading] = useState(() => tabs.length === 0);

  // Determine active category tab
  const effectiveTabs = tabs.length > 0 ? tabs : DEFAULT_CATEGORIES;
  const activeTab = effectiveTabs.some(({ key }) => key === tab)
    ? tab
    : effectiveTabs[0]?.key || "erp";

  // 2. Section Data & Loading State initialized from cache if available
  const [data, setData] = useState(() => {
    if (!activeTab) return [];
    const cachedData = cache.get(`/toolkit/${activeTab}`);
    return Array.isArray(cachedData) ? cachedData : [];
  });

  const [loading, setLoading] = useState(() => {
    if (!activeTab) return true;
    const cachedData = cache.get(`/toolkit/${activeTab}`);
    return !cachedData;
  });

  // Fetch dynamic categories from backend API if not in cache
  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const cachedCats = cache.get("/toolkit/categories");
        if (cachedCats && Array.isArray(cachedCats) && cachedCats.length > 0) {
          if (isMounted) {
            setTabs(cachedCats);
            setCategoriesLoading(false);
          }
          return;
        }

        const res = await api.get("/toolkit/categories");
        if (res.data?.success && Array.isArray(res.data.categories) && isMounted) {
          const catList = res.data.categories.length > 0 ? res.data.categories : DEFAULT_CATEGORIES;
          setTabs(catList);
          cache.set("/toolkit/categories", catList, CACHE_TTL);
        } else if (isMounted && tabs.length === 0) {
          setTabs(DEFAULT_CATEGORIES);
        }
      } catch (err) {
        console.warn("Failed to fetch public toolkit categories:", err.message);
        if (isMounted && tabs.length === 0) {
          setTabs(DEFAULT_CATEGORIES);
        }
      } finally {
        if (isMounted) setCategoriesLoading(false);
      }
    };

    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch data per section on-demand with caching
  useEffect(() => {
    if (!activeTab) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchSectionData = async () => {
      const cacheKey = `/toolkit/${activeTab}`;

      // Check cache first
      const cachedData = cache.get(cacheKey);
      if (cachedData && Array.isArray(cachedData)) {
        if (isMounted) {
          setData(cachedData);
          setLoading(false);
        }
        return;
      }

      if (isMounted) setLoading(true);

      try {
        const response = await api.get(cacheKey);
        if (response.data && response.data.success && isMounted) {
          const items = response.data.data || [];
          setData(items);
          cache.set(cacheKey, items, CACHE_TTL);
        } else if (isMounted) {
          setData([]);
        }
      } catch (error) {
        console.error(`Error fetching toolkit section [${activeTab}]:`, error);
        if (isMounted) setData([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSectionData();
    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  const activeTabLabel =
    effectiveTabs.find((t) => t.key === activeTab)?.label || "Toolkit";

  const handleTabChange = (key) => {
    navigate(`/toolkit/${key}`);
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      <SEO
        title={`${activeTabLabel} Toolkit`}
        description={seoConfig.toolkit.description}
        keywords={seoConfig.toolkit.keywords}
        canonical={`/toolkit/${activeTab}`}
        breadcrumbs={seoConfig.toolkit.breadcrumbs}
      />

      <section className="container mx-auto py-12">
        <div className="pb-4">
          <Breadcrumbs items={seoConfig.toolkit.breadcrumbs} />
        </div>

        {/* Heading matching Forms Page design */}
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl md:text-5xl font-bold font-space-grotesk tracking-tighter text-white">
            Toolkit
          </h1>
        </div>

        {/* Category Tabs matching box design of toolkit items */}
        {categoriesLoading && tabs.length === 0 ? (
          <SkeletonTabs />
        ) : (
          <div className="flex justify-start md:justify-center flex-nowrap overflow-x-auto gap-0 mb-10 no-scrollbar select-none">
            {effectiveTabs.map(({ key, label }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => handleTabChange(key)}
                  className={`
                    whitespace-nowrap px-5 py-2.5 text-sm md:text-base font-medium font-space-grotesk
                    border-[0.5px] transition-all duration-200 flex-shrink-0
                    ${
                      isActive
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-transparent border-white/10 text-white/60 hover:bg-white/5 hover:border-white/20 hover:text-white"
                    }
                  `}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* Content Section Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0"
          >
            {data.length > 0 ? (
              data.map((item, index) => {
                const itemTitle = item.title || item.catching || "Resource";
                const itemDesc = item.description || item.cover || "";
                const itemLink = item.link || item.href || "#";

                return (
                  <motion.div
                    key={item._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group relative flex flex-col justify-between overflow-hidden bg-transparent border-white/10 border-[0.5px] hover:bg-white/5 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 ease-out p-5"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                          {item.category || activeTab}
                        </span>

                        {item.isPopular && (
                          <span className="text-[10px] font-semibold text-white bg-primary/90 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            Popular
                          </span>
                        )}
                      </div>

                      <h2 className="text-lg font-bold font-space-grotesk text-white group-hover:text-primary transition-colors leading-snug">
                        {itemTitle}
                      </h2>

                      {itemDesc && (
                        <p className="text-xs md:text-sm text-white/60 line-clamp-3 leading-relaxed mt-2">
                          {itemDesc}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 border-t border-white/10 pt-3">
                      <a
                        href={itemLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center py-2 text-sm font-medium text-primary hover:text-white transition-colors"
                      >
                        Access Resource →
                      </a>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <p className="text-center col-span-full py-16 text-white/40 text-sm">
                No resources found for this section.
              </p>
            )}
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Toolkit;
