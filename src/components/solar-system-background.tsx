'use client';

import React, { useEffect, useRef, useState } from 'react';

// Star definition for high-performance canvas rendering
interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  phase: number;
  color: string;
  isBeacon?: boolean;
}

// Shooting star / meteor definition
interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  maxOpacity: number;
  thickness: number;
  color: string;
}

export default function SolarSystemBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Canvas Starfield, Akashaganga (Milky Way), Constellations, & Shooting Stars
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

      if (containerRef.current) {
        containerRef.current.style.setProperty('--parallax-x', `${targetMouseX * 24}px`);
        containerRef.current.style.setProperty('--parallax-y', `${targetMouseY * 18}px`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Starlight palette matching YantraVis themes (Gold, Saffron, Diamond White, Cyan)
    const STAR_COLORS = [
      'rgba(255, 255, 255, ',    // Diamond White
      'rgba(254, 240, 138, ',    // Surya Gold
      'rgba(253, 224, 71, ',     // Goldenrod
      'rgba(254, 215, 170, ',    // Saffron Amber
      'rgba(249, 115, 22, ',     // Fiery Copper
      'rgba(186, 230, 253, ',    // Celestial Cyan
      'rgba(224, 242, 254, ',    // Pale Starlight Blue
    ];

    let stars: Star[] = [];
    let milkyWayStars: Star[] = [];
    let meteors: Meteor[] = [];

    const initStars = () => {
      stars = [];
      milkyWayStars = [];
      const totalArea = width * height;
      const count = Math.min(480, Math.max(220, Math.floor(totalArea / 4200)));

      // 1. Ambient & Beacon Field Stars
      for (let i = 0; i < count; i++) {
        const isBeacon = i < 28; // 28 prominent navigation stars with diffraction cross
        const colorPrefix = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
        const radius = isBeacon 
          ? 2.2 + Math.random() * 1.5 
          : 0.7 + Math.random() * 1.4;

        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius,
          baseAlpha: isBeacon ? 0.85 + Math.random() * 0.15 : 0.3 + Math.random() * 0.6,
          alpha: 0.6,
          twinkleSpeed: 0.018 + Math.random() * 0.038,
          phase: Math.random() * Math.PI * 2,
          color: colorPrefix,
          isBeacon,
        });
      }

      // 2. Akashaganga (Celestial Milky Way Band) — diagonal stardust cluster
      const mwCount = Math.floor(count * 0.45);
      for (let i = 0; i < mwCount; i++) {
        const t = Math.random();
        const lineX = t * width;
        const lineY = t * height * 0.85 + (Math.random() - 0.5) * 180;
        const colorPrefix = Math.random() > 0.5 ? 'rgba(254, 240, 138, ' : 'rgba(186, 230, 253, ';

        milkyWayStars.push({
          x: lineX + (Math.random() - 0.5) * 220,
          y: lineY,
          radius: 0.5 + Math.random() * 0.8,
          baseAlpha: 0.2 + Math.random() * 0.4,
          alpha: 0.3,
          twinkleSpeed: 0.01 + Math.random() * 0.02,
          phase: Math.random() * Math.PI * 2,
          color: colorPrefix,
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

    // Spawn shooting star (meteor)
    let lastMeteorTime = Date.now();
    const spawnMeteor = () => {
      const startX = Math.random() * width * 0.85 + width * 0.1;
      const startY = Math.random() * 220;
      meteors.push({
        x: startX,
        y: startY,
        length: 120 + Math.random() * 110,
        speed: 15 + Math.random() * 8,
        angle: (Math.PI / 4) + (Math.random() * 0.2 - 0.1), // ~45 deg diagonal
        opacity: 0,
        maxOpacity: 0.9 + Math.random() * 0.1,
        thickness: 1.8 + Math.random() * 1.2,
        color: Math.random() > 0.4 ? 'rgba(254, 240, 138,' : 'rgba(254, 215, 170,',
      });
    };

    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Smooth parallax easing
      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      ctx.clearRect(0, 0, width, height);

      // ──────────────────────────────────────────────────────────
      // Akashaganga (Milky Way Stardust)
      // ──────────────────────────────────────────────────────────
      for (let i = 0; i < milkyWayStars.length; i++) {
        const star = milkyWayStars[i];
        star.phase += star.twinkleSpeed;
        const shimmer = Math.sin(star.phase);
        star.alpha = Math.max(0.08, star.baseAlpha + shimmer * 0.2);

        const px = star.x + currentMouseX * 3;
        const py = star.y + currentMouseY * 3;

        ctx.fillStyle = `${star.color}${star.alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // ──────────────────────────────────────────────────────────
      // Faint Constellation Lines (Saptarshi / Ursa Major & Mriga)
      // ──────────────────────────────────────────────────────────
      if (stars.length >= 28) {
        ctx.save();
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.11)';
        ctx.lineWidth = 0.9;
        ctx.setLineDash([3, 4]);

        for (let i = 0; i < 11; i += 2) {
          const s1 = stars[i];
          const s2 = stars[(i + 1) % 18];
          if (s1 && s2) {
            const dist = Math.hypot(s1.x - s2.x, s1.y - s2.y);
            if (dist < 260 && dist > 50) {
              ctx.beginPath();
              ctx.moveTo(s1.x + currentMouseX * 7, s1.y + currentMouseY * 7);
              ctx.lineTo(s2.x + currentMouseX * 7, s2.y + currentMouseY * 7);
              ctx.stroke();
            }
          }
        }
        ctx.restore();
      }

      // ──────────────────────────────────────────────────────────
      // Twinkling Field Stars & Beacon Stars with Cross Flares
      // ──────────────────────────────────────────────────────────
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.phase += star.twinkleSpeed;
        const shimmer = Math.sin(star.phase);
        star.alpha = Math.max(0.15, star.baseAlpha + shimmer * 0.35);

        const depth = star.radius > 2.0 ? 16 : star.radius > 1.3 ? 9 : 4;
        const px = star.x + currentMouseX * depth;
        const py = star.y + currentMouseY * depth;

        // Core star dot
        ctx.fillStyle = `${star.color}${star.alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, star.radius, 0, Math.PI * 2);
        ctx.fill();

        // 4-point cross diffraction spikes on beacon navigation stars
        if (star.isBeacon && star.alpha > 0.42) {
          const spikeLen = star.radius * 5.5 * star.alpha;
          ctx.save();
          ctx.strokeStyle = `${star.color}${star.alpha * 0.8})`;
          ctx.lineWidth = 0.85;
          ctx.beginPath();
          // Horizontal spike
          ctx.moveTo(px - spikeLen, py);
          ctx.lineTo(px + spikeLen, py);
          // Vertical spike
          ctx.moveTo(px, py - spikeLen);
          ctx.lineTo(px, py + spikeLen);
          ctx.stroke();

          // Soft radiant star glow halo
          const gradient = ctx.createRadialGradient(px, py, 0, px, py, star.radius * 7);
          gradient.addColorStop(0, `${star.color}${star.alpha * 0.45})`);
          gradient.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(px, py, star.radius * 7, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      }

      // ──────────────────────────────────────────────────────────
      // Shooting Stars (Meteors)
      // ──────────────────────────────────────────────────────────
      const now = Date.now();
      if (now - lastMeteorTime > 4500 + Math.random() * 4000) {
        spawnMeteor();
        lastMeteorTime = now;
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;

        if (m.y < 380) {
          m.opacity = Math.min(m.maxOpacity, m.opacity + delta * 2.8);
        } else {
          m.opacity -= delta * 1.4;
        }

        if (m.opacity <= 0 || m.x < -100 || m.x > width + 100 || m.y > height + 100) {
          meteors.splice(i, 1);
          continue;
        }

        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, `${m.color}${m.opacity})`);
        grad.addColorStop(0.3, `${m.color}${m.opacity * 0.5})`);
        grad.addColorStop(1, `${m.color}0)`);

        ctx.save();
        ctx.strokeStyle = grad;
        ctx.lineWidth = m.thickness;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Glowing meteor head
        ctx.fillStyle = `rgba(255, 255, 255, ${m.opacity})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.thickness * 1.3, 0, Math.PI * 2);
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
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none" 
      aria-hidden="true"
      style={{
        ['--parallax-x' as string]: '0px',
        ['--parallax-y' as string]: '0px',
      }}
    >
      {/* ════════════════════════════════════════════════════════════════════════════════
          LAYER 1: DEEP COSMIC NEBULAE GRADIENTS (Warm Saffron, Surya Gold, Deep Indigo)
          ════════════════════════════════════════════════════════════════════════════════ */}
      <div 
        className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-35 filter blur-[100px] pointer-events-none transform transition-transform duration-700 ease-out"
        style={{
          background: 'radial-gradient(circle, hsla(24, 95%, 52%, 0.45) 0%, hsla(18, 90%, 45%, 0.2) 40%, transparent 70%)',
          transform: 'translate3d(calc(var(--parallax-x) * 0.4), calc(var(--parallax-y) * 0.4), 0)',
        }}
      />
      <div 
        className="absolute top-[12%] right-[2%] w-[800px] h-[800px] rounded-full opacity-40 filter blur-[120px] pointer-events-none transform transition-transform duration-700 ease-out"
        style={{
          background: 'radial-gradient(circle, hsla(43, 100%, 54%, 0.45) 0%, hsla(28, 95%, 50%, 0.2) 50%, transparent 70%)',
          transform: 'translate3d(calc(var(--parallax-x) * -0.6), calc(var(--parallax-y) * -0.6), 0)',
        }}
      />
      <div 
        className="absolute -bottom-48 left-[25%] w-[850px] h-[850px] rounded-full opacity-30 filter blur-[130px] pointer-events-none transform transition-transform duration-700 ease-out"
        style={{
          background: 'radial-gradient(circle, hsla(225, 75%, 28%, 0.55) 0%, hsla(220, 60%, 15%, 0.25) 50%, transparent 75%)',
          transform: 'translate3d(calc(var(--parallax-x) * 0.3), calc(var(--parallax-y) * 0.3), 0)',
        }}
      />

      {/* ════════════════════════════════════════════════════════════════════════════════
          LAYER 2: HIGH-DPI CANVAS TWINKLING STARFIELD & SHOOTING STARS
          ════════════════════════════════════════════════════════════════════════════════ */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none opacity-95"
      />

      {/* ════════════════════════════════════════════════════════════════════════════════
          LAYER 3: THE CELESTIAL SOLAR SYSTEM (NAVAGRAHA ASTRONOMICAL ORRERY)
          Tilted 3D perspective with central radiant Surya (Sun) and revolving planetary spheres
          ════════════════════════════════════════════════════════════════════════════════ */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        style={{
          perspective: '1300px',
        }}
      >
        <div 
          className="relative w-[1300px] h-[1300px] flex items-center justify-center transition-transform duration-500 ease-out origin-center"
          style={{
            // Positioned so the radiant Sun crowns the upper-right quadrant
            // while orbits sweep through center and behind the left configuration panel
            transform: 'translate3d(calc(18vw + var(--parallax-x)), calc(-6vh + var(--parallax-y)), 0) rotateX(52deg) rotateZ(-15deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* ──────────────────────────────────────────────────────────
              SUN (SURYA) — Radiant golden core, corona, & solar rays
              ────────────────────────────────────────────────────────── */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center pointer-events-none"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Deep solar atmospheric glow aura */}
            <div 
              className="absolute w-80 h-80 rounded-full pointer-events-none animate-pulse"
              style={{
                background: 'radial-gradient(circle, hsla(43, 100%, 55%, 0.5) 0%, hsla(24, 90%, 55%, 0.28) 45%, transparent 70%)',
                animationDuration: '5s',
              }}
            />

            {/* Rotating 12 Solar Rays / Surya Mandala */}
            <div 
              className="absolute w-52 h-52 rounded-full border border-dashed opacity-45 animate-spin-slow pointer-events-none"
              style={{
                borderColor: 'hsl(43, 100%, 55%)',
                animationDuration: '90s',
                boxShadow: '0 0 35px hsla(43, 100%, 52%, 0.35)',
              }}
            />
            <div 
              className="absolute w-40 h-40 rounded-full border border-dotted opacity-50 animate-counter-spin pointer-events-none"
              style={{
                borderColor: 'hsl(24, 90%, 58%)',
                animationDuration: '65s',
              }}
            />

            {/* Inner radiant Surya sphere */}
            <div 
              className="relative w-18 h-18 rounded-full flex items-center justify-center shadow-2xl"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #fffdf0 0%, #fef08a 25%, #f59e0b 60%, #ea580c 100%)',
                boxShadow: `
                  0 0 32px hsla(43, 100%, 55%, 0.95),
                  0 0 70px hsla(24, 95%, 55%, 0.7),
                  0 0 120px hsla(24, 90%, 55%, 0.4)
                `,
              }}
            >
              {/* Sacred Sun Core Symbol (☉) */}
              <div className="w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_12px_white]" />
            </div>

            {/* Sun Label */}
            <div 
              className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-widest text-accent font-bold uppercase whitespace-nowrap opacity-75"
              style={{ textShadow: '0 0 8px hsla(43, 100%, 55%, 0.8)' }}
            >
              ☉ SURYA
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────
              ORBIT 1: MERCURY (BUDHA) — Radius 85px
              ────────────────────────────────────────────────────────── */}
          <div 
            className="absolute rounded-full border border-dashed pointer-events-none"
            style={{
              width: '170px',
              height: '170px',
              borderColor: 'hsla(43, 100%, 60%, 0.35)',
              boxShadow: '0 0 14px hsla(43, 100%, 52%, 0.12)',
            }}
          />
          {/* Mercury Revolution Arm */}
          <div 
            className="absolute w-[170px] h-[170px] rounded-full pointer-events-none"
            style={{
              animation: 'spin-slow 16s linear infinite',
            }}
          >
            {/* Mercury Planet Node */}
            <div 
              className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-lg"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #fef08a 0%, #eab308 60%, #ca8a04 100%)',
                boxShadow: '0 0 10px hsla(43, 100%, 55%, 0.95), 0 0 18px hsla(43, 100%, 55%, 0.4)',
              }}
              title="Mercury (Budha)"
            />
          </div>

          {/* ──────────────────────────────────────────────────────────
              ORBIT 2: VENUS (SHUKRA) — Radius 145px
              ────────────────────────────────────────────────────────── */}
          <div 
            className="absolute rounded-full border border-dashed pointer-events-none"
            style={{
              width: '290px',
              height: '290px',
              borderColor: 'hsla(43, 95%, 65%, 0.32)',
              boxShadow: '0 0 16px hsla(43, 100%, 52%, 0.12)',
            }}
          />
          {/* Venus Revolution Arm */}
          <div 
            className="absolute w-[290px] h-[290px] rounded-full pointer-events-none"
            style={{
              animation: 'spin-slow 26s linear infinite',
            }}
          >
            {/* Venus Planet Node */}
            <div 
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-5.5 h-5.5 rounded-full flex items-center justify-center shadow-lg"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #fef9c3 40%, #fde047 80%, #d97706 100%)',
                boxShadow: '0 0 16px hsla(43, 100%, 65%, 0.95), 0 0 30px hsla(43, 100%, 65%, 0.45)',
              }}
              title="Venus (Shukra)"
            />
          </div>

          {/* ──────────────────────────────────────────────────────────
              ORBIT 3: EARTH (PRITHVI / BHU) with MOON (CHANDRA) — Radius 215px
              ────────────────────────────────────────────────────────── */}
          <div 
            className="absolute rounded-full border pointer-events-none"
            style={{
              width: '430px',
              height: '430px',
              borderColor: 'hsla(190, 85%, 60%, 0.32)',
              boxShadow: '0 0 18px hsla(190, 80%, 60%, 0.12)',
            }}
          />
          {/* Earth Revolution Arm */}
          <div 
            className="absolute w-[430px] h-[430px] rounded-full pointer-events-none"
            style={{
              animation: 'spin-slow 40s linear infinite',
            }}
          >
            {/* Earth Container with Orbiting Moon */}
            <div 
              className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 flex items-center justify-center pointer-events-none"
            >
              {/* Earth Body */}
              <div 
                className="w-6 h-6 rounded-full shadow-lg relative z-10"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, #7dd3fc 0%, #0284c7 60%, #0369a1 100%)',
                  boxShadow: '0 0 16px hsla(199, 89%, 60%, 0.95), 0 0 28px hsla(199, 89%, 60%, 0.45)',
                }}
                title="Earth (Prithvi)"
              />
              {/* Moon Orbit ring around Earth */}
              <div 
                className="absolute inset-0 rounded-full border border-dotted border-white/35 pointer-events-none"
              />
              {/* Moon revolving around Earth */}
              <div 
                className="absolute inset-0 rounded-full animate-spin pointer-events-none"
                style={{ animationDuration: '4.5s' }}
              >
                <div 
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-100 shadow-[0_0_8px_white]"
                  title="Moon (Chandra)"
                />
              </div>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────
              ORBIT 4: MARS (MANGALA) — Radius 285px
              ────────────────────────────────────────────────────────── */}
          <div 
            className="absolute rounded-full border border-dashed pointer-events-none"
            style={{
              width: '570px',
              height: '570px',
              borderColor: 'hsla(18, 90%, 55%, 0.28)',
              boxShadow: '0 0 16px hsla(18, 90%, 55%, 0.1)',
            }}
          />
          {/* Mars Revolution Arm */}
          <div 
            className="absolute w-[570px] h-[570px] rounded-full pointer-events-none"
            style={{
              animation: 'spin-slow 58s linear infinite',
            }}
          >
            {/* Mars Planet Node */}
            <div 
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center shadow-lg"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #fdba74 0%, #ea580c 60%, #9a3412 100%)',
                boxShadow: '0 0 15px hsla(18, 90%, 55%, 0.95), 0 0 28px hsla(18, 90%, 55%, 0.4)',
              }}
              title="Mars (Mangala)"
            />
          </div>

          {/* ──────────────────────────────────────────────────────────
              ORBIT 5: ASTEROID BELT (KSHUDRAGRAHA) — Radius 355px
              Dotted celestial stardust particle belt
              ────────────────────────────────────────────────────────── */}
          <div 
            className="absolute rounded-full border border-dotted pointer-events-none opacity-35 animate-spin-slow"
            style={{
              width: '710px',
              height: '710px',
              borderColor: 'hsla(43, 90%, 65%, 0.6)',
              borderWidth: '2px',
              animationDuration: '140s',
            }}
          />
          <div 
            className="absolute rounded-full border border-dashed pointer-events-none opacity-25 animate-counter-spin"
            style={{
              width: '740px',
              height: '740px',
              borderColor: 'hsla(24, 90%, 55%, 0.5)',
              animationDuration: '160s',
            }}
          />

          {/* ──────────────────────────────────────────────────────────
              ORBIT 6: JUPITER (BRIHASPATI / GURU) — Radius 435px
              Large gas giant with atmospheric banding
              ────────────────────────────────────────────────────────── */}
          <div 
            className="absolute rounded-full border pointer-events-none"
            style={{
              width: '870px',
              height: '870px',
              borderColor: 'hsla(38, 90%, 55%, 0.28)',
              boxShadow: '0 0 20px hsla(38, 90%, 55%, 0.1)',
            }}
          />
          {/* Jupiter Revolution Arm */}
          <div 
            className="absolute w-[870px] h-[870px] rounded-full pointer-events-none"
            style={{
              animation: 'spin-slow 88s linear infinite',
            }}
          >
            {/* Jupiter Planet Node */}
            <div 
              className="absolute -top-4.5 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full flex items-center justify-center shadow-xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #fef08a 0%, #f59e0b 25%, #d97706 50%, #b45309 75%, #78350f 100%)',
                boxShadow: '0 0 22px hsla(38, 95%, 52%, 0.9), 0 0 45px hsla(38, 95%, 52%, 0.35)',
              }}
              title="Jupiter (Brihaspati)"
            >
              {/* Storm bands on Jupiter */}
              <div className="w-full h-1.5 bg-amber-950/30 my-0.5" />
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────
              ORBIT 7: SATURN (SHANI) — Radius 525px
              Golden planet with iconic tilted elliptical rings!
              ────────────────────────────────────────────────────────── */}
          <div 
            className="absolute rounded-full border border-dashed pointer-events-none"
            style={{
              width: '1050px',
              height: '1050px',
              borderColor: 'hsla(43, 90%, 55%, 0.25)',
              boxShadow: '0 0 22px hsla(43, 90%, 55%, 0.08)',
            }}
          />
          {/* Saturn Revolution Arm */}
          <div 
            className="absolute w-[1050px] h-[1050px] rounded-full pointer-events-none"
            style={{
              animation: 'spin-slow 130s linear infinite',
            }}
          >
            {/* Saturn Container with Rings */}
            <div 
              className="absolute -top-5.5 left-1/2 -translate-x-1/2 w-18 h-14 flex items-center justify-center pointer-events-none"
            >
              {/* Saturn's Rings (Tilted Ellipse SVG) */}
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 72 56"
                style={{
                  transform: 'rotate(-26deg)',
                }}
              >
                {/* Outer ring */}
                <ellipse 
                  cx="36" 
                  cy="28" 
                  rx="34" 
                  ry="9" 
                  fill="none" 
                  stroke="hsla(43, 95%, 70%, 0.8)" 
                  strokeWidth="2.4" 
                />
                {/* Inner Cassini division ring */}
                <ellipse 
                  cx="36" 
                  cy="28" 
                  rx="26" 
                  ry="7.5" 
                  fill="none" 
                  stroke="hsla(43, 100%, 80%, 0.65)" 
                  strokeWidth="1.6" 
                />
              </svg>

              {/* Saturn Planet Sphere */}
              <div 
                className="w-7.5 h-7.5 rounded-full relative z-10 shadow-lg"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, #fef9c3 0%, #fde047 50%, #ca8a04 100%)',
                  boxShadow: '0 0 18px hsla(43, 100%, 55%, 0.85), 0 0 35px hsla(43, 100%, 55%, 0.3)',
                }}
                title="Saturn (Shani)"
              />
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────
              ORBIT 8: CELSIUS DIGAMSHA / ASTRONOMICAL GRADUATION RING
              Ancient Indian celestial meridian ring with degree tick marks
              ────────────────────────────────────────────────────────── */}
          <div 
            className="absolute rounded-full pointer-events-none animate-spin-slow"
            style={{
              width: '1240px',
              height: '1240px',
              border: '1.5px solid hsla(43, 100%, 55%, 0.18)',
              boxShadow: '0 0 30px hsla(43, 100%, 55%, 0.05)',
              animationDuration: '240s',
            }}
          >
            {/* Cardinal orientation markers */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-widest text-accent/50 font-bold">
              NORTH · UTTARA
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-widest text-accent/50 font-bold">
              SOUTH · DAKSHINA
            </div>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-mono tracking-widest text-primary/50 font-bold -rotate-90 origin-center">
              EAST · PURVA
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono tracking-widest text-primary/50 font-bold rotate-90 origin-center">
              WEST · PASHCHIMA
            </div>
          </div>

          {/* Outermost astrolabe coordinate ring */}
          <div 
            className="absolute rounded-full border border-dashed pointer-events-none opacity-25 animate-counter-spin"
            style={{
              width: '1320px',
              height: '1320px',
              borderColor: 'hsl(24, 90%, 55%)',
              animationDuration: '300s',
            }}
          />
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════════════
          LAYER 4: SUBTLE CORNER ASTRONOMICAL DIALS & VIGNETTE
          ════════════════════════════════════════════════════════════════════════════════ */}
      {/* Subtle bottom-right astrolabe coordinate dial */}
      <div 
        className="absolute bottom-6 right-8 w-44 h-44 rounded-full border border-dashed opacity-25 pointer-events-none animate-spin-slow hidden xl:block"
        style={{ borderColor: 'hsl(43, 100%, 55%)', animationDuration: '90s' }}
      >
        <div className="absolute inset-4 rounded-full border border-dotted opacity-40 animate-counter-spin" style={{ borderColor: 'hsl(24, 90%, 55%)', animationDuration: '60s' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-accent/60 shadow-[0_0_12px_hsl(43,100%,60%)]" />
        </div>
      </div>

      {/* Vignette overlay to keep UI text & controls crisp and high-contrast */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, hsla(225, 47%, 3%, 0.35) 85%, hsla(225, 47%, 3%, 0.75) 100%)',
        }}
      />
    </div>
  );
}
