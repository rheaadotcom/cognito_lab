import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as experimentsApi from '../api/experiments';
import Skeleton from '../components/common/Skeleton';

const ResearcherDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentExperiments, setRecentExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, experimentsData] = await Promise.all([
        experimentsApi.getStats(),
        experimentsApi.getExperiments()
      ]);

      if (statsData.success) setStats(statsData.data);
      if (experimentsData.success) {
        setRecentExperiments(experimentsData.data.slice(0, 2));
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Could not load dashboard data.');
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
    if (window.confirm('Are you sure you want to delete this study?')) {
      try {
        const response = await experimentsApi.deleteExperiment(id);
        if (response.success) {
          setRecentExperiments(prev => prev.filter(e => e._id !== id));
          fetchDashboardData(); // Refresh stats
        }
      } catch (err) {
        alert('Failed to delete experiment.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="px-1">
        <h2 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name || 'Researcher'}</h2>
        <p className="text-slate-500">Here's what's happening in your lab today.</p>
      </div>
      
      {/* Statistics Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="card p-6 space-y-3">
              <Skeleton width="40px" height="40px" borderRadius="12px" />
              <Skeleton width="100px" height="14px" />
              <Skeleton width="60px" height="32px" />
            </div>
          ))
        ) : (
          <>
            <div className="card flex flex-col justify-center p-6 bg-gradient-to-br from-white to-blue-50/30">
               <div className="flex items-center justify-between mb-4">
                 <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl">🧪</div>
               </div>
               <p className="text-sm font-medium text-slate-500 mb-1">Total Experiments</p>
               <h4 className="text-3xl font-bold text-slate-900">{stats?.totalExperiments || 0}</h4>
            </div>

            <div className="card flex flex-col justify-center p-6 bg-gradient-to-br from-white to-indigo-50/30">
               <div className="flex items-center justify-between mb-4">
                 <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-xl">👥</div>
               </div>
               <p className="text-sm font-medium text-slate-500 mb-1">Total Participants</p>
               <h4 className="text-3xl font-bold text-slate-900">{stats?.totalParticipants || 0}</h4>
            </div>

            <div className="card flex flex-col justify-center p-6 bg-gradient-to-br from-white to-amber-50/30">
               <div className="flex items-center justify-between mb-4">
                 <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 text-xl">⚡</div>
               </div>
               <p className="text-sm font-medium text-slate-500 mb-1">Active Studies</p>
               <h4 className="text-3xl font-bold text-slate-900">{stats?.activeExperiments || 0}</h4>
            </div>
          </>
        )}
      </section>
      
      {/* Recent Experiments Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-bold text-slate-800">Recent Experiments</h3>
          <Link to="/experiments" className="text-sm font-bold text-brand-600 hover:text-brand-700 underline-offset-4 hover:underline">View all →</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [1, 2].map(i => (
              <div key={i} className="card p-6 space-y-4">
                <div className="flex justify-between"><Skeleton width="30px" height="30px" /><Skeleton width="60px" height="20px" borderRadius="10px" /></div>
                <Skeleton width="80%" height="24px" />
                <Skeleton width="100%" height="40px" />
              </div>
            ))
          ) : recentExperiments.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-2 flex flex-col items-center justify-center p-12 card border-dashed border-2 border-slate-200 bg-transparent text-center">
               <div className="text-4xl mb-4">📉</div>
               <h4 className="font-bold text-slate-900">No studies yet</h4>
               <p className="text-sm text-slate-500 mt-1 max-w-xs">Start your research journey by creating your first experiment.</p>
               <Link to="/create-experiment" className="mt-6 btn btn-primary btn-sm px-6">Create Experiment</Link>
            </div>
          ) : (
            recentExperiments.map(experiment => (
              <div key={experiment._id} className="card hover:shadow-soft-lg transition-all duration-300 flex flex-col h-full border-l-4 border-l-brand-600 p-6 group">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 text-sm">
                      {experiment.type === 'stroop' ? '🧠' : '📝'}
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      experiment.status === 'active' 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {experiment.status === 'active' && <span className="w-1 h-1 bg-green-500 rounded-full mr-1 animate-pulse"></span>}
                      {experiment.status || 'Draft'}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">{experiment.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">{experiment.description}</p>
                </div>
                
                <div className="mt-5 pt-5 border-t border-slate-100 flex items-center justify-between">
                   <Link to={`/results/${experiment._id}`} className="text-brand-600 text-xs font-bold hover:underline">
                     Analytics →
                   </Link>
                   <div className="flex gap-1.5">
                      <button onClick={() => handleCopyLink(experiment._id)} className="text-slate-400 hover:text-brand-600 p-1" title="Copy Link">🔗</button>
                      <button onClick={() => handleDelete(experiment._id)} className="text-slate-400 hover:text-red-500 p-1" title="Delete">🗑️</button>
                   </div>
                </div>
              </div>
            ))
          )}

          {/* New Experiment Card */}
          <Link to="/create-experiment" className="card border-2 border-dashed border-slate-200 bg-transparent hover:bg-slate-50 hover:border-brand-300 flex flex-col items-center justify-center text-center p-8 transition-all group shadow-none min-h-[200px]">
             <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 mb-3 group-hover:scale-110 group-hover:bg-brand-100 transition-all text-xl">➕</div>
             <h4 className="text-sm font-bold text-slate-900">New Experiment</h4>
             <p className="text-[10px] text-slate-500 mt-1">Design a new study</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ResearcherDashboard;
