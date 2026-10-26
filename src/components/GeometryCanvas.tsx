/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { PositionalAnalysis, Point2D } from '../types/geometry';
import { TranslationSchema } from '../i18n/translations';
import { ZoomIn, ZoomOut, RotateCcw, Eye, Layers, Download } from 'lucide-react';

interface GeometryCanvasProps {
  analysis: PositionalAnalysis;
  t?: TranslationSchema;
  onUpdateCenter?: (x: number, y: number) => void;
  onUpdateRadius?: (r: number) => void;
}

export const GeometryCanvas: React.FC<GeometryCanvasProps> = ({
  analysis,
  t,
  onUpdateCenter,
  onUpdateRadius,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 700, height: 500 });

  // Viewport transformation: scale (pixels per math unit), origin (in canvas pixel space)
  const [scale, setScale] = useState<number>(36);
  const [pan, setPan] = useState<Point2D>({ x: 0, y: 0 });

  // Dragging states
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState<Point2D>({ x: 0, y: 0 });
  const [activeDragTarget, setActiveDragTarget] = useState<'center' | 'radius' | null>(null);

  // Toggles
  const [showAuxLines, setShowAuxLines] = useState(true);
  const [showExtrema, setShowExtrema] = useState(true);

  // Auto-center on initial load or reset
  const resetView = useCallback(() => {
    if (analysis.isValidCircle) {
      const targetScale = Math.min(
        dimensions.width / (analysis.r * 6 + 10),
        dimensions.height / (analysis.r * 6 + 10),
        45
      );
      setScale(Math.max(20, Math.min(targetScale, 60)));
      setPan({
        x: dimensions.width / 2 - analysis.x0 * scale,
        y: dimensions.height / 2 + analysis.y0 * scale,
      });
    } else {
      setScale(36);
      setPan({ x: dimensions.width / 2, y: dimensions.height / 2 });
    }
  }, [analysis.isValidCircle, analysis.x0, analysis.y0, analysis.r, dimensions, scale]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(300, rect.width),
          height: Math.max(380, rect.height || 520),
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setPan({
      x: dimensions.width / 2 - analysis.x0 * scale,
      y: dimensions.height / 2 + analysis.y0 * scale,
    });
  }, [dimensions.width, dimensions.height]);

  // Coordinate Conversion
  const mathToScreen = useCallback(
    (mx: number, my: number): Point2D => {
      return {
        x: pan.x + mx * scale,
        y: pan.y - my * scale,
      };
    },
    [pan, scale]
  );

  const screenToMath = useCallback(
    (sx: number, sy: number): Point2D => {
      return {
        x: (sx - pan.x) / scale,
        y: (pan.y - sy) / scale,
      };
    },
    [pan, scale]
  );

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    const centerScreen = mathToScreen(analysis.x0, analysis.y0);
    const distToCenter = Math.hypot(sx - centerScreen.x, sy - centerScreen.y);

    if (distToCenter < 16 && onUpdateCenter) {
      setActiveDragTarget('center');
      return;
    }

    const circleScreenRadius = analysis.r * scale;
    if (Math.abs(distToCenter - circleScreenRadius) < 12 && onUpdateRadius) {
      setActiveDragTarget('radius');
      return;
    }

    setIsPanning(true);
    setDragStart({ x: sx - pan.x, y: sy - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    if (isPanning) {
      setPan({
        x: sx - dragStart.x,
        y: sy - dragStart.y,
      });
      return;
    }

    if (activeDragTarget === 'center' && onUpdateCenter) {
      const mPos = screenToMath(sx, sy);
      onUpdateCenter(Math.round(mPos.x * 2) / 2, Math.round(mPos.y * 2) / 2);
      return;
    }

    if (activeDragTarget === 'radius' && onUpdateRadius) {
      const centerScreen = mathToScreen(analysis.x0, analysis.y0);
      const newScreenR = Math.hypot(sx - centerScreen.x, sy - centerScreen.y);
      const newMathR = Math.max(0.5, Math.round((newScreenR / scale) * 2) / 2);
      onUpdateRadius(newMathR);
      return;
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setActiveDragTarget(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    const newScale = Math.max(10, Math.min(130, scale * zoomFactor));

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const mathX = (mouseX - pan.x) / scale;
    const mathY = (pan.y - mouseY) / scale;

    setScale(newScale);
    setPan({
      x: mouseX - mathX * newScale,
      y: mouseY + mathY * newScale,
    });
  };

  // Export SVG file
  const handleExportSvg = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GeometryDiagram_${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Grid
  const renderGrid = () => {
    const lines = [];
    const step = scale < 25 ? 5 : scale < 50 ? 2 : 1;

    const minX = Math.floor((0 - pan.x) / scale / step) * step;
    const maxX = Math.ceil((dimensions.width - pan.x) / scale / step) * step;
    const minY = Math.floor((pan.y - dimensions.height) / scale / step) * step;
    const maxY = Math.ceil(pan.y / scale / step) * step;

    for (let x = minX; x <= maxX; x += step) {
      const sx = pan.x + x * scale;
      const isAxis = x === 0;
      lines.push(
        <g key={`v-${x}`}>
          <line
            x1={sx}
            y1={0}
            x2={sx}
            y2={dimensions.height}
            stroke={isAxis ? '#334155' : '#E2E8F0'}
            strokeWidth={isAxis ? 1.5 : 1}
          />
          {x !== 0 && (
            <text
              x={sx + 3}
              y={Math.max(16, Math.min(dimensions.height - 6, pan.y + 14))}
              fill="#94A3B8"
              fontSize={11}
              className="font-mono select-none"
            >
              {x}
            </text>
          )}
        </g>
      );
    }

    for (let y = minY; y <= maxY; y += step) {
      const sy = pan.y - y * scale;
      const isAxis = y === 0;
      lines.push(
        <g key={`h-${y}`}>
          <line
            x1={0}
            y1={sy}
            x2={dimensions.width}
            y2={sy}
            stroke={isAxis ? '#334155' : '#E2E8F0'}
            strokeWidth={isAxis ? 1.5 : 1}
          />
          {y !== 0 && (
            <text
              x={Math.max(6, Math.min(dimensions.width - 26, pan.x + 4))}
              y={sy - 4}
              fill="#94A3B8"
              fontSize={11}
              className="font-mono select-none"
            >
              {y}
            </text>
          )}
        </g>
      );
    }

    lines.push(
      <text
        key="origin"
        x={pan.x - 14}
        y={pan.y + 16}
        fill="#475569"
        fontSize={12}
        fontWeight="bold"
        className="font-mono select-none"
      >
        O
      </text>
    );

    return lines;
  };

  // Line
  const renderLine = () => {
    const { A, B, C } = analysis;
    const minM = screenToMath(0, dimensions.height);
    const maxM = screenToMath(dimensions.width, 0);

    let p1: Point2D;
    let p2: Point2D;

    if (Math.abs(B) > 1e-7) {
      const x1 = minM.x - 2;
      const y1 = (-A * x1 - C) / B;
      const x2 = maxM.x + 2;
      const y2 = (-A * x2 - C) / B;
      p1 = mathToScreen(x1, y1);
      p2 = mathToScreen(x2, y2);
    } else {
      const xVal = -C / A;
      p1 = mathToScreen(xVal, minM.y - 2);
      p2 = mathToScreen(xVal, maxM.y + 2);
    }

    return (
      <line
        x1={p1.x}
        y1={p1.y}
        x2={p2.x}
        y2={p2.y}
        stroke="#0284C7"
        strokeWidth={3}
        strokeLinecap="round"
      />
    );
  };

  const centerScr = mathToScreen(analysis.x0, analysis.y0);
  const footScr = mathToScreen(analysis.footH.x, analysis.footH.y);
  const radiusScr = analysis.r * scale;

  const renderRightAngle = () => {
    if (!analysis.isValidCircle || analysis.distance < 0.05) return null;
    const size = 10;
    const dx = centerScr.x - footScr.x;
    const dy = centerScr.y - footScr.y;
    const len = Math.hypot(dx, dy);
    if (len < 1e-4) return null;

    const uX = dx / len;
    const uY = dy / len;
    const vX = -uY;
    const vY = uX;

    const p1X = footScr.x + uX * size;
    const p1Y = footScr.y + uY * size;
    const p2X = p1X + vX * size;
    const p2Y = p1Y + vY * size;
    const p3X = footScr.x + vX * size;
    const p3Y = footScr.y + vY * size;

    return (
      <path
        d={`M ${p1X} ${p1Y} L ${p2X} ${p2Y} L ${p3X} ${p3Y}`}
        fill="none"
        stroke="#F59E0B"
        strokeWidth={1.7}
      />
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[480px] bg-white border border-slate-200 rounded-lg overflow-hidden select-none"
    >
      {/* Floating Toolbar */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 p-1 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-md shadow-xs">
        <button
          onClick={() => setScale((s) => Math.min(130, s * 1.2))}
          title={t?.canvasZoomIn || 'Zoom In'}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setScale((s) => Math.max(10, s / 1.2))}
          title={t?.canvasZoomOut || 'Zoom Out'}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetView}
          title={t?.canvasResetView || 'Reset View'}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={handleExportSvg}
          title={t?.btnExportSvg || 'Export Diagram'}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
        >
          <Download className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-slate-200 mx-0.5" />
        <button
          onClick={() => setShowAuxLines(!showAuxLines)}
          className={`px-2.5 py-1 text-xs sm:text-sm font-medium flex items-center gap-1 rounded transition-colors ${
            showAuxLines ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{t?.canvasAuxToggle || 'Aux Lines'}</span>
        </button>
        <button
          onClick={() => setShowExtrema(!showExtrema)}
          className={`px-2.5 py-1 text-xs sm:text-sm font-medium flex items-center gap-1 rounded transition-colors ${
            showExtrema ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{t?.canvasExtremaToggle || 'Extrema'}</span>
        </button>
      </div>

      {/* Floating Legend */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 p-3 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-md shadow-xs text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              analysis.relation === 'intersecting'
                ? 'bg-emerald-500'
                : analysis.relation === 'tangent'
                ? 'bg-amber-500'
                : 'bg-indigo-500'
            }`}
          />
          <span className="font-semibold text-slate-800">
            {analysis.relation === 'intersecting'
              ? t?.verdictSecant || 'Secant'
              : analysis.relation === 'tangent'
              ? t?.verdictTangent || 'Tangent'
              : t?.verdictDisjoint || 'Disjoint'}
          </span>
          <span className="text-slate-500 font-mono text-xs">
            d={analysis.distance.toFixed(2)} vs R={analysis.r.toFixed(2)}
          </span>
        </div>
        {analysis.relation === 'intersecting' && (
          <div className="text-slate-600 font-mono text-xs pt-1 border-t border-slate-100 font-medium">
            {t?.chordLabel || 'Chord'} L = {analysis.chordLength?.toFixed(3)}
          </div>
        )}
      </div>

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {renderGrid()}
        {renderLine()}

        {analysis.isValidCircle && (
          <g>
            <circle
              cx={centerScr.x}
              cy={centerScr.y}
              r={radiusScr}
              fill="rgba(37, 99, 235, 0.04)"
              stroke="#2563EB"
              strokeWidth={2.5}
            />

            {showAuxLines && (
              <g>
                <line
                  x1={centerScr.x}
                  y1={centerScr.y}
                  x2={footScr.x}
                  y2={footScr.y}
                  stroke="#F59E0B"
                  strokeWidth={2}
                  strokeDasharray="4,3"
                />
                {renderRightAngle()}
                <text
                  x={(centerScr.x + footScr.x) / 2 + 6}
                  y={(centerScr.y + footScr.y) / 2 - 6}
                  fill="#B45309"
                  fontSize={12}
                  fontWeight="bold"
                  className="font-mono select-none"
                >
                  d = {analysis.distance.toFixed(2)}
                </text>
              </g>
            )}

            {showAuxLines && analysis.relation === 'intersecting' && analysis.intersectionPoints.length === 2 && (
              <g>
                {analysis.intersectionPoints.map((pt, idx) => {
                  const pScr = mathToScreen(pt.x, pt.y);
                  return (
                    <line
                      key={`rad-chord-${idx}`}
                      x1={centerScr.x}
                      y1={centerScr.y}
                      x2={pScr.x}
                      y2={pScr.y}
                      stroke="#93C5FD"
                      strokeWidth={1.5}
                      strokeDasharray="3,3"
                    />
                  );
                })}

                {(() => {
                  const pA = mathToScreen(analysis.intersectionPoints[0].x, analysis.intersectionPoints[0].y);
                  const pB = mathToScreen(analysis.intersectionPoints[1].x, analysis.intersectionPoints[1].y);
                  return (
                    <g>
                      <line
                        x1={pA.x}
                        y1={pA.y}
                        x2={pB.x}
                        y2={pB.y}
                        stroke="#059669"
                        strokeWidth={4.5}
                        strokeLinecap="round"
                      />
                      <text
                        x={(pA.x + pB.x) / 2}
                        y={(pA.y + pB.y) / 2 + 18}
                        fill="#047857"
                        fontSize={12}
                        fontWeight="bold"
                        textAnchor="middle"
                        className="font-mono select-none bg-white"
                      >
                        L = {analysis.chordLength?.toFixed(2)}
                      </text>
                    </g>
                  );
                })()}
              </g>
            )}

            {showExtrema && (
              <g>
                {(() => {
                  const den = Math.hypot(analysis.A, analysis.B);
                  if (den < 1e-5) return null;
                  const uX = (analysis.A / den) * Math.sign(analysis.A * analysis.x0 + analysis.B * analysis.y0 + analysis.C || 1);
                  const uY = (analysis.B / den) * Math.sign(analysis.A * analysis.x0 + analysis.B * analysis.y0 + analysis.C || 1);

                  const nearP = mathToScreen(analysis.x0 - analysis.r * uX, analysis.y0 - analysis.r * uY);
                  const farP = mathToScreen(analysis.x0 + analysis.r * uX, analysis.y0 + analysis.r * uY);

                  return (
                    <g>
                      <circle cx={nearP.x} cy={nearP.y} r={4} fill="#6366F1" />
                      <text
                        x={nearP.x + 6}
                        y={nearP.y - 5}
                        fill="#4F46E5"
                        fontSize={11}
                        fontWeight="bold"
                        className="font-mono select-none"
                      >
                        {t?.nearPointLabel || 'd_min'}
                      </text>
                      <circle cx={farP.x} cy={farP.y} r={4} fill="#818CF8" />
                      <text
                        x={farP.x + 6}
                        y={farP.y + 14}
                        fill="#4F46E5"
                        fontSize={11}
                        fontWeight="bold"
                        className="font-mono select-none"
                      >
                        {t?.farPointLabel || 'd_max'}
                      </text>
                    </g>
                  );
                })()}
              </g>
            )}

            <circle cx={footScr.x} cy={footScr.y} r={4.5} fill="#F59E0B" stroke="#FFFFFF" strokeWidth={1.5} />
            <text
              x={footScr.x - 16}
              y={footScr.y - 8}
              fill="#B45309"
              fontSize={12}
              fontWeight="bold"
              className="font-mono select-none"
            >
              H
            </text>

            {analysis.intersectionPoints.map((pt, idx) => {
              const pScr = mathToScreen(pt.x, pt.y);
              const name = analysis.relation === 'tangent' ? (t?.pointTangentLabel || 'T') : idx === 0 ? 'A' : 'B';
              return (
                <g key={`pt-${idx}`}>
                  <circle
                    cx={pScr.x}
                    cy={pScr.y}
                    r={5.5}
                    fill={analysis.relation === 'tangent' ? '#F59E0B' : '#059669'}
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  />
                  <text
                    x={pScr.x + 9}
                    y={pScr.y - 7}
                    fill={analysis.relation === 'tangent' ? '#B45309' : '#065F46'}
                    fontSize={12}
                    fontWeight="bold"
                    className="font-mono select-none"
                  >
                    {name}({pt.x.toFixed(1)}, {pt.y.toFixed(1)})
                  </text>
                </g>
              );
            })}

            <circle
              cx={centerScr.x}
              cy={centerScr.y}
              r={7}
              fill="#2563EB"
              stroke="#FFFFFF"
              strokeWidth={2.5}
              className="cursor-move hover:scale-125 transition-transform"
            />
            <text
              x={centerScr.x + 10}
              y={centerScr.y - 8}
              fill="#1D4ED8"
              fontSize={13}
              fontWeight="bold"
              className="font-mono select-none"
            >
              O({analysis.x0}, {analysis.y0})
            </text>
          </g>
        )}
      </svg>

      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-slate-500 pointer-events-none">
        <span>{t?.canvasHint || 'Mouse wheel to zoom · Drag canvas to pan · Drag circle center'}</span>
        <span className="font-mono">{t?.canvasScale || 'Scale:'} {scale < 25 ? '5' : scale < 50 ? '2' : '1'} units</span>
      </div>
    </div>
  );
};
