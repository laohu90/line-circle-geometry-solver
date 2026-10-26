/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CircleInputMode = 'general' | 'standard' | 'threePoints';

export interface GeneralCircleInput {
  D: number; // x^2 + y^2 + Dx + Ey + F = 0
  E: number;
  F: number;
}

export interface StandardCircleInput {
  x0: number; // (x - x0)^2 + (y - y0)^2 = R^2
  y0: number;
  r: number;
}

export interface Point2D {
  x: number;
  y: number;
  xLatex?: string;
  yLatex?: string;
}

export type LineInputMode = 'general' | 'slopeIntercept' | 'twoPoints' | 'pointSlope';

export interface GeneralLineInput {
  A: number; // Ax + By + C = 0
  B: number;
  C: number;
}

export interface SlopeInterceptLineInput {
  k: number; // y = kx + b (or isVertical with x = xVal)
  b: number;
  isVertical: boolean;
  xVal?: number;
}

export interface PointSlopeLineInput {
  x1: number;
  y1: number;
  k: number;
  isVertical: boolean;
}

export type RelationType = 'intersecting' | 'tangent' | 'disjoint';

export interface RadicalResult {
  approx: number;
  latex: string;
  exact?: string;
}

export interface CompleteSquareStep {
  title: string;
  latex: string;
  explanation: string;
}

export interface PositionalAnalysis {
  isValidCircle: boolean;
  circleStatusMsg?: string;
  discriminantCircle: number; // D^2 + E^2 - 4F
  
  // Circle params
  x0: number;
  y0: number;
  r: number;
  rSquared: number;
  
  // Line params (Ax + By + C = 0)
  A: number;
  B: number;
  C: number;
  
  // Distance from center to line
  distance: number;
  distanceFractionLatex: string;
  distanceExactLatex: string;
  
  // Comparison
  relation: RelationType;
  relationChinese: string;
  relationSummary: string;
  
  // Chord length (if intersecting)
  chordLength?: number;
  halfChordLength?: number;
  chordLengthLatex?: string;
  fullChordExactLatex?: string;
  exactIntersectionsLatex?: string;
  
  // Algebraic comparison (Method 2: 联立消元法)
  algebraicDelta?: number;
  quadraticCoeffs?: { a: number; b: number; c: number };
  vietaSum?: number;
  vietaProduct?: number;
  
  // Foot of perpendicular H (and chord midpoint M)
  footH: Point2D;
  
  // Intersections or tangent point
  intersectionPoints: Point2D[];
  
  // Distance extrema from points on circle to line
  minDistToLine: number;
  maxDistToLine: number;
  minDistLatex: string;
  maxDistLatex: string;
  
  // Geometry steps
  completeSquareSteps: CompleteSquareStep[];
}

export interface MistakeQuestion {
  id: string;
  title: string;
  tag: string; // e.g. "相交弦长", "含参切线", "配方法易错", "最值问题", "2024高考模拟"
  date: string;
  circleMode: CircleInputMode;
  generalCircle: GeneralCircleInput;
  standardCircle: StandardCircleInput;
  lineMode: LineInputMode;
  generalLine: GeneralLineInput;
  slopeLine: SlopeInterceptLineInput;
  userNote: string; // 我的易错原因 / 解题心得
  isMastered: boolean;
  keywords?: string[];
}
