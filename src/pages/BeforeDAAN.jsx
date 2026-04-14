import { Link } from "react-router-dom";
import { 
  AlertTriangle, 
  Users, 
  MessageSquareWarning, 
  Award, 
  Clock,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import SEO, { seoConfig } from "../utils/SEO";

const challenges = [
  {
    icon: AlertTriangle,
    title: "Lack of Centralized Information",
    description: "There was no single place to access verified information about DAAN KGPians, council members, or academic achievers."
  },
  {
    icon: Users,
    title: "Freshers' Struggles",
    description: "Newly admitted students faced difficulties navigating ERP registration, academic procedures, campus life, halls, clubs, CDC processes, and even understanding KGP-specific terminology."
  },
  {
    icon: MessageSquareWarning,
    title: "Inefficient Coordination",
    description: "Council members struggled to reach everyone simultaneously, collect responses reliably, or maintain updated records. Data was scattered across chats, spreadsheets, and personal contacts."
  },
  {
    icon: Award,
    title: "No Recognition Mechanism",
    description: "Academic excellence and extracurricular achievements of DAAN KGPians largely went unnoticed at the community level."
  }
];

const timeline = [
  { year: "Pre-2024", event: "Informal WhatsApp groups as primary communication" },
  { year: "Oct 2024", event: "CR selection on Dakshana Day '24" },
  { year: "Summer 2025", event: "Development of DAAN KGP platform begins" },
  { year: "May 25, 2025", event: "DAAN KGP website launches publicly" },
  { year: "Dec 2025", event: "Authentication introduced, 172 members onboarded" }
];

const BeforeDAAN = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <SEO 
        title="Before DAAN KGP"
        description="Discover the challenges faced by DAAN KGPians before the platform existed - fragmented communication, lack of centralized information, and inefficient coordination."
        keywords="DAAN KGP history, Dakshana alumni challenges, before DAAN KGP, community problems"
        canonical="/before"
      />

      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            The State Before DAAN KGP
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Prior to the establishment of DAAN KGP as a structured platform, the community 
            largely relied on informal and fragmented modes of communication.
          </p>
        </div>

        {/* Main Challenge */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-500">
              <MessageSquareWarning className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                WhatsApp-Driven Communication
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Communication primarily relied on WhatsApp groups. These groups were often 
                batch-wise, unstructured, and limited in functionality. Support often depended 
                on repeatedly approaching seniors individually.
              </p>
            </div>
          </div>
        </div>

        {/* Key Challenges Grid */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Key Challenges
        </h2>
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {challenges.map((item, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:border-rose-200 dark:hover:border-rose-800 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-500">
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

        {/* Timeline */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-rose-500" />
            Timeline to Transformation
          </h2>
          <div className="space-y-4">
            {timeline.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-20 text-sm font-medium text-rose-500">
                  {item.year}
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    {item.event}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Turning Point */}
        <div className="bg-gradient-to-r from-rose-500 to-red-500 rounded-2xl p-6 md:p-8 text-white mb-8">
          <h2 className="text-xl font-semibold mb-3">The Turning Point</h2>
          <p className="text-rose-100 leading-relaxed mb-4">
            The turning point came after the author's selection as College Representative (CR) 
            of DAAN KGP on Dakshana Day '24, October 15, 2024. Upon closely observing the 
            recurring challenges faced by both freshers and seniors, it became evident that 
            incremental fixes would not be sufficient. A non-traditional, initiative-driven 
            approach was required.
          </p>
          <p className="text-rose-100 leading-relaxed">
            The decision was made to design and build a comprehensive digital platform that 
            could address these issues holistically. This effort was driven by a clear 
            prioritization of responsibility towards the community over personal convenience.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link 
            to="/after"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:scale-105 transition-transform"
          >
            See What Changed
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BeforeDAAN;
