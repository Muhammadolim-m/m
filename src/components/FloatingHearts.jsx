import { useEffect, useRef, memo } from 'react';

// Romantic Luxury Palette
const COLORS = [
  { r: 247, g: 205, b: 219 }, // Soft blush
  { r: 235, g: 174, b: 196 }, // Romantic rose pink
  { r: 214, g: 74,  b: 105 }, // Velvet rose red
  { r: 245, g: 226, b: 185 }, // Champagne gold
  { r: 255, g: 253, b: 248 }, // Cream pearl
  { r: 223, g: 194, b: 126 }, // Light gold
];

/**
 * FloatingHearts - High-Performance Romantic Ambient Canvas
 * Renders floating semi-translucent glowing hearts, drifting flower petals,
 * and warm champagne light sparkles with responsive interaction.
 */
const FloatingHearts = ({ triggerBurst }) => {
  const canvasRef = useRef(null);
  const elementsRef = useRef([]);
  const burstParticlesRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const animFrameIdRef = useRef(null);

  // Helper: Draw a smooth vector heart on canvas
  const drawHeart = (ctx, x, y, size, color, alpha, rotation = 0) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.beginPath();
    const topCurveHeight = size * 0.32;
    ctx.moveTo(0, topCurveHeight);
    // Left lobe
    ctx.bezierCurveTo(
      -size / 2, -topCurveHeight,
      -size, size / 3,
      0, size
    );
    // Right lobe
    ctx.bezierCurveTo(
      size, size / 3,
      size / 2, -topCurveHeight,
      0, topCurveHeight
    );
    ctx.closePath();

    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
    ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${Math.min(alpha * 0.7, 0.45)})`;
    ctx.shadowBlur = size * 0.4;
    ctx.fill();
    ctx.restore();
  };

  // Helper: Draw a gentle botanical petal on canvas
  const drawPetal = (ctx, x, y, size, color, alpha, rotation = 0) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.bezierCurveTo(size * 0.7, -size * 0.55, size * 0.7, size * 0.65, 0, size);
    ctx.bezierCurveTo(-size * 0.7, size * 0.65, -size * 0.7, -size * 0.55, 0, -size);
    ctx.closePath();

    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
    ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${Math.min(alpha * 0.5, 0.3)})`;
    ctx.shadowBlur = size * 0.35;
    ctx.fill();
    ctx.restore();
  };

  // Helper: Draw a delicate twinkling star/sparkle
  const drawSparkle = (ctx, x, y, size, color, alpha) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
    ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.9})`;
    ctx.shadowBlur = size * 1.5;
    ctx.fill();

    // 4-point subtle star spikes
    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.8})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-size, 0); ctx.lineTo(size, 0);
    ctx.moveTo(0, -size); ctx.lineTo(0, size);
    ctx.stroke();
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    let dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Populate ambient particles
    const count = Math.min(Math.floor(width / 24), 55);
    elementsRef.current = Array.from({ length: count }, (_, i) => {
      const typeChoice = i % 3; // 0 = heart, 1 = petal, 2 = sparkle
      return {
        type: typeChoice === 0 ? 'heart' : typeChoice === 1 ? 'petal' : 'sparkle',
        x: Math.random() * width,
        y: Math.random() * height,
        size: typeChoice === 2 ? Math.random() * 4 + 2 : Math.random() * 14 + 8,
        speedY: typeChoice === 1 ? Math.random() * 0.5 + 0.3 : -(Math.random() * 0.6 + 0.3),
        speedX: (Math.random() - 0.5) * 0.3,
        swaySpeed: Math.random() * 0.015 + 0.008,
        swayDist: Math.random() * 2 + 1,
        swayOffset: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.45 + 0.18,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 0.6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        pulse: Math.random() * Math.PI,
      };
    });

    // Helper: spawn explosion of particles
    const spawnBurst = (x, y, count = 28) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4.5 + 1.2;
        const typeChoice = Math.random() > 0.4 ? 'heart' : 'sparkle';
        burstParticlesRef.current.push({
          type: typeChoice,
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2,
          size: typeChoice === 'sparkle' ? Math.random() * 5 + 3 : Math.random() * 14 + 7,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          alpha: 1,
          decay: Math.random() * 0.018 + 0.009,
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 8,
          gravity: 0.05,
        });
      }
    };

    // User touch or mouse interaction
    const handlePointerDown = (e) => {
      // Avoid bursting if clicking an input, button, or link
      if (e.target.closest('button') || e.target.closest('input') || e.target.closest('a') || e.target.closest('.romantic-video')) {
        return;
      }
      spawnBurst(e.clientX, e.clientY, 18);
    };

    const handlePointerMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handlePointerLeave);

    // Animation Loop
    let tick = 0;
    let isHidden = false;

    const handleVisibility = () => {
      isHidden = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const render = () => {
      if (!isHidden) {
        ctx.clearRect(0, 0, width, height);
        tick += 0.015;

        // 1. Render Ambient Floating Particles
        elementsRef.current.forEach((el) => {
          el.y += el.speedY;
          el.x += Math.sin(tick + el.swayOffset) * el.swayDist * 0.5 + el.speedX;
          el.rotation += el.rotSpeed;
          el.pulse += 0.03;

          // Gentle mouse wind deflection
          if (mouseRef.current.active) {
            const dx = el.x - mouseRef.current.x;
            const dy = el.y - mouseRef.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              const force = (120 - dist) / 120;
              el.x += (dx / dist) * force * 1.5;
              el.y += (dy / dist) * force * 1.5;
            }
          }

          // Boundary reset
          if (el.speedY < 0 && el.y < -40) {
            el.y = height + 30;
            el.x = Math.random() * width;
          } else if (el.speedY > 0 && el.y > height + 40) {
            el.y = -30;
            el.x = Math.random() * width;
          }

          if (el.x < -30) el.x = width + 20;
          if (el.x > width + 30) el.x = -20;

          const currentAlpha = el.opacity * (0.8 + Math.sin(el.pulse) * 0.2);

          if (el.type === 'heart') {
            const currentSize = el.size * (1 + Math.sin(el.pulse) * 0.07);
            drawHeart(ctx, el.x, el.y, currentSize, el.color, currentAlpha, el.rotation);
          } else if (el.type === 'petal') {
            drawPetal(ctx, el.x, el.y, el.size, el.color, currentAlpha, el.rotation);
          } else {
            drawSparkle(ctx, el.x, el.y, el.size, el.color, currentAlpha);
          }
        });

        // 2. Render Burst Particles
        for (let i = burstParticlesRef.current.length - 1; i >= 0; i--) {
          const p = burstParticlesRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.vx *= 0.985;
          p.rotation += p.rotSpeed;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            burstParticlesRef.current.splice(i, 1);
            continue;
          }

          if (p.type === 'heart') {
            drawHeart(ctx, p.x, p.y, p.size, p.color, Math.max(0, p.alpha), p.rotation);
          } else {
            drawSparkle(ctx, p.x, p.y, p.size, p.color, Math.max(0, p.alpha));
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Trigger Burst externally (e.g., when opening envelope or clicking Heart button)
  useEffect(() => {
    if (!triggerBurst || !canvasRef.current) return;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5.5 + 2.0;
      burstParticlesRef.current.push({
        type: Math.random() > 0.4 ? 'heart' : 'sparkle',
        x: centerX + (Math.random() - 0.5) * 120,
        y: centerY + (Math.random() - 0.5) * 100,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.8,
        size: Math.random() * 15 + 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 1,
        decay: Math.random() * 0.014 + 0.008,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.05,
      });
    }
  }, [triggerBurst]);

  return (
    <canvas
      ref={canvasRef}
      className="floating-hearts-canvas"
      aria-hidden="true"
    />
  );
};

export default memo(FloatingHearts);
