import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'researcher' // Default to researcher for the primary CTA
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await signup(formData);
      if (result.success) {
        navigate(result.user.role === 'researcher' ? '/dashboard' : '/join-experiment');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Server error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-surface-light relative pt-12 pb-20">
      
      {/* Background Decorators */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-brand-50 to-transparent pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Start Your Lab</h2>
          <p className="text-slate-500 mt-2 text-lg">Create a researcher account to build studies</p>
        </div>

        <div className="card p-8 sm:p-10 shadow-soft-lg border-slate-200/60 bg-white/80 backdrop-blur-xl relative overflow-hidden">
          {/* Top colored accent bar */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-500 to-indigo-500"></div>

          <form onSubmit={handleSubmit} className="space-y-5 mt-2">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-shake">
                {error}
              </div>
            )}

            {/* Role Selector */}
            <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'researcher' })}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                  formData.role === 'researcher' 
                    ? 'bg-white text-brand-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Researcher
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'participant' })}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                  formData.role === 'participant' 
                    ? 'bg-white text-brand-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Participant
              </button>
            </div>

            <div className="form-group mb-0">
              <label className="text-slate-700 font-semibold">
                {formData.role === 'researcher' ? 'Principal Investigator Name' : 'Full Name'}
              </label>
              <input 
                type="text" 
                name="name" 
                placeholder="Dr. Jane Doe"
                value={formData.name} 
                onChange={handleChange} 
                className="mt-1"
                required 
                disabled={loading}
              />
            </div>
            
            <div className="form-group mb-0">
              <label className="text-slate-700 font-semibold">Institutional Email</label>
              <input 
                type="email" 
                name="email" 
                placeholder="jane@university.edu"
                value={formData.email} 
                onChange={handleChange} 
                className="mt-1"
                required 
                disabled={loading}
              />
            </div>
            
            <div className="form-group mb-0">
              <label className="text-slate-700 font-semibold">Secure Password</label>
              <input 
                type="password" 
                name="password" 
                placeholder="Create a strong password"
                value={formData.password} 
                onChange={handleChange} 
                className="mt-1"
                required 
                minLength="6" 
                disabled={loading}
              />
              <p className="text-xs text-slate-500 mt-2 font-medium">Must be at least 6 characters.</p>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full py-3 text-base mt-4 shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Initializing Lab...
                </span>
              ) : (formData.role === 'researcher' ? 'Create Research Account' : 'Join as Participant')}
            </button>
            <p className="text-xs text-slate-500 text-center mt-4">By creating an account, you agree to our Terms of Service.</p>
          </form>
        </div>
        
        <p className="text-center mt-8 text-slate-600">
          Already a primary investigator?{' '}
          <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-700 hover:underline underline-offset-4">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
