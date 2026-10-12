'use client';

import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';
import type { Yantra } from '@/lib/yantras';

type YantraViewerProps = {
  yantraId: Yantra['id'];
  latitude?: number;
  isArMode?: boolean;
  animateShadow?: boolean;
};

export type YantraViewerRef = {
  exportSTL: () => Blob | null;
};

// Material definitions and procedural stone/marble texture generators

let cachedSandstoneTex: THREE.CanvasTexture | null = null;
let cachedMarbleTex: THREE.CanvasTexture | null = null;

function getSandstoneTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  if (cachedSandstoneTex) return cachedSandstoneTex;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#b85d38';
      ctx.fillRect(0, 0, 256, 256);
      for (let y = 0; y < 256; y += 4) {
        const alpha = 0.04 + Math.sin(y * 0.1) * 0.02;
        ctx.fillStyle = y % 8 === 0 ? `rgba(90, 40, 20, ${alpha})` : `rgba(220, 140, 90, ${alpha})`;
        ctx.fillRect(0, y, 256, 4);
      }
      for (let i = 0; i < 2000; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        const shade = Math.random() > 0.5 ? 255 : 0;
        ctx.fillStyle = `rgba(${shade}, ${shade * 0.8}, ${shade * 0.6}, ${Math.random() * 0.07})`;
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    cachedSandstoneTex = tex;
    return tex;
  } catch {
    return null;
  }
}

function getMarbleTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  if (cachedMarbleTex) return cachedMarbleTex;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f5f0e8';
      ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = 'rgba(180, 160, 140, 0.12)';
      ctx.lineWidth = 2.5;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        let x = Math.random() * 256;
        let y = 0;
        ctx.moveTo(x, y);
        while (y < 256) {
          x += (Math.random() - 0.5) * 35;
          y += 20 + Math.random() * 30;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.08)';
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        let x = 0;
        let y = Math.random() * 256;
        ctx.moveTo(x, y);
        while (x < 256) {
          x += 20 + Math.random() * 30;
          y += (Math.random() - 0.5) * 20;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    cachedMarbleTex = tex;
    return tex;
  } catch {
    return null;
  }
}

function createSandstoneMaterial() {
  const map = getSandstoneTexture();
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xb85d38),
    map: map || undefined,
    roughness: 0.76,
    metalness: 0.03,
    envMapIntensity: 0.45,
    flatShading: false,
  });
}

function createWeatheredSandstoneMaterial() {
  const map = getSandstoneTexture();
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x9e4c2a),
    map: map || undefined,
    roughness: 0.85,
    metalness: 0.02,
    envMapIntensity: 0.35,
    flatShading: false,
  });
}

function createMarbleMaterial() {
  const map = getMarbleTexture();
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xf6f2eb),
    map: map || undefined,
    roughness: 0.16,
    metalness: 0.08,
    envMapIntensity: 0.95,
    flatShading: false,
  });
}

function createBronzeMaterial() {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xd4963f),
    roughness: 0.20,
    metalness: 0.88,
    envMapIntensity: 1.2,
    flatShading: false,
  });
}

function createOxidizedBronzeMaterial() {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x7da08c),
    roughness: 0.50,
    metalness: 0.70,
    envMapIntensity: 0.7,
    flatShading: false,
  });
}

function createDarkStoneMaterial() {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x4c3a2a),
    roughness: 0.85,
    metalness: 0.05,
    envMapIntensity: 0.35,
    flatShading: false,
  });
}

// Environment map generator

function createEnvironmentMap(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  
  // Create a warm sunset-like environment
  const scene = new THREE.Scene();
  
  // Warm golden sky gradient
  const skyColor = new THREE.Color(0xfff0d4);
  const groundColor = new THREE.Color(0x2a1a0a);
  const horizonColor = new THREE.Color(0xff9a3c);
  
  // Upper hemisphere
  const upperHemi = new THREE.HemisphereLight(skyColor, horizonColor, 1.0);
  scene.add(upperHemi);
  
  // Ambient fill
  const ambient = new THREE.AmbientLight(groundColor, 0.3);
  scene.add(ambient);
  
  // Sun disc approximation
  const sunGeo = new THREE.SphereGeometry(0.5, 16, 8);
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xfff5e0 });
  const sunMesh = new THREE.Mesh(sunGeo, sunMat);
  sunMesh.position.set(5, 8, 3);
  scene.add(sunMesh);
  
  const envMap = pmremGenerator.fromScene(scene, 0.04).texture;
  pmremGenerator.dispose();
  sunGeo.dispose();
  sunMat.dispose();
  
  return envMap;
}

// Ambient dust particle system

function createDustParticles(scene: THREE.Scene): THREE.Points {
  const particleCount = 80;
  const positions = new Float32Array(particleCount * 3);
  const velocities: number[] = [];
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 1] = Math.random() * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    velocities.push(
      (Math.random() - 0.5) * 0.003,
      Math.random() * 0.005 + 0.002,
      (Math.random() - 0.5) * 0.003
    );
  }
  
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const material = new THREE.PointsMaterial({
    color: 0xd4a040,
    size: 0.04,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  
  const points = new THREE.Points(geometry, material);
  (points as any)._velocities = velocities;
  scene.add(points);
  return points;
}

function updateDustParticles(points: THREE.Points, elapsed: number) {
  const positions = points.geometry.attributes.position.array as Float32Array;
  const velocities = (points as any)._velocities as number[];
  
  for (let i = 0; i < positions.length / 3; i++) {
    positions[i * 3] += velocities[i * 3] + Math.sin(elapsed * 0.5 + i) * 0.001;
    positions[i * 3 + 1] += velocities[i * 3 + 1];
    positions[i * 3 + 2] += velocities[i * 3 + 2] + Math.cos(elapsed * 0.3 + i) * 0.001;
    
    // Reset particles that float too high
    if (positions[i * 3 + 1] > 8) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = -0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
  }
  
  // Gentle overall opacity pulse
  (points.material as THREE.PointsMaterial).opacity = 0.35 + Math.sin(elapsed * 0.7) * 0.15;
  points.geometry.attributes.position.needsUpdate = true;
}

// Ground platform and orientation markers

function createGround(scene: THREE.Scene, groundY = 0) {
  // Platform base — flush with ground plane
  const platformGeo = new THREE.CylinderGeometry(5.2, 5.6, 0.3, 48);
  const platform = new THREE.Mesh(platformGeo, createWeatheredSandstoneMaterial());
  platform.position.y = groundY - 0.15;
  platform.receiveShadow = true;
  platform.castShadow = true;
  scene.add(platform);

  // Marble inlay ring on the platform surface
  const inlayGeo = new THREE.RingGeometry(4.4, 4.6, 64);
  inlayGeo.rotateX(-Math.PI / 2);
  const inlay = new THREE.Mesh(inlayGeo, createMarbleMaterial());
  inlay.position.y = groundY + 0.002;
  inlay.receiveShadow = true;
  scene.add(inlay);

  // Shadow receiver at groundY + 0.005 to prevent z-fighting
  const shadowGeo = new THREE.CircleGeometry(5.0, 64);
  const shadowMat = new THREE.ShadowMaterial({ opacity: 0.45, color: 0x1a0800 });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = groundY + 0.005;
  shadow.receiveShadow = true;
  scene.add(shadow);

  // Cardinal direction markers (N S E W) aligned with True Meridian
  const cardinals = [
    { label: 'N', pos: new THREE.Vector3(0, groundY + 0.04, -4.5) },
    { label: 'S', pos: new THREE.Vector3(0, groundY + 0.04, 4.5) },
    { label: 'E', pos: new THREE.Vector3(4.5, groundY + 0.04, 0) },
    { label: 'W', pos: new THREE.Vector3(-4.5, groundY + 0.04, 0) },
  ];
  cardinals.forEach(({ pos }) => {
    const markerGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.08, 16);
    const marker = new THREE.Mesh(markerGeo, createBronzeMaterial());
    marker.position.copy(pos);
    marker.castShadow = true;
    scene.add(marker);
  });

  // Radial scale lines on ground
  for (let i = 0; i < 24; i++) {
    const angle = (i * Math.PI * 2) / 24;
    const linePts = [
      new THREE.Vector3(Math.cos(angle) * 0.8, groundY + 0.006, Math.sin(angle) * 0.8),
      new THREE.Vector3(Math.cos(angle) * 4.3, groundY + 0.006, Math.sin(angle) * 4.3),
    ];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xd4956a,
      transparent: true,
      opacity: i % 6 === 0 ? 0.6 : 0.2,
    });
    scene.add(new THREE.Line(lineGeo, lineMat));
  }
}

// Parametric instrument builders

function buildSamrat(latRad: number): THREE.Group {
  const group = new THREE.Group();
  const sandstone = createSandstoneMaterial();
  const marble = createMarbleMaterial();
  const bronze = createBronzeMaterial();
  const weathered = createWeatheredSandstoneMaterial();

  const baseL = 3.6;
  const gH = baseL * Math.tan(latRad);
  const foundationY = 0.75;

  // 1. Foundation: 3 stepped masonry plinths
  [4.0, 3.6, 3.2].forEach((w, i) => {
    const stepGeo = new THREE.BoxGeometry(w, 0.25, 1.4 - i * 0.15);
    const step = new THREE.Mesh(stepGeo, weathered);
    step.position.y = 0.125 + i * 0.25;
    step.castShadow = true;
    step.receiveShadow = true;
    group.add(step);
  });

  // 2. Triangular gnomon core
  const gnomonShape = new THREE.Shape();
  gnomonShape.moveTo(-baseL / 2, 0);
  gnomonShape.lineTo(baseL / 2, 0);
  gnomonShape.lineTo(-baseL / 2, gH);
  gnomonShape.closePath();

  const gnomonGeo = new THREE.ExtrudeGeometry(gnomonShape, {
    depth: 0.36,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelSegments: 3,
  });
  gnomonGeo.translate(0, 0, -0.18);
  const gnomonMesh = new THREE.Mesh(gnomonGeo, sandstone);
  gnomonMesh.position.set(0, foundationY, 0);
  gnomonMesh.castShadow = true;
  gnomonMesh.receiveShadow = true;
  group.add(gnomonMesh);

  // 3. Central climbable staircase along hypotenuse (aligned correctly from South +baseL/2 up to North -baseL/2)
  const hypoLength = Math.sqrt(baseL * baseL + gH * gH);
  const hypoAngle = Math.atan2(gH, baseL);
  
  // Marble hypotenuse bed slab
  const hypoBed = new THREE.Mesh(new THREE.BoxGeometry(hypoLength, 0.08, 0.40), marble);
  hypoBed.position.set(0, foundationY + gH * 0.5, 0);
  hypoBed.rotation.z = -hypoAngle;
  hypoBed.castShadow = true;
  group.add(hypoBed);

  // Steps climbing up the hypotenuse
  const stairCount = Math.max(12, Math.floor(hypoLength * 3.2));
  for (let s = 0; s < stairCount; s++) {
    const t = (s + 0.5) / stairCount;
    // Step goes from base (sx = +baseL/2, sy = foundationY) to apex (sx = -baseL/2, sy = foundationY + gH)
    const sx = baseL / 2 - t * baseL;
    const sy = foundationY + t * gH;
    const stepGeo = new THREE.BoxGeometry((hypoLength / stairCount) * 0.88, 0.03, 0.38);
    const stepMesh = new THREE.Mesh(stepGeo, marble);
    stepMesh.position.set(sx, sy + 0.05, 0);
    stepMesh.rotation.z = -hypoAngle;
    stepMesh.castShadow = true;
    group.add(stepMesh);
  }

  // 4. Balustrades / railings along the ramp edges
  [-0.19, 0.19].forEach((zOff) => {
    const railGeo = new THREE.BoxGeometry(hypoLength, 0.04, 0.03);
    const rail = new THREE.Mesh(railGeo, marble);
    rail.position.set(0, foundationY + gH * 0.5 + 0.12, zOff);
    rail.rotation.z = -hypoAngle;
    rail.castShadow = true;
    group.add(rail);

    // Support baluster posts
    for (let p = 0; p <= 6; p++) {
      const pt = p / 6;
      const px = baseL / 2 - pt * baseL;
      const py = foundationY + pt * gH;
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 0.03), marble);
      post.position.set(px, py + 0.07, zOff);
      post.castShadow = true;
      group.add(post);
    }
  });

  // 5. Authentic observation Chhatri (Pavilion) at the apex (-baseL/2, foundationY + gH, 0)
  const chhatriGroup = new THREE.Group();
  chhatriGroup.position.set(-baseL / 2, foundationY + gH, 0);
  
  // Plinth
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.06, 0.58), marble);
  plinth.position.y = 0.03;
  chhatriGroup.add(plinth);

  // 4 Carved stone pillars
  const colH = 0.45;
  [[-0.22, -0.22], [0.22, -0.22], [-0.22, 0.22], [0.22, 0.22]].forEach(([cx, cz]) => {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, colH, 12), sandstone);
    col.position.set(cx, 0.06 + colH / 2, cz);
    col.castShadow = true;
    chhatriGroup.add(col);

    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.03, 0.08), marble);
    cap.position.set(cx, 0.06 + colH, cz);
    chhatriGroup.add(cap);
  });

  // Cornice & Roof
  const cornice = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.04, 0.56), marble);
  cornice.position.y = 0.06 + colH + 0.02;
  chhatriGroup.add(cornice);

  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.5), sandstone);
  dome.position.y = 0.06 + colH + 0.04;
  dome.castShadow = true;
  chhatriGroup.add(dome);

  // Brass Kalash finial
  const kalash = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.16, 12), bronze);
  kalash.position.y = 0.06 + colH + 0.04 + 0.28 + 0.08;
  kalash.castShadow = true;
  chhatriGroup.add(kalash);

  group.add(chhatriGroup);

  // 6. Eastern & Western Quadrant Arcs (precision marble curves with bronze graduations)
  const arcR = Math.max(2.1, gH * 1.05);
  for (const side of [-1, 1]) {
    const quad = new THREE.Group();
    quad.position.set(side * 0.72, foundationY + gH * 0.42, 0);
    quad.scale.x = side;

    // Thick marble quadrant arc face
    const arcGeo = new THREE.CylinderGeometry(arcR, arcR + 0.15, 0.58, 64, 1, true, 0, Math.PI * 0.52);
    arcGeo.rotateX(Math.PI / 2);
    arcGeo.rotateZ(latRad - Math.PI / 2 + 0.05);
    const arcMesh = new THREE.Mesh(arcGeo, marble);
    arcMesh.castShadow = true;
    arcMesh.receiveShadow = true;
    quad.add(arcMesh);

    // Stone masonry backing structure
    const backArcGeo = new THREE.CylinderGeometry(arcR - 0.22, arcR - 0.02, 0.54, 48, 1, true, 0, Math.PI * 0.52);
    backArcGeo.rotateX(Math.PI / 2);
    backArcGeo.rotateZ(latRad - Math.PI / 2 + 0.05);
    const backArc = new THREE.Mesh(backArcGeo, sandstone);
    quad.add(backArc);

    // Fine scale graduations: hours (bronze studs) and minute tick notches
    const arcRot = latRad - Math.PI / 2 + 0.05;
    for (let t = 0; t <= 24; t++) {
      const angle = (t / 24) * (Math.PI * 0.52) + arcRot;
      const isMajor = t % 4 === 0;
      const nx = Math.cos(angle) * (arcR + 0.07);
      const ny = Math.sin(angle) * (arcR + 0.07);
      const mark = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, isMajor ? 0.08 : 0.04, isMajor ? 0.05 : 0.025),
        bronze
      );
      mark.position.set(nx, ny, 0.28);
      quad.add(mark);
    }

    // Foundation support pier with authentic arched niche cutout
    const pierH = gH * 0.45;
    const pier = new THREE.Mesh(new THREE.BoxGeometry(0.24, pierH, 0.42), weathered);
    pier.position.set(0, -gH * 0.18 + pierH * 0.1, 0);
    pier.castShadow = true;
    quad.add(pier);

    group.add(quad);
  }

  // 7. Structural flank walls and decorative horizontal marble string courses
  for (const side of [-0.68, 0.68]) {
    const wallH = gH * 0.62;
    const flank = new THREE.Mesh(new THREE.BoxGeometry(0.24, wallH, 0.95), weathered);
    flank.position.set(side, foundationY + wallH / 2, 0);
    flank.castShadow = true;
    group.add(flank);
  }

  for (let i = 1; i <= 5; i++) {
    const t = i / 6;
    const lineY = foundationY + t * gH;
    const lineW = baseL * (1 - t) * 0.88;
    const course = new THREE.Mesh(new THREE.BoxGeometry(lineW, 0.02, 0.38), marble);
    course.position.set(-baseL / 2 + lineW / 2, lineY, 0);
    group.add(course);
  }

  return group;
}

function buildRama(latRad: number): THREE.Group {
  const group = new THREE.Group();
  const sandstone = createSandstoneMaterial();
  const marble = createMarbleMaterial();
  const bronze = createBronzeMaterial();
  const weathered = createWeatheredSandstoneMaterial();

  const R = 2.6;
  const H = 2.5;
  const numSectors = 12;
  const sectorAngle = (Math.PI * 2) / numSectors; // 30° total per section: 15° stone slab + 15° open gap
  const floorElevation = 0.28;

  // 1. Foundation base ring
  const baseRingGeo = new THREE.CylinderGeometry(R + 0.3, R + 0.45, 0.18, 48);
  const baseRing = new THREE.Mesh(baseRingGeo, weathered);
  baseRing.position.y = 0.09;
  baseRing.receiveShadow = true;
  group.add(baseRing);

  // 2. Central cylindrical gnomon pillar
  const pillarGeo = new THREE.CylinderGeometry(0.12, 0.15, H + floorElevation, 32);
  const pillar = new THREE.Mesh(pillarGeo, bronze);
  pillar.position.y = (H + floorElevation) / 2;
  pillar.castShadow = true;
  group.add(pillar);

  // Ornate capital on central pillar (double tiered with lotus dome)
  const capitalBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.12, 0.1, 24), marble);
  capitalBase.position.y = H + floorElevation + 0.05;
  group.add(capitalBase);

  const capitalFinial = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), bronze);
  capitalFinial.position.y = H + floorElevation + 0.18;
  capitalFinial.castShadow = true;
  group.add(capitalFinial);

  // 3. 12 Elevated radiating stone floor sectors (with 15° open gaps in between)
  for (let s = 0; s < numSectors; s++) {
    const startA = s * sectorAngle;
    const spanA = sectorAngle * 0.5; // 15° solid sector, leaving 15° open space

    // Extruded radial pie sector for the floor
    const shape = new THREE.Shape();
    shape.moveTo(0.2, 0);
    const pts = 12;
    for (let p = 0; p <= pts; p++) {
      const a = startA + (p / pts) * spanA;
      shape.lineTo(Math.cos(a) * (R - 0.05), Math.sin(a) * (R - 0.05));
    }
    shape.lineTo(Math.cos(startA + spanA) * 0.2, Math.sin(startA + spanA) * 0.2);
    shape.closePath();

    const floorGeo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.12,
      bevelEnabled: false,
    });
    floorGeo.rotateX(-Math.PI / 2);
    const sectorMesh = new THREE.Mesh(floorGeo, marble);
    sectorMesh.position.y = floorElevation;
    sectorMesh.castShadow = true;
    sectorMesh.receiveShadow = true;
    group.add(sectorMesh);

    // Stone support arches / pillars under the elevated floor
    const midA = startA + spanA * 0.5;
    for (const radDist of [0.9, 1.8]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, floorElevation, 0.12), sandstone);
      post.position.set(Math.cos(midA) * radDist, floorElevation / 2, Math.sin(midA) * radDist);
      post.castShadow = true;
      group.add(post);
    }

    // Radial bronze division lines on floor sector
    for (let d = 1; d <= 3; d++) {
      const dist = 0.5 + d * 0.6;
      const arcRing = new THREE.Mesh(
        new THREE.RingGeometry(dist - 0.01, dist + 0.01, 16, 1, startA, spanA),
        bronze
      );
      arcRing.rotateX(-Math.PI / 2);
      arcRing.position.y = floorElevation + 0.125;
      group.add(arcRing);
    }
  }

  // 4. Perimeter arcade: 12 vertical stone wall pillars corresponding to floor sectors
  for (let s = 0; s < numSectors; s++) {
    const midA = s * sectorAngle + sectorAngle * 0.25;
    const pierW = 0.38;
    const pierThick = 0.32;
    const pier = new THREE.Mesh(
      new THREE.BoxGeometry(pierW, H, pierThick),
      sandstone
    );
    pier.position.set(Math.cos(midA) * R, H / 2, Math.sin(midA) * R);
    pier.rotation.y = -midA;
    pier.castShadow = true;
    pier.receiveShadow = true;
    group.add(pier);

    // Marble altitude scale facing on the inner surface of each vertical pier
    const innerFace = new THREE.Mesh(
      new THREE.BoxGeometry(pierW * 0.85, H * 0.92, 0.03),
      marble
    );
    innerFace.position.set(Math.cos(midA) * (R - pierThick * 0.45), H / 2, Math.sin(midA) * (R - pierThick * 0.45));
    innerFace.rotation.y = -midA;
    group.add(innerFace);

    // Altitude degree bands on the inner face
    for (let b = 1; b <= 5; b++) {
      const bandY = (b / 6) * H;
      const band = new THREE.Mesh(new THREE.BoxGeometry(pierW * 0.8, 0.02, 0.04), bronze);
      band.position.set(Math.cos(midA) * (R - pierThick * 0.45), bandY, Math.sin(midA) * (R - pierThick * 0.45));
      band.rotation.y = -midA;
      group.add(band);
    }
  }

  // Top perimeter coping ring connecting all pillars
  const topRing = new THREE.Mesh(
    new THREE.TorusGeometry(R, 0.08, 12, 64),
    marble
  );
  topRing.rotateX(Math.PI / 2);
  topRing.position.y = H;
  topRing.castShadow = true;
  group.add(topRing);

  // Entrance steps on the south side
  for (let st = 0; st < 3; st++) {
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.09, 0.2),
      weathered
    );
    step.position.set(0, 0.045 + st * 0.09, R + 0.3 + (2 - st) * 0.2);
    step.castShadow = true;
    group.add(step);
  }

  return group;
}

function buildJaiPrakash(latRad: number): THREE.Group {
  const group = new THREE.Group();
  const sandstone = createSandstoneMaterial();
  const marble = createMarbleMaterial();
  const bronze = createBronzeMaterial();
  const weathered = createWeatheredSandstoneMaterial();

  const R = 2.3;
  const drumH = R + 0.55;

  // 1. Outer stepped cylindrical masonry drum
  const drumPlinth = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.55, R + 0.65, 0.3, 64), weathered);
  drumPlinth.position.y = 0.15;
  drumPlinth.receiveShadow = true;
  group.add(drumPlinth);

  const drum = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.45, R + 0.55, drumH, 64), sandstone);
  drum.position.y = drumH / 2;
  drum.castShadow = true;
  drum.receiveShadow = true;
  group.add(drum);

  // Rajput decorative cornice molding along drum rim
  const cornice = new THREE.Mesh(new THREE.TorusGeometry(R + 0.48, 0.06, 8, 64), marble);
  cornice.rotateX(Math.PI / 2);
  cornice.position.y = drumH;
  cornice.castShadow = true;
  group.add(cornice);

  // 2. Concave marble bowl interior (Sunken celestial sphere)
  const bowlMat = marble.clone();
  bowlMat.side = THREE.BackSide;
  const bowl = new THREE.Mesh(
    new THREE.SphereGeometry(R, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
    bowlMat
  );
  bowl.position.y = drumH;
  bowl.receiveShadow = true;
  group.add(bowl);

  // 3. Sunken walkway passage cuts (pathways cut into the bowl so observers can walk inside)
  const numPassages = 6;
  for (let i = 0; i < numPassages; i++) {
    const angle = (i * Math.PI) / 3;
    const passage = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, R * 0.8, R * 2.1),
      sandstone
    );
    passage.position.set(0, drumH - R * 0.4, 0);
    passage.rotation.y = angle;
    group.add(passage);
  }

  // 4. Inlaid celestial coordinate curves inside the bowl
  // Celestial equator
  const eqPts: THREE.Vector3[] = [];
  for (let a = 0; a <= 64; a++) {
    const th = (a / 64) * Math.PI * 2;
    const rRing = R * 0.88;
    eqPts.push(new THREE.Vector3(Math.cos(th) * rRing, drumH - R * 0.52, Math.sin(th) * rRing));
  }
  const eqGeo = new THREE.BufferGeometry().setFromPoints(eqPts);
  group.add(new THREE.Line(eqGeo, new THREE.LineBasicMaterial({ color: 0xd4963f, linewidth: 2 })));

  // Tropics of Cancer and Capricorn
  for (const [deg, col] of [[23.44, 0x7da08c], [-23.44, 0x7da08c]] as const) {
    const ringPts: THREE.Vector3[] = [];
    const rRing = R * (deg > 0 ? 0.72 : 0.96);
    const yRing = drumH - R * (deg > 0 ? 0.70 : 0.28);
    for (let a = 0; a <= 48; a++) {
      const th = (a / 48) * Math.PI * 2;
      ringPts.push(new THREE.Vector3(Math.cos(th) * rRing, yRing, Math.sin(th) * rRing));
    }
    const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPts);
    group.add(new THREE.Line(ringGeo, new THREE.LineBasicMaterial({ color: col })));
  }

  // Meridian & Azimuth hour arcs
  for (let h = 0; h < 12; h++) {
    const angle = (h * Math.PI) / 6;
    const arcPts: THREE.Vector3[] = [];
    for (let s = 0; s <= 20; s++) {
      const t = (s / 20) * (Math.PI / 2);
      arcPts.push(new THREE.Vector3(
        Math.cos(angle) * R * Math.cos(t) * 0.98,
        drumH - R * Math.sin(t),
        Math.sin(angle) * R * Math.cos(t) * 0.98
      ));
    }
    const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPts);
    group.add(new THREE.Line(arcGeo, new THREE.LineBasicMaterial({ color: 0xcb8e3e, transparent: true, opacity: 0.5 })));
  }

  // 5. Taut bronze meridian and prime-vertical crosswires across the top rim
  const wireMat = new THREE.MeshStandardMaterial({ color: 0xd4963f, roughness: 0.15, metalness: 0.9 });
  for (const rotY of [0, Math.PI / 2]) {
    const wire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, R * 2, 8),
      wireMat
    );
    wire.rotateZ(Math.PI / 2);
    wire.rotateY(rotY);
    wire.position.y = drumH;
    wire.castShadow = true;
    group.add(wire);
  }

  // 6. Central bronze sighting ring (sun-disk aperture) suspended at the wire intersection
  const centerRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.09, 0.018, 12, 32),
    bronze
  );
  centerRing.rotateX(Math.PI / 2);
  centerRing.position.y = drumH;
  centerRing.castShadow = true;
  group.add(centerRing);

  // 7. Marble top rim ring with bronze calibration pins
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(R, 0.12, 16, 72),
    marble
  );
  rim.rotateX(Math.PI / 2);
  rim.position.y = drumH;
  rim.castShadow = true;
  group.add(rim);

  for (let i = 0; i < 24; i++) {
    const a = (i * Math.PI * 2) / 24;
    const pin = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), bronze);
    pin.position.set(Math.cos(a) * (R + 0.02), drumH + 0.06, Math.sin(a) * (R + 0.02));
    group.add(pin);
  }

  // 8. Exterior stone entrance stairs leading to the observation rim
  for (let st = 0; st < 5; st++) {
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, drumH / 5, 0.22),
      weathered
    );
    step.position.set(0, (st + 0.5) * (drumH / 5), R + 0.45 + (4 - st) * 0.2);
    step.castShadow = true;
    group.add(step);
  }

  return group;
}

function buildRasivalaya(latRad: number): THREE.Group {
  const group = new THREE.Group();
  const sandstone = createSandstoneMaterial();
  const marble = createMarbleMaterial();
  const bronze = createBronzeMaterial();

  // Circular base platform sitting on ground at y = 0
  const baseH = 0.28;
  const baseGeo = new THREE.CylinderGeometry(2.6, 2.8, baseH, 48);
  const base = new THREE.Mesh(baseGeo, createWeatheredSandstoneMaterial());
  base.position.y = baseH / 2;
  base.receiveShadow = true;
  group.add(base);

  // 12 zodiac instruments arranged in a ring atop the base
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI * 2) / 12;
    const r = 1.85;
    const subGroup = new THREE.Group();

    // Gnomon triangle
    const gnomonH = 0.75;
    const gnomonShape = new THREE.Shape();
    gnomonShape.moveTo(-0.2, 0);
    gnomonShape.lineTo(0.2, 0);
    gnomonShape.lineTo(0, gnomonH);
    gnomonShape.closePath();
    const gnomonGeo = new THREE.ExtrudeGeometry(gnomonShape, { depth: 0.12, bevelEnabled: false });
    const gnomon = new THREE.Mesh(gnomonGeo, sandstone);
    gnomon.position.z = -0.06;
    gnomon.castShadow = true;
    subGroup.add(gnomon);

    // Scale arc
    const arcGeo = new THREE.TorusGeometry(0.45, 0.03, 8, 32, Math.PI * 0.8);
    const arc = new THREE.Mesh(arcGeo, marble);
    arc.position.y = 0.05;
    arc.rotation.z = -Math.PI * 0.1;
    subGroup.add(arc);

    // Bronze indicator pin
    const pinGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
    const pin = new THREE.Mesh(pinGeo, bronze);
    pin.position.y = 0.25;
    pin.rotation.x = latRad * 0.4;
    subGroup.add(pin);

    subGroup.position.set(Math.cos(angle) * r, baseH, Math.sin(angle) * r);
    subGroup.rotation.y = -angle + Math.PI * 0.5;
    group.add(subGroup);
  }

  // Center elevation marker
  const centerH = 0.35;
  const centerGeo = new THREE.CylinderGeometry(0.25, 0.3, centerH, 24);
  const center = new THREE.Mesh(centerGeo, marble);
  center.position.y = baseH + centerH / 2;
  group.add(center);

  const sphereGeo = new THREE.SphereGeometry(0.1, 16, 8);
  const sphere = new THREE.Mesh(sphereGeo, bronze);
  sphere.position.y = baseH + centerH + 0.1;
  group.add(sphere);

  return group;
}

function buildDigamsa(latRad: number): THREE.Group {
  const group = new THREE.Group();
  const sandstone = createSandstoneMaterial();
  const marble = createMarbleMaterial();
  const bronze = createBronzeMaterial();
  const weathered = createWeatheredSandstoneMaterial();

  const outerR = 2.6;
  const innerR = 1.5;
  const wallH = 1.0;

  // 1. Foundation ring plinth
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(outerR + 0.35, outerR + 0.5, 0.2, 64), weathered);
  plinth.position.y = 0.1;
  plinth.receiveShadow = true;
  group.add(plinth);

  // 2. Outer cylindrical wall with 4 arched cardinal doorways (N, S, E, W)
  for (let q = 0; q < 4; q++) {
    const startAngle = q * (Math.PI / 2) + 0.12;
    const arcAngle = Math.PI / 2 - 0.24; // leaves doorway gap
    const wallGeo = new THREE.CylinderGeometry(outerR, outerR + 0.15, wallH, 32, 1, true, startAngle, arcAngle);
    const wallMesh = new THREE.Mesh(wallGeo, sandstone);
    wallMesh.position.y = 0.2 + wallH / 2;
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    group.add(wallMesh);

    // Marble coping on each wall quadrant
    const copingGeo = new THREE.TorusGeometry(outerR + 0.07, 0.08, 8, 32, arcAngle);
    copingGeo.rotateX(Math.PI / 2);
    copingGeo.rotateZ(startAngle);
    const copingMesh = new THREE.Mesh(copingGeo, marble);
    copingMesh.position.y = 0.2 + wallH;
    copingMesh.castShadow = true;
    group.add(copingMesh);

    // Doorway stone architrave pilasters
    for (const dEnd of [startAngle, startAngle + arcAngle]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.18, wallH + 0.08, 0.22), marble);
      post.position.set(Math.cos(dEnd) * outerR, 0.2 + wallH / 2, Math.sin(dEnd) * outerR);
      post.rotation.y = -dEnd;
      post.castShadow = true;
      group.add(post);
    }
  }

  // 3. Inner cylindrical wall
  const innerWallGeo = new THREE.CylinderGeometry(innerR, innerR + 0.12, wallH * 0.85, 48, 1, true);
  const innerWall = new THREE.Mesh(innerWallGeo, sandstone);
  innerWall.position.y = 0.2 + (wallH * 0.85) / 2;
  innerWall.castShadow = true;
  group.add(innerWall);

  const innerCoping = new THREE.Mesh(new THREE.TorusGeometry(innerR + 0.06, 0.07, 8, 48), marble);
  innerCoping.rotateX(Math.PI / 2);
  innerCoping.position.y = 0.2 + wallH * 0.85;
  group.add(innerCoping);

  // 4. Annular floor walkway between walls
  const annularGeo = new THREE.RingGeometry(innerR + 0.12, outerR - 0.02, 64);
  annularGeo.rotateX(-Math.PI / 2);
  const annular = new THREE.Mesh(annularGeo, weathered);
  annular.position.y = 0.205;
  annular.receiveShadow = true;
  group.add(annular);

  // 5. 360-degree graduated bronze & marble azimuth markers on the outer wall top
  for (let i = 0; i < 36; i++) {
    const angle = (i * Math.PI * 2) / 36;
    const isCardinal = i % 9 === 0;
    const markGeo = new THREE.BoxGeometry(0.035, isCardinal ? 0.08 : 0.04, isCardinal ? 0.14 : 0.08);
    const mark = new THREE.Mesh(markGeo, isCardinal ? marble : bronze);
    mark.position.set(Math.cos(angle) * (outerR + 0.06), 0.2 + wallH + 0.04, Math.sin(angle) * (outerR + 0.06));
    mark.rotation.y = -angle;
    group.add(mark);
  }

  // 6. Central pillar with bronze sighting pin
  const pillarH = 1.45;
  const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, pillarH, 24), bronze);
  pillar.position.y = 0.2 + pillarH / 2;
  pillar.castShadow = true;
  group.add(pillar);

  const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 12), marble);
  pin.position.y = 0.2 + pillarH + 0.2;
  group.add(pin);

  // 7. Stretched crosshair sighting wires
  for (const angle of [0, Math.PI / 2, Math.PI, Math.PI * 1.5]) {
    const wirePts = [
      new THREE.Vector3(Math.cos(angle) * 0.2, 0.2 + wallH * 0.86, Math.sin(angle) * 0.2),
      new THREE.Vector3(Math.cos(angle) * (outerR - 0.1), 0.2 + wallH * 0.86, Math.sin(angle) * (outerR - 0.1)),
    ];
    const wireGeo = new THREE.BufferGeometry().setFromPoints(wirePts);
    group.add(new THREE.Line(wireGeo, new THREE.LineBasicMaterial({ color: 0xd4963f, linewidth: 2 })));
  }

  // Entrance steps on 4 cardinal directions
  for (let c = 0; c < 4; c++) {
    const cAngle = c * (Math.PI / 2);
    for (let st = 0; st < 2; st++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.1, 0.2), weathered);
      step.position.set(
        Math.cos(cAngle) * (outerR + 0.2 + st * 0.18),
        0.05 + (1 - st) * 0.1,
        Math.sin(cAngle) * (outerR + 0.2 + st * 0.18)
      );
      step.rotation.y = -cAngle + Math.PI / 2;
      group.add(step);
    }
  }

  return group;
}

function buildGolayantra(latRad: number): THREE.Group {
  const group = new THREE.Group();
  const bronze = createBronzeMaterial();
  const oxidized = createOxidizedBronzeMaterial();
  const marble = createMarbleMaterial();
  const darkStone = createDarkStoneMaterial();

  const R = 1.6;
  const pedBaseH = 0.35;
  const pedStemH = 1.1;

  // Upright Pedestal Base sitting firmly on ground at y = 0
  const pedBase = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, pedBaseH, 24), createWeatheredSandstoneMaterial());
  pedBase.position.y = pedBaseH / 2;
  pedBase.castShadow = true;
  pedBase.receiveShadow = true;
  group.add(pedBase);

  // Decorative pedestal base molding
  const moldingGeo = new THREE.TorusGeometry(0.78, 0.04, 8, 32);
  moldingGeo.rotateX(Math.PI / 2);
  const molding = new THREE.Mesh(moldingGeo, bronze);
  molding.position.y = pedBaseH;
  group.add(molding);

  // Upright Pedestal Stem
  const pedStem = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.55, pedStemH, 20), createSandstoneMaterial());
  pedStem.position.y = pedBaseH + pedStemH / 2;
  pedStem.castShadow = true;
  group.add(pedStem);

  // Collar ring at stem top
  const collarGeo = new THREE.TorusGeometry(0.35, 0.05, 8, 24);
  collarGeo.rotateX(Math.PI / 2);
  const collar = new THREE.Mesh(collarGeo, bronze);
  collar.position.y = pedBaseH + pedStemH;
  group.add(collar);

  // Armillary sphere assembly centered atop the pedestal
  const sphereCenterY = pedBaseH + pedStemH + R + 0.15;
  const sphereGroup = new THREE.Group();
  sphereGroup.position.y = sphereCenterY;

  // Equatorial ring (thicker, primary ring)
  const eqGeo = new THREE.TorusGeometry(R, 0.06, 16, 80);
  const eqRing = new THREE.Mesh(eqGeo, bronze);
  eqRing.castShadow = true;
  sphereGroup.add(eqRing);

  // Tropic of Cancer ring
  const tropicAngle = THREE.MathUtils.degToRad(23.44);
  const tropicR = R * Math.cos(tropicAngle);
  const cancerRing = new THREE.Mesh(new THREE.TorusGeometry(tropicR, 0.025, 10, 48), oxidized);
  cancerRing.position.y = R * Math.sin(tropicAngle);
  cancerRing.castShadow = true;
  sphereGroup.add(cancerRing);

  // Tropic of Capricorn ring
  const capricornRing = new THREE.Mesh(new THREE.TorusGeometry(tropicR, 0.025, 10, 48), oxidized);
  capricornRing.position.y = -R * Math.sin(tropicAngle);
  capricornRing.castShadow = true;
  sphereGroup.add(capricornRing);

  // Hour circles (6 meridian rings at 30° intervals)
  for (let i = 0; i < 6; i++) {
    const hRing = new THREE.Mesh(new THREE.TorusGeometry(R, 0.03, 10, 64), oxidized);
    hRing.rotation.y = (i * Math.PI) / 6;
    hRing.castShadow = true;
    sphereGroup.add(hRing);
  }

  // Ecliptic ring (thicker, prominent)
  const eclipticRing = new THREE.Mesh(new THREE.TorusGeometry(R, 0.055, 14, 72), marble);
  eclipticRing.rotation.x = THREE.MathUtils.degToRad(23.44);
  eclipticRing.rotation.z = THREE.MathUtils.degToRad(10);
  eclipticRing.castShadow = true;
  sphereGroup.add(eclipticRing);

  // Zodiac markers on ecliptic (12 small spheres)
  for (let z = 0; z < 12; z++) {
    const zodiacAngle = (z * Math.PI * 2) / 12;
    const zodiacGeo = new THREE.SphereGeometry(0.035, 8, 6);
    const zodiacMarker = new THREE.Mesh(zodiacGeo, bronze);
    const zx = Math.cos(zodiacAngle) * R;
    const zy = Math.sin(zodiacAngle) * R;
    zodiacMarker.position.set(zx, 0, zy);
    // Apply same rotation as ecliptic
    const eclipticGroup = new THREE.Group();
    eclipticGroup.rotation.x = THREE.MathUtils.degToRad(23.44);
    eclipticGroup.rotation.z = THREE.MathUtils.degToRad(10);
    eclipticGroup.add(zodiacMarker);
    sphereGroup.add(eclipticGroup);
  }

  // Horizon ring (larger, horizontal)
  const horizonRing = new THREE.Mesh(new THREE.TorusGeometry(R * 1.12, 0.04, 12, 64), darkStone);
  horizonRing.castShadow = true;
  sphereGroup.add(horizonRing);

  // Polar axis rod
  const poleGeo = new THREE.CylinderGeometry(0.03, 0.03, R * 2 + 0.4, 12);
  const poleRod = new THREE.Mesh(poleGeo, bronze);
  poleRod.castShadow = true;
  sphereGroup.add(poleRod);

  // Polar caps with decorative finials
  const capGeo = new THREE.SphereGeometry(0.08, 12, 6);
  [-1, 1].forEach((dir) => {
    const cap = new THREE.Mesh(capGeo, bronze);
    cap.position.set(0, dir * (R + 0.18), 0);
    sphereGroup.add(cap);

    // Small decorative spike
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.12, 8), bronze);
    spike.position.set(0, dir * (R + 0.32), 0);
    if (dir < 0) spike.rotation.x = Math.PI;
    sphereGroup.add(spike);
  });

  // Crosshair sighting wires (perpendicular to polar axis)
  for (const angle of [0, Math.PI / 2]) {
    const wireGeo = new THREE.CylinderGeometry(0.01, 0.01, R * 2, 8);
    wireGeo.rotateZ(Math.PI / 2);
    wireGeo.rotateY(angle);
    const wire = new THREE.Mesh(wireGeo, bronze);
    sphereGroup.add(wire);
  }

  // Tilt ONLY the armillary sphere according to latitude, NOT the pedestal!
  sphereGroup.rotation.z = latRad - Math.PI / 2;
  group.add(sphereGroup);

  return group;
}

function buildBhitti(): THREE.Group {
  const group = new THREE.Group();
  const sandstone = createSandstoneMaterial();
  const marble = createMarbleMaterial();
  const bronze = createBronzeMaterial();
  const weathered = createWeatheredSandstoneMaterial();

  const W = 4.4;
  const H = 2.6;
  const D = 0.5;

  // Foundation plinth
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(W + 0.4, 0.24, D + 0.3), weathered);
  plinth.position.y = 0.12;
  plinth.receiveShadow = true;
  group.add(plinth);

  // Main wall body
  const wall = new THREE.Mesh(new THREE.BoxGeometry(W, H, D), sandstone);
  wall.position.y = 0.24 + H / 2;
  wall.castShadow = true;
  wall.receiveShadow = true;
  group.add(wall);

  // Front marble cladding face
  const face = new THREE.Mesh(new THREE.BoxGeometry(W * 0.94, H * 0.92, 0.04), marble);
  face.position.set(0, 0.24 + H / 2, D / 2 + 0.02);
  face.castShadow = true;
  group.add(face);

  // Heavy stepped buttresses supporting wall
  for (const side of [-1, 1]) {
    const buttress = new THREE.Mesh(new THREE.BoxGeometry(0.35, H, 1.1), weathered);
    buttress.position.set(side * (W / 2 + 0.16), 0.24 + H / 2, -0.32);
    buttress.castShadow = true;
    group.add(buttress);
  }

  // Meridian quadrant arc on marble face
  const arcR = 1.6;
  const arcGeo = new THREE.TorusGeometry(arcR, 0.04, 12, 64, Math.PI * 0.52);
  const arc = new THREE.Mesh(arcGeo, bronze);
  arc.position.set(0.4, 0.24 + H * 0.72, D / 2 + 0.05);
  arc.castShadow = true;
  group.add(arc);

  // Degree graduations
  for (let i = 0; i <= 15; i++) {
    const angle = (i / 15) * Math.PI * 0.52;
    const mark = new THREE.Mesh(
      new THREE.BoxGeometry(i % 3 === 0 ? 0.12 : 0.06, 0.025, 0.02),
      bronze
    );
    mark.position.set(
      0.4 - Math.sin(angle) * arcR,
      0.24 + H * 0.72 - Math.cos(angle) * arcR,
      D / 2 + 0.06
    );
    group.add(mark);
  }

  // Pinhole solar gnomon aperture plate at center of arc
  const pinhole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.04, 16), bronze);
  pinhole.rotation.x = Math.PI / 2;
  pinhole.position.set(0.4, 0.24 + H * 0.72, D / 2 + 0.05);
  group.add(pinhole);

  // Top coping course
  const coping = new THREE.Mesh(new THREE.BoxGeometry(W + 0.12, 0.18, D + 0.12), marble);
  coping.position.y = 0.24 + H + 0.09;
  coping.castShadow = true;
  group.add(coping);

  // Side inspection ladder / stairs
  for (let st = 0; st < 8; st++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, 0.14), weathered);
    step.position.set(-W / 2 - 0.25, 0.24 + st * 0.3, 0);
    group.add(step);
  }

  return group;
}

function buildDakshinottaraBhitti(latRad: number): THREE.Group {
  const group = new THREE.Group();
  const sandstone = createSandstoneMaterial();
  const marble = createMarbleMaterial();
  const bronze = createBronzeMaterial();
  const weathered = createWeatheredSandstoneMaterial();

  const wallL = 5.2;
  const wallH = 3.0;
  const wallThick = 0.75;
  const arcR = 2.1;

  // 1. Plinth foundation
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(wallL + 0.6, 0.28, wallThick + 0.4),
    weathered
  );
  plinth.position.y = 0.14;
  plinth.receiveShadow = true;
  group.add(plinth);

  // 2. Colossal Meridian Wall aligned strictly North-South (along Z axis)
  const wallGeo = new THREE.BoxGeometry(wallThick, wallH, wallL);
  const wall = new THREE.Mesh(wallGeo, sandstone);
  wall.position.y = 0.28 + wallH / 2;
  wall.castShadow = true;
  wall.receiveShadow = true;
  group.add(wall);

  // 3. Dual Marble Quadrant Scales: Eastern Face (+X) and Western Face (-X)
  for (const side of [-1, 1]) {
    const faceX = side * (wallThick / 2 + 0.02);

    // Marble veneer cladding on both wall faces
    const veneer = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, wallH * 0.92, wallL * 0.94),
      marble
    );
    veneer.position.set(faceX, 0.28 + wallH / 2, 0);
    veneer.castShadow = true;
    group.add(veneer);

    // Bronze Quadrant Arc on each face (centered at upper observation aperture)
    const arcGeo = new THREE.TorusGeometry(arcR, 0.045, 12, 64, Math.PI * 0.52);
    arcGeo.rotateY(Math.PI / 2);
    arcGeo.rotateX(side > 0 ? 0 : Math.PI);
    const arc = new THREE.Mesh(arcGeo, bronze);
    arc.position.set(side * (wallThick / 2 + 0.05), 0.28 + wallH * 0.72, 0.4);
    arc.castShadow = true;
    group.add(arc);

    // Scale degree graduations along the quadrant arc
    for (let d = 0; d <= 18; d++) {
      const angle = (d / 18) * (Math.PI * 0.52);
      const dy = -Math.sin(angle) * arcR;
      const dz = -Math.cos(angle) * arcR;
      const tick = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, d % 3 === 0 ? 0.08 : 0.04, 0.015),
        bronze
      );
      tick.position.set(side * (wallThick / 2 + 0.06), 0.28 + wallH * 0.72 + dy, 0.4 + dz);
      group.add(tick);
    }

    // Pinhole gnomon aperture plate at the top of the quadrant
    const pinholePlate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.04, 16),
      bronze
    );
    pinholePlate.rotation.z = Math.PI / 2;
    pinholePlate.position.set(side * (wallThick / 2 + 0.05), 0.28 + wallH * 0.72, 0.4);
    group.add(pinholePlate);
  }

  // 4. North and South access staircases leading to the upper observation terrace
  const stairCount = 10;
  for (const end of [-1, 1]) {
    for (let s = 0; s < stairCount; s++) {
      const t = (s + 0.5) / stairCount;
      const stepH = (wallH / stairCount) * 0.9;
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(wallThick * 0.85, stepH, 0.18),
        marble
      );
      const sz = end * (wallL / 2 + (stairCount - s) * 0.16);
      const sy = 0.28 + t * (wallH * 0.85);
      step.position.set(0, sy, sz);
      step.castShadow = true;
      group.add(step);
    }
  }

  // 5. Upper catwalk and coping terrace
  const coping = new THREE.Mesh(
    new THREE.BoxGeometry(wallThick + 0.15, 0.16, wallL + 0.15),
    marble
  );
  coping.position.y = 0.28 + wallH + 0.08;
  coping.castShadow = true;
  group.add(coping);

  // Parapet balustrades along upper walkway
  for (const side of [-1, 1]) {
    const parapet = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.35, wallL * 0.9),
      marble
    );
    parapet.position.set(side * (wallThick / 2 + 0.03), 0.28 + wallH + 0.16 + 0.175, 0);
    parapet.castShadow = true;
    group.add(parapet);
  }

  // Zenith observation sighting vane on top terrace
  const zenithSight = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.45, 12),
    bronze
  );
  zenithSight.position.set(0, 0.28 + wallH + 0.4, 0);
  group.add(zenithSight);

  return group;
}

function buildNadiValaya(latRad: number): THREE.Group {
  const group = new THREE.Group();
  const sandstone = createSandstoneMaterial();
  const marble = createMarbleMaterial();
  const bronze = createBronzeMaterial();

  const dialR = 1.5;
  const dialThick = 0.3;
  const baseH = 0.35;
  const stemH = 1.3;

  // Upright stand base sitting on ground at y = 0
  const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.7, baseH, 24), createWeatheredSandstoneMaterial());
  standBase.position.y = baseH / 2;
  standBase.castShadow = true;
  standBase.receiveShadow = true;
  group.add(standBase);

  // Upright stand stem
  const standStem = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.4, stemH, 20), sandstone);
  standStem.position.y = baseH + stemH / 2;
  standStem.castShadow = true;
  group.add(standStem);

  // Dial assembly mounted atop the stem
  const dialGroup = new THREE.Group();
  dialGroup.position.y = baseH + stemH + 0.2;

  // Dial disc
  const dialGeo = new THREE.CylinderGeometry(dialR, dialR, dialThick, 64);
  const dial = new THREE.Mesh(dialGeo, sandstone);
  dial.castShadow = true;
  dial.receiveShadow = true;

  // Marble face (summer side)
  const faceS = new THREE.Mesh(new THREE.CircleGeometry(dialR * 0.96, 64), marble);
  faceS.position.y = dialThick / 2 + 0.005;
  dial.add(faceS);

  // Marble face (winter side)  
  const faceW = new THREE.Mesh(new THREE.CircleGeometry(dialR * 0.96, 64), marble);
  faceW.position.y = -(dialThick / 2 + 0.005);
  faceW.rotation.x = Math.PI;
  dial.add(faceW);

  // Hour lines on dial faces
  for (let h = 0; h < 24; h++) {
    const angle = (h * Math.PI * 2) / 24;
    for (const faceDir of [1, -1]) {
      const linePts = [
        new THREE.Vector3(Math.cos(angle) * dialR * 0.35, faceDir * (dialThick / 2 + 0.01), Math.sin(angle) * dialR * 0.35),
        new THREE.Vector3(Math.cos(angle) * dialR * 0.92, faceDir * (dialThick / 2 + 0.01), Math.sin(angle) * dialR * 0.92),
      ];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts);
      const lineMat = new THREE.LineBasicMaterial({
        color: h % 6 === 0 ? 0xcb8e3e : 0x8a6040,
        transparent: true,
        opacity: h % 6 === 0 ? 0.9 : 0.4,
      });
      dial.add(new THREE.Line(lineGeo, lineMat));
    }
  }

  // Rim ring
  const rimGeo = new THREE.TorusGeometry(dialR, 0.06, 12, 72);
  rimGeo.rotateX(Math.PI / 2);
  dial.add(new THREE.Mesh(rimGeo, marble));

  // Bronze gnomon rod through dial center
  const gnomon = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, dialThick + 1.4, 12), bronze);
  gnomon.castShadow = true;
  dial.add(gnomon);

  // Apply latitude tilt to dial disc only
  dial.rotation.x = latRad;
  dialGroup.add(dial);
  group.add(dialGroup);

  return group;
}

function buildDhruvaProthaChakra(latRad: number): THREE.Group {
  const group = new THREE.Group();
  const sandstone = createSandstoneMaterial();
  const marble = createMarbleMaterial();
  const bronze = createBronzeMaterial();

  // Tiered foundation
  [2.4, 2.0, 1.6].forEach((s, i) => {
    const step = new THREE.Mesh(new THREE.BoxGeometry(s, 0.22, s * 0.7), sandstone);
    step.position.y = 0.11 + i * 0.22;
    step.castShadow = true;
    step.receiveShadow = true;
    group.add(step);
  });

  const baseH = 0.66;
  const pillarH = 2.2;
  const pillarSpacing = 1.1;

  // Twin meridian upright masonry pillars
  for (const side of [-1, 1]) {
    const pillarGeo = new THREE.BoxGeometry(0.24, pillarH, 0.45);
    const pillar = new THREE.Mesh(pillarGeo, createWeatheredSandstoneMaterial());
    pillar.position.set(side * (pillarSpacing / 2), baseH + pillarH / 2, 0);
    pillar.castShadow = true;
    group.add(pillar);

    // Marble top cap
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.5), marble);
    cap.position.set(side * (pillarSpacing / 2), baseH + pillarH + 0.06, 0);
    group.add(cap);
  }

  // Cross axle between pillars
  const axleY = baseH + pillarH * 0.65;
  const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, pillarSpacing + 0.2, 16), bronze);
  axle.rotation.z = Math.PI / 2;
  axle.position.y = axleY;
  group.add(axle);

  // Rotating polar chakra ring assembly (tilted towards celestial pole = latRad)
  const chakraGroup = new THREE.Group();
  chakraGroup.position.set(0, axleY, 0);
  chakraGroup.rotation.x = latRad - Math.PI / 2;

  // Outer brass graduated ring
  const ringGeo = new THREE.TorusGeometry(0.85, 0.045, 12, 64);
  const ring = new THREE.Mesh(ringGeo, bronze);
  ring.castShadow = true;
  chakraGroup.add(ring);

  // Inner sighting quadrant cross
  for (const rot of [0, Math.PI / 2]) {
    const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.7, 8), bronze);
    spoke.rotation.z = rot;
    chakraGroup.add(spoke);
  }

  // Polar sight aperture tube
  const sightTube = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 16), marble);
  sightTube.rotation.x = Math.PI / 2;
  chakraGroup.add(sightTube);

  group.add(chakraGroup);
  return group;
}

function buildSamratCombo(latRad: number): THREE.Group {
  const group = new THREE.Group();
  const sandstone = createSandstoneMaterial();
  const marble = createMarbleMaterial();
  const bronze = createBronzeMaterial();
  const weathered = createWeatheredSandstoneMaterial();

  const baseL = 3.2;
  const gH = baseL * Math.tan(latRad);
  const foundationY = 0.44;

  // Foundation
  [3.6, 3.2].forEach((w, i) => {
    const step = new THREE.Mesh(new THREE.BoxGeometry(w, 0.22, 1.4 - i * 0.2), weathered);
    step.position.y = 0.11 + i * 0.22;
    step.castShadow = true;
    group.add(step);
  });

  // Triangular gnomon
  const gnomonShape = new THREE.Shape();
  gnomonShape.moveTo(-baseL / 2, 0);
  gnomonShape.lineTo(baseL / 2, 0);
  gnomonShape.lineTo(-baseL / 2, gH);
  gnomonShape.closePath();

  const gnomonGeo = new THREE.ExtrudeGeometry(gnomonShape, { depth: 0.32, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03 });
  gnomonGeo.translate(0, 0, -0.16);
  const gnomon = new THREE.Mesh(gnomonGeo, sandstone);
  gnomon.position.set(0, foundationY, 0);
  gnomon.castShadow = true;
  gnomon.receiveShadow = true;
  group.add(gnomon);

  // Marble hypotenuse ramp
  const hypoLen = Math.sqrt(baseL * baseL + gH * gH);
  const hypoAngle = Math.atan2(gH, baseL);
  const hypo = new THREE.Mesh(new THREE.BoxGeometry(hypoLen, 0.06, 0.36), marble);
  hypo.position.set(0, foundationY + gH * 0.5, 0);
  hypo.rotation.z = -hypoAngle;
  hypo.castShadow = true;
  group.add(hypo);

  // Steps along hypotenuse
  const stairCount = 10;
  for (let s = 0; s < stairCount; s++) {
    const t = (s + 0.5) / stairCount;
    const sx = baseL / 2 - t * baseL;
    const sy = foundationY + t * gH;
    const step = new THREE.Mesh(new THREE.BoxGeometry((hypoLen / stairCount) * 0.85, 0.025, 0.34), marble);
    step.position.set(sx, sy + 0.04, 0);
    step.rotation.z = -hypoAngle;
    step.castShadow = true;
    group.add(step);
  }

  // Apex chhatri
  const chhatri = new THREE.Group();
  chhatri.position.set(-baseL / 2, foundationY + gH, 0);
  const chhatriBase = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.05, 0.48), marble);
  chhatri.add(chhatriBase);
  [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].forEach(([px, pz]) => {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.36, 10), sandstone);
    col.position.set(px, 0.05 + 0.18, pz);
    chhatri.add(col);
  });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), sandstone);
  dome.position.y = 0.05 + 0.36;
  dome.castShadow = true;
  chhatri.add(dome);
  const finial = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.12, 8), bronze);
  finial.position.y = 0.05 + 0.36 + 0.22 + 0.06;
  chhatri.add(finial);
  group.add(chhatri);

  // Dual quadrant arcs with graduations
  const arcR = Math.max(1.9, gH * 0.95);
  for (const side of [-1, 1]) {
    const arcGeo = new THREE.CylinderGeometry(arcR, arcR + 0.12, 0.44, 48, 1, true, 0, Math.PI * 0.52);
    arcGeo.rotateX(Math.PI / 2);
    arcGeo.rotateZ(latRad - Math.PI / 2 + 0.05);
    const arcMesh = new THREE.Mesh(arcGeo, marble);
    arcMesh.position.set(side * 0.65, foundationY + gH * 0.38, 0);
    arcMesh.scale.x = side;
    arcMesh.castShadow = true;
    group.add(arcMesh);

    // Supporting pier
    const pier = new THREE.Mesh(new THREE.BoxGeometry(0.2, gH * 0.35, 0.35), weathered);
    pier.position.set(side * 0.65, foundationY + gH * 0.18, 0);
    pier.castShadow = true;
    group.add(pier);
  }

  // Integrated southern sighting chakra ring (the "combo" celestial unit)
  const chakraGroup = new THREE.Group();
  chakraGroup.position.set(baseL / 2 + 0.6, foundationY + 0.4, 0);
  const chakraRing = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.045, 12, 48), bronze);
  chakraRing.rotation.y = Math.PI / 2;
  chakraRing.rotation.x = latRad;
  chakraRing.castShadow = true;
  chakraGroup.add(chakraRing);

  // Cross spokes on chakra
  for (const a of [0, Math.PI / 2]) {
    const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.36, 8), bronze);
    spoke.rotation.x = latRad;
    spoke.rotation.z = a;
    chakraGroup.add(spoke);
  }

  const chakraPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.85, 16), weathered);
  chakraPillar.position.y = -0.42;
  chakraPillar.castShadow = true;
  chakraGroup.add(chakraPillar);

  group.add(chakraGroup);
  return group;
}

function buildChaapa(latRad: number): THREE.Group {
  const group = new THREE.Group();
  const sandstone = createSandstoneMaterial();
  const marble = createMarbleMaterial();
  const bronze = createBronzeMaterial();

  // Circular tiered masonry base
  [2.2, 1.8, 1.4].forEach((r, i) => {
    const step = new THREE.Mesh(new THREE.CylinderGeometry(r, r + 0.1, 0.22, 36), sandstone);
    step.position.y = 0.11 + i * 0.22;
    step.castShadow = true;
    step.receiveShadow = true;
    group.add(step);
  });

  const baseH = 0.66;
  const pierH = 1.8;

  // Central meridian support pier
  const pier = new THREE.Mesh(new THREE.BoxGeometry(0.5, pierH, 0.5), createWeatheredSandstoneMaterial());
  pier.position.y = baseH + pierH / 2;
  pier.castShadow = true;
  group.add(pier);

  // Large curved bow-shaped arc (Chaapa / Dhanur arc)
  const arcRadius = 1.5;
  const arcTube = 0.055;
  const arcGeo = new THREE.TorusGeometry(arcRadius, arcTube, 16, 64, Math.PI * 0.667);
  arcGeo.rotateZ(-Math.PI * 0.333);
  const arcMesh = new THREE.Mesh(arcGeo, bronze);
  arcMesh.position.set(0, baseH + pierH * 0.7, 0.28);
  arcMesh.castShadow = true;
  group.add(arcMesh);

  // Marble graduated scale facing plate attached to arc
  const scaleGeo = new THREE.TorusGeometry(arcRadius - 0.02, 0.02, 8, 64, Math.PI * 0.667);
  scaleGeo.rotateZ(-Math.PI * 0.333);
  const scaleMesh = new THREE.Mesh(scaleGeo, marble);
  scaleMesh.position.set(0, baseH + pierH * 0.7, 0.29);
  group.add(scaleMesh);

  // Bronze central sighting pin
  const gnomonPin = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 12), bronze);
  gnomonPin.rotation.x = Math.PI / 2;
  gnomonPin.position.set(0, baseH + pierH * 0.7, 0.32);
  group.add(gnomonPin);

  // Vernier cursor traveler on arc
  const cursor = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.08), bronze);
  const curAngle = Math.PI * 0.15;
  cursor.position.set(Math.cos(curAngle) * arcRadius, baseH + pierH * 0.7 + Math.sin(curAngle) * arcRadius, 0.28);
  group.add(cursor);

  return group;
}

function buildPalaka(): THREE.Group {
  const group = new THREE.Group();
  const sandstone = createSandstoneMaterial();
  const marble = createMarbleMaterial();
  const bronze = createBronzeMaterial();

  // Stepped masonry pedestal
  const pedGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.7, 32);
  const ped = new THREE.Mesh(pedGeo, createWeatheredSandstoneMaterial());
  ped.position.y = 0.35;
  ped.castShadow = true;
  ped.receiveShadow = true;
  group.add(ped);

  // Rectangular calculating board (Palaka)
  const boardL = 2.4;
  const boardW = 1.6;
  const boardH = 0.12;

  const board = new THREE.Mesh(new THREE.BoxGeometry(boardL, boardH, boardW), sandstone);
  board.position.y = 0.7 + boardH / 2;
  board.castShadow = true;
  board.receiveShadow = true;
  group.add(board);

  // Polished marble face inlay
  const face = new THREE.Mesh(new THREE.BoxGeometry(boardL * 0.92, 0.02, boardW * 0.9), marble);
  face.position.y = 0.7 + boardH + 0.01;
  group.add(face);

  // Central gnomon rod (Shanku)
  const shanku = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.04, 0.65, 16), bronze);
  shanku.position.y = 0.7 + boardH + 0.325;
  shanku.castShadow = true;
  group.add(shanku);

  // Coordinate grid lines etched on the board
  for (let i = -4; i <= 4; i++) {
    const x = (i / 4) * (boardL * 0.42);
    const linePts = [
      new THREE.Vector3(x, 0.7 + boardH + 0.022, -boardW * 0.42),
      new THREE.Vector3(x, 0.7 + boardH + 0.022, boardW * 0.42),
    ];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts);
    group.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0x906040, transparent: true, opacity: i === 0 ? 0.9 : 0.4 })));
  }
  for (let j = -3; j <= 3; j++) {
    const z = (j / 3) * (boardW * 0.42);
    const linePts = [
      new THREE.Vector3(-boardL * 0.42, 0.7 + boardH + 0.022, z),
      new THREE.Vector3(boardL * 0.42, 0.7 + boardH + 0.022, z),
    ];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts);
    group.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0x906040, transparent: true, opacity: j === 0 ? 0.9 : 0.4 })));
  }

  // Concentric shadow circles on board
  for (const r of [0.35, 0.7, 1.05]) {
    const circGeo = new THREE.RingGeometry(r - 0.008, r + 0.008, 48);
    circGeo.rotateX(-Math.PI / 2);
    const circMesh = new THREE.Mesh(circGeo, bronze);
    circMesh.position.y = 0.7 + boardH + 0.022;
    group.add(circMesh);
  }

  return group;
}

function buildDefault(): THREE.Group {
  const group = new THREE.Group();
  const sandstone = createSandstoneMaterial();
  const marble = createMarbleMaterial();
  const bronze = createBronzeMaterial();

  // Stepped base: 3 steps of 0.25 height each
  [2.0, 1.6, 1.2].forEach((s, i) => {
    const step = new THREE.Mesh(new THREE.BoxGeometry(s, 0.25, s), sandstone);
    step.position.y = 0.125 + i * 0.25;
    step.castShadow = true;
    step.receiveShadow = true;
    group.add(step);
  });

  // Main body
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.2, 1.0), sandstone);
  body.position.y = 1.35;
  body.castShadow = true;
  group.add(body);

  // Marble cap
  const cap = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.18, 1.1), marble);
  cap.position.y = 2.04;
  group.add(cap);

  // Bronze indicator sphere
  const indicator = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 8), bronze);
  indicator.position.y = 2.25;
  group.add(indicator);

  return group;
}

// Helpers for zero-teardown instrument swapping

function buildInstrumentGroup(yantraId: Yantra['id'], latitude?: number): THREE.Group {
  const safeLat = typeof latitude === 'number' && !isNaN(latitude) ? latitude : 26.9124;
  const latRad = (Math.max(5, Math.min(85, Math.abs(safeLat))) * Math.PI) / 180;
  let object: THREE.Group;

  switch (yantraId) {
    case 'samrat': object = buildSamrat(latRad); break;
    case 'rama': object = buildRama(latRad); break;
    case 'jai-prakash': object = buildJaiPrakash(latRad); break;
    case 'rasivalaya': object = buildRasivalaya(latRad); break;
    case 'digamsa': object = buildDigamsa(latRad); break;
    case 'dhruva-protha-chakra': object = buildDhruvaProthaChakra(latRad); break;
    case 'yantra-samrat-combo': object = buildSamratCombo(latRad); break;
    case 'golayantra-chakra': object = buildGolayantra(latRad); break;
    case 'bhitti': object = buildBhitti(); break;
    case 'dakshinottara-bhitti': object = buildDakshinottaraBhitti(latRad); break;
    case 'nadi-valaya': object = buildNadiValaya(latRad); break;
    case 'palaka': object = buildPalaka(); break;
    case 'chaapa': object = buildChaapa(latRad); break;
    default: object = buildDefault(); break;
  }

  // Shadows
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  // Auto-align object: center in X & Z, and rest flush on ground plane at y = 0
  const initialBox = new THREE.Box3().setFromObject(object);
  const initialCenter = initialBox.getCenter(new THREE.Vector3());
  object.position.x = -initialCenter.x;
  object.position.z = -initialCenter.z;
  object.position.y = -initialBox.min.y;

  return object;
}

function disposeGroupTree(group: THREE.Object3D) {
  group.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry?.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach((m) => m.dispose());
      } else if (child.material) {
        child.material.dispose();
      }
    }
    if (child instanceof THREE.Line) {
      child.geometry?.dispose();
      (child.material as THREE.Material)?.dispose();
    }
    if (child instanceof THREE.Points) {
      child.geometry?.dispose();
      (child.material as THREE.Material)?.dispose();
    }
  });
}

// Main 3D viewport component

const YantraViewer = forwardRef<YantraViewerRef, YantraViewerProps>(
  ({ yantraId, latitude = 26.9124, isArMode = false, animateShadow = false }, ref) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const objectRef = useRef<THREE.Group | null>(null);

    // Persistent engine references for zero-teardown updates
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
    const hemisphereLightRef = useRef<THREE.HemisphereLight | null>(null);
    const bounceLightRef = useRef<THREE.PointLight | null>(null);
    const rimLightRef = useRef<THREE.DirectionalLight | null>(null);

    const animateShadowRef = useRef(animateShadow);
    animateShadowRef.current = animateShadow;

    const isVisibleRef = useRef(true);

    useImperativeHandle(ref, () => ({
      exportSTL: () => {
        if (!objectRef.current) return null;
        try {
          const exporter = new STLExporter();
          const stlString = exporter.parse(objectRef.current, { binary: false });
          return new Blob([stlString], { type: 'model/stl' });
        } catch (err) {
          console.error('Failed to export STL:', err);
          return null;
        }
      },
    }));

    // 1. Primary Engine Setup: Runs ONCE on mount
    useEffect(() => {
      const currentMount = mountRef.current;
      if (!currentMount) return;

      const width = currentMount.clientWidth || 600;
      const height = currentMount.clientHeight || 400;

      // Scene
      const scene = new THREE.Scene();
      scene.background = null;
      sceneRef.current = scene;

      // Atmospheric fog
      if (!isArMode) {
        scene.fog = new THREE.FogExp2(0x060810, 0.032);
      }

      // Camera — cinematic FOV
      const camera = new THREE.PerspectiveCamera(42, width / height, 0.05, 200);
      camera.position.set(4.5, 3.5, 6.5);
      cameraRef.current = camera;

      // High-performance WebGL Renderer (optimized pixelRatio and 1024 shadow map)
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      rendererRef.current = renderer;

      // HDR Environment Map for realistic reflections
      const envMap = createEnvironmentMap(renderer);
      scene.environment = envMap;

      // Clear any previous nodes before mounting canvas
      while (currentMount.firstChild) {
        currentMount.removeChild(currentMount.firstChild);
      }
      renderer.domElement.style.touchAction = 'none';
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      currentMount.appendChild(renderer.domElement);

      // Controls — smooth damping
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.minDistance = 1.5;
      controls.maxDistance = 40;
      controls.minPolarAngle = 0.1;
      controls.maxPolarAngle = Math.PI * 0.85;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.30;
      controlsRef.current = controls;

      // Scene lighting
      const hemisphereLight = new THREE.HemisphereLight(
        new THREE.Color(0xffeedd),
        new THREE.Color(0x2a1a0a),
        0.70
      );
      scene.add(hemisphereLight);
      hemisphereLightRef.current = hemisphereLight;

      // Key light — solar (optimized 1024x1024 shadow map for 4x faster rendering)
      const sunLight = new THREE.DirectionalLight(new THREE.Color(0xfff6e0), 3.2);
      sunLight.position.set(10, 16, 8);
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      sunLight.shadow.camera.near = 0.5;
      sunLight.shadow.camera.far = 60;
      sunLight.shadow.camera.left = -7;
      sunLight.shadow.camera.right = 7;
      sunLight.shadow.camera.top = 7;
      sunLight.shadow.camera.bottom = -7;
      sunLight.shadow.bias = -0.0003;
      sunLight.shadow.normalBias = 0.025;
      sunLight.shadow.radius = 2;
      scene.add(sunLight);
      sunLightRef.current = sunLight;

      // Fill light
      const fillLight = new THREE.DirectionalLight(new THREE.Color(0xb8d4f0), 0.55);
      fillLight.position.set(-8, 4, -6);
      scene.add(fillLight);

      // Warm bounce from below
      const bounceLight = new THREE.PointLight(new THREE.Color(0xff9a3c), 0.45, 22);
      bounceLight.position.set(0, -2, 3);
      scene.add(bounceLight);
      bounceLightRef.current = bounceLight;

      // Rim/edge light
      const rimLight = new THREE.DirectionalLight(new THREE.Color(0xffe8c0), 0.8);
      rimLight.position.set(-4, 8, -10);
      scene.add(rimLight);
      rimLightRef.current = rimLight;

      // Floating golden dust particles
      let dustParticles: THREE.Points | null = null;
      if (!isArMode) {
        dustParticles = createDustParticles(scene);
      }

      // Platform created flush at ground plane y = 0
      if (!isArMode) {
        createGround(scene, 0);
      }

      // Initial instrument build
      const initialObject = buildInstrumentGroup(yantraId, latitude);
      scene.add(initialObject);
      objectRef.current = initialObject;

      // Fit camera to centered object
      const box = new THREE.Box3().setFromObject(initialObject);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z, 2.5);
      camera.position.set(
        center.x + maxDim * 1.35,
        center.y + maxDim * 0.85,
        center.z + maxDim * 1.6
      );
      camera.lookAt(center);
      controls.target.copy(center);

      // Animation loop with visibility culling
      const clock = new THREE.Clock();
      let animationFrameId: number;

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        // Skip execution when viewer is not visible or tab is minimized
        if (!isVisibleRef.current) return;

        const elapsed = clock.getElapsedTime();

        if (dustParticles) {
          updateDustParticles(dustParticles, elapsed);
        }

        if (animateShadowRef.current) {
          renderer.shadowMap.autoUpdate = true;
          const dayFraction = (elapsed * 0.08) % 1;
          const sunAngle = dayFraction * Math.PI;
          const sunElevation = Math.sin(sunAngle);
          const sunEastWest = Math.cos(sunAngle);

          sunLight.position.set(
            sunEastWest * 16,
            Math.max(1.0, sunElevation * 16),
            (1 - sunElevation * 0.4) * 8
          );

          const isGoldenHour = dayFraction < 0.18 || dayFraction > 0.82;
          sunLight.color.setHSL(
            isGoldenHour ? 0.08 : 0.11,
            isGoldenHour ? 0.85 : 0.35,
            0.85 + sunElevation * 0.15
          );
          sunLight.intensity = Math.max(0.3, sunElevation * 3.5);
          hemisphereLight.intensity = Math.max(0.2, sunElevation * 0.70);
          bounceLight.intensity = Math.max(0.1, sunElevation * 0.5);
          rimLight.intensity = Math.max(0.3, sunElevation * 0.8);
        } else {
          // Static daylight coordinates
          sunLight.position.set(10, 16, 8);
          sunLight.intensity = 3.2;
          sunLight.color.set(0xfff6e0);
          hemisphereLight.intensity = 0.70;
          bounceLight.intensity = 0.45;
          rimLight.intensity = 0.8;
          renderer.shadowMap.autoUpdate = false;
        }

        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // IntersectionObserver & Visibility handling to save 100% GPU when offscreen
      const intersectionObserver = new IntersectionObserver((entries) => {
        const isIntersecting = entries[0]?.isIntersecting ?? true;
        isVisibleRef.current = isIntersecting && !document.hidden;
      }, { threshold: 0.05 });
      intersectionObserver.observe(currentMount);

      const handleVisibilityChange = () => {
        isVisibleRef.current = !document.hidden;
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Debounced resize handler for performance
      let resizeTimeout: ReturnType<typeof setTimeout>;
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          if (!currentMount) return;
          const w = currentMount.clientWidth;
          const h = currentMount.clientHeight;
          if (w === 0 || h === 0) return;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h, false);
        }, 30);
      };
      window.addEventListener('resize', handleResize);
      const resizeObserver = new ResizeObserver(() => handleResize());
      resizeObserver.observe(currentMount);

      // Clean cleanup only on unmount
      return () => {
        cancelAnimationFrame(animationFrameId);
        clearTimeout(resizeTimeout);
        intersectionObserver.disconnect();
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('resize', handleResize);
        resizeObserver.disconnect();
        controls.dispose();
        envMap.dispose();
        disposeGroupTree(scene);
        renderer.dispose();
        if (renderer.domElement?.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        while (currentMount.firstChild) {
          currentMount.removeChild(currentMount.firstChild);
        }
        sceneRef.current = null;
        rendererRef.current = null;
        cameraRef.current = null;
        controlsRef.current = null;
        objectRef.current = null;
      };
    }, [isArMode]);

    // 2. Ultra-Fast Instrument Swap Effect: 0.5ms mesh update without WebGL teardown
    useEffect(() => {
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      const renderer = rendererRef.current;
      if (!scene || !camera || !controls || !renderer) return;

      // Safely remove previous object
      if (objectRef.current) {
        scene.remove(objectRef.current);
        disposeGroupTree(objectRef.current);
        objectRef.current = null;
      }

      // Build requested new instrument
      const newObject = buildInstrumentGroup(yantraId, latitude);
      scene.add(newObject);
      objectRef.current = newObject;

      // Smoothly fit camera & controls target
      const box = new THREE.Box3().setFromObject(newObject);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z, 2.5);

      camera.position.set(
        center.x + maxDim * 1.35,
        center.y + maxDim * 0.85,
        center.z + maxDim * 1.6
      );
      camera.lookAt(center);
      controls.target.copy(center);

      // Flag shadow map to refresh for the new geometry
      renderer.shadowMap.needsUpdate = true;
    }, [yantraId, latitude]);

    return <div ref={mountRef} className="w-full h-full min-h-[220px] touch-none" />;
  }
);

YantraViewer.displayName = 'YantraViewer';
export default YantraViewer;
