import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Circle, Check, RotateCcw } from 'lucide-react';
import GlowButton from '../ui/GlowButton';
import GlowCard from '../ui/GlowCard';

export default function CircleSelector({ image, onSelectionComplete }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [circle, setCircle] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = URL.createObjectURL(image);
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
      drawCanvas();
    };
  }, [image]);

  useEffect(() => {
    if (imageLoaded) {
      drawCanvas();
    }
  }, [circle, imageLoaded]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;

    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    // Set canvas size to match image
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw image
    ctx.drawImage(img, 0, 0);

    // Draw semi-transparent overlay
    if (circle) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Clear circle area
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw circle border
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = '#a78bfa';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleMouseDown = (e) => {
    const coords = getCanvasCoordinates(e);
    setIsDrawing(true);
    setCircle({ x: coords.x, y: coords.y, radius: 0 });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !circle) return;

    const coords = getCanvasCoordinates(e);
    const radius = Math.sqrt(
      Math.pow(coords.x - circle.x, 2) + Math.pow(coords.y - circle.y, 2)
    );
    setCircle({ ...circle, radius });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleReset = () => {
    setCircle(null);
  };

  const handleConfirm = () => {
    if (circle && circle.radius > 0) {
      onSelectionComplete(circle);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <GlowCard glowColor="cyan" className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-2">
            Draw a Circle Around Your Item
          </h3>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <Circle className="w-4 h-4" />
            Click and drag to create a circle around the clothing you want to isolate
          </p>
        </div>

        <div className="rounded-xl overflow-hidden border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6 bg-white">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-auto cursor-crosshair"
            style={{ maxHeight: '500px', objectFit: 'contain' }}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <GlowButton onClick={handleReset} variant="secondary" disabled={!circle}>
            <RotateCcw className="w-5 h-5 mr-2 inline" />
            Reset Circle
          </GlowButton>
          <GlowButton 
            onClick={handleConfirm} 
            variant="success"
            disabled={!circle || circle.radius < 10}
          >
            <Check className="w-5 h-5 mr-2 inline" />
            Continue with Selection
          </GlowButton>
        </div>
      </GlowCard>
    </div>
  );
}