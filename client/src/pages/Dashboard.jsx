import { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, Sparkles, Send, CheckCircle2, Clock, AlertCircle, Award, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  
  // AI Advisor State
  const [query, setQuery] = useState('');
  const [aiAdvice, setAiAdvice] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      const { data } = await API.get('/applications/my-applications');
      setApplications(data.data || []);
      setLoadingApps(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoadingApps(false);
    }
  };

  const handleAiQuery = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoadingAi(true);
      setAiAdvice('');
      const { data } = await API.post('/ai/recommendations', { studentQuery: query });
      setAiAdvice(data.advice);
      setLoadingAi(false);
    } catch (error) {
      console.error('Error fetching AI advice:', error);
      setAiAdvice('Failed to fetch AI recommendations. Please try again.');
      setLoadingAi(false);
    }
  };

  // Calculate Stats
  const totalApplications = applications.length;
  const approvedCount = applications.filter(app => app.status === 'Approved').length;
  const pendingCount = applications.filter(app => app.status === 'Pending' || !app.status).length;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Student Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, <span className="font-semibold text-gray-900">{user?.name}</span>!</p>
          </div>
          <div className="bg-primary-50 border border-primary-100 px-4 py-2 rounded-xl flex items-center gap-2 self-start sm:self-auto">
            <Award className="h-5 w-5 text-primary-600" />
            <span className="text-sm font-semibold text-primary-900">Education: {user?.profile?.educationLevel || 'Undergraduate'}</span>
          </div>
        </div>

        {/* Stats Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Applications</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{totalApplications}</h3>
            </div>
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
              <FileText className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Approved</p>
              <h3 className="text-3xl font-bold text-green-600 mt-1">{approvedCount}</h3>
            </div>
            <div className="bg-green-50 text-green-600 p-3 rounded-xl">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Under Review</p>
              <h3 className="text-3xl font-bold text-yellow-600 mt-1">{pendingCount}</h3>
            </div>
            <div className="bg-yellow-50 text-yellow-600 p-3 rounded-xl">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: My Applications */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary-600" /> My Scholarship Applications
              </h2>

              {loadingApps ? (
                <div className="space-y-3">
                  {[1, 2].map((n) => (
                    <div key={n} className="h-20 bg-gray-100 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                  <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">No applications submitted yet.</p>
                  <p className="text-gray-400 text-sm mt-1">Explore scholarships and start applying today!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app._id} className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-primary-200 transition-all">
                      <div>
                        <h3 className="font-bold text-gray-900">{app.scholarship?.title || 'Scholarship'}</h3>
                        <p className="text-xs text-gray-500 mt-1">Provider: <span className="font-medium text-gray-700">{app.scholarship?.provider}</span></p>
                        <p className="text-xs text-gray-400 mt-0.5">Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          app.status === 'Approved' ? 'bg-green-50 text-green-700 border border-green-200' :
                          app.status === 'Rejected' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                        }`}>
                          {app.status === 'Approved' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                          {app.status || 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: AI Scholarship Advisor */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary-600" /> AI Scholarship Advisor
              </h2>
              <p className="text-gray-600 text-sm mb-5">Ask Gemini for personalized recommendations and guidance based on your profile.</p>

              <form onSubmit={handleAiQuery} className="space-y-4">
                
                {/* Quick Suggestion Pills */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Quick Prompts</label>
                  <div className="flex flex-wrap gap-2">
                    {["Undergraduate CS scholarships", "Merit-based financial aid", "Deadlines coming up this month"].map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setQuery(chip)}
                        className="text-xs bg-primary-50 text-primary-700 hover:bg-primary-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <textarea
                    rows="3"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. Which scholarships match my profile best?"
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loadingAi}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition-colors shadow-sm"
                >
                  <Send className="h-4 w-4" /> {loadingAi ? 'Thinking...' : 'Get AI Advice'}
                </button>
              </form>

              {aiAdvice && (
                <div className="mt-6 p-4 bg-primary-50 border border-primary-100 rounded-xl text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                  <h4 className="font-bold text-primary-900 mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-primary-600" /> AI Recommendation:
                  </h4>
                  {aiAdvice}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;