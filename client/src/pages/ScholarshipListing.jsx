import { useState, useEffect } from 'react';
import API from '../services/api';
import { Search, Filter, Award, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ScholarshipListing = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [educationFilter, setEducationFilter] = useState('');
  const [fieldFilter, setFieldFilter] = useState('');

  useEffect(() => {
    fetchScholarships();
  }, [educationFilter, fieldFilter]);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      let queryUrl = '/scholarships?';
      if (educationFilter) queryUrl += `educationLevel=${educationFilter}&`;
      if (fieldFilter) queryUrl += `fieldOfStudy=${fieldFilter}&`;

      const { data } = await API.get(queryUrl);
      setScholarships(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching scholarships:', error);
      setLoading(false);
    }
  };

  // Client-side filtering for instant search title matching
  const filteredScholarships = scholarships.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Explore Scholarships</h1>
          <p className="text-gray-600 mt-1">Discover financial opportunities tailored for your educational journey.</p>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Keyword Search */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Search Keywords</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by title or provider..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Education Level */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Education Level</label>
            <select
              value={educationFilter}
              onChange={(e) => setEducationFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="">All Levels</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>
          </div>

          {/* Field of Study */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Field of Study</label>
            <input
              type="text"
              placeholder="e.g. Computer Science"
              value={fieldFilter}
              onChange={(e) => setFieldFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-gray-200 p-6 h-64 animate-pulse flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-100 rounded"></div>
                    <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                  </div>
                </div>
                <div className="h-10 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredScholarships.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No scholarships found</h3>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your search query or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScholarships.map((item) => (
              <div key={item._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md hover:border-primary-200 transition-all">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="bg-primary-50 text-primary-700 text-xs font-semibold px-2.5 py-1 rounded-md">
                      {item.provider}
                    </span>
                    <span className="text-green-600 font-bold text-lg flex items-center">
                      <DollarSign className="h-4 w-4" />{item.amount.toLocaleString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">{item.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">{item.description}</p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> {new Date(item.deadline).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/scholarships/${item._id}`}
                    className="inline-flex items-center gap-1 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                  >
                    View & Apply <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ScholarshipListing;