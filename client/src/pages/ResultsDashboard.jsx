import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as responsesApi from '../api/responses';
import * as experimentsApi from '../api/experiments';
import Skeleton from '../components/common/Skeleton';

const ResultsDashboard = () => {
  const { id } = useParams();
  const [results, setResults] = useState([]);
  const [experiment, setExperiment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResults();
  }, [id]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const [expData, respData] = await Promise.all([
        experimentsApi.getExperiment(id),
        responsesApi.getExperimentResponses(id)
      ]);

      if (expData.success) setExperiment(expData.data);
      if (respData.success) setResults(respData.data);
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Failed to load experiment data.');
    } finally {
      setLoading(false);
    }
  };

  const avgReactionTime = results.length > 0 
    ? (results.reduce((acc, curr) => acc + (curr.reactionTime || 0), 0) / results.length).toFixed(0) 
    : 0;

  const accuracyRate = results.length > 0
    ? ((results.filter(r => r.accuracy).length / results.length) * 100).toFixed(1)
    : 0;

  const handleExportCSV = () => {
    if (results.length === 0) return;

    const headers = ['ID', 'Reaction Time (ms)', 'Accuracy', 'Timestamp'];
    const csvRows = results.map(res => [
      res._id,
      res.reactionTime,
      res.accuracy ? 'Correct' : 'Incorrect',
      new Date(res.timestamp).toISOString()
    ]);

    const csvContent = [headers, ...csvRows]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `results_${experiment?.title || id}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4">
          <Skeleton width="100px" height="14px" />
          <Skeleton width="300px" height="32px" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-6 flex items-center">
              <Skeleton width="56px" height="56px" borderRadius="12px" className="mr-5" />
              <div className="space-y-2 flex-1">
                <Skeleton width="100px" height="14px" />
                <Skeleton width="60px" height="32px" />
              </div>
            </div>
          ))}
        </div>
        <div className="card p-0 overflow-hidden border border-slate-200">
           <div className="p-6 border-b border-slate-200 bg-slate-50"><Skeleton width="150px" height="24px" /></div>
           <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} width="100%" height="40px" />)}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-soft border border-slate-100">
         <div>
           <div className="flex items-center gap-2 text-sm text-brand-600 font-bold mb-1">
             <Link to="/experiments" className="hover:underline">Experiments</Link> 
             <span className="text-slate-300">/</span> 
             <span>Results</span>
           </div>
           <h2 className="text-2xl font-bold text-slate-900">{experiment?.title || 'Experiment Results'}</h2>
         </div>
         <div className="flex gap-3">
           <button 
             onClick={handleExportCSV}
             className="btn btn-secondary shadow-sm btn-sm"
             disabled={results.length === 0}
           >
             <span className="mr-2">📥</span> Export CSV
           </button>
         </div>
      </header>
      
      {/* Top Level Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="card flex items-center p-6 border-l-4 border-l-brand-500">
           <div className="w-14 h-14 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 text-xl mr-5">
             👥
           </div>
           <div>
             <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Responses</p>
             <h4 className="text-3xl font-bold text-slate-900">{results.length}</h4>
           </div>
         </div>

         <div className="card flex items-center p-6 border-l-4 border-l-emerald-500">
           <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-xl mr-5">
             ⏱️
           </div>
           <div>
             <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Avg Reaction Time</p>
             <h4 className="text-3xl font-bold text-slate-900">{avgReactionTime} <span className="text-lg font-normal text-slate-500">ms</span></h4>
           </div>
         </div>

         <div className="card flex items-center p-6 border-l-4 border-l-purple-500">
           <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 text-xl mr-5">
             🎯
           </div>
           <div>
             <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Accuracy Rate</p>
             <h4 className="text-3xl font-bold text-slate-900">{accuracyRate}%</h4>
           </div>
         </div>
      </div>

      {/* Detailed Data Table */}
      <div className="card overflow-hidden p-0 border border-slate-200">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Raw Response Data</h3>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md uppercase">{results.length} records</span>
        </div>
        
        {results.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="text-5xl mb-4">📊</div>
            <h4 className="text-lg font-bold text-slate-900">No data collected yet</h4>
            <p className="text-slate-500 max-w-sm mt-1">Once participants complete this experiment, their specific reaction times and accuracy will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Reaction</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Accuracy</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Timestamp</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {results.map((res, idx) => (
                  <tr key={res._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-slate-400">{res._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-bold">{res.reactionTime}ms</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        res.accuracy 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {res.accuracy ? 'CORRECT' : 'INCORRECT'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">{new Date(res.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDashboard;
