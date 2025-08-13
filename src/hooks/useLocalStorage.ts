import { useState } from 'react';

/**
 * Custom hook for managing localStorage with type safety
 * @param key - The localStorage key
 * @param initialValue - The initial value
 * @returns [value, setValue] tuple
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (_value: T | ((_val: T) => T)) => void] {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (_error) {
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (_value: T | ((_val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = _value instanceof Function ? _value(storedValue) : _value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (_error) {
      // Silent failure for localStorage issues
    }
  };

  return [storedValue, setValue];
}