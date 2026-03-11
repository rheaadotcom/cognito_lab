import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await login(formData);
      if (result.success) {
        navigate(result.user.role === 'researcher' ? '/dashboard' : '/join-experiment');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-surface-light relative">
      
      {/* Background Decorators */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-brand-50 to-transparent pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex w-16 h-16 bg-brand-600 rounded-2xl items-center justify-center text-white text-3xl font-bold mb-6 shadow-brand-500/30 shadow-lg hover:scale-105 transition-transform">
            C
          </Link>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 mt-2 text-lg">Log in to manage your experiments</p>
        </div>

        <div className="card p-8 sm:p-10 shadow-soft-lg border-slate-200/60 bg-white/80 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-shake text-center">
                {error}
              </div>
            )}

            <div className="form-group mb-0">
              <label className="text-slate-700 font-semibold">Work Email</label>
              <input 
                type="email" 
                name="email" 
                placeholder="dr.smith@university.edu"
                value={formData.email} 
                onChange={handleChange} 
                className="mt-1"
                required 
                disabled={loading}
              />
            </div>
            
            <div className="form-group mb-0">
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-700 font-semibold mb-0">Password</label>
                <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-500">Forgot password?</a>
              </div>
              <input 
                type="password" 
                name="password" 
                placeholder="••••••••"
                value={formData.password} 
                onChange={handleChange} 
                className="mt-1"
                required 
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full py-3 text-base mt-2 shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : 'Log In Securely'}
            </button>
          </form>
        </div>
        
        <p className="text-center mt-8 text-slate-600">
          Don't have a lab account yet?{' '}
          <Link to="/register" className="text-brand-600 font-semibold hover:text-brand-700 hover:underline underline-offset-4">
            Request access
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
