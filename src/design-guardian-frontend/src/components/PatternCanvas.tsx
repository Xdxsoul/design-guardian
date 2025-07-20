import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Palette, Square, Circle, Triangle, Brush, Eraser, RotateCcw, Save, Minus, Grid, Ruler } from 'lucide-react';

interface PatternCanvasProps {
  onSave: (canvasData: string) => void;
}

export const PatternCanvas = ({ onSave }: PatternCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'brush' | 'eraser' | 'square' | 'circle' | 'triangle' | 'line'>('brush');
  const [showGrid, setShowGrid] = useState(true);
  const [showRuler, setShowRuler] = useState(true);
  const [startPoint, setStartPoint] = useState<{x: number, y: number} | null>(null);
  const [currentColor, setCurrentColor] = useState('#6366f1');
  const [brushSize, setBrushSize] = useState(5);

  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', 
    '#f97316', '#eab308', '#22c55e', '#06b6d4',
    '#3b82f6', '#6366f1', '#000000', '#ffffff'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Initialize with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid and ruler
    drawGrid(ctx, canvas.width, canvas.height);
    drawRuler(ctx, canvas.width, canvas.height);
    
    // Set default drawing properties
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!showGrid) return;
    
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([]);
    
    const gridSize = 20;
    
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawRuler = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!showRuler) return;
    
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, width, 20);
    ctx.fillRect(0, 0, 20, height);
    
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1;
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#374151';
    
    // Horizontal ruler
    for (let x = 0; x <= width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 15);
      ctx.lineTo(x, 20);
      ctx.stroke();
      if (x > 0) {
        ctx.fillText(x.toString(), x + 2, 12);
      }
    }
    
    // Vertical ruler
    for (let y = 0; y <= height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(15, y);
      ctx.lineTo(20, y);
      ctx.stroke();
      if (y > 0) {
        ctx.save();
        ctx.translate(8, y - 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(y.toString(), 0, 0);
        ctx.restore();
      }
    }
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Save current canvas content
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Clear and redraw background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Redraw grid and ruler
    drawGrid(ctx, canvas.width, canvas.height);
    drawRuler(ctx, canvas.width, canvas.height);
    
    // Restore content
    ctx.putImageData(imageData, 0, 0);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);

    if (currentTool === 'brush' || currentTool === 'eraser') {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.beginPath();
      ctx.moveTo(x, y);
    } else if (currentTool === 'line') {
      setStartPoint({ x, y });
    } else {
      // For shapes, we'll draw them on mouse up
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (currentTool === 'brush') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (currentTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 2;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (currentTool === 'line' && startPoint) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
      ctx.setLineDash([]);
      
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      
      setStartPoint(null);
    } else if (currentTool !== 'brush' && currentTool !== 'eraser' && currentTool !== 'line') {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = currentColor;
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = 2;

      const size = 50;
      
      switch (currentTool) {
        case 'square':
          ctx.fillRect(x - size/2, y - size/2, size, size);
          break;
        case 'circle':
          ctx.beginPath();
          ctx.arc(x, y, size/2, 0, 2 * Math.PI);
          ctx.fill();
          break;
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(x, y - size/2);
          ctx.lineTo(x - size/2, y + size/2);
          ctx.lineTo(x + size/2, y + size/2);
          ctx.closePath();
          ctx.fill();
          break;
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, canvas.width, canvas.height);
    drawRuler(ctx, canvas.width, canvas.height);
  };

  const savePattern = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL('image/png');
    onSave(dataURL);
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-card border rounded-lg shadow-sm">
        {/* Tools */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-muted-foreground">Tools:</span>
          <Button
            variant={currentTool === 'brush' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentTool('brush')}
          >
            <Brush className="h-4 w-4" />
          </Button>
          <Button
            variant={currentTool === 'eraser' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentTool('eraser')}
          >
            <Eraser className="h-4 w-4" />
          </Button>
          <Button
            variant={currentTool === 'square' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentTool('square')}
          >
            <Square className="h-4 w-4" />
          </Button>
          <Button
            variant={currentTool === 'circle' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentTool('circle')}
          >
            <Circle className="h-4 w-4" />
          </Button>
          <Button
            variant={currentTool === 'triangle' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentTool('triangle')}
          >
            <Triangle className="h-4 w-4" />
          </Button>
          <Button
            variant={currentTool === 'line' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentTool('line')}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Brush Size */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-muted-foreground">Size:</span>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-20"
          />
          <span className="text-sm w-8">{brushSize}</span>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Colors */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-muted-foreground">Color:</span>
          <div className="flex space-x-1">
            {colors.map((color) => (
              <button
                key={color}
                className={`w-6 h-6 rounded border-2 ${
                  currentColor === color ? 'border-primary' : 'border-border'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setCurrentColor(color)}
              />
            ))}
          </div>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* View Options */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-muted-foreground">View:</span>
          <Button
            variant={showGrid ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setShowGrid(!showGrid);
              setTimeout(redrawCanvas, 0);
            }}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={showRuler ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setShowRuler(!showRuler);
              setTimeout(redrawCanvas, 0);
            }}
          >
            <Ruler className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={clearCanvas}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <Button size="sm" onClick={savePattern}>
            <Save className="h-4 w-4 mr-2" />
            Save Pattern
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="border rounded-lg overflow-hidden shadow-lg bg-white">
        <canvas
          ref={canvasRef}
          className="cursor-crosshair max-w-full"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={() => setIsDrawing(false)}
        />
      </div>
    </div>
  );
};