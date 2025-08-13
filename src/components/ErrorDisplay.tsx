import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export function ErrorDisplay() {
  const { state } = useAppContext();

  if (!state.error) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-xl p-4"
    >
      <div className="flex items-center gap-2 text-red-400">
        <Info className="h-5 w-5" />
        <span>{state.error}</span>
      </div>
    </motion.div>
  );
}