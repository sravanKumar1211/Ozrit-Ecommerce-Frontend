import { useState, useEffect } from "react";

const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => window.clearTimeout(handler);
  }, [value, delay]);

  return debounced;
};

export default useDebounce;
