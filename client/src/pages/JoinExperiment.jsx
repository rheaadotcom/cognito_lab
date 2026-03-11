import * as experimentsApi from '../api/experiments';

const JoinExperiment = () => {
  const [experimentCode, setExperimentCode] = useState('');
  const [experiment, setExperiment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFetch = async (e) => {
    e.preventDefault();
    if (!experimentCode.trim()) return;

    setLoading(true);
    setError('');
    try {
      const response = await experimentsApi.getPublicExperiment(experimentCode);
      if (response.success) {
        setExperiment(response.data);
      } else {
        setError(response.error || 'Experiment not found.');
      }
    } catch (err) {
      setError('Experiment not found. Please check the code.');
      setExperiment(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunch = () => {
    if (experiment) {
      navigate(`/experiment/${experiment._id}/run`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
          {experiment ? 'Ready to Begin?' : `Welcome, ${user?.name || 'Participant'}`}
        </h2>
        <p className="text-slate-500 text-lg">
          {experiment ? 'Please review the instructions below carefully.' : 'Enter your experiment access code to begin.'}
        </p>
      </div>

      {!experiment ? (
        <div className="card p-8 shadow-soft-xl border-slate-200/60 bg-white/80 backdrop-blur-xl">
          <form onSubmit={handleFetch} className="space-y-6">
            <div className="form-group mb-0">
              <label className="text-slate-700 font-semibold mb-3 block">Access Code</label>
              <input 
                type="text" 
                placeholder="Paste code here..."
                value={experimentCode}
                onChange={(e) => setExperimentCode(e.target.value)}
                className="text-center text-xl sm:text-2xl tracking-widest font-mono py-5 border-2 border-slate-100 focus:border-brand-500 rounded-2xl shadow-inner bg-slate-50/50"
                required
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium animate-shake text-center">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary w-full py-4 text-lg shadow-lg shadow-brand-500/20 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-70"
            >
              {loading ? 'Searching...' : 'Find Experiment'}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="card p-8 shadow-soft-xl border-slate-200/60 bg-white animate-slide-up">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">{experiment.title}</h3>
            
            <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
               <h4 className="font-bold text-slate-800 mb-2 flex items-center">
                 <span className="mr-2">📋</span> Instructions
               </h4>
               <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                 {experiment.instructions}
               </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setExperiment(null)}
                className="btn btn-secondary flex-1 py-4 text-lg"
              >
                Back
              </button>
              <button 
                onClick={handleLaunch}
                className="btn btn-primary flex-[2] py-4 text-lg shadow-lg shadow-brand-500/20 hover:scale-[1.01] active:scale-95 transition-all"
              >
                Launch Experiment
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-brand-50 rounded-2xl border border-brand-100">
          <h4 className="font-bold text-brand-900 mb-2">How it works</h4>
          <p className="text-sm text-brand-800 opacity-80 leading-relaxed">Ensure you are in a quiet environment. Follow all on-screen speed and accuracy instructions.</p>
        </div>
        <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
          <h4 className="font-bold text-indigo-900 mb-2">Your Privacy</h4>
          <p className="text-sm text-indigo-800 opacity-80 leading-relaxed">Responses are anonymized. We do not store personally identifiable info with your task results.</p>
        </div>
      </div>
    </div>
  );
};

export default JoinExperiment;
