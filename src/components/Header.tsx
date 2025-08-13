import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export function Header() {
  return (
    <header className="relative z-10 text-center py-12">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Star className="h-8 w-8 text-yellow-400" />
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AstroCalc Pro
          </h1>
          <Star className="h-8 w-8 text-yellow-400" />
        </div>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto px-4">
          Professional astrophotography exposure calculator with smart camera-lens compatibility
        </p>
      </motion.div>
    </header>
  );
}