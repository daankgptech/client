import { Link } from "react-router-dom";
import { 
  Users, 
  Database, 
  Award, 
  Shield, 
  Zap,
  ArrowLeft,
  CheckCircle,
  TrendingUp,
  Globe
} from "lucide-react";
import SEO, { seoConfig } from "../utils/SEO";

const features = [
  {
    icon: Database,
    title: "Centralized Database",
    description: "A comprehensive directory of all DAAN KGPians with academic records, achievements, and contact information in one place."
  },
  {
    icon: Users,
    title: "Freshers' Support System",
    description: "Dedicated toolkit for freshers covering ERP guides, CDC processes, campus navigation, hall information, and KGP terminology."
  },
  {
    icon: Shield,
    title: "Secure Authentication",
    description: "Private, authenticated platform ensuring data privacy with verified member profiles and controlled access."
  },
  {
    icon: Award,
    title: "Academic Recognition",
    description: "Academic Stars section celebrating batch-wise toppers and high achievers within the DAAN KGP community."
  },
  {
    icon: Zap,
    title: "Real-time Forms & Events",
    description: "Streamlined event management, form distribution, and response tracking for efficient coordination."
  },
  {
    icon: Globe,
    title: "Public Presence",
    description: "A professional website showcasing DAAN KGP's activities, council, and achievements to the world."
  }
];

const stats = [
  { label: "DAAN KGPians", value: "170+" },
  { label: "Academic Batches", value: "5" },
  { label: "Forms Managed", value: "10+" },
  { label: "Events Documented", value: "7+" }
];

const AfterDAAN = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <SEO 
        title="After DAAN KGP"
        description="Explore how DAAN KGP transformed into a comprehensive digital platform - centralized database, fresher support, academic recognition, and efficient coordination."
        keywords="DAAN KGP platform, Dakshana alumni network, DAAN KGP features, after DAAN KGP"
        canonical="/after"
      />

      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            DAAN KGP Today
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            From fragmented WhatsApp groups to a comprehensive digital platform -
            DAAN KGP now stands as a unified community hub for all Dakshana scholars at IIT Kharagpur.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 text-center"
            >
              <div className="text-2xl md:text-3xl font-bold text-rose-500 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Main Features Grid */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Platform Features
        </h2>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {features.map((item, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:border-rose-200 dark:hover:border-rose-800 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* What's Different */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            What's Different Now
          </h2>
          <div className="space-y-3">
            {[
              "Single source of truth for all DAAN KGP information",
              "Freshers get structured guidance without repeated questions",
              "Council can coordinate efficiently with trackable forms",
              "Academic achievements get the recognition they deserve",
              "Private, authenticated platform with verified members",
              "Professional public presence for the community"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Stack */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 md:p-8 text-white mb-8">
          <h2 className="text-xl font-semibold mb-3">Built for the Future</h2>
          <p className="text-emerald-100 leading-relaxed mb-4">
            The platform was built as a full-stack MERN application with a strong focus 
            on usability, privacy, and scalability. Launched publicly on May 25, 2025, 
            it continues to evolve with new features and improvements.
          </p>
          <div className="flex flex-wrap gap-2">
            {['MongoDB', 'Express', 'React', 'Node.js', 'Cloudinary', 'PWA'].map((tech) => (
              <span 
                key={tech}
                className="px-3 py-1 bg-white/20 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Growth Story */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Organic Growth
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            Initial reactions were mixed. While some seniors appreciated the initiative, 
            others questioned its necessity. Adoption was gradual, especially after 
            authentication was introduced in December 2025.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Credentials were manually issued to 172 DAAN KGPians, with steady but 
            organic onboarding thereafter. Today, the platform continues to grow 
            as the primary hub for the DAAN KGP community.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link 
            to="/before"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:scale-105 transition-transform"
          >
            <ArrowLeft className="w-4 h-4" />
            See How It Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AfterDAAN;
