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
  { value: 'cotton', label: 'Cotton', color: '#ffffff', roughness: 0.8 },
  { value: 'silk', label: 'Silk', color: '#f8f4ec', roughness: 0.2 },
  { value: 'denim', label: 'Denim', color: '#4a6fa5', roughness: 0.9 },
  { value: 'velvet', label: 'Velvet', color: '#722f37', roughness: 0.6 },
  { value: 'leather', label: 'Leather', color: '#3d2314', roughness: 0.4 },
  { value: 'linen', label: 'Linen', color: '#e8dcc4', roughness: 0.85 },
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

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (isRotating && meshRef.current) {
        meshRef.current.rotation.y += 0.005;
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

  // Create clothing mesh
  const createClothingMesh = (scene, type, adj) => {
    // Remove existing mesh
    if (meshRef.current) {
      scene.remove(meshRef.current);
    }

    let geometry;
    const baseLength = 2.5 * adj.lengthScale;
    const baseWidth = 2 * adj.widthScale;
    const sleeveLength = 1.5 * adj.sleeveScale;

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

    const texture = fabricTextures.find(t => t.value === selectedTexture);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedColor),
      roughness: texture?.roughness || 0.7,
      metalness: 0.1,
      side: THREE.DoubleSide,
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

  // Geometry creators
  const createTopGeometry = (width, length, sleeve) => {
    const group = new THREE.Group();
    
    // Main body
    const body = new THREE.BoxGeometry(width, length, 0.3);
    
    return body;
  };

  const createBottomGeometry = (width, length) => {
    return new THREE.CylinderGeometry(width * 0.4, width * 0.3, length * 1.2, 8);
  };

  const createDressGeometry = (width, length) => {
    return new THREE.ConeGeometry(width * 0.6, length * 1.4, 8);
  };

  const createOuterwearGeometry = (width, length, sleeve) => {
    return new THREE.BoxGeometry(width * 1.1, length, 0.5);
  };

  const createJumpsuitGeometry = (width, length) => {
    return new THREE.CapsuleGeometry(width * 0.4, length, 4, 8);
  };

  // Update mesh when settings change
  useEffect(() => {
    if (sceneRef.current) {
      createClothingMesh(sceneRef.current, clothingType, adjustments);
    }
  }, [selectedTexture, selectedColor, adjustments, clothingType]);

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
        <TabsList className="grid grid-cols-3 gap-2 bg-gradient-to-r from-pink-100 via-purple-100 to-cyan-100 p-2 rounded-xl border-3 border-black">
          <TabsTrigger value="measurements" className="data-[state=active]:bg-white data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg font-bold text-xs">
            <Ruler className="w-3 h-3 mr-1" /> Size
          </TabsTrigger>
          <TabsTrigger value="texture" className="data-[state=active]:bg-white data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg font-bold text-xs">
            <Move className="w-3 h-3 mr-1" /> Texture
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

        <TabsContent value="texture" className="mt-4">
          <div className="grid grid-cols-3 gap-2">
            {fabricTextures.map(texture => (
              <button
                key={texture.value}
                onClick={() => setSelectedTexture(texture.value)}
                className={`
                  p-3 rounded-xl border-3 border-black transition-all text-center
                  ${selectedTexture === texture.value
                    ? 'bg-gradient-to-br from-pink-200 to-purple-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] scale-105'
                    : 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50'
                  }
                `}
              >
                <div 
                  className="w-8 h-8 rounded-lg mx-auto mb-1 border-2 border-black"
                  style={{ backgroundColor: texture.color }}
                />
                <span className="text-xs font-bold">{texture.label}</span>
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