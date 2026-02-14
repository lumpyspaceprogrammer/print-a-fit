import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  RotateCcw, ZoomIn, ZoomOut, Download, Palette, 
  Ruler, Move, RefreshCw, Maximize2, Minimize2,
  Sun, Moon
} from 'lucide-react';
import * as THREE from 'three';
import GlowCard from '../ui/GlowCard';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const fabricTextures = [
  { 
    value: 'cotton', 
    label: 'Cotton', 
    color: '#ffffff', 
    roughness: 0.8,
    weight: 0.5,
    stretch: 0.3,
    drape: 0.6,
    description: 'Medium weight, moderate drape'
  },
  { 
    value: 'silk', 
    label: 'Silk', 
    color: '#f8f4ec', 
    roughness: 0.2,
    weight: 0.2,
    stretch: 0.2,
    drape: 0.9,
    description: 'Lightweight, flows beautifully'
  },
  { 
    value: 'denim', 
    label: 'Denim', 
    color: '#4a6fa5', 
    roughness: 0.9,
    weight: 0.9,
    stretch: 0.1,
    drape: 0.2,
    description: 'Heavy, structured, minimal drape'
  },
  { 
    value: 'velvet', 
    label: 'Velvet', 
    color: '#722f37', 
    roughness: 0.6,
    weight: 0.7,
    stretch: 0.4,
    drape: 0.7,
    description: 'Medium-heavy, soft draping'
  },
  { 
    value: 'leather', 
    label: 'Leather', 
    color: '#3d2314', 
    roughness: 0.4,
    weight: 0.95,
    stretch: 0.05,
    drape: 0.1,
    description: 'Very heavy, rigid, no drape'
  },
  { 
    value: 'linen', 
    label: 'Linen', 
    color: '#e8dcc4', 
    roughness: 0.85,
    weight: 0.4,
    stretch: 0.15,
    drape: 0.5,
    description: 'Light-medium, crisp with some flow'
  },
  { 
    value: 'jersey', 
    label: 'Jersey', 
    color: '#e0e0e0', 
    roughness: 0.7,
    weight: 0.3,
    stretch: 0.9,
    drape: 0.8,
    description: 'Lightweight, very stretchy, flows well'
  },
  { 
    value: 'satin', 
    label: 'Satin', 
    color: '#fff5f7', 
    roughness: 0.1,
    weight: 0.35,
    stretch: 0.25,
    drape: 0.95,
    description: 'Light, smooth, excellent drape'
  },
];

const colorPresets = [
  { name: 'Pink Dream', color: '#ff69b4' },
  { name: 'Ocean Blue', color: '#00ced1' },
  { name: 'Lavender', color: '#e6e6fa' },
  { name: 'Mint', color: '#98fb98' },
  { name: 'Coral', color: '#ff7f50' },
  { name: 'Sunshine', color: '#ffd700' },
  { name: 'Classic Black', color: '#1a1a1a' },
  { name: 'Pure White', color: '#ffffff' },
];

export default function Interactive3DViewer({ clothingType, measurements, onMeasurementsChange }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const meshRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTexture, setSelectedTexture] = useState('cotton');
  const [selectedColor, setSelectedColor] = useState('#e9d5ff');
  const [customColor, setCustomColor] = useState('#e9d5ff');
  const [lightMode, setLightMode] = useState('day');
  const [isRotating, setIsRotating] = useState(true);
  
  // Measurement adjustments
  const [adjustments, setAdjustments] = useState({
    lengthScale: 1,
    widthScale: 1,
    sleeveScale: 1,
  });

  // Fabric simulation properties
  const [fabricProps, setFabricProps] = useState({
    weight: 0.5,
    stretch: 0.3,
    drape: 0.6,
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const animationFrameRef = useRef(null);

  // Initialize 3D scene
  useEffect(() => {
    if (!containerRef.current || sceneRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = isFullscreen ? window.innerHeight - 200 : 400;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    updateLighting(scene, lightMode);

    // Create mesh
    createClothingMesh(scene, clothingType, adjustments);

    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      setIsRotating(false);
    };

    const onMouseMove = (e) => {
      if (!isDragging || !meshRef.current) return;
      
      const deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y
      };

      meshRef.current.rotation.y += deltaMove.x * 0.01;
      meshRef.current.rotation.x += deltaMove.y * 0.01;

      previousMousePosition = { x: e.offsetX, y: e.offsetY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      camera.position.z += e.deltaY * 0.01;
      camera.position.z = Math.max(2, Math.min(10, camera.position.z));
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mouseleave', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    // Animation loop with fabric simulation
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      if (isRotating && meshRef.current) {
        meshRef.current.rotation.y += 0.005;
      }

      // Fabric simulation: gentle movement based on stretch
      if (isSimulating && meshRef.current) {
        const time = Date.now() * 0.001;
        const stretchAmount = fabricProps.stretch * 0.05;
        
        // Gentle breathing effect for stretchy fabrics
        meshRef.current.scale.set(
          1 + Math.sin(time * 0.5) * stretchAmount,
          1 + Math.cos(time * 0.7) * stretchAmount * 0.5,
          1 + Math.sin(time * 0.3) * stretchAmount * 0.3
        );
      } else if (meshRef.current) {
        meshRef.current.scale.set(1, 1, 1);
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('mouseleave', onMouseUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update lighting
  const updateLighting = (scene, mode) => {
    // Remove existing lights
    scene.children = scene.children.filter(child => !(child instanceof THREE.Light));
    
    const ambientIntensity = mode === 'day' ? 0.6 : 0.3;
    const directionalIntensity = mode === 'day' ? 0.8 : 0.4;
    
    const ambient = new THREE.AmbientLight(0xffffff, ambientIntensity);
    scene.add(ambient);

    const directional = new THREE.DirectionalLight(0xffffff, directionalIntensity);
    directional.position.set(5, 5, 5);
    directional.castShadow = true;
    scene.add(directional);

    if (mode === 'day') {
      const fill = new THREE.DirectionalLight(0xfce7f3, 0.3);
      fill.position.set(-5, 3, -5);
      scene.add(fill);
    } else {
      const rim = new THREE.PointLight(0x8b5cf6, 0.5);
      rim.position.set(0, 3, -3);
      scene.add(rim);
    }

    // Update background
    scene.background = new THREE.Color(mode === 'day' ? 0xfce7f3 : 0x1a1a2e);
  };

  // Create clothing mesh with fabric simulation
  const createClothingMesh = (scene, type, adj) => {
    // Remove existing mesh
    if (meshRef.current) {
      scene.remove(meshRef.current);
    }

    let geometry;
    const baseLength = 2.5 * adj.lengthScale;
    const baseWidth = 2 * adj.widthScale;
    const sleeveLength = 1.5 * adj.sleeveScale;

    // Apply fabric drape effect to geometry
    const drapeIntensity = fabricProps.drape;
    const weightFactor = fabricProps.weight;

    switch (type) {
      case 'top':
        geometry = createTopGeometry(baseWidth, baseLength, sleeveLength);
        break;
      case 'bottom':
        geometry = createBottomGeometry(baseWidth, baseLength);
        break;
      case 'dress':
        geometry = createDressGeometry(baseWidth, baseLength);
        break;
      case 'outerwear':
        geometry = createOuterwearGeometry(baseWidth, baseLength, sleeveLength);
        break;
      case 'jumpsuit':
        geometry = createJumpsuitGeometry(baseWidth, baseLength);
        break;
      default:
        geometry = new THREE.BoxGeometry(baseWidth, baseLength, 0.3);
    }

    // Apply drape deformation to geometry
    applyDrapeEffect(geometry, drapeIntensity, weightFactor);

    const texture = fabricTextures.find(t => t.value === selectedTexture);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedColor),
      roughness: texture?.roughness || 0.7,
      metalness: texture?.value === 'satin' || texture?.value === 'silk' ? 0.3 : 0.1,
      side: THREE.DoubleSide,
      // Add subtle displacement for fabric texture
      flatShading: texture?.value === 'denim' || texture?.value === 'linen',
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    meshRef.current = mesh;
    scene.add(mesh);

    // Add wireframe overlay
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });
    const wireframe = new THREE.Mesh(geometry.clone(), wireframeMaterial);
    mesh.add(wireframe);
  };

  // Apply drape effect to geometry vertices
  const applyDrapeEffect = (geometry, drapeIntensity, weightFactor) => {
    const position = geometry.attributes.position;
    if (!position) return;

    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z = position.getZ(i);

      // Apply gravity-based draping (more drape at bottom)
      const verticalPos = (y + 2) / 4; // Normalize to 0-1
      const drapeAmount = drapeIntensity * (1 - verticalPos) * weightFactor;
      
      // Add wave deformation for fabric flow
      const waveX = Math.sin(x * 2 + y) * drapeAmount * 0.1;
      const waveZ = Math.cos(y * 2 + x) * drapeAmount * 0.1;
      
      // Apply deformation
      position.setX(i, x + waveX);
      position.setZ(i, z + waveZ);
      
      // Gravity pull (heavier fabrics pull down more)
      if (y < 0) {
        position.setY(i, y - drapeAmount * 0.15);
      }
    }

    position.needsUpdate = true;
    geometry.computeVertexNormals();
  };

  // Geometry creators with higher detail for fabric simulation
  const createTopGeometry = (width, length, sleeve) => {
    // Use plane with segments for better draping
    return new THREE.PlaneGeometry(width, length, 20, 30);
  };

  const createBottomGeometry = (width, length) => {
    return new THREE.CylinderGeometry(width * 0.4, width * 0.3, length * 1.2, 16, 20);
  };

  const createDressGeometry = (width, length) => {
    return new THREE.ConeGeometry(width * 0.6, length * 1.4, 16, 20);
  };

  const createOuterwearGeometry = (width, length, sleeve) => {
    return new THREE.PlaneGeometry(width * 1.1, length, 20, 30);
  };

  const createJumpsuitGeometry = (width, length) => {
    return new THREE.CapsuleGeometry(width * 0.4, length, 8, 20);
  };

  // Update fabric properties when texture changes
  useEffect(() => {
    const texture = fabricTextures.find(t => t.value === selectedTexture);
    if (texture) {
      setFabricProps({
        weight: texture.weight,
        stretch: texture.stretch,
        drape: texture.drape,
      });
    }
  }, [selectedTexture]);

  // Update mesh when settings change
  useEffect(() => {
    if (sceneRef.current) {
      createClothingMesh(sceneRef.current, clothingType, adjustments);
    }
  }, [selectedTexture, selectedColor, adjustments, clothingType, fabricProps]);

  // Update lighting when mode changes
  useEffect(() => {
    if (sceneRef.current) {
      updateLighting(sceneRef.current, lightMode);
    }
  }, [lightMode]);

  // Handle adjustment changes
  const handleAdjustment = (key, value) => {
    const newAdjustments = { ...adjustments, [key]: value[0] };
    setAdjustments(newAdjustments);
    
    // Notify parent of measurement changes
    if (onMeasurementsChange) {
      onMeasurementsChange(newAdjustments);
    }
  };

  // Export as GLB
  const exportGLB = async () => {
    if (!sceneRef.current || !meshRef.current) return;

    // Dynamic import of GLTFExporter
    const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js');
    
    const exporter = new GLTFExporter();
    
    exporter.parse(
      meshRef.current,
      (gltf) => {
        const blob = new Blob([gltf], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `garment-${clothingType}-${Date.now()}.glb`;
        a.click();
        URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Export error:', error);
      },
      { binary: true }
    );
  };

  // Reset view
  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 5);
    }
    if (meshRef.current) {
      meshRef.current.rotation.set(0, 0, 0);
    }
    setIsRotating(true);
  };

  return (
    <GlowCard glowColor="pink" className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span className="text-2xl">🎨</span> Interactive 3D Preview
        </h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setLightMode(lightMode === 'day' ? 'night' : 'day')}
            className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            {lightMode === 'day' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* 3D Viewport */}
      <div 
        ref={containerRef}
        className={`rounded-xl overflow-hidden border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-pink-100 via-purple-100 to-cyan-100 cursor-grab active:cursor-grabbing ${isFullscreen ? 'h-[60vh]' : ''}`}
        style={{ minHeight: isFullscreen ? '60vh' : '400px' }}
      />

      {/* Controls */}
      <div className="flex justify-center gap-2 mt-4 mb-4">
        <Button
          size="sm"
          variant="outline"
          onClick={resetView}
          className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          <RotateCcw className="w-4 h-4 mr-1" /> Reset
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsRotating(!isRotating)}
          className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          <RefreshCw className={`w-4 h-4 mr-1 ${isRotating ? 'animate-spin' : ''}`} />
          {isRotating ? 'Stop' : 'Spin'}
        </Button>
        <Button
          size="sm"
          onClick={exportGLB}
          className="bg-gradient-to-r from-pink-400 to-purple-400 text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          <Download className="w-4 h-4 mr-1" /> Export GLB
        </Button>
      </div>

      {/* Customization Tabs */}
      <Tabs defaultValue="measurements" className="mt-4">
        <TabsList className="grid grid-cols-4 gap-2 bg-gradient-to-r from-pink-100 via-purple-100 to-cyan-100 p-2 rounded-xl border-3 border-black">
          <TabsTrigger value="measurements" className="data-[state=active]:bg-white data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg font-bold text-xs">
            <Ruler className="w-3 h-3 mr-1" /> Size
          </TabsTrigger>
          <TabsTrigger value="fabric" className="data-[state=active]:bg-white data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg font-bold text-xs">
            <Move className="w-3 h-3 mr-1" /> Fabric
          </TabsTrigger>
          <TabsTrigger value="texture" className="data-[state=active]:bg-white data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg font-bold text-xs">
            <Move className="w-3 h-3 mr-1" /> Type
          </TabsTrigger>
          <TabsTrigger value="color" className="data-[state=active]:bg-white data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg font-bold text-xs">
            <Palette className="w-3 h-3 mr-1" /> Color
          </TabsTrigger>
        </TabsList>

        <TabsContent value="measurements" className="mt-4 space-y-4">
          <div>
            <Label className="text-sm font-bold flex justify-between">
              <span>Length</span>
              <span className="text-purple-500">{Math.round(adjustments.lengthScale * 100)}%</span>
            </Label>
            <Slider
              value={[adjustments.lengthScale]}
              onValueChange={(v) => handleAdjustment('lengthScale', v)}
              min={0.7}
              max={1.3}
              step={0.05}
              className="mt-2"
            />
          </div>
          <div>
            <Label className="text-sm font-bold flex justify-between">
              <span>Width</span>
              <span className="text-pink-500">{Math.round(adjustments.widthScale * 100)}%</span>
            </Label>
            <Slider
              value={[adjustments.widthScale]}
              onValueChange={(v) => handleAdjustment('widthScale', v)}
              min={0.7}
              max={1.3}
              step={0.05}
              className="mt-2"
            />
          </div>
          {(clothingType === 'top' || clothingType === 'outerwear') && (
            <div>
              <Label className="text-sm font-bold flex justify-between">
                <span>Sleeve Length</span>
                <span className="text-cyan-500">{Math.round(adjustments.sleeveScale * 100)}%</span>
              </Label>
              <Slider
                value={[adjustments.sleeveScale]}
                onValueChange={(v) => handleAdjustment('sleeveScale', v)}
                min={0.5}
                max={1.5}
                step={0.05}
                className="mt-2"
              />
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            💡 Adjust measurements to see changes in real-time
          </p>
        </TabsContent>

        <TabsContent value="fabric" className="mt-4 space-y-4">
          <div className="bg-purple-50 border-2 border-black rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🧵</span>
              <h4 className="font-bold">Fabric Simulation</h4>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              Adjust properties to see how different fabrics behave
            </p>
            
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-bold flex justify-between">
                  <span>Weight (Heaviness)</span>
                  <span className="text-purple-500">{Math.round(fabricProps.weight * 100)}%</span>
                </Label>
                <Slider
                  value={[fabricProps.weight]}
                  onValueChange={(v) => setFabricProps(prev => ({ ...prev, weight: v[0] }))}
                  min={0}
                  max={1}
                  step={0.05}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Heavy fabrics (denim, leather) vs light (silk, chiffon)
                </p>
              </div>

              <div>
                <Label className="text-sm font-bold flex justify-between">
                  <span>Stretch (Elasticity)</span>
                  <span className="text-pink-500">{Math.round(fabricProps.stretch * 100)}%</span>
                </Label>
                <Slider
                  value={[fabricProps.stretch]}
                  onValueChange={(v) => setFabricProps(prev => ({ ...prev, stretch: v[0] }))}
                  min={0}
                  max={1}
                  step={0.05}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Stretchy fabrics (jersey, spandex) vs rigid (denim, canvas)
                </p>
              </div>

              <div>
                <Label className="text-sm font-bold flex justify-between">
                  <span>Drape (Flow)</span>
                  <span className="text-cyan-500">{Math.round(fabricProps.drape * 100)}%</span>
                </Label>
                <Slider
                  value={[fabricProps.drape]}
                  onValueChange={(v) => setFabricProps(prev => ({ ...prev, drape: v[0] }))}
                  min={0}
                  max={1}
                  step={0.05}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Flowing fabrics (silk, satin) vs structured (denim, taffeta)
                </p>
              </div>
            </div>

            <Button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`w-full mt-4 border-2 border-black ${
                isSimulating 
                  ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' 
                  : 'bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              {isSimulating ? '⏸️ Stop Movement' : '▶️ Animate Fabric'}
            </Button>
          </div>

          <div className="text-xs text-gray-600 bg-cyan-50 border-2 border-black rounded-xl p-3">
            <span className="font-bold">💡 Tip:</span> Each fabric type has preset properties. Adjust them manually or select a preset below.
          </div>
        </TabsContent>

        <TabsContent value="texture" className="mt-4">
          <div className="grid grid-cols-2 gap-3">
            {fabricTextures.map(texture => (
              <button
                key={texture.value}
                onClick={() => setSelectedTexture(texture.value)}
                className={`
                  p-3 rounded-xl border-3 border-black transition-all text-left
                  ${selectedTexture === texture.value
                    ? 'bg-gradient-to-br from-pink-200 to-purple-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] scale-105'
                    : 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg border-2 border-black flex-shrink-0"
                    style={{ backgroundColor: texture.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold block">{texture.label}</span>
                    <span className="text-xs text-gray-600 block truncate">{texture.description}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="color" className="mt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {colorPresets.map(preset => (
                <button
                  key={preset.name}
                  onClick={() => setSelectedColor(preset.color)}
                  className={`
                    p-2 rounded-xl border-3 border-black transition-all
                    ${selectedColor === preset.color
                      ? 'shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] scale-105'
                      : 'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    }
                  `}
                  style={{ backgroundColor: preset.color }}
                  title={preset.name}
                >
                  <span className="sr-only">{preset.name}</span>
                </button>
              ))}
            </div>
            <div>
              <Label className="text-sm font-bold mb-2 block">Custom Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    setSelectedColor(e.target.value);
                  }}
                  className="w-12 h-12 rounded-lg border-3 border-black cursor-pointer"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                      setSelectedColor(e.target.value);
                    }
                  }}
                  className="flex-1 px-3 rounded-lg border-3 border-black font-mono uppercase"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </GlowCard>
  );
}