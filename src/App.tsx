import { AppProvider } from './contexts/AppContext';
import { useDataFetching } from './hooks/useDataFetching';
import { Header } from './components/Header';
import { BackgroundStars } from './components/BackgroundStars';
import { TabNavigation } from './components/TabNavigation';
import { ErrorDisplay } from './components/ErrorDisplay';
import { GuidedMode } from './components/GuidedMode';
import { ManualMode } from './components/ManualMode';

function AppContent() {
  // Initialize data fetching
  useDataFetching();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background stars */}
      <BackgroundStars />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 pb-12">
        
        {/* Tab Navigation */}
        <TabNavigation />
        
        {/* Error Display */}
        <ErrorDisplay />

        {/* Tab Content */}
        <GuidedMode />
        <ManualMode />
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App; 