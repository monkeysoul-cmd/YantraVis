'use client';

import React, { useEffect, useRef } from 'react';

// Star definition for high-performance canvas rendering
interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  phase: number;
  depth: number;
  isBeacon?: boolean;
}

// Shooting star / meteor definition (pure white only)
interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  maxOpacity: number;
  thickness: number;
}

export default function SolarSystemBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Parallax tracking with smooth spring damping
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

    const initStars = () => {
      stars = [];
      const totalArea = width * height;
      const count = Math.min(600, Math.max(260, Math.floor(totalArea / 3200)));

      // 1. Ambient & Beacon Field Stars (100% pure white)
      for (let i = 0; i < count; i++) {
        const isBeacon = i < 32; // Prominent navigation stars with subtle diffraction cross
        const radius = isBeacon 
          ? 2.0 + Math.random() * 1.4 
          : 0.5 + Math.random() * 1.3;
        
        const depth = isBeacon ? 18 : radius > 1.2 ? 10 : 4;

        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius,
          baseAlpha: isBeacon ? 0.85 + Math.random() * 0.15 : 0.25 + Math.random() * 0.65,
          alpha: 0.6,
          twinkleSpeed: 0.015 + Math.random() * 0.035,
          phase: Math.random() * Math.PI * 2,
          depth,
          isBeacon,
        });
      }
    };

    // Handle Resize with High-DPI support
    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars();
    };

    handleResize();

    // Spawn shooting star (pure white meteor)
    let lastMeteorTime = Date.now();
    const spawnMeteor = () => {
      const startX = Math.random() * width * 0.85 + width * 0.1;
      const startY = Math.random() * (height * 0.35);
      meteors.push({
        x: startX,
        y: startY,
        length: 120 + Math.random() * 120,
        speed: 16 + Math.random() * 9,
        angle: (Math.PI / 4) + (Math.random() * 0.2 - 0.1), // ~45 deg diagonal
        opacity: 0,
        maxOpacity: 0.85 + Math.random() * 0.15,
        thickness: 1.5 + Math.random() * 1.0,
      });
    };

    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Smooth parallax easing
      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      // Pure pitch-black canvas clearing
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // ──────────────────────────────────────────────────────────
      // Faint White Constellation Lines between nearby beacon stars
      // ──────────────────────────────────────────────────────────
      if (stars.length >= 32) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 0.8;
        ctx.setLineDash([3, 5]);

        for (let i = 0; i < 14; i += 2) {
          const s1 = stars[i];
          const s2 = stars[(i + 1) % 24];
          if (s1 && s2) {
            const dist = Math.hypot(s1.x - s2.x, s1.y - s2.y);
            if (dist < 260 && dist > 50) {
              ctx.beginPath();
              ctx.moveTo(s1.x + currentMouseX * 8, s1.y + currentMouseY * 8);
              ctx.lineTo(s2.x + currentMouseX * 8, s2.y + currentMouseY * 8);
              ctx.stroke();
            }
          }
        }
        ctx.restore();
      }

      // ──────────────────────────────────────────────────────────
      // Twinkling White Field Stars & Prominent Beacon Stars
      // ──────────────────────────────────────────────────────────
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.phase += star.twinkleSpeed;
        const shimmer = Math.sin(star.phase);
        star.alpha = Math.max(0.12, Math.min(1.0, star.baseAlpha + shimmer * 0.35));

        const px = star.x + currentMouseX * star.depth;
        const py = star.y + currentMouseY * star.depth;

        // Core star dot (pure white)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, star.radius, 0, Math.PI * 2);
        ctx.fill();

        // Subtle 4-point cross diffraction spikes & glow on beacon stars
        if (star.isBeacon && star.alpha > 0.45) {
          const spikeLen = star.radius * 5.0 * star.alpha;
          ctx.save();
          ctx.strokeStyle = `rgba(255, 255, 255, ${star.alpha * 0.75})`;
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          // Horizontal spike
          ctx.moveTo(px - spikeLen, py);
          ctx.lineTo(px + spikeLen, py);
          // Vertical spike
          ctx.moveTo(px, py - spikeLen);
          ctx.lineTo(px, py + spikeLen);
          ctx.stroke();

          // Soft white radiant star halo
          const gradient = ctx.createRadialGradient(px, py, 0, px, py, star.radius * 6);
          gradient.addColorStop(0, `rgba(255, 255, 255, ${star.alpha * 0.35})`);
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(px, py, star.radius * 6, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      }

      // ──────────────────────────────────────────────────────────
      // Occasional Pure White Shooting Stars (Meteors)
      // ──────────────────────────────────────────────────────────
      const now = Date.now();
      if (now - lastMeteorTime > 5000 + Math.random() * 4500) {
        spawnMeteor();
        lastMeteorTime = now;
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;

        if (m.y < height * 0.45) {
          m.opacity = Math.min(m.maxOpacity, m.opacity + delta * 2.5);
        } else {
          m.opacity -= delta * 1.5;
        }

        if (m.opacity <= 0 || m.x < -100 || m.x > width + 100 || m.y > height + 100) {
          meteors.splice(i, 1);
          continue;
        }

        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${m.opacity})`);
        grad.addColorStop(0.35, `rgba(255, 255, 255, ${m.opacity * 0.45})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.save();
        ctx.strokeStyle = grad;
        ctx.lineWidth = m.thickness;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Glowing white meteor head
        ctx.fillStyle = `rgba(255, 255, 255, ${m.opacity})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.thickness * 1.25, 0, Math.PI * 2);
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
