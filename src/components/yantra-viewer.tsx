'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

type YantraViewerProps = {
  yantraId: 'samrat' | 'rama' | 'jai-prakash' | 'rasivalaya';
  isArMode?: boolean;
};

export default function YantraViewer({ yantraId, isArMode = false }: YantraViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene
    const scene = new THREE.Scene();
    if (!isArMode) {
      scene.background = new THREE.Color(0xe6e6fa); // Light Lavender
      scene.fog = new THREE.Fog(0xe6e6fa, 10, 25);
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
    controls.minDistance = 2;
    controls.maxDistance = 20;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Material
    const material = new THREE.MeshStandardMaterial({ color: 0x4B0082, roughness: 0.5, metalness: 0.1 });

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
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xd8d8f0, roughness: 0.8 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = groundY;
        ground.receiveShadow = true;
        scene.add(ground);
    }
    
    camera.lookAt(object.position);
    controls.target.copy(object.position);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
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
  }, [yantraId, isArMode]);

  return <div ref={mountRef} className="w-full h-full" />;
}
