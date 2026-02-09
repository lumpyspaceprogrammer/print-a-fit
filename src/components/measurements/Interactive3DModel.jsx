import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Info } from 'lucide-react';

const measurementPoints = {
  top: [
    { key: 'bust', position: [0, 0.3, 0], color: '#ec4899', label: 'Bust/Chest', instruction: 'Measure around the fullest part of your chest, keeping the tape parallel to the floor.' },
    { key: 'waist', position: [0, 0, 0], color: '#a855f7', label: 'Waist', instruction: 'Measure around your natural waistline, usually the narrowest part of your torso.' },
    { key: 'shoulder', position: [0, 0.6, 0], color: '#06b6d4', label: 'Shoulder Width', instruction: 'Measure from shoulder point to shoulder point across the back.' },
    { key: 'sleeve', position: [0.3, 0.4, 0], color: '#f59e0b', label: 'Sleeve Length', instruction: 'Measure from shoulder point to wrist with arm slightly bent.' }
  ],
  bottom: [
    { key: 'waist', position: [0, 0.2, 0], color: '#a855f7', label: 'Waist', instruction: 'Measure around your natural waistline.' },
    { key: 'hips', position: [0, -0.1, 0], color: '#ec4899', label: 'Hips', instruction: 'Measure around the fullest part of your hips and buttocks.' },
    { key: 'inseam', position: [0, -0.5, 0], color: '#06b6d4', label: 'Inseam', instruction: 'Measure from crotch to ankle along the inside of your leg.' },
    { key: 'rise', position: [0, 0, 0], color: '#f59e0b', label: 'Rise', instruction: 'Measure from waist to crotch while sitting.' }
  ],
  dress: [
    { key: 'bust', position: [0, 0.3, 0], color: '#ec4899', label: 'Bust/Chest', instruction: 'Measure around the fullest part of your chest.' },
    { key: 'waist', position: [0, 0, 0], color: '#a855f7', label: 'Waist', instruction: 'Measure around your natural waistline.' },
    { key: 'hips', position: [0, -0.2, 0], color: '#06b6d4', label: 'Hips', instruction: 'Measure around the fullest part of your hips.' },
    { key: 'length', position: [0, -0.7, 0], color: '#f59e0b', label: 'Length', instruction: 'Measure from shoulder to desired hemline.' }
  ],
  outerwear: [
    { key: 'chest', position: [0, 0.3, 0], color: '#ec4899', label: 'Chest', instruction: 'Measure around the fullest part of your chest.' },
    { key: 'shoulder', position: [0, 0.6, 0], color: '#a855f7', label: 'Shoulder Width', instruction: 'Measure from shoulder point to shoulder point.' },
    { key: 'sleeve', position: [0.3, 0.4, 0], color: '#06b6d4', label: 'Sleeve Length', instruction: 'Measure from shoulder to wrist with arm slightly bent.' },
    { key: 'length', position: [0, -0.5, 0], color: '#f59e0b', label: 'Jacket Length', instruction: 'Measure from collar seam to desired length.' }
  ]
};

export default function Interactive3DModel({ clothingType, activeMeasurement, onMeasurementClick }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const figureRef = useRef(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  useEffect(() => {
    if (!mountRef.current || !clothingType) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.set(0, 0, 3);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(300, 400);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create simplified body figure
    const bodyGroup = new THREE.Group();
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xe0e0e0,
      flatShading: true
    });
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.y = 0.7;
    bodyGroup.add(head);

    // Torso
    const torsoGeometry = new THREE.CylinderGeometry(0.2, 0.22, 0.8, 8);
    const torso = new THREE.Mesh(torsoGeometry, bodyMaterial);
    torso.position.y = 0.2;
    bodyGroup.add(torso);

    // Hips
    if (['bottom', 'dress', 'jumpsuit'].includes(clothingType)) {
      const hipsGeometry = new THREE.CylinderGeometry(0.22, 0.2, 0.3, 8);
      const hips = new THREE.Mesh(hipsGeometry, bodyMaterial);
      hips.position.y = -0.3;
      bodyGroup.add(hips);

      // Legs
      const legGeometry = new THREE.CylinderGeometry(0.08, 0.07, 0.7, 8);
      const leftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
      leftLeg.position.set(-0.1, -0.7, 0);
      bodyGroup.add(leftLeg);
      const rightLeg = new THREE.Mesh(legGeometry, bodyMaterial);
      rightLeg.position.set(0.1, -0.7, 0);
      bodyGroup.add(rightLeg);
    }

    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.05, 0.04, 0.6, 8);
    const leftArm = new THREE.Mesh(armGeometry, bodyMaterial);
    leftArm.position.set(-0.3, 0.2, 0);
    leftArm.rotation.z = Math.PI / 6;
    bodyGroup.add(leftArm);
    const rightArm = new THREE.Mesh(armGeometry, bodyMaterial);
    rightArm.position.set(0.3, 0.2, 0);
    rightArm.rotation.z = -Math.PI / 6;
    bodyGroup.add(rightArm);

    // Add measurement points
    const points = measurementPoints[clothingType] || [];
    points.forEach(point => {
      const pointGeometry = new THREE.SphereGeometry(0.05, 16, 16);
      const pointMaterial = new THREE.MeshBasicMaterial({ color: point.color });
      const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
      pointMesh.position.set(...point.position);
      pointMesh.userData = point;
      bodyGroup.add(pointMesh);

      // Add ring around point
      const ringGeometry = new THREE.TorusGeometry(0.08, 0.01, 8, 16);
      const ringMaterial = new THREE.MeshBasicMaterial({ color: point.color });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.set(...point.position);
      ring.rotation.x = Math.PI / 2;
      bodyGroup.add(ring);
    });

    scene.add(bodyGroup);
    figureRef.current = bodyGroup;

    // Animation
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      bodyGroup.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
    };
  }, [clothingType]);

  const points = measurementPoints[clothingType] || [];

  return (
    <div className="relative">
      <div 
        ref={mountRef} 
        className="rounded-xl border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
      />
      
      {/* Measurement points overlay */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {points.map((point, idx) => (
          <motion.button
            key={point.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onMeasurementClick?.(point.key)}
            onMouseEnter={() => setHoveredPoint(point.key)}
            onMouseLeave={() => setHoveredPoint(null)}
            className={`p-3 rounded-lg border-3 border-black dark:border-white text-left transition-all ${
              activeMeasurement === point.key
                ? 'bg-gradient-to-br shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] scale-105'
                : 'bg-white dark:bg-gray-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:scale-105'
            }`}
            style={{
              background: activeMeasurement === point.key 
                ? `linear-gradient(135deg, ${point.color}40, ${point.color}60)`
                : undefined
            }}
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full border-2 border-black dark:border-white"
                style={{ backgroundColor: point.color }}
              />
              <span className="text-sm font-bold dark:text-white">{point.label}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredPoint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-3 p-4 rounded-xl border-3 border-black dark:border-white bg-white dark:bg-gray-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
          >
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {points.find(p => p.key === hoveredPoint)?.instruction}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}