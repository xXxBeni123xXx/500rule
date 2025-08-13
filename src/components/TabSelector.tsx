import { motion } from 'framer-motion';
import { Camera, Calculator } from 'lucide-react';

interface TabSelectorProps {
  activeTab: 'guided' | 'manual';
  onTabChange: (tab: 'guided' | 'manual') => void;
}

export default function TabSelector({ activeTab, onTabChange }: TabSelectorProps) {
  return (
    <div className="flex gap-2 p-1 bg-white/10 backdrop-blur-lg rounded-xl">
      <button
        onClick={() => onTabChange('guided')}
        className={`relative flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
          activeTab === 'guided'
            ? 'text-white'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        {activeTab === 'guided' && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"
            transition={{ type: "spring", duration: 0.5 }}
          />
        )}
        <Camera className="h-5 w-5 relative z-10" />
        <span className="relative z-10">Guided Mode</span>
      </button>
      
      <button
        onClick={() => onTabChange('manual')}
        className={`relative flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
          activeTab === 'manual'
            ? 'text-white'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        {activeTab === 'manual' && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"
            transition={{ type: "spring", duration: 0.5 }}
          />
        )}
        <Calculator className="h-5 w-5 relative z-10" />
        <span className="relative z-10">Manual Calculator</span>
      </button>
    </div>
  );
}