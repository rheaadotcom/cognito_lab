import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Layout Components
import Navbar from './components/Navbar';
import DashboardLayout from './components/DashboardLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ResearcherDashboard from './pages/ResearcherDashboard';
import CreateExperiment from './pages/CreateExperiment';
import RunExperiment from './pages/RunExperiment';
import ResultsDashboard from './pages/ResultsDashboard';
import Experiments from './pages/Experiments';
import Results from './pages/Results';
import Settings from './pages/Settings';
import JoinExperiment from './pages/JoinExperiment';

// Custom component to handle layout conditionally 
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isPublicRoute = ['/', '/login', '/register', '/join-experiment'].includes(location.pathname);
  const isParticipantRoute = location.pathname.includes('/run') || location.pathname.includes('/experiment/');

  if (isParticipantRoute) {
    return <main className="bg-white min-h-screen">{children}</main>;
  }

  if (isPublicRoute) {
    return (
      <div className="min-h-screen bg-surface-light flex flex-col">
        <Navbar />
        <main className="flex-1 w-full">
          {children}
        </main>
      </div>
    );
  }

  // Dashboard Routes get the new Reusable Dark Layout
  return <DashboardLayout>{children}</DashboardLayout>;
};

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/join-experiment" element={<JoinExperiment />} />
          
          {/* Researcher Dashboard Routes */}
          <Route path="/dashboard" element={<ResearcherDashboard />} />
          <Route path="/experiments" element={<Experiments />} />
          <Route path="/create-experiment" element={<CreateExperiment />} />
          <Route path="/results" element={<ResultsDashboard />} />
          <Route path="/results/:id" element={<ResultsDashboard />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Participant Route */}
          <Route path="/experiment/:id/run" element={<RunExperiment />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
