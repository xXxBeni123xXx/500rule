import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../contexts/AppContext';
import { CameraPicker } from './CameraPicker';
import { LensPicker } from './LensPicker';
import { ResultsPanel } from './ResultsPanel';

export function GuidedMode() {
  const { state } = useAppContext();

  // Only show when guided tab is active
  if (state.activeTab !== 'guided') {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="guided-mode"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CameraPicker />
        </motion.div>

        <motion.div
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <LensPicker />
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <ResultsPanel />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}