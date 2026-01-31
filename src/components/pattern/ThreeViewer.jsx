import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function ThreeViewer({ clothingType }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0x9B5DE5, 0.4);
    backLight.position.set(-5, 5, -5);
    scene.add(backLight);

    // Create clothing based on type
    const clothingGroup = new THREE.Group();
    
    // Material with gradient-like effect
    const material = new THREE.MeshStandardMaterial({
      color: 0xFF6B9D,
      metalness: 0.1,
      roughness: 0.8,
      side: THREE.DoubleSide
    });

    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      transparent: true,
      opacity: 0.1
    });

    let mainMesh;

    switch (clothingType) {
      case 'top':
      case 'jacket':
        // Torso
        const torsoGeometry = new THREE.BoxGeometry(2, 2.5, 0.8);
        mainMesh = new THREE.Mesh(torsoGeometry, material);
        clothingGroup.add(mainMesh);
        clothingGroup.add(new THREE.Mesh(torsoGeometry, wireMaterial));
        
        // Sleeves
        const sleeveGeometry = new THREE.CylinderGeometry(0.25, 0.3, 1.5, 16);
        const leftSleeve = new THREE.Mesh(sleeveGeometry, material);
        leftSleeve.rotation.z = Math.PI / 4;
        leftSleeve.position.set(-1.5, 0.5, 0);
        clothingGroup.add(leftSleeve);
        
        const rightSleeve = new THREE.Mesh(sleeveGeometry, material);
        rightSleeve.rotation.z = -Math.PI / 4;
        rightSleeve.position.set(1.5, 0.5, 0);
        clothingGroup.add(rightSleeve);
        
        // Collar
        const collarGeometry = new THREE.TorusGeometry(0.4, 0.1, 8, 16, Math.PI);
        const collar = new THREE.Mesh(collarGeometry, material);
        collar.rotation.x = Math.PI / 2;
        collar.position.set(0, 1.3, 0.2);
        clothingGroup.add(collar);
        break;

      case 'dress':
        // Bodice
        const bodiceGeometry = new THREE.CylinderGeometry(0.8, 0.6, 1.5, 32);
        mainMesh = new THREE.Mesh(bodiceGeometry, material);
        mainMesh.position.y = 1;
        clothingGroup.add(mainMesh);
        
        // Skirt part
        const skirtGeometry = new THREE.ConeGeometry(1.5, 2.5, 32, 1, true);
        const skirt = new THREE.Mesh(skirtGeometry, material);
        skirt.rotation.x = Math.PI;
        skirt.position.y = -1;
        clothingGroup.add(skirt);
        break;

      case 'pants':
      case 'shorts':
        const legLength = clothingType === 'shorts' ? 0.8 : 2;
        
        // Waistband
        const waistGeometry = new THREE.CylinderGeometry(0.7, 0.7, 0.3, 32);
        const waist = new THREE.Mesh(waistGeometry, material);
        waist.position.y = 1;
        clothingGroup.add(waist);
        
        // Left leg
        const legGeometry = new THREE.CylinderGeometry(0.35, 0.3, legLength, 16);
        const leftLeg = new THREE.Mesh(legGeometry, material);
        leftLeg.position.set(-0.4, -legLength/2 + 0.8, 0);
        clothingGroup.add(leftLeg);
        
        // Right leg
        const rightLeg = new THREE.Mesh(legGeometry, material);
        rightLeg.position.set(0.4, -legLength/2 + 0.8, 0);
        clothingGroup.add(rightLeg);
        
        // Crotch area
        const crotchGeometry = new THREE.BoxGeometry(0.8, 0.5, 0.4);
        const crotch = new THREE.Mesh(crotchGeometry, material);
        crotch.position.y = 0.8;
        clothingGroup.add(crotch);
        break;

      case 'skirt':
        // Waistband
        const skirtWaistGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.2, 32);
        const skirtWaist = new THREE.Mesh(skirtWaistGeometry, material);
        skirtWaist.position.y = 1.2;
        clothingGroup.add(skirtWaist);
        
        // Skirt body
        const skirtBodyGeometry = new THREE.ConeGeometry(1.2, 2, 32, 1, true);
        mainMesh = new THREE.Mesh(skirtBodyGeometry, material);
        mainMesh.rotation.x = Math.PI;
        clothingGroup.add(mainMesh);
        break;

      default:
        // Default cube
        const defaultGeometry = new THREE.BoxGeometry(2, 2, 0.5);
        mainMesh = new THREE.Mesh(defaultGeometry, material);
        clothingGroup.add(mainMesh);
    }

    scene.add(clothingGroup);

    // Mouse interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      
      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y
      };

      clothingGroup.rotation.y += deltaMove.x * 0.01;
      clothingGroup.rotation.x += deltaMove.y * 0.01;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      camera.position.z += e.deltaY * 0.01;
      camera.position.z = Math.max(3, Math.min(10, camera.position.z));
    };

    // Touch events
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      
      const deltaMove = {
        x: e.touches[0].clientX - previousMousePosition.x,
        y: e.touches[0].clientY - previousMousePosition.y
      };

      clothingGroup.rotation.y += deltaMove.x * 0.01;
      clothingGroup.rotation.x += deltaMove.y * 0.01;

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mouseleave', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });
    renderer.domElement.addEventListener('touchstart', onTouchStart);
    renderer.domElement.addEventListener('touchmove', onTouchMove);
    renderer.domElement.addEventListener('touchend', onTouchEnd);

    // Animation
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      if (!isDragging) {
        clothingGroup.rotation.y += 0.005;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('mouseleave', onMouseUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.domElement.removeEventListener('touchstart', onTouchStart);
      renderer.domElement.removeEventListener('touchmove', onTouchMove);
      renderer.domElement.removeEventListener('touchend', onTouchEnd);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [clothingType]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'none' }}
    />
  );
}