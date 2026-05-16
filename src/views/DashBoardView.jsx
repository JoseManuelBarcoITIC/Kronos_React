import React from 'react';
import { motion } from 'motion/react';
import { Database, Map, Layers } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import './DashboardView.css';
export function DashboardView({ excavations = [], sectors = [], ues = [], onNavigate }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="dashboard-container"
    >
      <div className="stats-grid">
        <StatCard 
          icon={<Database className="icon-white" size={24} />} 
          label="Sistemas Kronos" 
          value={excavations.length} 
          className="card-dark"
          onClick={() => onNavigate('excavations')}
        />
        <StatCard 
          icon={<Map className="icon-white" size={24} />} 
          label="Sectores" 
          value={sectors.length} 
          className="card-medium"
        />
        <StatCard 
          icon={<Layers className="icon-white" size={24} />} 
          label="Registros Kronos" 
          value={ues.length} 
          className="card-accent"
        />
      </div>
    </motion.div>
  );
}