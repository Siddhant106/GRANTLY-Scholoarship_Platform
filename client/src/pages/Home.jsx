import { Link } from 'react-router-dom';
import { Award, Search, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="h-4 w-4" /> GRANTLY — Unified Scholarship Discovery
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-ext500 font-bold text-gray-900 tracking-tight leading-tight mb-6">
              Rethinking the <span className="text-primary-600">Scholarship Experience</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed">
              Accessing educational financial assistance can be a complicated journey. We simplify discovery, navigation, and management into a seamless digital experience[cite: 1].
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/scholarships"
                className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3.5 rounded-xl shadow-sm transition-all text-base"
              >
                Browse Scholarships <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6 py-3.5 rounded-xl transition-all text-base"
              >
                Student Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose Grantly?</h2>
          <p className="text-gray-600 mt-2">Designed to transform complex funding processes into an intuitive journey[cite: 1].</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <div className="bg-primary-50 text-primary-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Discovery</h3>
            <p className="text-gray-600">Filter and find relevant opportunities tailored to your education level, field of study, and category.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <div className="bg-primary-50 text-primary-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Advisor</h3>
            <p className="text-gray-600">Get personalized recommendations and application guidance powered by advanced Google GenAI SDK integration.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <div className="bg-primary-50 text-primary-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Seamless Tracking</h3>
            <p className="text-gray-600">Keep track of your submitted applications and stay updated on approval statuses in real-time.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;