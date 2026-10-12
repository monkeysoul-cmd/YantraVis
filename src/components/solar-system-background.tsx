'use client';

import React, { useEffect, useRef } from 'react';

// Star definition for ultra-crisp HD astronomical starfield
interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  depth: number;
  type: 'dust' | 'steady' | 'diamond';
  // Natural diamond sparkle scintillation state
  sparkleActive: boolean;
  sparkleTimer: number;      // countdown in seconds until next scintillation
  sparkleDuration: number;   // total duration of scintillation (~0.4s - 0.8s)
  sparkleElapsed: number;    // elapsed time in current scintillation
  sparklePeak: number;       // peak flare length
}

// Shooting star / meteor definition (ultra-fast, razor-sharp white streak)
interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  life: number;
  maxLife: number;
  thickness: number;
}

export default function SolarSystemBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Smooth subtle parallax tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let mouseTicking = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (mouseTicking) return;
      mouseTicking = true;
      requestAnimationFrame(() => {
        const halfW = window.innerWidth / 2;
        const halfH = window.innerHeight / 2;
        targetMouseX = (e.clientX - halfW) / halfW;
        targetMouseY = (e.clientY - halfH) / halfH;
        mouseTicking = false;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let stars: Star[] = [];
    let meteors: Meteor[] = [];
    const margin = 24;

    // Offscreen canvas for pre-rendered static stars (65% stardust + 23% steady stars)
    let staticCanvas: HTMLCanvasElement | null = null;
    let staticCtx: CanvasRenderingContext2D | null = null;

    // Initialize stars with high efficiency: static stars cached once, only sparkling diamond stars animated
    const initStars = () => {
      stars = [];
      const totalArea = width * height;
      const count = Math.min(420, Math.max(200, Math.floor(totalArea / 3200)));

      if (!staticCanvas) {
        staticCanvas = document.createElement('canvas');
      }
      staticCanvas.width = Math.ceil(width + margin * 2);
      staticCanvas.height = Math.ceil(height + margin * 2);
      staticCtx = staticCanvas.getContext('2d');
      if (staticCtx) {
        staticCtx.clearRect(0, 0, staticCanvas.width, staticCanvas.height);
      }

      for (let i = 0; i < count; i++) {
        const rand = Math.random();
        const sx = Math.random() * (width + margin * 2);
        const sy = Math.random() * (height + margin * 2);

        if (rand < 0.65) {
          // Distant Celestial Stardust (baked into static texture)
          const radius = 0.35 + Math.random() * 0.45;
          const alpha = 0.45 + Math.random() * 0.45;
          if (staticCtx) {
            staticCtx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            staticCtx.beginPath();
            staticCtx.arc(sx, sy, radius, 0, Math.PI * 2);
            staticCtx.fill();
          }
        } else if (rand < 0.88) {
          // Mid-Field Stars (baked into static texture)
          const radius = 0.75 + Math.random() * 0.45;
          const alpha = 0.75 + Math.random() * 0.22;
          if (staticCtx) {
            staticCtx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            staticCtx.beginPath();
            staticCtx.arc(sx, sy, radius, 0, Math.PI * 2);
            staticCtx.fill();
          }
        } else {
          // Prominent Diamond Stars (only ~12% = ~25 stars animated for scintillation)
          const radius = 1.3 + Math.random() * 0.65;
          stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius,
            baseAlpha: 0.9 + Math.random() * 0.1,
            alpha: 0.95,
            depth: 8 + Math.random() * 5,
            type: 'diamond',
            sparkleActive: false,
            sparkleTimer: 0.5 + Math.random() * 3.5,
            sparkleDuration: 0.4 + Math.random() * 0.4,
            sparkleElapsed: 0,
            sparklePeak: 4.5 + Math.random() * 5.0,
          });
        }
      }
    };

    // Debounced and DPR-capped canvas scaling (1.5 max for performance)
    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      initStars();
    };

    handleResize();

    // Spawn razor-sharp shooting star (meteor)
    let lastMeteorTime = Date.now();
    const spawnMeteor = () => {
      const startX = Math.random() * width * 0.8 + width * 0.1;
      const startY = Math.random() * (height * 0.3);
      meteors.push({
        x: startX,
        y: startY,
        length: 90 + Math.random() * 110,
        speed: 24 + Math.random() * 12,
        angle: (Math.PI / 4) + (Math.random() * 0.15 - 0.075),
        life: 0,
        maxLife: 0.5 + Math.random() * 0.35,
        thickness: 1.0 + Math.random() * 0.8,
      });
    };

    let lastTime = performance.now();
    let isRunning = true;

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Smooth subtle parallax easing
      currentMouseX += (targetMouseX - currentMouseX) * 0.035;
      currentMouseY += (targetMouseY - currentMouseY) * 0.035;

      // Pure pitch-black deep space background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // ──────────────────────────────────────────────────────────
      // 1. FAST SINGLE BLIT OF CACHED STATIC STARFIELD
      // ──────────────────────────────────────────────────────────
      if (staticCanvas) {
        ctx.drawImage(
          staticCanvas,
          -margin + currentMouseX * 3.5,
          -margin + currentMouseY * 3.5
        );
      }

      // ──────────────────────────────────────────────────────────
      // 2. PROMINENT DIAMOND STARS (Clear, Brilliant, Realistic Sparkle)
      // ──────────────────────────────────────────────────────────
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        if (star.type !== 'diamond') continue;

        const px = star.x + currentMouseX * star.depth;
        const py = star.y + currentMouseY * star.depth;

        // Sparkle lifecycle management
        let flareProgress = 0;

        if (star.sparkleActive) {
          star.sparkleElapsed += delta;
          const t = star.sparkleElapsed / star.sparkleDuration;
          if (t >= 1) {
            star.sparkleActive = false;
            star.sparkleTimer = 1.5 + Math.random() * 4.5;
            star.sparkleElapsed = 0;
            flareProgress = 0;
          } else {
            flareProgress = Math.sin(t * Math.PI);
          }
        } else {
          star.sparkleTimer -= delta;
          if (star.sparkleTimer <= 0) {
            star.sparkleActive = true;
            star.sparkleDuration = 0.35 + Math.random() * 0.45;
            star.sparkleElapsed = 0;
            flareProgress = 0;
          }
        }

        // Base brilliant diamond core
        const currentRadius = star.radius + flareProgress * 0.45;
        const currentAlpha = Math.min(1.0, star.baseAlpha + flareProgress * 0.15);

        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(px, py, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // Needle spikes during sparkle flare
        if (flareProgress > 0.05) {
          const spikeLen = star.sparklePeak * flareProgress;
          const spikeAlpha = flareProgress * 0.85;

          ctx.save();
          ctx.strokeStyle = `rgba(255, 255, 255, ${spikeAlpha})`;
          ctx.lineWidth = 0.5;
          ctx.lineCap = 'round';

          ctx.beginPath();
          ctx.moveTo(px - spikeLen, py);
          ctx.lineTo(px + spikeLen, py);
          ctx.moveTo(px, py - spikeLen);
          ctx.lineTo(px, py + spikeLen);
          ctx.stroke();

          if (flareProgress > 0.4) {
            const diagLen = spikeLen * 0.55;
            ctx.strokeStyle = `rgba(255, 255, 255, ${spikeAlpha * 0.55})`;
            ctx.lineWidth = 0.35;
            ctx.beginPath();
            ctx.moveTo(px - diagLen, py - diagLen);
            ctx.lineTo(px + diagLen, py + diagLen);
            ctx.moveTo(px - diagLen, py + diagLen);
            ctx.lineTo(px + diagLen, py - diagLen);
            ctx.stroke();
          }

          ctx.restore();
        }
      }

      // ──────────────────────────────────────────────────────────
      // 3. ULTRA-FAST REALISTIC METEORS (Razor-sharp white streaks)
      // ──────────────────────────────────────────────────────────
      const now = Date.now();
      if (now - lastMeteorTime > 7000 + Math.random() * 6000) {
        spawnMeteor();
        lastMeteorTime = now;
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.life += delta;
        const lifeNorm = m.life / m.maxLife;

        if (lifeNorm >= 1) {
          meteors.splice(i, 1);
          continue;
        }

        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;

        const opacity = Math.sin(lifeNorm * Math.PI) * 0.95;
        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
        grad.addColorStop(0.2, `rgba(255, 255, 255, ${opacity * 0.6})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.save();
        ctx.strokeStyle = grad;
        ctx.lineWidth = m.thickness;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.thickness * 1.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (isRunning) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // Pause RAF loop when tab is hidden to save 100% background GPU/CPU
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
      } else if (!isRunning) {
        isRunning = true;
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Debounced window resize
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onWindowResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 50);
    };

    window.addEventListener('resize', onWindowResize);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none bg-black" 
      aria-hidden="true"
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
