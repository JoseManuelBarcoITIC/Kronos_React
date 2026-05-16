import React from 'react';

export function StatCard({ icon, label, value, color, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-6 hover:shadow-md transition-all text-left group"
    >
      <div className={`${color} p-4 rounded-lg shadow-sm group-hover:scale-105 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 leading-none">{label}</p>
        <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
    </button>
  );
}