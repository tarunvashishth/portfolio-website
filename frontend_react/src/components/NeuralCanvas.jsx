import React, { useEffect, useRef } from 'react';

const LINK_DISTANCE = 140;
const POINTER_RADIUS = 190;

const readPalette = () => {
  const styles = getComputedStyle(document.documentElement);
  return {
    accent: styles.getPropertyValue('--accent-rgb').trim() || '165, 148, 255',
    light: document.documentElement.dataset.theme === 'light',
  };
};

// A drifting constellation of nodes that link up when close and reach for the
// pointer. Pauses off-screen / in background tabs; static for reduced motion.
const NeuralCanvas = ({ className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: 0, y: 0, active: false };
    let palette = readPalette();
    let nodes = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let inView = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(120, Math.max(36, (width * height) / 12500)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        r: Math.random() * 1.4 + 0.7,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const { accent, light } = palette;
      const nodeColor = light ? '18, 18, 22' : '244, 243, 239';

      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DISTANCE) {
            ctx.strokeStyle = `rgba(${accent}, ${(1 - dist / LINK_DISTANCE) * (light ? 0.35 : 0.3)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        if (pointer.active) {
          const dx = a.x - pointer.x;
          const dy = a.y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < POINTER_RADIUS) {
            ctx.strokeStyle = `rgba(${accent}, ${(1 - dist / POINTER_RADIUS) * 0.7})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < nodes.length; i += 1) {
        const n = nodes[i];
        ctx.fillStyle = `rgba(${nodeColor}, ${light ? 0.45 : 0.55})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      for (let i = 0; i < nodes.length; i += 1) {
        const n = nodes[i];
        if (pointer.active) {
          // gentle pull toward the pointer
          const dx = pointer.x - n.x;
          const dy = pointer.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < POINTER_RADIUS && dist > 40) {
            n.vx += (dx / dist) * 0.012;
            n.vy += (dy / dist) * 0.012;
          }
        }
        n.vx *= 0.995;
        n.vy *= 0.995;
        // keep a minimum drift so the field never freezes
        if (Math.abs(n.vx) < 0.05) n.vx += (Math.random() - 0.5) * 0.04;
        if (Math.abs(n.vy) < 0.05) n.vy += (Math.random() - 0.5) * 0.04;
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        n.x = Math.max(0, Math.min(width, n.x));
        n.y = Math.max(0, Math.min(height, n.y));
      }
      draw();
      frame = requestAnimationFrame(step);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (reduceMotion) {
        draw();
        return;
      }
      if (inView && !document.hidden) frame = requestAnimationFrame(step);
    };

    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = pointer.y >= 0 && pointer.y <= rect.height;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };

    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      start();
    });
    const themeObserver = new MutationObserver(() => {
      palette = readPalette();
      if (reduceMotion) draw();
    });
    const resizeObserver = new ResizeObserver(() => {
      resize();
      start();
    });

    resize();
    start();
    visibility.observe(canvas);
    resizeObserver.observe(canvas);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', start);

    return () => {
      cancelAnimationFrame(frame);
      visibility.disconnect();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', start);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};

export default NeuralCanvas;
