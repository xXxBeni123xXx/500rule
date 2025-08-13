import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Camera, Lens as LensType } from '../services/api';
import { RuleConstant } from '../utils/astro';

// State interface
export interface AppState {
  // Camera and lens selection
  selectedCamera: Camera | null;
  selectedLens: LensType | null;
  currentFocalLength: number;
  manualFocalLength: number | null;
  
  // Rule settings
  ruleConstant: RuleConstant;
  
  // Search filters
  cameraSearchTerm: string;
  lensSearchTerm: string;
  
  // Manual parameters
  manualCropFactor: number;
  manualFocalLengthParam: number;
  manualRule: RuleConstant;
  
  // Data
  allCameras: Camera[];
  allCompatibleLenses: LensType[];
  
  // UI state
  loading: boolean;
  error: string | null;
  activeTab: 'guided' | 'manual';
  
  // Tooltip states
  showRuleTooltip: boolean;
  showTrailTooltip: boolean;
}

// Action types
export type AppAction =
  | { type: 'SET_SELECTED_CAMERA'; payload: Camera | null }
  | { type: 'SET_SELECTED_LENS'; payload: LensType | null }
  | { type: 'SET_CURRENT_FOCAL_LENGTH'; payload: number }
  | { type: 'SET_MANUAL_FOCAL_LENGTH'; payload: number | null }
  | { type: 'SET_RULE_CONSTANT'; payload: RuleConstant }
  | { type: 'SET_CAMERA_SEARCH_TERM'; payload: string }
  | { type: 'SET_LENS_SEARCH_TERM'; payload: string }
  | { type: 'SET_MANUAL_CROP_FACTOR'; payload: number }
  | { type: 'SET_MANUAL_FOCAL_LENGTH_PARAM'; payload: number }
  | { type: 'SET_MANUAL_RULE'; payload: RuleConstant }
  | { type: 'SET_ALL_CAMERAS'; payload: Camera[] }
  | { type: 'SET_ALL_COMPATIBLE_LENSES'; payload: LensType[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ACTIVE_TAB'; payload: 'guided' | 'manual' }
  | { type: 'SET_SHOW_RULE_TOOLTIP'; payload: boolean }
  | { type: 'SET_SHOW_TRAIL_TOOLTIP'; payload: boolean }
  | { type: 'RESET_STATE' };

// Initial state
const initialState: AppState = {
  selectedCamera: null,
  selectedLens: null,
  currentFocalLength: 24,
  manualFocalLength: null,
  ruleConstant: 500,
  cameraSearchTerm: '',
  lensSearchTerm: '',
  manualCropFactor: 1.5,
  manualFocalLengthParam: 50,
  manualRule: 500,
  allCameras: [],
  allCompatibleLenses: [],
  loading: false,
  error: null,
  activeTab: 'guided',
  showRuleTooltip: false,
  showTrailTooltip: false,
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_SELECTED_CAMERA':
      return {
        ...state,
        selectedCamera: action.payload,
        // Reset lens when camera changes
        selectedLens: null,
        allCompatibleLenses: [],
      };
    
    case 'SET_SELECTED_LENS':
      return {
        ...state,
        selectedLens: action.payload,
        // Reset manual focal length when lens changes
        manualFocalLength: null,
      };
    
    case 'SET_CURRENT_FOCAL_LENGTH':
      return { ...state, currentFocalLength: action.payload };
    
    case 'SET_MANUAL_FOCAL_LENGTH':
      return { ...state, manualFocalLength: action.payload };
    
    case 'SET_RULE_CONSTANT':
      return { ...state, ruleConstant: action.payload };
    
    case 'SET_CAMERA_SEARCH_TERM':
      return { ...state, cameraSearchTerm: action.payload };
    
    case 'SET_LENS_SEARCH_TERM':
      return { ...state, lensSearchTerm: action.payload };
    
    case 'SET_MANUAL_CROP_FACTOR':
      return { ...state, manualCropFactor: action.payload };
    
    case 'SET_MANUAL_FOCAL_LENGTH_PARAM':
      return { ...state, manualFocalLengthParam: action.payload };
    
    case 'SET_MANUAL_RULE':
      return { ...state, manualRule: action.payload };
    
    case 'SET_ALL_CAMERAS':
      return { ...state, allCameras: action.payload };
    
    case 'SET_ALL_COMPATIBLE_LENSES':
      return { ...state, allCompatibleLenses: action.payload };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    
    case 'SET_SHOW_RULE_TOOLTIP':
      return { ...state, showRuleTooltip: action.payload };
    
    case 'SET_SHOW_TRAIL_TOOLTIP':
      return { ...state, showTrailTooltip: action.payload };
    
    case 'RESET_STATE':
      return initialState;
    
    default:
      return state;
  }
}

// Context interface
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// Action creators for easier dispatch calls
export const appActions = {
  setSelectedCamera: (camera: Camera | null) => ({ type: 'SET_SELECTED_CAMERA' as const, payload: camera }),
  setSelectedLens: (lens: LensType | null) => ({ type: 'SET_SELECTED_LENS' as const, payload: lens }),
  setCurrentFocalLength: (length: number) => ({ type: 'SET_CURRENT_FOCAL_LENGTH' as const, payload: length }),
  setManualFocalLength: (length: number | null) => ({ type: 'SET_MANUAL_FOCAL_LENGTH' as const, payload: length }),
  setRuleConstant: (constant: RuleConstant) => ({ type: 'SET_RULE_CONSTANT' as const, payload: constant }),
  setCameraSearchTerm: (term: string) => ({ type: 'SET_CAMERA_SEARCH_TERM' as const, payload: term }),
  setLensSearchTerm: (term: string) => ({ type: 'SET_LENS_SEARCH_TERM' as const, payload: term }),
  setManualCropFactor: (factor: number) => ({ type: 'SET_MANUAL_CROP_FACTOR' as const, payload: factor }),
  setManualFocalLengthParam: (length: number) => ({ type: 'SET_MANUAL_FOCAL_LENGTH_PARAM' as const, payload: length }),
  setManualRule: (rule: RuleConstant) => ({ type: 'SET_MANUAL_RULE' as const, payload: rule }),
  setAllCameras: (cameras: Camera[]) => ({ type: 'SET_ALL_CAMERAS' as const, payload: cameras }),
  setAllCompatibleLenses: (lenses: LensType[]) => ({ type: 'SET_ALL_COMPATIBLE_LENSES' as const, payload: lenses }),
  setLoading: (loading: boolean) => ({ type: 'SET_LOADING' as const, payload: loading }),
  setError: (error: string | null) => ({ type: 'SET_ERROR' as const, payload: error }),
  setActiveTab: (tab: 'guided' | 'manual') => ({ type: 'SET_ACTIVE_TAB' as const, payload: tab }),
  setShowRuleTooltip: (show: boolean) => ({ type: 'SET_SHOW_RULE_TOOLTIP' as const, payload: show }),
  setShowTrailTooltip: (show: boolean) => ({ type: 'SET_SHOW_TRAIL_TOOLTIP' as const, payload: show }),
  resetState: () => ({ type: 'RESET_STATE' as const }),
};