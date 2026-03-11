import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as experimentsApi from '../api/experiments';

const COLORS = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Purple', value: '#a855f7' }
];

const CreateExperiment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: ''
  });

  const [tasks, setTasks] = useState([
    { id: Date.now(), type: 'stroop', stimulus: { text: '', color: '#ef4444' }, correctAnswer: '', duration: 2000 }
  ]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTaskChange = (id, field, value) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        if (field === 'text' || field === 'color') {
          return { ...task, stimulus: { ...task.stimulus, [field]: value } };
        }
        return { ...task, [field]: value };
      }
      return task;
    }));
  };

  const addTask = () => {
    setTasks([...tasks, { id: Date.now(), type: 'stroop', stimulus: { text: '', color: '#ef4444' }, correctAnswer: '', duration: 2000 }]);
  };

  const removeTask = (id) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const payload = {
        title: formData.title,
        description: formData.description,
        instructions: formData.instructions,
        tasks: tasks.map(({ id, ...rest }) => ({
          ...rest,
          // Ensure correct answer is always uppercase for consistency
          correctAnswer: rest.correctAnswer.toUpperCase()
        }))
      };
      
      const response = await experimentsApi.createExperiment(payload);
      if (response.success) {
        navigate('/experiments');
      } else {
        setError(response.error || 'Failed to create experiment.');
      }
    } catch (err) {
      console.error('Error creating experiment:', err);
      setError('An error occurred while saving. Please check your data or connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-1">
         <div>
           <div className="flex items-center gap-2 text-sm text-brand-600 font-bold mb-1">
             <Link to="/dashboard" className="hover:underline">Dashboard</Link> 
             <span className="text-slate-300">/</span> 
             <span>New Experiment</span>
           </div>
           <h2 className="text-3xl font-bold text-slate-900">Create Study</h2>
         </div>
      </header>

      {error && (
        <div className="mx-1 bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm flex items-center shadow-sm">
          <span className="mr-2">⚠️</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Basic Details */}
        <div className="flex-1 space-y-6">
          <div className="card space-y-6 shadow-soft p-6 md:p-8">
            <h3 className="text-lg font-bold border-b border-slate-100 pb-3 mb-4 text-slate-800 uppercase tracking-tight">Study Details</h3>
            
            <div className="form-group">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Experiment Title <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="title" 
                placeholder="e.g. Lexical Interference Study"
                value={formData.title} 
                onChange={handleChange} 
                className="bg-slate-50 border-slate-200 focus:bg-white"
                required 
              />
            </div>
            
            <div className="form-group">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Public Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="A brief summary for participants..."
                rows="3"
                className="bg-slate-50 border-slate-200 focus:bg-white"
                required
              />
            </div>
            
            <div className="form-group mb-0">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Participant Instructions <span className="text-red-500">*</span></label>
              <textarea 
                name="instructions" 
                value={formData.instructions} 
                onChange={handleChange} 
                placeholder="Detailed instructions for the task..."
                rows="6"
                className="bg-slate-50 border-slate-200 focus:bg-white"
                required
              />
              <p className="text-xs text-slate-400 mt-2 italic font-medium">Clear instructions help ensure data quality.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Task Builder & Submit */}
        <div className="lg:w-[420px] shrink-0 space-y-6">
          <div className="card bg-slate-50/50 border-slate-200 p-6">
             <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Trials</h3>
                  <span className="bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{tasks.length} {tasks.length === 1 ? 'ITEM' : 'ITEMS'}</span>
             </div>
             
             <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {tasks.map((task, index) => (
                  <div key={task.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm relative group hover:border-brand-300 transition-colors">
                     <button 
                        type="button" 
                        onClick={() => removeTask(task.id)}
                        className="absolute top-3 right-3 text-slate-300 hover:text-red-500 p-1 transition-colors"
                        title="Remove Trial"
                      >
                        ✕
                      </button>
                     
                     <div className="flex items-center mb-3">
                        <div className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center mr-2">
                          {index + 1}
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stroop Trial</span>
                     </div>

                     <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Display Text</label>
                            <input 
                              type="text" 
                              className="w-full text-sm px-3 py-1.5 rounded-lg border border-slate-100 bg-slate-50 focus:bg-white focus:border-brand-500 uppercase"
                              placeholder="RED"
                              value={task.stimulus.text}
                              onChange={(e) => handleTaskChange(task.id, 'text', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Display Color</label>
                            <div className="flex gap-1.5">
                               {COLORS.map(c => (
                                 <button
                                   key={c.name}
                                   type="button"
                                   onClick={() => handleTaskChange(task.id, 'color', c.value)}
                                   className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${task.stimulus.color === c.value ? 'border-slate-800 scale-110' : 'border-transparent'}`}
                                   style={{ backgroundColor: c.value }}
                                   title={c.name}
                                 />
                               ))}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Correct Key</label>
                            <input 
                              type="text" 
                              className="w-full text-sm px-3 py-1.5 rounded-lg border border-slate-100 bg-slate-50 focus:bg-white focus:border-brand-500 uppercase"
                              placeholder="G"
                              maxLength="1"
                              value={task.correctAnswer}
                              onChange={(e) => handleTaskChange(task.id, 'correctAnswer', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Show Duration</label>
                            <div className="flex items-center">
                              <input 
                                type="number" 
                                className="w-full text-sm px-3 py-1.5 rounded-l-lg border border-slate-100 bg-slate-50 focus:bg-white focus:border-brand-500"
                                value={task.duration}
                                onChange={(e) => handleTaskChange(task.id, 'duration', parseInt(e.target.value) || 0)}
                                required
                              />
                              <span className="bg-slate-100 px-2 py-1.5 border border-l-0 border-slate-100 rounded-r-lg text-[10px] font-bold text-slate-400">MS</span>
                            </div>
                          </div>
                        </div>
                     </div>
                  </div>
                ))}
             </div>

             <button 
               type="button" 
               onClick={addTask}
               className="w-full py-2.5 bg-white border border-slate-300 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all flex items-center justify-center border-dashed"
             >
                <span className="mr-2">＋</span> ADD ANOTHER TRIAL
             </button>
          </div>

          <div className="card shadow-lg border-slate-200 p-6 bg-white">
             <button 
               type="submit" 
               className={`btn btn-primary w-full py-3.5 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
               disabled={loading}
             >
               {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
               {loading ? 'Creating...' : 'Launch Experiment'}
             </button>
             <button type="button" onClick={() => navigate('/dashboard')} className="w-full text-center mt-4 text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors font-mono">
               Discard & Exit
             </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default CreateExperiment;
