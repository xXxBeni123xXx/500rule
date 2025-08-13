import { useAppContext, appActions } from '../contexts/AppContext';

export function TabNavigation() {
  const { state, dispatch } = useAppContext();

  const handleTabChange = (tab: 'guided' | 'manual') => {
    dispatch(appActions.setActiveTab(tab));
  };

  return (
    <div className="flex justify-center mb-8">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-1 flex">
        <button
          onClick={() => handleTabChange('guided')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            state.activeTab === 'guided'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          📸 Guided Selection
        </button>
        <button
          onClick={() => handleTabChange('manual')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            state.activeTab === 'manual'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          ⚙️ Manual Parameters
        </button>
      </div>
    </div>
  );
}