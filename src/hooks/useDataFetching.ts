import { useEffect, useCallback } from 'react';
import { useAppContext, appActions } from '../contexts/AppContext';
import { fetchCameras, fetchCompatibleLenses } from '../services/api';

export function useDataFetching() {
  const { state, dispatch } = useAppContext();

  // Load cameras on mount
  const loadCameras = useCallback(async () => {
    try {
      dispatch(appActions.setLoading(true));
      dispatch(appActions.setError(null));
      
      const cameraData = await fetchCameras();
      dispatch(appActions.setAllCameras(cameraData));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load cameras';
      dispatch(appActions.setError(errorMessage));
      console.error('Error loading cameras:', err);
    } finally {
      dispatch(appActions.setLoading(false));
    }
  }, [dispatch]);

  // Load compatible lenses when camera changes
  const loadCompatibleLenses = useCallback(async (cameraId: string) => {
    try {
      dispatch(appActions.setLoading(true));
      
      const lensData = await fetchCompatibleLenses(cameraId);
      dispatch(appActions.setAllCompatibleLenses(lensData));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load lenses';
      dispatch(appActions.setError(errorMessage));
      console.error('Error loading lenses:', err);
    } finally {
      dispatch(appActions.setLoading(false));
    }
  }, [dispatch]);

  // Load cameras on mount
  useEffect(() => {
    loadCameras();
  }, [loadCameras]);

  // Load compatible lenses when camera changes
  useEffect(() => {
    if (state.selectedCamera) {
      loadCompatibleLenses(state.selectedCamera.id);
    } else {
      dispatch(appActions.setAllCompatibleLenses([]));
      dispatch(appActions.setSelectedLens(null));
    }
  }, [state.selectedCamera, loadCompatibleLenses, dispatch]);

  // Update focal length when lens changes
  useEffect(() => {
    if (state.selectedLens) {
      // This logic will be moved to a utility function
      const focalLength = state.selectedLens.focal_length;
      if (focalLength) {
        // Simple parsing for now - will be improved
        const parsed = parseInt(focalLength);
        if (!isNaN(parsed)) {
          dispatch(appActions.setCurrentFocalLength(parsed));
        }
      }
      dispatch(appActions.setManualFocalLength(null));
    }
  }, [state.selectedLens, dispatch]);

  return {
    loadCameras,
    loadCompatibleLenses,
  };
}