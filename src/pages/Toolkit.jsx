import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SEO, { seoConfig, Breadcrumbs } from "../utils/SEO";
import { api } from "../utils/Secure/api";
import { cache } from "../utils/cache";

// Skeleton shimmer component matching Forms page skeleton design
const SkeletonCard = () => (
  <div className="animate-shimmer rounded-2xl overflow-hidden bg-white/5 border-[0.5px] border-white/10 p-5 space-y-4">
    <div className="flex items-center justify-between">
      <div className="w-16 h-4 rounded bg-white/10" />
      <div className="w-12 h-4 rounded bg-white/5" />
    </div>
    <div className="w-3/4 h-6 rounded bg-white/10" />
    <div className="w-full h-4 rounded bg-white/5" />
    <div className="w-2/3 h-3 rounded bg-white/5" />
    <div className="border-t border-white/10 pt-3 mt-4">
      <div className="w-full h-8 rounded bg-white/5" />
    </div>
  </div>
);

const Toolkit = () => {
  const { tab } = useParams();
  const navigate = useNavigate();

  const [tabs, setTabs] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dynamic categories from backend API
  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const cachedCats = cache.get("/toolkit/categories");
        if (cachedCats && Array.isArray(cachedCats) && cachedCats.length > 0 && isMounted) {
          setTabs(cachedCats);
          return;
        }

        const res = await api.get("/toolkit/categories");
        if (res.data?.success && Array.isArray(res.data.categories) && isMounted) {
          setTabs(res.data.categories);
          if (res.data.categories.length > 0) {
            cache.set("/toolkit/categories", res.data.categories, 15 * 60 * 1000);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch public toolkit categories:", err.message);
      }
    };

    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeTab = tabs.some(({ key }) => key === tab) ? tab : tabs[0]?.key || "";

  // Fetch data per section on-demand with caching
  useEffect(() => {
    if (!activeTab) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchSectionData = async () => {
      setLoading(true);
      const cacheKey = `/toolkit/${activeTab}`;

      try {
        // Check cache first
        const cachedData = cache.get(cacheKey);
        if (cachedData && Array.isArray(cachedData) && isMounted) {
          setData(cachedData);
          setLoading(false);
          return;
        }

        // Section API fetch
        const response = await api.get(cacheKey);
        if (response.data && response.data.success && isMounted) {
          const items = response.data.data || [];
          setData(items);
          cache.set(cacheKey, items, 15 * 60 * 1000);
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
    tabs.find((t) => t.key === activeTab)?.label || "Toolkit";

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

        {/* Category Tabs matching website pill tab design */}
        {tabs.length > 0 && (
          <div className="flex justify-start md:justify-center flex-nowrap overflow-x-auto gap-2 mb-10 no-scrollbar select-none">
            {tabs.map(({ key, label }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => handleTabChange(key)}
                  className={`
                    whitespace-nowrap px-4 py-2 rounded-full text-sm md:text-base font-medium
                    border transition-all duration-200 flex-shrink-0
                    ${
                      isActive
                        ? "bg-primary text-white border-primary"
                        : "bg-transparent border-white/10 text-white/60 hover:border-white/20 hover:text-white"
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
          <>
            <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
            <style>{`
              @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
              }
              .animate-shimmer {
                background: linear-gradient(90deg, transparent 0%, rgba(156, 163, 175, 0.3) 50%, transparent 100%);
                background-size: 200% 100%;
                animation: shimmer 1.2s linear infinite;
              }
              .dark .animate-shimmer {
                background: linear-gradient(90deg, transparent 0%, rgba(75, 85, 99, 0.3) 50%, transparent 100%);
                background-size: 200% 100%;
              }
            `}</style>
          </>
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
