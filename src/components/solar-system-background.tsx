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

    const handleMouseMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      targetMouseX = (e.clientX - halfW) / halfW;
      targetMouseY = (e.clientY - halfH) / halfH;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let stars: Star[] = [];
    let meteors: Meteor[] = [];

    // Initialize stars with realistic astronomical distribution
    const initStars = () => {
      stars = [];
      const totalArea = width * height;
      // High-density crisp star count calibrated for real night sky
      const count = Math.min(650, Math.max(300, Math.floor(totalArea / 2800)));

      for (let i = 0; i < count; i++) {
        const rand = Math.random();
        
        if (rand < 0.65) {
          // 65% Distant Celestial Stardust (pin-point sharp, steady, 0.35px - 0.75px)
          stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: 0.35 + Math.random() * 0.45,
            baseAlpha: 0.45 + Math.random() * 0.45,
            alpha: 0.5,
            depth: 2.5,
            type: 'dust',
            sparkleActive: false,
            sparkleTimer: 0,
            sparkleDuration: 0,
            sparkleElapsed: 0,
            sparklePeak: 0,
          });
        } else if (rand < 0.88) {
          // 23% Clear Mid-Field Stars (crisp, steady white points, 0.8px - 1.25px)
          stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: 0.8 + Math.random() * 0.45,
            baseAlpha: 0.75 + Math.random() * 0.22,
            alpha: 0.85,
            depth: 5.5,
            type: 'steady',
            sparkleActive: false,
            sparkleTimer: 0,
            sparkleDuration: 0,
            sparkleElapsed: 0,
            sparklePeak: 0,
          });
        } else {
          // 12% Prominent Diamond Stars (brilliant white with realistic intermittent sparkle)
          const radius = 1.35 + Math.random() * 0.75;
          stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius,
            baseAlpha: 0.9 + Math.random() * 0.1,
            alpha: 0.95,
            depth: 10 + Math.random() * 6,
            type: 'diamond',
            sparkleActive: false,
            sparkleTimer: 0.5 + Math.random() * 3.5, // staggered first sparkles
            sparkleDuration: 0.4 + Math.random() * 0.4,
            sparkleElapsed: 0,
            sparklePeak: 5.0 + Math.random() * 5.5, // needle spike length
          });
        }
      }
    };

    // Handle high-definition canvas scaling
    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
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
        speed: 24 + Math.random() * 12, // ultra fast
        angle: (Math.PI / 4) + (Math.random() * 0.15 - 0.075),
        life: 0,
        maxLife: 0.5 + Math.random() * 0.35, // 0.5s - 0.85s quick lifespan
        thickness: 1.0 + Math.random() * 0.8,
      });
    };

    let lastTime = performance.now();

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
      // 1. DISTANT STARDUST & STEADY MID-FIELD STARS (Crisp & Steady)
      // ──────────────────────────────────────────────────────────
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        if (star.type === 'diamond') continue;

        const px = star.x + currentMouseX * star.depth;
        const py = star.y + currentMouseY * star.depth;

        ctx.fillStyle = `rgba(255, 255, 255, ${star.baseAlpha})`;
        ctx.beginPath();
        ctx.arc(px, py, star.radius, 0, Math.PI * 2);
        ctx.fill();
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
            // Sparkle finished, set next random interval (2s to 6s)
            star.sparkleActive = false;
            star.sparkleTimer = 1.5 + Math.random() * 4.5;
            star.sparkleElapsed = 0;
            flareProgress = 0;
          } else {
            // Realistic bell-curve scintillation pulse
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

        // Core star
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(px, py, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // Subtle micro-halo during sparkle glint
        if (flareProgress > 0.05) {
          const haloRadius = currentRadius * (2.5 + flareProgress * 2.0);
          const haloGrad = ctx.createRadialGradient(px, py, 0, px, py, haloRadius);
          haloGrad.addColorStop(0, `rgba(255, 255, 255, ${flareProgress * 0.5})`);
          haloGrad.addColorStop(0.5, `rgba(255, 255, 255, ${flareProgress * 0.18})`);
          haloGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = haloGrad;
          ctx.beginPath();
          ctx.arc(px, py, haloRadius, 0, Math.PI * 2);
          ctx.fill();

          // Razor-thin needle diffraction spikes (Hubble/DSLR diamond glint)
          const spikeLen = star.sparklePeak * flareProgress;
          const spikeAlpha = flareProgress * 0.85;

          ctx.save();
          ctx.strokeStyle = `rgba(255, 255, 255, ${spikeAlpha})`;
          ctx.lineWidth = 0.5; // Razor sharp needle line
          ctx.lineCap = 'round';

          // Primary 4-point cross (+ axis)
          ctx.beginPath();
          ctx.moveTo(px - spikeLen, py);
          ctx.lineTo(px + spikeLen, py);
          ctx.moveTo(px, py - spikeLen);
          ctx.lineTo(px, py + spikeLen);
          ctx.stroke();

          // Secondary subtle 45-degree diagonal needle glint (× axis)
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

        // Fade in rapidly, fade out smoothly
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

        // Pin-point meteor head
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.thickness * 1.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', handleResize);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
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
