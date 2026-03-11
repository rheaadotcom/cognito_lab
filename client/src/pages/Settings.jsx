import React from 'react';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="px-1">
        <h3 className="text-xl font-bold text-slate-800">Account Settings</h3>
        <p className="text-slate-500 text-sm mt-1">Manage your lab profile, institutional details, and security preferences.</p>
      </div>
      
      <div className="card max-w-2xl">
         <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="form-group mb-0">
                  <label>Full Name</label>
                  <input type="text" readOnly value="Dr. Researcher" className="bg-slate-50" />
               </div>
               <div className="form-group mb-0">
                  <label>Institutional Email</label>
                  <input type="email" readOnly value="researcher@university.edu" className="bg-slate-50" />
               </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100 flex justify-end">
               <button className="btn btn-secondary mr-3" disabled>Cancel</button>
               <button className="btn btn-primary" disabled>Save Changes</button>
            </div>
            
            <p className="text-xs text-slate-400 italic">Settings module is currently under construction. Please contact support for critical account changes.</p>
         </div>
      </div>
    </div>
  );
};

export default Settings;
