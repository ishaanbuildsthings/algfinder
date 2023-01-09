import { useState, useEffect } from 'react';

function UseWindowSize() {
  const [windowSize, setWindowSize] = useState({ width: window.width }); // lets us access width or height later if we need

  useEffect(() => {
    // when the handler is triggered, change the state
    function handleResize() {
      setWindowSize({ width: window.innerWidth });
    }

    // 'resize' is a premade option that applies when the window is resized
    window.addEventListener('resize', handleResize);
    // update the state via the handler
    handleResize();
    // Return a function that removes the event listener upon dismount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export default UseWindowSize;
