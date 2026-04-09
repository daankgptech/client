import { useEffect, useState, useRef } from "react";

const AnimatedCounter = ({ target = 95, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const end = Number(target) || 0;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;

      const progress = timestamp - startTimeRef.current;
      const progressRatio = Math.min(progress / duration, 1);

      // ease-out effect (feels more natural)
      const eased = 1 - Math.pow(1 - progressRatio, 3);

      const current = Math.floor(eased * end);
      setCount(current);

      if (progressRatio < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    return () => {
      startTimeRef.current = null;
    };
  }, [target, duration]);

  return (
    <div className="text-3xl md:text-4xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white transition-colors duration-200">
      {count}
    </div>
  );
};

export default AnimatedCounter;