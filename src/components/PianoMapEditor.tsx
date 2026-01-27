"use client";

import React, { useState, useEffect, useRef } from 'react';

// Define the type for a single point
interface Point {
  x: number;
  y: number;
}

const INITIAL_DATA: Point[] = [
  { x: 0.25, y: 0.80 }, { x: 0.75, y: 0.80 }, { x: 0.75, y: 0.60 },
  { x: 0.73, y: 0.50 }, { x: 0.72, y: 0.48 }, { x: 0.70, y: 0.45 },
  { x: 0.66, y: 0.44 }, { x: 0.60, y: 0.42 }, { x: 0.58, y: 0.41 },
  { x: 0.57, y: 0.40 }, { x: 0.56, y: 0.36 }, { x: 0.55, y: 0.32 },
  { x: 0.53, y: 0.30 }, { x: 0.52, y: 0.27 }, { x: 0.50, y: 0.25 },
  { x: 0.45, y: 0.21 }, { x: 0.28, y: 0.20 }, { x: 0.27, y: 0.20 },
  { x: 0.26, y: 0.28 }, { x: 0.25, y: 0.28 }, { x: 0.24, y: 0.26 },
  { x: 0.25, y: 0.80 },
];

const PianoMapEditor = () => {
  // Add <HTMLCanvasElement> to the ref
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>(INITIAL_DATA);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  
  const WIDTH = 600;
  const HEIGHT = 600;
  const POINT_RADIUS = 6;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return; // TS safety check

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw Grid
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    for (let i = 0; i <= WIDTH; i += 50) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, HEIGHT); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(WIDTH, i); ctx.stroke();
    }

    // Draw Red Lines
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    if (points.length > 0) {
      ctx.moveTo(points[0].x * WIDTH, points[0].y * HEIGHT);
      points.forEach((p) => {
        ctx.lineTo(p.x * WIDTH, p.y * HEIGHT);
      });
    }
    ctx.stroke();

    // Draw Points
    points.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x * WIDTH, p.y * HEIGHT, POINT_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = i === dragIndex ? '#00ff00' : 'blue';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.stroke();
    });

  }, [points, dragIndex]);

  // Add event type: React.MouseEvent
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / WIDTH,
      y: (e.clientY - rect.top) / HEIGHT
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getMousePos(e);
    const clickedIndex = points.findIndex(p => {
      const px = p.x * WIDTH;
      const py = p.y * HEIGHT;
      const mx = x * WIDTH;
      const my = y * HEIGHT;
      const dist = Math.sqrt((px - mx) ** 2 + (py - my) ** 2);
      return dist < POINT_RADIUS + 4;
    });

    if (clickedIndex !== -1) {
      setDragIndex(clickedIndex);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragIndex === null) return;
    
    const { x, y } = getMousePos(e);
    
    // Clamp to 0-1 range
    const clampedX = Math.max(0, Math.min(1, x));
    const clampedY = Math.max(0, Math.min(1, y));

    const newPoints = [...points];
    newPoints[dragIndex] = { x: clampedX, y: clampedY };
    setPoints(newPoints);
  };

  const handleMouseUp = () => {
    setDragIndex(null);
  };

  const outputString = `const PIANO_MAP = [\n${points.map(p => `  { x: ${p.x.toFixed(2)}, y: ${p.y.toFixed(2)} }`).join(',\n')}\n];`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '10px' }}>Piano Map Editor</h2>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ border: '2px solid #333', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <canvas
            ref={canvasRef}
            width={WIDTH}
            height={HEIGHT}
            style={{ cursor: dragIndex !== null ? 'grabbing' : 'crosshair', display: 'block' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '300px' }}>
          <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>Output Code:</label>
          <textarea
            readOnly
            value={outputString}
            style={{
              width: '100%',
              height: '600px',
              fontFamily: 'monospace',
              fontSize: '12px',
              padding: '10px',
              backgroundColor: '#f8f8f8',
              border: '1px solid #ccc',
              borderRadius: '5px'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PianoMapEditor;