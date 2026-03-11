import React from 'react';

const Results = () => {
  return (
    <div className="space-y-6">
      <div className="px-1">
        <h3 className="text-xl font-bold text-slate-800">Results Explorer</h3>
        <p className="text-slate-500 text-sm mt-1">Review raw data and aggregated analytics across all studies.</p>
      </div>
      
      <div className="card text-center py-20 flex flex-col items-center border-dashed border-2 border-slate-200 bg-transparent">
        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-4 text-2xl">📈</div>
        <h4 className="text-lg font-bold text-slate-900 mb-2">Aggregated Results</h4>
        <p className="text-slate-500 max-w-sm">This view will provide a global overview of participant responses, average reaction times, and data export options.</p>
      </div>
    </div>
  );
};

export default Results;
