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

      // Camera
      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
      camera.position.set(3, 2.5, 5.5);

      // Renderer
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      currentMount.appendChild(renderer.domElement);

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.minDistance = 1;
      controls.maxDistance = 30;

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xfffaed, 2.2);
      directionalLight.position.set(8, 12, 8);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 1024;
      directionalLight.shadow.mapSize.height = 1024;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 50;
      directionalLight.shadow.bias = -0.001;
      scene.add(directionalLight);

      // Material - Traditional Jaipur Pink/Red Sandstone
      const sandstoneMaterial = new THREE.MeshStandardMaterial({
        color: 0xc96d53,
        roughness: 0.75,
        metalness: 0.08,
      });

      // Material - White Makrana Marble (for scale markings & contrasts)
      const marbleMaterial = new THREE.MeshStandardMaterial({
        color: 0xf5f0ea,
        roughness: 0.35,
        metalness: 0.15,
      });

      // Material - Bronze Hardware
      const bronzeMaterial = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.3,
        metalness: 0.7,
      });

      // Compute latitude inclination angle in radians
      const latRad = (Math.max(5, Math.min(85, Math.abs(latitude))) * Math.PI) / 180;

      // Construct Geometry based on Instrument type
      let object: THREE.Object3D;

      switch (yantraId) {
        case 'samrat': {
          const group = new THREE.Group();
          const baseLength = 3.0;
          const gnomonHeight = baseLength * Math.tan(latRad);

          // Central triangular gnomon
          const gnomonShape = new THREE.Shape();
          gnomonShape.moveTo(-baseLength / 2, 0);
          gnomonShape.lineTo(baseLength / 2, 0);
          gnomonShape.lineTo(-baseLength / 2, gnomonHeight);
          gnomonShape.closePath();

          const gnomonGeo = new THREE.ExtrudeGeometry(gnomonShape, { depth: 0.25, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02 });
          gnomonGeo.center();
          const gnomonMesh = new THREE.Mesh(gnomonGeo, sandstoneMaterial);
          gnomonMesh.position.y = gnomonHeight / 2;
          group.add(gnomonMesh);

          // Eastern and Western Quadrant Arcs
          const arcRadius = Math.max(1.5, gnomonHeight * 0.9);
          const quadrantThickness = 0.15;
          const quadrantWidth = 0.4;

          const eastArcGeo = new THREE.CylinderGeometry(arcRadius, arcRadius + quadrantThickness, quadrantWidth, 32, 1, true, 0, Math.PI / 2);
          eastArcGeo.rotateX(Math.PI / 2);
          eastArcGeo.rotateZ(latRad - Math.PI / 2);
          const eastArc = new THREE.Mesh(eastArcGeo, marbleMaterial);
          eastArc.position.set(0.6, gnomonHeight * 0.4, 0);
          group.add(eastArc);

          const westArc = eastArc.clone();
          westArc.position.x = -0.6;
          westArc.scale.x = -1;
          group.add(westArc);

          object = group;
          break;
        }
        case 'rama': {
          const group = new THREE.Group();
          // Cylindrical open chamber
          const cylinderRadius = 1.8;
          const cylinderHeight = 2.4;
          const outerCylinder = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, cylinderHeight, 48, 1, true);
          const cylinderMesh = new THREE.Mesh(outerCylinder, sandstoneMaterial);
          cylinderMesh.position.y = cylinderHeight / 2;
          group.add(cylinderMesh);

          // Floor circular sectors
          const floorGeo = new THREE.RingGeometry(0.3, cylinderRadius, 32);
          floorGeo.rotateX(-Math.PI / 2);
          const floorMesh = new THREE.Mesh(floorGeo, marbleMaterial);
          group.add(floorMesh);

          // Central vertical gnomon pillar
          const pillarGeo = new THREE.CylinderGeometry(0.08, 0.08, cylinderHeight, 16);
          const pillarMesh = new THREE.Mesh(pillarGeo, bronzeMaterial);
          pillarMesh.position.y = cylinderHeight / 2;
          group.add(pillarMesh);

          object = group;
          break;
        }
        case 'jai-prakash': {
          const group = new THREE.Group();
          const bowlRadius = 2.0;
          // Inverted hemispherical bowl
          const bowlGeo = new THREE.SphereGeometry(bowlRadius, 48, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
          const doubleSidedSandstone = sandstoneMaterial.clone();
          doubleSidedSandstone.side = THREE.DoubleSide;
          const bowlMesh = new THREE.Mesh(bowlGeo, doubleSidedSandstone);
          group.add(bowlMesh);

          // Marble rim ring
          const rimGeo = new THREE.TorusGeometry(bowlRadius, 0.08, 16, 64);
          rimGeo.rotateX(Math.PI / 2);
          const rimMesh = new THREE.Mesh(rimGeo, marbleMaterial);
          group.add(rimMesh);

          // Taut Cross-wires across rim
          const wireMat = new THREE.LineBasicMaterial({ color: 0xd4af37, linewidth: 2 });
          const wireGeoNS = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, -bowlRadius), new THREE.Vector3(0, 0, bowlRadius)]);
          const wireGeoEW = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-bowlRadius, 0, 0), new THREE.Vector3(bowlRadius, 0, 0)]);
          group.add(new THREE.Line(wireGeoNS, wireMat));
          group.add(new THREE.Line(wireGeoEW, wireMat));

          object = group;
          break;
        }
        case 'rasivalaya': {
          const group = new THREE.Group();
          for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI * 2) / 12;
            const r = 2.0;
            const subGnomonGeo = new THREE.ConeGeometry(0.12, 0.8, 4);
            const subGnomon = new THREE.Mesh(subGnomonGeo, sandstoneMaterial);
            subGnomon.position.set(Math.cos(angle) * r, 0.4, Math.sin(angle) * r);
            subGnomon.rotation.z = Math.cos(angle) * (latRad * 0.3);
            group.add(subGnomon);
          }
          // Center viewing marker
          const centerGeo = new THREE.CylinderGeometry(0.3, 0.35, 0.1, 16);
          group.add(new THREE.Mesh(centerGeo, marbleMaterial));
          object = group;
          break;
        }
        case 'digamsa': {
          const group = new THREE.Group();
          // Concentric outer and inner walls
          const outerWallGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.8, 48, 1, true);
          const innerWallGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.8, 48, 1, true);
          const centerPillarGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.2, 24);

          const outer = new THREE.Mesh(outerWallGeo, sandstoneMaterial);
          const inner = new THREE.Mesh(innerWallGeo, sandstoneMaterial);
          const center = new THREE.Mesh(centerPillarGeo, bronzeMaterial);

          outer.position.y = 0.4;
          inner.position.y = 0.4;
          center.position.y = 0.6;

          group.add(outer);
          group.add(inner);
          group.add(center);
          object = group;
          break;
        }
        case 'dhruva-protha-chakra': {
          const group = new THREE.Group();
          const frameGeo = new THREE.BoxGeometry(2.2, 2.6, 0.15);
          const frame = new THREE.Mesh(frameGeo, sandstoneMaterial);
          frame.position.y = 1.3;

          const wheelGeo = new THREE.TorusGeometry(0.8, 0.05, 16, 48);
          const wheel = new THREE.Mesh(wheelGeo, bronzeMaterial);
          wheel.position.set(0, 1.3, 0.1);

          group.add(frame);
          group.add(wheel);
          group.rotation.x = latRad - Math.PI / 2;
          object = group;
          break;
        }
        case 'yantra-samrat-combo': {
          const group = new THREE.Group();
          const baseLength = 2.8;
          const gnomonHeight = baseLength * Math.tan(latRad);
          const gnomonShape = new THREE.Shape();
          gnomonShape.moveTo(-baseLength / 2, 0);
          gnomonShape.lineTo(baseLength / 2, 0);
          gnomonShape.lineTo(-baseLength / 2, gnomonHeight);
          gnomonShape.closePath();

          const samratPart = new THREE.Mesh(
            new THREE.ExtrudeGeometry(gnomonShape, { depth: 0.25, bevelEnabled: false }),
            sandstoneMaterial
          );
          samratPart.geometry.center();
          samratPart.position.y = gnomonHeight / 2;
          group.add(samratPart);

          const chakra = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.04, 16, 36), bronzeMaterial);
          chakra.position.set(0, gnomonHeight * 0.7, 0.25);
          group.add(chakra);
          object = group;
          break;
        }
        case 'golayantra-chakra': {
          const group = new THREE.Group();
          const sphereRadius = 1.5;
          // Celestial spheres with equatorial and polar rings
          const eqRing = new THREE.Mesh(new THREE.TorusGeometry(sphereRadius, 0.04, 16, 64), bronzeMaterial);
          const polarRing = new THREE.Mesh(new THREE.TorusGeometry(sphereRadius, 0.04, 16, 64), bronzeMaterial);
          polarRing.rotation.y = Math.PI / 2;
          const eclipticRing = new THREE.Mesh(new THREE.TorusGeometry(sphereRadius, 0.04, 16, 64), marbleMaterial);
          eclipticRing.rotation.x = THREE.MathUtils.degToRad(23.44);

          group.add(eqRing);
          group.add(polarRing);
          group.add(eclipticRing);

          // Support Pedestal
          const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 1.2, 24), sandstoneMaterial);
          pedestal.position.y = -sphereRadius - 0.6;
          group.add(pedestal);

          group.rotation.z = latRad - Math.PI / 2;
          group.position.y = 1.6;
          object = group;
          break;
        }
        case 'bhitti': {
          const group = new THREE.Group();
          const wallGeo = new THREE.BoxGeometry(3.5, 2.0, 0.35);
          const wall = new THREE.Mesh(wallGeo, sandstoneMaterial);
          wall.position.y = 1.0;
          group.add(wall);

          // Meridian scale arc on wall face
          const scaleArc = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.03, 8, 32, Math.PI / 2), marbleMaterial);
          scaleArc.position.set(0.5, 1.0, 0.19);
          group.add(scaleArc);
          object = group;
          break;
        }
        case 'dakshinottara-bhitti': {
          const group = new THREE.Group();
          const wallGeo = new THREE.BoxGeometry(4.0, 2.2, 0.35);
          const wall = new THREE.Mesh(wallGeo, sandstoneMaterial);
          wall.position.y = 1.1;
          group.add(wall);

          // Double meridian quadrant scales
          const scaleArcNorth = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.03, 8, 32, Math.PI / 2), marbleMaterial);
          scaleArcNorth.position.set(-0.8, 1.1, 0.19);
          const scaleArcSouth = scaleArcNorth.clone();
          scaleArcSouth.position.x = 0.8;
          group.add(scaleArcNorth);
          group.add(scaleArcSouth);
          object = group;
          break;
        }
        case 'nadi-valaya': {
          const group = new THREE.Group();
          const dialRadius = 1.4;
          const dialGeo = new THREE.CylinderGeometry(dialRadius, dialRadius, 0.25, 48);
          dialGeo.rotateX(Math.PI / 2);
          const dial = new THREE.Mesh(dialGeo, sandstoneMaterial);

          // Central gnomon rod perpendicular to dial face
          const rodGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.8, 16);
          const rod = new THREE.Mesh(rodGeo, bronzeMaterial);
          dial.add(rod);

          group.add(dial);

          // Support stand
          const standGeo = new THREE.CylinderGeometry(0.2, 0.4, 1.5, 16);
          const stand = new THREE.Mesh(standGeo, sandstoneMaterial);
          stand.position.y = -1.0;
          group.add(stand);

          // Tilt dial by latitude so axis is parallel to Earth axis
          dial.rotation.x = latRad;
          group.position.y = 1.2;
          object = group;
          break;
        }
        case 'palaka': {
          const group = new THREE.Group();
          const boardGeo = new THREE.BoxGeometry(2.4, 1.5, 0.1);
          const board = new THREE.Mesh(boardGeo, sandstoneMaterial);
          board.position.y = 0.8;
          group.add(board);

          const pinGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 12);
          const pin = new THREE.Mesh(pinGeo, bronzeMaterial);
          pin.position.set(0, 1.2, 0.1);
          group.add(pin);
          object = group;
          break;
        }
        case 'chaapa': {
          const group = new THREE.Group();
          const arcGeo = new THREE.TorusGeometry(1.6, 0.1, 16, 64, (2 * Math.PI) / 3);
          arcGeo.rotateZ(Math.PI / 6);
          const arc = new THREE.Mesh(arcGeo, sandstoneMaterial);
          arc.position.y = 0.5;
          group.add(arc);

          const gnomonPin = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 12), bronzeMaterial);
          gnomonPin.position.y = 0.8;
          group.add(gnomonPin);
          object = group;
          break;
        }
        default: {
          const boxGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
          object = new THREE.Mesh(boxGeo, sandstoneMaterial);
          object.position.y = 0.75;
          break;
        }
      }

      // Cast and receive shadows on all child meshes
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      scene.add(object);
      objectRef.current = object;

      // Ground plane with shadows
      const box = new THREE.Box3().setFromObject(object);
      const groundY = Math.min(0, box.min.y);

      if (!isArMode) {
        const groundGeo = new THREE.PlaneGeometry(30, 30);
        const groundMat = new THREE.ShadowMaterial({ opacity: 0.45, color: 0x000000 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = groundY;
        ground.receiveShadow = true;
        scene.add(ground);
      }

      const center = box.getCenter(new THREE.Vector3());
      camera.lookAt(center);
      controls.target.copy(center);

      const clock = new THREE.Clock();
      let animationFrameId: number;

      // Animation Loop with proper cancellation
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        if (animateShadow) {
          const elapsed = clock.getElapsedTime();
          const sunAngle = (elapsed * 0.15) % (Math.PI * 2);
          directionalLight.position.set(
            16 * Math.cos(sunAngle),
            12 * Math.max(0.2, Math.sin(sunAngle)) + 2,
            16 * Math.sin(sunAngle)
          );
          ambientLight.intensity = Math.max(0.3, Math.sin(sunAngle) * 0.85);
        }

        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // Handle Resize
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

      // Thorough cleanup to prevent WebGL leaks and runaway requestAnimationFrames
      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);

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

        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        objectRef.current = null;
      };
    }, [yantraId, latitude, isArMode, animateShadow]);

    return <div ref={mountRef} className="w-full h-full min-h-[300px]" />;
  }
);

YantraViewer.displayName = 'YantraViewer';
export default YantraViewer;
