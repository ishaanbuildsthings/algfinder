import { useState, useEffect } from 'react';


/* const [theme, setTheme] = useLocalStraoge("theme", "dark") would set {"theme":"dark"} in local storage
and provide a setter function, setTheme, to change the value */
function useLocalStorage(key, defaultValue) {
  // if something is stored already, value is set to that, otherwise it's set to the default value
  const [value, setValue] = useState(() => {
    let currentValue;
    try {
      currentValue = JSON.parse(
        localStorage.getItem(key) || String(defaultValue)
      );
    } catch (error) {
      currentValue = defaultValue;
    }

    return currentValue;
  });

  // ! understand this?
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  // after creating [value, setValue] above, we return it to the function
  return [value, setValue];
}

export default useLocalStorage;

// more info on this hook: https://designcode.io/react-hooks-handbook-uselocalstorage-hook