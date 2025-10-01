'use client';

import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { Yantra } from '@/lib/yantras';

type YantraViewerProps = {
  yantraId: Yantra['id'];
  isArMode?: boolean;
  animateShadow?: boolean;
};

export type YantraViewerRef = {
  zoomIn: () => void;
  zoomOut: () => void;
};

const YantraViewer = forwardRef<YantraViewerRef, YantraViewerProps>(
  ({ yantraId, isArMode = false, animateShadow = false }, ref) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const controlsRef = useRef<OrbitControls>();

    useImperativeHandle(ref, () => ({
      zoomIn: () => {
        if (controlsRef.current) {
          controlsRef.current.dollyIn(1.2);
          controlsRef.current.update();
        }
      },
      zoomOut: () => {
        if (controlsRef.current) {
          controlsRef.current.dollyOut(1.2);
          controlsRef.current.update();
        }
      },
    }));

    useEffect(() => {
      if (!mountRef.current) return;

      const currentMount = mountRef.current;

      // Scene
      const scene = new THREE.Scene();
      if (!isArMode) {
        scene.background = new THREE.Color(0xFFFDF7); // Brighter background
        scene.fog = new THREE.Fog(0xFFFDF7, 10, 25);
      } else {
        scene.background = null;
      }


      // Camera
      const camera = new THREE.PerspectiveCamera(50, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
      camera.position.set(2, 2, 5);
      
      // Renderer
      const renderer = new THREE.WebGLRenderer({ 
          antialias: true,
          alpha: isArMode
      });
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      currentMount.appendChild(renderer.domElement);

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.minDistance = 1;
      controls.maxDistance = 25;
      controlsRef.current = controls;

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
      directionalLight.position.set(5, 10, 7.5);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 1024;
      directionalLight.shadow.mapSize.height = 1024;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 50;
      scene.add(directionalLight);

      // Material
      const material = new THREE.MeshStandardMaterial({ color: 0x4A00E0, roughness: 0.5, metalness: 0.1 });

      // Geometry
      let object: THREE.Object3D;
      switch (yantraId) {
        case 'samrat':
          const gnomonShape = new THREE.Shape();
          gnomonShape.moveTo(0, 0); gnomonShape.lineTo(2.5, 0); gnomonShape.lineTo(0, 1.5);
          const gnomonGeometry = new THREE.ExtrudeGeometry(gnomonShape, { depth: 0.2, bevelEnabled: false });
          gnomonGeometry.center();
          object = new THREE.Mesh(gnomonGeometry, material);
          break;
        case 'rama':
          const cylinderGeometry = new THREE.CylinderGeometry(1.5, 1.5, 3, 64, 1, true);
          object = new THREE.Mesh(cylinderGeometry, material);
          break;
        case 'jai-prakash':
          const hemisphereGeometry = new THREE.SphereGeometry(2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
          object = new THREE.Mesh(hemisphereGeometry, material);
          object.material.side = THREE.DoubleSide;
          break;
        case 'rasivalaya':
          object = new THREE.Group();
          for (let i = 0; i < 6; i++) {
            const smallGnomon = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1, 0.2), material);
            smallGnomon.position.set(Math.cos(i * Math.PI / 3) * 1.5, 0, Math.sin(i * Math.PI / 3) * 1.5);
            smallGnomon.castShadow = true;
            (object as THREE.Group).add(smallGnomon);
          }
          break;
        case 'digamsa':
          const digamsaCylinder = new THREE.CylinderGeometry(2, 2, 0.2, 64);
          object = new THREE.Mesh(digamsaCylinder, material);
          break;
        case 'dhruva-protha-chakra':
          const dhruvaRect = new THREE.BoxGeometry(2, 2, 0.2);
          object = new THREE.Mesh(dhruvaRect, material);
          break;
        case 'yantra-samrat-combo':
          const comboGroup = new THREE.Group();
          const samratPart = new THREE.Mesh(new THREE.ExtrudeGeometry(new THREE.Shape().moveTo(0,0).lineTo(2.5, 0).lineTo(0, 1.5), { depth: 0.2, bevelEnabled: false }), material);
          samratPart.geometry.center();
          const dhruvaPart = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.5, 0.2), material);
          dhruvaPart.position.y = -0.25;
          comboGroup.add(samratPart);
          comboGroup.add(dhruvaPart);
          object = comboGroup;
          break;
        case 'golayantra-chakra':
          const golaSphere = new THREE.SphereGeometry(2, 32, 32);
          object = new THREE.Mesh(golaSphere, new THREE.MeshStandardMaterial({ ...material, wireframe: true }));
          break;
        case 'bhitti':
          const bhittiWall = new THREE.BoxGeometry(3, 2, 0.2);
          object = new THREE.Mesh(bhittiWall, material);
          break;
        case 'dakshinottara-bhitti':
          const dakWall = new THREE.BoxGeometry(4, 2, 0.2);
          object = new THREE.Mesh(dakWall, material);
          break;
        case 'nadi-valaya':
          const nadiCylinder = new THREE.CylinderGeometry(2, 2, 0.4, 64);
          nadiCylinder.rotateX(THREE.MathUtils.degToRad(23.5));
          object = new THREE.Mesh(nadiCylinder, material);
          break;
        case 'palaka':
          const palakaPlane = new THREE.BoxGeometry(3, 1.5, 0.1);
          object = new THREE.Mesh(palakaPlane, material);
          break;
        case 'chaapa':
          const chaapaArc = new THREE.TorusGeometry(1.5, 0.1, 16, 100, Math.PI);
          object = new THREE.Mesh(chaapaArc, material);
          object.rotation.y = Math.PI;
          break;
        default:
          object = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
          break;
      }
      object.castShadow = true;
      object.receiveShadow = true;
      scene.add(object);

      let groundY = 0;
      const box = new THREE.Box3().setFromObject(object);
      groundY = box.min.y;

      if (!isArMode) {
          const groundGeometry = new THREE.PlaneGeometry(20, 20);
          const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xFCF8F3, roughness: 0.8 });
          const ground = new THREE.Mesh(groundGeometry, groundMaterial);
          ground.rotation.x = -Math.PI / 2;
          ground.position.y = groundY;
          ground.receiveShadow = true;
          scene.add(ground);
      }
      
      camera.lookAt(object.position);
      controls.target.copy(object.position);

      const clock = new THREE.Clock();

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);

        if (animateShadow) {
          const elapsedTime = clock.getElapsedTime();
          const sunAngle = (elapsedTime * 0.2) % (Math.PI * 2);
          directionalLight.position.set(
              8 * Math.cos(sunAngle),
              6 * Math.sin(sunAngle),
              8 * Math.sin(sunAngle)
          );
          ambientLight.intensity = Math.max(0.2, Math.sin(sunAngle) * 0.7);
        }

        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // Handle resize
      const handleResize = () => {
          if(currentMount) {
              camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
              camera.updateProjectionMatrix();
              renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
          }
      };
      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        if(currentMount && renderer.domElement) {
          currentMount.removeChild(renderer.domElement);
        }
      };
    }, [yantraId, isArMode, animateShadow]);

    return <div ref={mountRef} className="w-full h-full" />;
});
YantraViewer.displayName = "YantraViewer";
export default YantraViewer;
