import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="w-full flex-1 flex flex-col bg-white overflow-hidden">
      
      {/* Background Decorators */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-brand-50 to-white pointer-events-none"></div>
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-40 left-0 -ml-20 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 md:pt-32 md:pb-28 text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-brand-100 text-brand-600 text-sm font-semibold mb-8 shadow-sm tracking-wide">
          <span className="flex h-2 w-2 relative mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
          </span>
          The New Standard in Cognitive Research
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tighter leading-[1.1] mb-8 max-w-4xl mx-auto">
          Build, Run, and Analyze <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-brand-600 to-indigo-600">
            Cognitive Experiments
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-500 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
          CognitoLab is a premium SaaS platform designed for researchers. Create web-based psychological tasks in minutes and collect millisecond-accurate reaction time data globally.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
           <Link to="/register" className="btn btn-primary btn-large w-full sm:w-auto shadow-brand-500/25 shadow-xl hover:-translate-y-1 transition-transform duration-300">
             Start Researching Free <span className="ml-2">→</span>
           </Link>
           <Link to="/login" className="btn btn-secondary btn-large w-full sm:w-auto bg-white hover:bg-slate-50 border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
             Log into Dashboard
           </Link>
        </div>
      </section>


      {/* Platform Description / How It Works */}
      <section className="bg-slate-50 py-24 border-y border-slate-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">How it Works</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-16">The fastest way to move your cognitive lab from the basement to the browser.</p>

            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
               <div className="relative">
                  <div className="w-16 h-16 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center text-2xl font-bold text-brand-600 mx-auto mb-6">1</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Design the Study</h3>
                  <p className="text-slate-600 leading-relaxed">Use our intuitive task builder to assemble blocks of stimuli, define correct keyboard mappings, and set exposure durations.</p>
               </div>
               <div className="relative">
                  <div className="w-16 h-16 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center text-2xl font-bold text-brand-600 mx-auto mb-6">2</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Share the Link</h3>
                  <p className="text-slate-600 leading-relaxed">Instantly generate a secure, unique URL. Distribute it via Prolific, MTurk, or email to gather a diverse, global cohort.</p>
               </div>
               <div className="relative">
                  <div className="w-16 h-16 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center text-2xl font-bold text-brand-600 mx-auto mb-6">3</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Analyze Results</h3>
                  <p className="text-slate-600 leading-relaxed">Watch real-time dashboards populate with reaction times and accuracy rates. Export formatted CSV data for immediate analysis.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Built for Precision</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Enterprise-grade architecture ensuring your scientific data is both secure and accurate.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card border border-slate-200 shadow-sm hover:shadow-soft-lg transition-all duration-300 group">
              <div className="w-12 h-12 bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white transition-colors rounded-xl flex items-center justify-center text-2xl mb-6">⏱️</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Sub-Millisecond Timing</h3>
              <p className="text-slate-600 leading-relaxed">Leverages modern browser Performance APIs for the highest possible fidelity in remote reaction time measurement.</p>
            </div>
            
            <div className="card border border-slate-200 shadow-sm hover:shadow-soft-lg transition-all duration-300 group">
              <div className="w-12 h-12 bg-emerald-50 group-hover:bg-emerald-600 text-emerald-600 group-hover:text-white transition-colors rounded-xl flex items-center justify-center text-2xl mb-6">📊</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Automated Analytics</h3>
              <p className="text-slate-600 leading-relaxed">Instantly visualize participant datasets. Export flat CSV structures pre-formatted for import into SPSS, R, or pandas.</p>
            </div>
            
            <div className="card border border-slate-200 shadow-sm hover:shadow-soft-lg transition-all duration-300 group">
              <div className="w-12 h-12 bg-orange-50 group-hover:bg-orange-600 text-orange-600 group-hover:text-white transition-colors rounded-xl flex items-center justify-center text-2xl mb-6">🔒</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Architecture</h3>
              <p className="text-slate-600 leading-relaxed">Encrypted HTTP-only cookie authentication, JWT-protected API routes, and structured MongoDB data isolation.</p>
            </div>

            <div className="card border border-slate-200 shadow-sm hover:shadow-soft-lg transition-all duration-300 group">
              <div className="w-12 h-12 bg-pink-50 group-hover:bg-pink-600 text-pink-600 group-hover:text-white transition-colors rounded-xl flex items-center justify-center text-xl mb-6 font-bold">U/X</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Distraction-Free Runner</h3>
              <p className="text-slate-600 leading-relaxed">Participants experience a completely immersive, full-screen trial view built entirely in modern React.</p>
            </div>

            <div className="card border border-slate-200 shadow-sm hover:shadow-soft-lg transition-all duration-300 group">
              <div className="w-12 h-12 bg-brand-50 group-hover:bg-brand-600 text-brand-600 group-hover:text-white transition-colors rounded-xl flex items-center justify-center text-2xl mb-6">📱</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Fully Responsive</h3>
              <p className="text-slate-600 leading-relaxed">Manage your lab anywhere. The researcher dashboard is optimized for desktops, tablets, and mobile devices.</p>
            </div>

            <div className="card border border-slate-200 shadow-sm hover:shadow-soft-lg transition-all duration-300 group">
              <div className="w-12 h-12 bg-purple-50 group-hover:bg-purple-600 text-purple-600 group-hover:text-white transition-colors rounded-xl flex items-center justify-center text-2xl mb-6">☁️</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Cloud Scalability</h3>
              <p className="text-slate-600 leading-relaxed">Run high-traffic experiments seamlessly. Our Node.js and Express backend handles concurrent participants with ease.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-600/10 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Ready to modernize your lab?</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light">Join forward-thinking researchers building the next generation of cognitive science experiments on CognitoLab.</p>
          <Link to="/register" className="btn btn-primary btn-large shadow-brand-500/25 shadow-xl hover:-translate-y-1 transition-transform duration-300 px-10">
            Create Free Account
          </Link>
          <p className="text-slate-500 mt-6 text-sm">No credit card required. Setup takes 30 seconds.</p>
        </div>
      </section>

    </div>
  );
};

export default Home;
