import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  len: number;
  r: number;
  baseX: number;
  baseY: number;
  floatSpeedX: number;
  floatSpeedY: number;
}

export function SpiderCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const { PI, hypot } = Math;

    function rnd(x = 1, dx = 0) {
      return Math.random() * x + dx;
    }

    function many<T>(n: number, f: (i: number) => T): T[] {
      return [...Array(n)].map((_, i) => f(i));
    }

    // Spawn 250 background stars
    const pts = many(250, () => {
      const baseX = rnd(window.innerWidth);
      const baseY = rnd(window.innerHeight);
      return {
        x: baseX,
        y: baseY,
        baseX,
        baseY,
        len: 0.15, // start at ambient
        r: 1.0,
        floatSpeedX: rnd(0.002, 0.0005),
        floatSpeedY: rnd(0.002, 0.0005),
      };
    });

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;
    let time = 0;

    const handlePointerMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      
      // Re-distribute stars that are out of bounds on resize
      pts.forEach((pt) => {
        if (pt.x > w) pt.x = rnd(w);
        if (pt.y > h) pt.y = rnd(h);
      });
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;

    const anim = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      // Increment time for floating animation
      time += 0.01;

      // Smooth lag behind mouse coordinates for the light focus point
      x += (tx - x) / 10;
      y += (ty - y) / 10;

      pts.forEach((ptObj) => {
        // Apply floating motion using sine and cosine
        ptObj.x = ptObj.baseX + Math.sin(time * ptObj.floatSpeedX) * 30;
        ptObj.y = ptObj.baseY + Math.cos(time * ptObj.floatSpeedY) * 30;

        const dx = ptObj.x - x;
        const dy = ptObj.y - y;
        const len = hypot(dx, dy);
        
        // Continuous gradient: 1.0 at center, fading down to 0.15 ambient at 180px distance
        const radiusLimit = 180;
        let targetLen = 0.15;
        if (len < radiusLimit) {
          targetLen = 0.15 + (1 - len / radiusLimit) * 0.85;
        }

        // Smoothly interpolate current brightness state to target
        ptObj.len += (targetLen - ptObj.len) * 0.08;
        
        // Size grows from 1.0px (ambient) up to 2.2px (glow center)
        ptObj.r = 1.0 + ptObj.len * 1.2;

        // Draw star in Ivory (#F8F5F2)
        ctx.fillStyle = `rgba(248, 245, 242, ${ptObj.len})`;
        ctx.beginPath();
        ctx.ellipse(ptObj.x, ptObj.y, ptObj.r, ptObj.r, 0, 0, PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(anim);
    };

    animationFrameId = requestAnimationFrame(anim);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
