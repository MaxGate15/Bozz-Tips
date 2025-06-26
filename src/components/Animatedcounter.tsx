import React, { useEffect, useState } from 'react';

interface CounterProps {
  target: number;
  duration?: number; // in ms
}

const AnimatedCounter: React.FC<CounterProps> = ({ target, duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16); // 16ms per frame (about 60fps)
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count.toLocaleString()}</span>;
};

export default AnimatedCounter;