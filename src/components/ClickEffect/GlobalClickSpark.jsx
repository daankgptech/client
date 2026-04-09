import { useRef, useEffect } from "react";

const MAX_SPARKS = 200; // pool limit

const GlobalClickSpark = ({
  sparkColor = "#ef4444",
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
}) => {
  const canvasRef = useRef(null);
  const sparks = useRef(new Array(MAX_SPARKS).fill(null));
  const activeCount = useRef(0);
  const running = useRef(false);

  // ✅ Resize + DPR scaling
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ✅ Animation loop (only runs when needed)
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let raf;

    const animate = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let stillActive = 0;

      for (let i = 0; i < activeCount.current; i++) {
        const s = sparks.current[i];
        if (!s) continue;

        const elapsed = t - s.start;
        if (elapsed >= duration) continue;

        const p = elapsed / duration;
        const ease = 1 - (1 - p) * (1 - p); // ease-out

        const dist = ease * sparkRadius;
        const len = sparkSize * (1 - ease);

        const x1 = s.x + dist * s.cos;
        const y1 = s.y + dist * s.sin;
        const x2 = s.x + (dist + len) * s.cos;
        const y2 = s.y + (dist + len) * s.sin;

        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        sparks.current[stillActive++] = s;
      }

      activeCount.current = stillActive;

      if (stillActive > 0) {
        raf = requestAnimationFrame(animate);
      } else {
        running.current = false; // 🧠 stop loop when idle
      }
    };

    const start = () => {
      if (!running.current) {
        running.current = true;
        requestAnimationFrame(animate);
      }
    };

    const handleClick = (e) => {
      const now = performance.now();

      for (let i = 0; i < sparkCount; i++) {
        if (activeCount.current >= MAX_SPARKS) break;

        const angle = (2 * Math.PI * i) / sparkCount;

        sparks.current[activeCount.current++] = {
          x: e.clientX,
          y: e.clientY,
          cos: Math.cos(angle),
          sin: Math.sin(angle),
          start: now,
        };
      }

      start();
    };

    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(raf);
    };
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration]);

  return (
    <canvas className="fixed inset-0 pointer-events-none z-[9999]" ref={canvasRef} />
  );
};

export default GlobalClickSpark;