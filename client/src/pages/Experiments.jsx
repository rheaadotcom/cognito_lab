import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as experimentsApi from '../api/experiments';
import Skeleton from '../components/common/Skeleton';

const Experiments = () => {
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExperiments();
  }, []);

  const fetchExperiments = async () => {
    try {
      setLoading(true);
      const data = await experimentsApi.getExperiments();
      if (data.success) {
        setExperiments(data.data);
      }
    } catch (err) {
      setError('Failed to load experiments. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (id) => {
    const link = `${window.location.origin}/join-experiment?code=${id}`;
    navigator.clipboard.writeText(link);
    alert('Participant link copied to clipboard!');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experiment? This action cannot be undone.')) {
      try {
        const response = await experimentsApi.deleteExperiment(id);
        if (response.success) {
          setExperiments(experiments.filter(e => e._id !== id));
        }
      } catch (err) {
        alert('Failed to delete experiment. Please try again.');
        console.error(err);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'draft' : 'active';
    try {
      const response = await experimentsApi.updateExperiment(id, { status: newStatus });
      if (response.success) {
        setExperiments(experiments.map(e => e._id === id ? { ...e, status: newStatus } : e));
      }
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <Skeleton width="150px" height="28px" />
          <Skeleton width="120px" height="40px" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card p-6 space-y-4">
              <Skeleton width="40px" height="40px" borderRadius="0.75rem" />
              <Skeleton width="70%" height="24px" />
              <Skeleton width="100%" height="40px" />
              <div className="pt-4 border-t border-slate-100 flex justify-between">
                <Skeleton width="80px" height="16px" />
                <Skeleton width="40px" height="16px" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-xl font-bold text-slate-800">Your Experiments</h3>
        <Link to="/create-experiment" className="btn btn-primary">Create New</Link>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {experiments.length === 0 ? (
        <div className="card text-center py-20 flex flex-col items-center border-dashed border-2 border-slate-200 bg-transparent">
          <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 mb-4 text-2xl">🧪</div>
          <h4 className="text-lg font-bold text-slate-900 mb-2">No experiments yet</h4>
          <p className="text-slate-500 max-w-sm mb-8">Ready to start your research? Create your first experiment and begin collecting data today.</p>
          <Link to="/create-experiment" className="btn btn-primary">Create First Experiment</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiments.map((experiment) => (
            <div key={experiment._id} className="card hover:shadow-soft-lg transition-all duration-300 flex flex-col h-full group p-6 border-l-4 border-l-brand-500">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 group-hover:scale-110 transition-transform">
                    {experiment.type === 'stroop' ? '🧠' : '📝'}
                  </div>
                  <button 
                    onClick={() => handleToggleStatus(experiment._id, experiment.status)}
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                      experiment.status === 'active' 
                        ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200' 
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                    title="Click to toggle status"
                  >
                    {experiment.status === 'active' && <span className="w-1 h-1 bg-green-500 rounded-full mr-1 animate-pulse"></span>}
                    {experiment.status || 'Draft'}
                  </button>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">{experiment.title}</h4>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">{experiment.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                   <div className="flex flex-col">
                     <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Participants</span>
                     <span className="font-semibold text-slate-700">{experiment.participantCount || 0}</span>
                   </div>
                   <div className="w-px h-8 bg-slate-200"></div>
                   <div className="flex flex-col">
                     <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Created</span>
                     <span className="font-semibold text-slate-700">{new Date(experiment.createdAt).toLocaleDateString()}</span>
                   </div>
                </div>
              </div>
              
              <div className="mt-5 pt-5 border-t border-slate-100 flex items-center justify-between">
                 <Link to={`/results/${experiment._id}`} className="text-brand-600 text-sm font-bold hover:underline flex items-center">
                   View Data <span className="ml-1">→</span>
                 </Link>
                 <div className="flex gap-2">
                    <button 
                      onClick={() => handleCopyLink(experiment._id)}
                      className="text-slate-400 hover:text-brand-600 transition-colors p-1" 
                      title="Copy Participant Link"
                    >
                      🔗
                    </button>
                    <button 
                      onClick={() => handleDelete(experiment._id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1" 
                      title="Delete Experiment"
                    >
                      🗑️
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Experiments;
