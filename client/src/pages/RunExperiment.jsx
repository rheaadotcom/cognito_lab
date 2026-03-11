import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as experimentsApi from '../api/experiments';
import * as responsesApi from '../api/responses';

const RunExperiment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experiment, setExperiment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState(null);
  
  // Trial State
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [showFixation, setShowFixation] = useState(true);
  const [startTime, setStartTime] = useState(0);
  const [trialCompleted, setTrialCompleted] = useState(false);

  // Fetch experiment data
  useEffect(() => {
    const fetchExperiment = async () => {
      try {
        setLoading(true);
        const res = await experimentsApi.getPublicExperiment(id);
        if (res.success) {
          setExperiment(res.data);
        } else {
          setError(res.error || 'Experiment not found.');
        }
      } catch (err) {
        console.error('Error fetching experiment:', err);
        setError('Connection failed. Please check your internet.');
      } finally {
        setLoading(false);
      }
    };
    fetchExperiment();
  }, [id]);

  // Trial Sequence Logic
  useEffect(() => {
    if (hasStarted && !isFinished && !trialCompleted) {
      setShowFixation(true);
      const timer = setTimeout(() => {
        setShowFixation(false);
        setStartTime(Date.now());
      }, 700); // 700ms fixation for better focus
      return () => clearTimeout(timer);
    }
  }, [hasStarted, currentTrialIndex, isFinished, trialCompleted]);

  const handleResponse = useCallback(async (key) => {
    if (showFixation || trialCompleted || isFinished) return;

    const endTime = Date.now();
    const reactionTime = endTime - startTime;
    const currentTask = experiment.tasks[currentTrialIndex];
    
    // Normalize key to match correct answer (case-insensitive check)
    const responseValue = key.toUpperCase();
    const accuracy = responseValue === currentTask.correctAnswer.toUpperCase();

    setTrialCompleted(true);

    try {
      await responsesApi.submitResponse({
        experimentId: id,
        taskId: currentTask._id,
        response: responseValue,
        reactionTime,
        accuracy
      });
    } catch (err) {
      console.error('Failed to submit response:', err);
      // We continue anyway so the participant isn't blocked by minor network issues
    }

    // Move to next trial or finish
    if (currentTrialIndex < experiment.tasks.length - 1) {
      setTimeout(() => {
        setCurrentTrialIndex(prev => prev + 1);
        setTrialCompleted(false);
      }, 400); // Brief pause between trials
    } else {
      setTimeout(() => setIsFinished(true), 500);
    }
  }, [showFixation, trialCompleted, isFinished, startTime, experiment, currentTrialIndex, id]);

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!hasStarted || isFinished || trialCompleted || showFixation) return;
      
      const key = e.key.toUpperCase();
      // Most Stroop tests use R, G, B, Y, P or F/J. We accept any single letter for flexibility.
      if (key.length === 1 && key.match(/[A-Z]/)) {
        handleResponse(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleResponse, hasStarted, isFinished, trialCompleted, showFixation]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
      <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-6"></div>
      <p className="text-slate-400 font-bold uppercase tracking-[0.3em] animate-pulse">Initializing Protocol</p>
    </div>
  );

  if (error || !experiment || (experiment.tasks && experiment.tasks.length === 0)) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-6 text-center">
      <div className="text-6xl mb-6">🚫</div>
      <h2 className="text-2xl font-bold text-white mb-2">{error || 'Invalid Experiment'}</h2>
      <p className="text-slate-400 mb-8 max-w-sm">We couldn't load the study protocol. Please verify your access code and try again.</p>
      <button onClick={() => navigate('/')} className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors uppercase tracking-widest text-xs">Return Home</button>
    </div>
  );

  if (isFinished) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-6 animate-fade-in">
      <div className="max-w-md w-full bg-slate-800 rounded-[2.5rem] shadow-2xl p-12 text-center border border-white/5">
        <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 animate-pulse">
          ✓
        </div>
        <h2 className="text-3xl font-black text-white mb-4">Study Complete</h2>
        <p className="text-slate-400 mb-10 leading-relaxed font-medium">
          Your cognitive data has been securely processed and transmitted. Thank you for your contribution to science.
        </p>
        <button 
          onClick={() => navigate('/')} 
          className="w-full py-4 bg-brand-600 text-white font-bold rounded-2xl text-lg shadow-xl shadow-brand-500/20 hover:bg-brand-500 transition-all uppercase tracking-widest"
        >
          Return Home
        </button>
      </div>
    </div>
  );

  const currentTask = experiment.tasks[currentTrialIndex];

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4">
      {!hasStarted ? (
        <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl p-10 md:p-16 text-center animate-slide-up relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-brand-600"></div>
          
          <div className="w-20 h-20 bg-brand-50 text-brand-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-8 shadow-inner">
            🧪
          </div>
          
          <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">{experiment.title}</h2>
          
          <div className="bg-slate-50 rounded-3xl p-8 mb-12 text-left border border-slate-100 shadow-sm overflow-y-auto max-h-72">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-sm font-bold">!</div>
                <h3 className="font-bold text-slate-900 text-lg uppercase tracking-tight">Instructions</h3>
             </div>
             <p className="text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">
               {experiment.instructions}
             </p>
          </div>
          
          <button 
            className="w-full sm:w-auto px-16 py-5 bg-slate-900 text-white text-xl font-black rounded-2xl shadow-2xl shadow-slate-900/20 hover:bg-brand-600 hover:scale-[1.03] active:scale-95 transition-all uppercase tracking-widest" 
            onClick={() => setHasStarted(true)}
          >
            Start Protocol
          </button>
        </div>
      ) : (
        <div className="w-full max-w-6xl aspect-video bg-slate-900 rounded-[3rem] shadow-2xl border border-white/5 flex flex-col relative overflow-hidden ring-1 ring-white/10">
           
           {/* Header Info */}
           <div className="px-10 py-6 border-b border-white/5 flex justify-between items-center bg-white/5 backdrop-blur-md">
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Progress</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-brand-400 font-mono text-3xl font-black">
                    {String(currentTrialIndex + 1).padStart(2, '0')}
                  </span>
                  <span className="text-slate-600 font-mono text-xl">/ {String(experiment.tasks.length).padStart(2, '0')}</span>
                </div>
              </div>
              
              <div className="h-2 flex-1 mx-12 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-500 transition-all duration-500 ease-out shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                  style={{ width: `${((currentTrialIndex + 1) / experiment.tasks.length) * 100}%` }}
                ></div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Link</span>
              </div>
           </div>

           {/* Core Stimulus Display */}
           <div className="flex-1 flex flex-col items-center justify-center relative select-none">
              
              {showFixation ? (
                <div className="text-7xl text-slate-700 font-thin animate-pulse">+</div>
              ) : (
                <div key={currentTrialIndex} className="animate-stimulus-pop">
                  <h1 
                    className="text-8xl md:text-[11rem] font-black tracking-tighter drop-shadow-2xl select-none" 
                    style={{ color: currentTask.stimulus.color }}
                  >
                    {currentTask.stimulus.text.toUpperCase()}
                  </h1>
                </div>
              )}

           </div>

           {/* Footer Hint */}
           <div className="p-8 text-center bg-white/[0.02] border-t border-white/5">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.5em] animate-pulse">Respond now using your keyboard</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default RunExperiment;
