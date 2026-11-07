import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Award, Calendar, DollarSign, Building, CheckCircle2, ArrowLeft, AlertCircle } from 'lucide-react';

const ScholarshipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchScholarshipDetails();
  }, [id]);

  const fetchScholarshipDetails = async () => {
    try {
      const { data } = await API.get(`/scholarships/${id}`);
      setScholarship(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching scholarship detail:', error);
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setApplying(true);
      setMessage({ type: '', text: '' });

      const { data } = await API.post('/applications', { scholarshipId: id });
      setMessage({ type: 'success', text: 'Successfully applied for this scholarship!' });
      setApplying(false);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to submit application' 
      });
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading scholarship details...</div>;
  }

  if (!scholarship) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Scholarship not found</h2>
        <button onClick={() => navigate('/scholarships')} className="mt-4 text-primary-600 font-medium">
          &larr; Back to Scholarships
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button
          onClick={() => navigate('/scholarships')}
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Scholarships
        </button>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          
          <div className="flex justify-between items-start gap-4 mb-6">
            <div>
              <span className="inline-block bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                {scholarship.provider}
              </span>
              <h1 className="text-3xl font-ext500 font-bold text-gray-900">{scholarship.title}</h1>
            </div>
            <div className="text-right shrink-0">
              <span className="text-2xl sm:text-3xl font-bold text-green-600 flex items-center justify-end">
                <DollarSign className="h-6 w-6" />{scholarship.amount.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500">Award Amount</span>
            </div>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-xl text-sm flex items-center gap-2 ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.type === 'success' ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
              <span>{message.text}</span>
            </div>
          )}

          <div className="border-t border-b border-gray-100 py-6 my-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Deadline</span>
              <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <Calendar className="h-4 w-4 text-primary-600" /> {new Date(scholarship.deadline).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Education Level</span>
              <span className="text-sm font-medium text-gray-900">{scholarship.eligibility?.educationLevel || 'All'}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Field of Study</span>
              <span className="text-sm font-medium text-gray-900">{scholarship.eligibility?.fieldOfStudy || 'General'}</span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{scholarship.description}</p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleApply}
              disabled={applying}
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium px-8 py-3.5 rounded-xl shadow-sm transition-colors text-base"
            >
              <CheckCircle2 className="h-5 w-5" /> {applying ? 'Submitting Application...' : 'Apply Now'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ScholarshipDetail;