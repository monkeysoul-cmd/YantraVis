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

// ─── Realistic Material Palette ───────────────────────────────────────────────

function createSandstoneMaterial() {
  // Jaipur pink sandstone — warm coral-terracotta
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xc27a54),
    roughness: 0.82,
    metalness: 0.02,
    envMapIntensity: 0.3,
  });
}

function createWeatheredSandstoneMaterial() {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xb06840),
    roughness: 0.92,
    metalness: 0.01,
    envMapIntensity: 0.2,
  });
}

function createMarbleMaterial() {
  // Makrana white marble — slightly warm
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xf0ebe2),
    roughness: 0.25,
    metalness: 0.08,
    envMapIntensity: 0.6,
  });
}

function createBronzeMaterial() {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xcb8e3e),
    roughness: 0.25,
    metalness: 0.82,
    envMapIntensity: 0.8,
  });
}

function createOxidizedBronzeMaterial() {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x7a9e8a),
    roughness: 0.55,
    metalness: 0.65,
    envMapIntensity: 0.5,
  });
}

function createDarkStoneMaterial() {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x4a3728),
    roughness: 0.88,
    metalness: 0.04,
    envMapIntensity: 0.2,
  });
}

// ─── Ground Platform ──────────────────────────────────────────────────────────

function createGround(scene: THREE.Scene, groundY: number) {
  // Platform base
  const platformGeo = new THREE.CylinderGeometry(5, 5.5, 0.3, 32);
  const platform = new THREE.Mesh(platformGeo, createWeatheredSandstoneMaterial());
  platform.position.y = groundY - 0.15;
  platform.receiveShadow = true;
  platform.castShadow = true;
  scene.add(platform);

  // Marble inlay ring
  const inlayGeo = new THREE.CylinderGeometry(4.5, 4.5, 0.02, 64, 1, true);
  const inlay = new THREE.Mesh(inlayGeo, createMarbleMaterial());
  inlay.position.y = groundY + 0.01;
  scene.add(inlay);

  // Shadow receiver
  const shadowGeo = new THREE.CircleGeometry(6, 64);
  const shadowMat = new THREE.ShadowMaterial({ opacity: 0.4, color: 0x1a0800 });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = groundY + 0.02;
  shadow.receiveShadow = true;
  scene.add(shadow);

  // Cardinal direction markers (N S E W)
  const cardinals = [
    { label: 'N', pos: new THREE.Vector3(0, groundY + 0.05, -4.2) },
    { label: 'S', pos: new THREE.Vector3(0, groundY + 0.05, 4.2) },
    { label: 'E', pos: new THREE.Vector3(4.2, groundY + 0.05, 0) },
    { label: 'W', pos: new THREE.Vector3(-4.2, groundY + 0.05, 0) },
  ];
  cardinals.forEach(({ pos }) => {
    const markerGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.06, 8);
    const marker = new THREE.Mesh(markerGeo, createBronzeMaterial());
    marker.position.copy(pos);
    scene.add(marker);
  });

  // Radial scale lines on ground
  for (let i = 0; i < 24; i++) {
    const angle = (i * Math.PI * 2) / 24;
    const linePts = [
      new THREE.Vector3(Math.cos(angle) * 0.8, groundY + 0.03, Math.sin(angle) * 0.8),
      new THREE.Vector3(Math.cos(angle) * 4.0, groundY + 0.03, Math.sin(angle) * 4.0),
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

// ─── Instrument Builders ──────────────────────────────────────────────────────

function buildSamrat(latRad: number): THREE.Group {
  const group = new THREE.Group();
  const sandstone = createSandstoneMaterial();
  const marble = createMarbleMaterial();
  const bronze = createBronzeMaterial();

  const baseL = 3.6;
  const gH = baseL * Math.tan(latRad);

  // Massive stepped base foundation
  [3.8, 3.4, 3.0].forEach((w, i) => {
    const stepGeo = new THREE.BoxGeometry(w, 0.25, 1.2 - i * 0.15);
    const step = new THREE.Mesh(stepGeo, sandstone);
    step.position.y = i * 0.25;
    step.castShadow = true;
    step.receiveShadow = true;
    group.add(step);
  });

  // Triangular gnomon — proper extruded shape
  const gnomonShape = new THREE.Shape();
  gnomonShape.moveTo(-baseL / 2, 0);
  gnomonShape.lineTo(baseL / 2, 0);
  gnomonShape.lineTo(-baseL / 2, gH);
  gnomonShape.closePath();

  const gnomonGeo = new THREE.ExtrudeGeometry(gnomonShape, {
    depth: 0.35,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelSegments: 3,
  });
  gnomonGeo.center();
  const gnomonMesh = new THREE.Mesh(gnomonGeo, sandstone);
  gnomonMesh.position.y = 0.75 + gH / 2;
  gnomonMesh.castShadow = true;
  gnomonMesh.receiveShadow = true;
  group.add(gnomonMesh);

  // Marble cladding edge on hypotenuse
  const hypoLength = Math.sqrt(baseL * baseL + gH * gH);
  const hypoGeo = new THREE.BoxGeometry(hypoLength, 0.08, 0.4);
  const hypo = new THREE.Mesh(hypoGeo, marble);
  hypo.position.set(-0.5, 0.75 + gH * 0.5, 0.2);
  hypo.rotation.z = -Math.atan2(gH, baseL);
  group.add(hypo);

  // Eastern & Western quadrant arcs with thickness
  const arcR = Math.max(2.0, gH * 1.0);
  for (const side of [-1, 1]) {
    // Quadrant arc plate
    const arcGeo = new THREE.CylinderGeometry(arcR, arcR + 0.12, 0.55, 48, 1, true, 0, Math.PI * 0.52);
    arcGeo.rotateX(Math.PI / 2);
    arcGeo.rotateZ(latRad - Math.PI / 2 + 0.05);
    const arcMesh = new THREE.Mesh(arcGeo, marble);
    arcMesh.position.set(side * 0.7, 0.75 + gH * 0.42, 0.02);
    arcMesh.scale.x = side;
    arcMesh.castShadow = true;
    arcMesh.receiveShadow = true;
    group.add(arcMesh);

    // Scale markings — small bronze notches
    for (let t = 0; t <= 8; t++) {
      const angle = (t / 8) * (Math.PI / 2);
      const nx = side * (0.7 + Math.cos(angle) * arcR * 0.85);
      const ny = 0.75 + gH * 0.42 + Math.sin(angle) * arcR * 0.85;
      const notchGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.05, 6);
      const notch = new THREE.Mesh(notchGeo, bronze);
      notch.position.set(nx, ny, 0.35);
      group.add(notch);
    }
  }

  // Structural support walls flanking gnomon
  for (const side of [-0.65, 0.65]) {
    const wallGeo = new THREE.BoxGeometry(0.22, gH * 0.6, 0.9);
    const wall = new THREE.Mesh(wallGeo, createWeatheredSandstoneMaterial());
    wall.position.set(side, 0.75 + gH * 0.3, 0);
    wall.castShadow = true;
    group.add(wall);
  }

  return group;
}

function buildRama(latRad: number): THREE.Group {
  const group = new THREE.Group();
  const sandstone = createSandstoneMaterial();
  const marble = createMarbleMaterial();
  const bronze = createBronzeMaterial();

  const R = 2.4;
  const H = 2.8;
  const wallThick = 0.22;

  // Outer cylindrical wall — open top
  const outerWallGeo = new THREE.CylinderGeometry(R, R + 0.1, H, 64, 3, true);
  const outerWall = new THREE.Mesh(outerWallGeo, sandstone);
  outerWall.position.y = H / 2;
  outerWall.castShadow = true;
  outerWall.receiveShadow = true;
  group.add(outerWall);

  // Top coping ring
  const copingGeo = new THREE.TorusGeometry(R + 0.08, wallThick / 2, 8, 64);
  const coping = new THREE.Mesh(copingGeo, marble);
  coping.rotation.x = Math.PI / 2;
  coping.position.y = H + wallThick / 2;
  group.add(coping);

  // Circular floor with marble inlay
  const floorGeo = new THREE.CylinderGeometry(R - 0.01, R, 0.14, 64);
  const floor = new THREE.Mesh(floorGeo, createWeatheredSandstoneMaterial());
  floor.receiveShadow = true;
  group.add(floor);

  // Marble radial floor divisions
  for (let i = 0; i < 36; i++) {
    const angle = (i * Math.PI * 2) / 36;
    const divPts = [
      new THREE.Vector3(Math.cos(angle) * 0.35, 0.15, Math.sin(angle) * 0.35),
      new THREE.Vector3(Math.cos(angle) * (R - 0.12), 0.15, Math.sin(angle) * (R - 0.12)),
    ];
    const divGeo = new THREE.BufferGeometry().setFromPoints(divPts);
    const divMat = new THREE.LineBasicMaterial({
      color: i % 6 === 0 ? 0xd4af6a : 0xa07050,
      transparent: true,
      opacity: i % 6 === 0 ? 0.8 : 0.3,
    });
    group.add(new THREE.Line(divGeo, divMat));
  }

  // Vertical wall slits (altitude readout openings)
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8;
    const slitGeo = new THREE.BoxGeometry(0.12, H * 0.85, wallThick * 1.5);
    const slit = new THREE.Mesh(slitGeo, marble);
    slit.position.set(Math.cos(angle) * R, H * 0.55, Math.sin(angle) * R);
    slit.rotation.y = -angle;
    group.add(slit);
  }

  // Central bronze gnomon pillar
  const pillarGeo = new THREE.CylinderGeometry(0.08, 0.1, H + 0.4, 24);
  const pillar = new THREE.Mesh(pillarGeo, bronze);
  pillar.position.y = (H + 0.4) / 2;
  pillar.castShadow = true;
  group.add(pillar);

  // Pillar capital
  const capitalGeo = new THREE.SphereGeometry(0.15, 16, 8);
  const capital = new THREE.Mesh(capitalGeo, bronze);
  capital.position.y = H + 0.5;
  group.add(capital);

  return group;
}

function buildJaiPrakash(latRad: number): THREE.Group {
  const group = new THREE.Group();
  const sandstone = createSandstoneMaterial();
  const marble = createMarbleMaterial();
  const bronze = createBronzeMaterial();

  const R = 2.2;

  // Bowl structure — sunken hemisphere
  const bowlMat = sandstone.clone();
  bowlMat.side = THREE.DoubleSide;
  const bowlGeo = new THREE.SphereGeometry(R, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
  const bowl = new THREE.Mesh(bowlGeo, bowlMat);
  bowl.castShadow = true;
  bowl.receiveShadow = true;
  group.add(bowl);

  // Inner marble lining
  const innerMat = marble.clone();
  innerMat.side = THREE.BackSide;
  const innerBowl = new THREE.Mesh(
    new THREE.SphereGeometry(R * 0.97, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
    innerMat
  );
  group.add(innerBowl);

  // Decorative celestial latitude rings inside bowl
  const ringAngles = [0, 23.5, -23.5, 45, -45];
  ringAngles.forEach((deg) => {
    const rad = THREE.MathUtils.degToRad(deg);
    const rRing = R * Math.cos(rad) * 0.96;
    const yRing = -R * Math.sin(rad);
    const ringGeo = new THREE.TorusGeometry(rRing, 0.018, 8, 64);
    const ringMesh = new THREE.Mesh(ringGeo, deg === 0 ? bronze : marble);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = yRing;
    group.add(ringMesh);
  });

  // Rim ring with coping
  const rimGeo = new THREE.TorusGeometry(R, 0.14, 16, 72);
  rimGeo.rotateX(Math.PI / 2);
  const rim = new THREE.Mesh(rimGeo, marble);
  rim.castShadow = true;
  group.add(rim);

  // Cross wire shadow-casters (diagonal)
  const wireMat = new THREE.MeshStandardMaterial({ color: 0xcb8e3e, roughness: 0.2, metalness: 0.9 });
  for (const angle of [0, Math.PI / 2]) {
    const wireGeo = new THREE.CylinderGeometry(0.015, 0.015, R * 2, 8);
    wireGeo.rotateZ(Math.PI / 2);
    wireGeo.rotateY(angle);
    const wire = new THREE.Mesh(wireGeo, wireMat);
    wire.castShadow = true;
    group.add(wire);
  }

  // Outer retaining wall
  const wallGeo = new THREE.CylinderGeometry(R + 0.38, R + 0.45, 0.6, 64, 1, true);
  const wall = new THREE.Mesh(wallGeo, createWeatheredSandstoneMaterial());
  wall.position.y = 0.3;
  wall.castShadow = true;
  group.add(wall);

  return group;
}

function buildRasivalaya(latRad: number): THREE.Group {
  const group = new THREE.Group();
  const sandstone = createSandstoneMaterial();
  const marble = createMarbleMaterial();
  const bronze = createBronzeMaterial();

  // Circular base platform
  const baseGeo = new THREE.CylinderGeometry(2.6, 2.8, 0.28, 48);
  const base = new THREE.Mesh(baseGeo, createWeatheredSandstoneMaterial());
  base.position.y = 0;
  base.receiveShadow = true;
  group.add(base);

  // 12 zodiac instruments arranged in a ring
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

    subGroup.position.set(Math.cos(angle) * r, 0.28, Math.sin(angle) * r);
    subGroup.rotation.y = -angle + Math.PI * 0.5;
    group.add(subGroup);
  }

  // Center elevation marker
  const centerGeo = new THREE.CylinderGeometry(0.25, 0.3, 0.35, 24);
  const center = new THREE.Mesh(centerGeo, marble);
  center.position.y = 0.28;
  group.add(center);

  const sphereGeo = new THREE.SphereGeometry(0.1, 16, 8);
  const sphere = new THREE.Mesh(sphereGeo, bronze);
  sphere.position.y = 0.63;
  group.add(sphere);

  return group;
}

function buildDigamsa(latRad: number): THREE.Group {
  const group = new THREE.Group();
  const sandstone = createSandstoneMaterial();
  const marble = createMarbleMaterial();
  const bronze = createBronzeMaterial();

  const outerR = 2.5;
  const innerR = 1.5;

  // Outer cylindrical wall
  const outerGeo = new THREE.CylinderGeometry(outerR, outerR + 0.15, 0.85, 64, 1, true);
  const outerWall = new THREE.Mesh(outerGeo, sandstone);
  outerWall.position.y = 0.42;
  outerWall.castShadow = true;
  group.add(outerWall);

  // Outer top coping
  const outerCopingGeo = new THREE.TorusGeometry(outerR + 0.07, 0.09, 8, 64);
  outerCopingGeo.rotateX(Math.PI / 2);
  group.add(new THREE.Mesh(outerCopingGeo, marble));

  // Inner cylindrical wall
  const innerGeo = new THREE.CylinderGeometry(innerR, innerR + 0.1, 0.85, 48, 1, true);
  const innerWall = new THREE.Mesh(innerGeo, createWeatheredSandstoneMaterial());
  innerWall.position.y = 0.42;
  innerWall.castShadow = true;
  group.add(innerWall);

  // Annular floor between walls
  const annularGeo = new THREE.RingGeometry(innerR + 0.1, outerR, 64);
  annularGeo.rotateX(-Math.PI / 2);
  const annular = new THREE.Mesh(annularGeo, createWeatheredSandstoneMaterial());
  annular.receiveShadow = true;
  group.add(annular);

  // Degree markings on outer rim
  for (let i = 0; i < 36; i++) {
    const angle = (i * Math.PI * 2) / 36;
    const markGeo = new THREE.BoxGeometry(0.04, i % 9 === 0 ? 0.3 : 0.15, 0.04);
    const mark = new THREE.Mesh(markGeo, bronze);
    mark.position.set(Math.cos(angle) * outerR, 0.88, Math.sin(angle) * outerR);
    mark.rotation.y = -angle;
    group.add(mark);
  }

  // Central gnomon pillar
  const pillarGeo = new THREE.CylinderGeometry(0.12, 0.15, 1.3, 20);
  const pillar = new THREE.Mesh(pillarGeo, bronze);
  pillar.position.y = 0.65;
  pillar.castShadow = true;
  group.add(pillar);

  // Crosshair wires
  for (const angle of [0, Math.PI / 2, Math.PI, Math.PI * 1.5]) {
    const wirePts = [
      new THREE.Vector3(Math.cos(angle) * 0.2, 0.88, Math.sin(angle) * 0.2),
      new THREE.Vector3(Math.cos(angle) * (outerR - 0.2), 0.88, Math.sin(angle) * (outerR - 0.2)),
    ];
    const wireGeo = new THREE.BufferGeometry().setFromPoints(wirePts);
    group.add(new THREE.Line(wireGeo, new THREE.LineBasicMaterial({ color: 0xcb8e3e, transparent: true, opacity: 0.7 })));
  }

  return group;
}

function buildGolayantra(latRad: number): THREE.Group {
  const group = new THREE.Group();
  const bronze = createBronzeMaterial();
  const oxidized = createOxidizedBronzeMaterial();
  const marble = createMarbleMaterial();

  const R = 1.6;

  // Pedestal
  const pedBase = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 0.35, 24), createWeatheredSandstoneMaterial());
  pedBase.position.y = -R - 0.9;
  pedBase.castShadow = true;
  pedBase.receiveShadow = true;
  group.add(pedBase);

  const pedStem = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.55, 0.9, 20), createSandstoneMaterial());
  pedStem.position.y = -R - 0.45;
  pedStem.castShadow = true;
  group.add(pedStem);

  // Equatorial ring
  const eqGeo = new THREE.TorusGeometry(R, 0.06, 16, 80);
  const eqRing = new THREE.Mesh(eqGeo, bronze);
  eqRing.castShadow = true;
  group.add(eqRing);

  // Hour circles (6 meridian rings at 30° intervals)
  for (let i = 0; i < 6; i++) {
    const hRing = new THREE.Mesh(new THREE.TorusGeometry(R, 0.03, 10, 64), oxidized);
    hRing.rotation.y = (i * Math.PI) / 6;
    hRing.castShadow = true;
    group.add(hRing);
  }

  // Ecliptic ring
  const eclipticRing = new THREE.Mesh(new THREE.TorusGeometry(R, 0.055, 14, 72), marble);
  eclipticRing.rotation.x = THREE.MathUtils.degToRad(23.44);
  eclipticRing.rotation.z = THREE.MathUtils.degToRad(10);
  eclipticRing.castShadow = true;
  group.add(eclipticRing);

  // Polar axis rod
  const poleGeo = new THREE.CylinderGeometry(0.03, 0.03, R * 2 + 0.4, 12);
  const poleRod = new THREE.Mesh(poleGeo, bronze);
  poleRod.rotation.z = latRad - Math.PI / 2;
  poleRod.castShadow = true;
  group.add(poleRod);

  // Polar caps
  const capGeo = new THREE.SphereGeometry(0.08, 12, 6);
  [-1, 1].forEach((dir) => {
    const cap = new THREE.Mesh(capGeo, bronze);
    const offset = dir * (R + 0.18);
    const angle = latRad - Math.PI / 2;
    cap.position.set(-Math.sin(angle) * offset, Math.cos(angle) * offset, 0);
    group.add(cap);
  });

  group.rotation.z = latRad - Math.PI / 2;
  group.position.y = R + 0.55;

  return group;
}

function buildBhitti(): THREE.Group {
  const group = new THREE.Group();
  const sandstone = createSandstoneMaterial();
  const marble = createMarbleMaterial();
  const bronze = createBronzeMaterial();

  const W = 4.0;
  const H = 2.4;
  const D = 0.45;

  // Main wall body
  const wallGeo = new THREE.BoxGeometry(W, H, D);
  const wall = new THREE.Mesh(wallGeo, sandstone);
  wall.position.y = H / 2;
  wall.castShadow = true;
  wall.receiveShadow = true;
  group.add(wall);

  // Marble face cladding (front)
  const faceGeo = new THREE.BoxGeometry(W * 0.92, H * 0.9, 0.04);
  const face = new THREE.Mesh(faceGeo, marble);
  face.position.set(0, H / 2 + 0.04, D / 2 + 0.02);
  group.add(face);

  // Buttress supports (left & right)
  for (const side of [-1, 1]) {
    const buttressGeo = new THREE.BoxGeometry(0.35, H, 1.2);
    const buttress = new THREE.Mesh(buttressGeo, createWeatheredSandstoneMaterial());
    buttress.position.set(side * (W / 2 + 0.17), H / 2, -0.38);
    buttress.castShadow = true;
    group.add(buttress);
  }

  // Meridian arc on wall face
  const arcGeo = new THREE.TorusGeometry(0.9, 0.04, 10, 48, Math.PI * 0.55);
  arcGeo.rotateZ(-Math.PI * 0.05);
  const arc = new THREE.Mesh(arcGeo, bronze);
  arc.position.set(0.3, H * 0.52, D / 2 + 0.06);
  group.add(arc);

  // Degree marks on arc
  for (let i = 0; i <= 6; i++) {
    const angle = (i / 6) * Math.PI * 0.55 - Math.PI * 0.05;
    const markGeo = new THREE.BoxGeometry(0.04, i === 0 || i === 6 ? 0.14 : 0.08, 0.03);
    const mark = new THREE.Mesh(markGeo, bronze);
    mark.position.set(
      0.3 + Math.cos(angle + Math.PI) * 0.92,
      H * 0.52 + Math.sin(angle + Math.PI) * 0.92,
      D / 2 + 0.07
    );
    mark.rotation.z = angle;
    group.add(mark);
  }

  // Top coping course
  const copingGeo = new THREE.BoxGeometry(W + 0.1, 0.18, D + 0.1);
  const coping = new THREE.Mesh(copingGeo, marble);
  coping.position.y = H + 0.09;
  group.add(coping);

  return group;
}

function buildNadiValaya(latRad: number): THREE.Group {
  const group = new THREE.Group();
  const sandstone = createSandstoneMaterial();
  const marble = createMarbleMaterial();
  const bronze = createBronzeMaterial();

  const dialR = 1.5;
  const dialThick = 0.3;

  // Stand / pedestal
  const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.7, 0.35, 24), createWeatheredSandstoneMaterial());
  standBase.position.y = -1.65;
  standBase.castShadow = true;
  standBase.receiveShadow = true;
  group.add(standBase);

  const standStem = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.4, 1.2, 20), sandstone);
  standStem.position.y = -1.1;
  standStem.castShadow = true;
  group.add(standStem);

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

  // Apply latitude tilt
  dial.rotation.x = latRad;
  group.add(dial);

  return group;
}

function buildDefault(): THREE.Group {
  const group = new THREE.Group();
  const sandstone = createSandstoneMaterial();
  const marble = createMarbleMaterial();
  const bronze = createBronzeMaterial();

  // Stepped base
  [2.0, 1.6, 1.2].forEach((s, i) => {
    const step = new THREE.Mesh(new THREE.BoxGeometry(s, 0.25, s), sandstone);
    step.position.y = i * 0.25;
    step.castShadow = true;
    step.receiveShadow = true;
    group.add(step);
  });

  // Main body
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.2, 1.0), sandstone);
  body.position.y = 0.75 + 0.6;
  body.castShadow = true;
  group.add(body);

  // Marble cap
  const cap = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.18, 1.1), marble);
  cap.position.y = 1.47;
  group.add(cap);

  // Bronze indicator
  const indicator = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 8), bronze);
  indicator.position.y = 1.7;
  group.add(indicator);

  return group;
}

// ─── Main Component ────────────────────────────────────────────────────────────

const YantraViewer = forwardRef<YantraViewerRef, YantraViewerProps>(
  ({ yantraId, latitude = 26.9124, isArMode = false, animateShadow = false }, ref) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const objectRef = useRef<THREE.Object3D | null>(null);

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

    useEffect(() => {
      const currentMount = mountRef.current;
      if (!currentMount) return;

      const width = currentMount.clientWidth || 600;
      const height = currentMount.clientHeight || 400;

      // Scene
      const scene = new THREE.Scene();
      scene.background = null;

      // Atmospheric fog
      if (!isArMode) {
        scene.fog = new THREE.FogExp2(0x08080e, 0.04);
      }

      // Camera
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.05, 200);
      camera.position.set(4.5, 3.5, 6.5);

      // Renderer
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        logarithmicDepthBuffer: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      currentMount.appendChild(renderer.domElement);

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.minDistance = 1.5;
      controls.maxDistance = 40;
      controls.minPolarAngle = 0.1;
      controls.maxPolarAngle = Math.PI * 0.85;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.4;

      // ─── Lighting ───────────────────────────────────────────────────────────

      // Sky ambient — warm blue sky
      const hemisphereLight = new THREE.HemisphereLight(
        new THREE.Color(0xffeedd), // sky warm
        new THREE.Color(0x2a1a0a), // ground warm bounce
        0.6
      );
      scene.add(hemisphereLight);

      // Key light — solar
      const sunLight = new THREE.DirectionalLight(new THREE.Color(0xfff8e7), 3.0);
      sunLight.position.set(10, 16, 8);
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 2048;
      sunLight.shadow.mapSize.height = 2048;
      sunLight.shadow.camera.near = 0.5;
      sunLight.shadow.camera.far = 80;
      sunLight.shadow.camera.left = -12;
      sunLight.shadow.camera.right = 12;
      sunLight.shadow.camera.top = 12;
      sunLight.shadow.camera.bottom = -12;
      sunLight.shadow.bias = -0.0003;
      sunLight.shadow.normalBias = 0.05;
      scene.add(sunLight);

      // Fill light — cool side fill
      const fillLight = new THREE.DirectionalLight(new THREE.Color(0xb8d4f0), 0.5);
      fillLight.position.set(-8, 4, -6);
      scene.add(fillLight);

      // Warm bounce from below
      const bounceLight = new THREE.PointLight(new THREE.Color(0xff9a3c), 0.4, 20);
      bounceLight.position.set(0, -2, 3);
      scene.add(bounceLight);

      // ─── Build Instrument ───────────────────────────────────────────────────

      const latRad = (Math.max(5, Math.min(85, Math.abs(latitude))) * Math.PI) / 180;
      let object: THREE.Group;

      switch (yantraId) {
        case 'samrat': object = buildSamrat(latRad); break;
        case 'rama': object = buildRama(latRad); break;
        case 'jai-prakash': object = buildJaiPrakash(latRad); break;
        case 'rasivalaya': object = buildRasivalaya(latRad); break;
        case 'digamsa': object = buildDigamsa(latRad); break;
        case 'golayantra-chakra': object = buildGolayantra(latRad); break;
        case 'bhitti': case 'dakshinottara-bhitti': object = buildBhitti(); break;
        case 'nadi-valaya': object = buildNadiValaya(latRad); break;
        default: object = buildDefault(); break;
      }

      // Shadows
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      scene.add(object);
      objectRef.current = object;

      // ─── Ground Platform ────────────────────────────────────────────────────

      const box = new THREE.Box3().setFromObject(object);
      const groundY = Math.min(0, box.min.y);

      if (!isArMode) {
        createGround(scene, groundY);
      }

      // Fit camera to object
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      camera.position.set(
        center.x + maxDim * 1.3,
        center.y + maxDim * 0.9,
        center.z + maxDim * 1.8
      );
      camera.lookAt(center);
      controls.target.copy(center);

      // ─── Animation ──────────────────────────────────────────────────────────

      const clock = new THREE.Clock();
      let animationFrameId: number;

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        if (animateShadow) {
          // Day arc simulation
          const dayFraction = (elapsed * 0.08) % 1;
          const sunAngle = dayFraction * Math.PI;
          const sunElevation = Math.sin(sunAngle);
          const sunAzimuth = (dayFraction - 0.5) * Math.PI * 2;

          sunLight.position.set(
            Math.cos(sunAzimuth) * 18,
            Math.max(0.5, sunElevation * 18) + 2,
            Math.sin(sunAzimuth) * 12
          );

          // Warm golden sunrise/sunset, cool midday
          const t = dayFraction;
          const isGoldenHour = t < 0.18 || t > 0.82;
          sunLight.color.setHSL(
            isGoldenHour ? 0.08 : 0.1,
            isGoldenHour ? 0.8 : 0.3,
            0.85 + sunElevation * 0.15
          );
          sunLight.intensity = Math.max(0.3, sunElevation * 3.2);
          hemisphereLight.intensity = Math.max(0.2, sunElevation * 0.65);

          // Ambient fills during day
          bounceLight.intensity = Math.max(0.1, sunElevation * 0.5);
        }

        // Gentle auto-rotate stops when user interacts
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // ─── Resize handler ──────────────────────────────────────────────────────

      const handleResize = () => {
        if (!currentMount) return;
        const w = currentMount.clientWidth;
        const h = currentMount.clientHeight;
        if (w === 0 || h === 0) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);
      const resizeObserver = new ResizeObserver(() => handleResize());
      resizeObserver.observe(currentMount);

      // ─── Cleanup ─────────────────────────────────────────────────────────────

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
        resizeObserver.disconnect();
        controls.dispose();
        renderer.dispose();
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry?.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else if (child.material) {
              child.material.dispose();
            }
          }
        });
        if (renderer.domElement?.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        objectRef.current = null;
      };
    }, [yantraId, latitude, isArMode, animateShadow]);

    return <div ref={mountRef} className="w-full h-full min-h-[280px]" />;
  }
);

YantraViewer.displayName = 'YantraViewer';
export default YantraViewer;
