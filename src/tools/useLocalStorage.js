import { useState, useEffect } from 'react';

/**
 * const [theme, setTheme] = useLocalStraoge("theme", "dark") would set {"theme":"dark"} in local storage
 * and provide a setter function, setTheme, to change the value.
 *
 * @param {*} key The name of the key that will be written in local storage
 * @param {*} defaultValue When we read the local storage data, if the local storage data doesn't exist,
 * use the defaultValue as the value
 * @returns Returns the value of the data in localStorage and the setter function to re-write that value
 */

function useLocalStorage(key, defaultValue) {   // if a value is stored already, we use that, otherwise we use the default value
  const [value, setValue] = useState(() => {
    let currentValue;
    try {
      currentValue = JSON.parse(localStorage.getItem(key)); // try reading the value from local storage
    } catch (error) {
      currentValue = defaultValue; // if it doesn't exist use the default value
    }

    return currentValue;
  });

  // TODO: understand this?
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}

export default useLocalStorage;

// more info on this hook: https://designcode.io/react-hooks-handbook-uselocalstorage-hook