/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GeneralCircleInput, StandardCircleInput, GeneralLineInput, SlopeInterceptLineInput } from '../types/geometry';
import { formatCircleGeneral, formatCircleStandard, formatLineEquation } from './exactMath';

export interface ParseResult {
  circle?: {
    mode: 'general' | 'standard';
    general: GeneralCircleInput;
    standard: StandardCircleInput;
    latex: string;
  };
  line?: {
    mode: 'general' | 'slopeIntercept';
    general: GeneralLineInput;
    slope: SlopeInterceptLineInput;
    latex: string;
  };
  matched: string;
}

// Clean and normalize math string
function cleanMathStr(str: string): string {
  return str
    .replace(/\s+/g, '')
    .replace(/（/g, '(')
    .replace(/）/g, ')')
    .replace(/，/g, ',')
    .replace(/＋/g, '+')
    .replace(/－/g, '-')
    .replace(/＝/g, '=')
    .replace(/²/g, '^2')
    .replace(/₀/g, '0')
    .toLowerCase();
}

/**
 * Robust polynomial term parser for equations in x and y:
 * Given a string like "x^2+y^2-2x+4y-4=0", splits into terms and extracts coefficients.
 */
function parseCircleGeneral(eq: string): { D: number; E: number; F: number } | null {
  // Normalize equation into standard LHS = 0 form
  const parts = eq.split('=');
  if (parts.length > 2) return null;

  let lhs = parts[0] || '';
  const rhs = parts.length === 2 ? parseFloat(parts[1] || '0') || 0 : 0;

  // Must contain x^2 and y^2
  if (!lhs.includes('x^2') || !lhs.includes('y^2')) return null;

  // Split into signed tokens: e.g. +x^2, +y^2, -2x, +4y, -4
  const tokenRegex = /([+-]?[^+-]+)/g;
  const rawTokens = lhs.match(tokenRegex);
  if (!rawTokens) return null;

  let d = 0;
  let e = 0;
  let f = -rhs; // subtract right hand side

  for (const token of rawTokens) {
    const t = token.trim();
    if (!t) continue;

    if (t === 'x^2' || t === '+x^2') {
      // 1 * x^2
      continue;
    } else if (t === '-x^2') {
      return null; // unsupported negative leading coefficient
    } else if (t === 'y^2' || t === '+y^2') {
      // 1 * y^2
      continue;
    } else if (t.endsWith('x') && !t.includes('^')) {
      // Linear x term
      const coeffStr = t.slice(0, -1);
      const val = coeffStr === '' || coeffStr === '+' ? 1 : coeffStr === '-' ? -1 : parseFloat(coeffStr);
      if (!isNaN(val)) d += val;
    } else if (t.endsWith('y') && !t.includes('^')) {
      // Linear y term
      const coeffStr = t.slice(0, -1);
      const val = coeffStr === '' || coeffStr === '+' ? 1 : coeffStr === '-' ? -1 : parseFloat(coeffStr);
      if (!isNaN(val)) e += val;
    } else {
      // Pure constant
      const val = parseFloat(t);
      if (!isNaN(val)) {
        f += val;
      }
    }
  }

  return { D: d, E: e, F: f };
}

/**
 * Parse standard form circle: (x - h)^2 + (y - k)^2 = R^2
 */
function parseCircleStandard(eq: string): { x0: number; y0: number; r: number } | null {
  const parts = eq.split('=');
  if (parts.length !== 2) return null;

  const lhs = parts[0];
  const rhs = parseFloat(parts[1]);
  if (isNaN(rhs) || rhs <= 0) return null;

  let rSquared = rhs;
  let r = Math.sqrt(rSquared);

  // Pattern for x-part: (x-1)^2 or (x+2)^2 or x^2
  let x0 = 0;
  let y0 = 0;

  const xMatch = lhs.match(/\(x([+-][0-9.]+)\)\^2/);
  if (xMatch) {
    x0 = -parseFloat(xMatch[1]);
  } else if (!lhs.includes('x^2') && !lhs.includes('(x')) {
    return null;
  }

  const yMatch = lhs.match(/\(y([+-][0-9.]+)\)\^2/);
  if (yMatch) {
    y0 = -parseFloat(yMatch[1]);
  } else if (!lhs.includes('y^2') && !lhs.includes('(y')) {
    return null;
  }

  return { x0, y0, r };
}

/**
 * Parse line equation: Ax + By + C = 0 or y = kx + b or x = c
 */
function parseLine(eq: string): { A: number; B: number; C: number; k: number; b: number; isVertical: boolean; xVal?: number } | null {
  // 1. Vertical line: x = c
  const vertMatch = eq.match(/^x=([+-]?[0-9.]+)$/);
  if (vertMatch) {
    const cVal = parseFloat(vertMatch[1]);
    return { A: 1, B: 0, C: -cVal, k: 0, b: 0, isVertical: true, xVal: cVal };
  }

  // 2. Slope-intercept: y = kx + b or y = kx
  const slopeMatch = eq.match(/^y=([+-]?[0-9.]*)x(?:([+-][0-9.]+))?$/);
  if (slopeMatch) {
    const kCoeff = slopeMatch[1];
    const k = kCoeff === '' || kCoeff === '+' ? 1 : kCoeff === '-' ? -1 : parseFloat(kCoeff);
    const b = slopeMatch[2] ? parseFloat(slopeMatch[2]) : 0;
    // kx - y + b = 0 => A=k, B=-1, C=b
    return { A: k, B: -1, C: b, k, b, isVertical: false };
  }

  // 3. General form: Ax + By + C = 0 or Ax + By = C
  if (eq.includes('x') || eq.includes('y')) {
    const parts = eq.split('=');
    const lhs = parts[0] || '';
    const rhs = parts.length === 2 ? parseFloat(parts[1] || '0') || 0 : 0;

    let a = 0;
    let b = 0;
    let c = -rhs;

    const tokenRegex = /([+-]?[^+-]+)/g;
    const tokens = lhs.match(tokenRegex);
    if (!tokens) return null;

    for (const token of tokens) {
      const t = token.trim();
      if (t.endsWith('x')) {
        const coeffStr = t.slice(0, -1);
        const val = coeffStr === '' || coeffStr === '+' ? 1 : coeffStr === '-' ? -1 : parseFloat(coeffStr);
        if (!isNaN(val)) a += val;
      } else if (t.endsWith('y')) {
        const coeffStr = t.slice(0, -1);
        const val = coeffStr === '' || coeffStr === '+' ? 1 : coeffStr === '-' ? -1 : parseFloat(coeffStr);
        if (!isNaN(val)) b += val;
      } else {
        const val = parseFloat(t);
        if (!isNaN(val)) c += val;
      }
    }

    if (a !== 0 || b !== 0) {
      const isVert = Math.abs(b) < 1e-9;
      const kVal = isVert ? 0 : -a / b;
      const bVal = isVert ? 0 : -c / b;
      return { A: a, B: b, C: c, k: kVal, b: bVal, isVertical: isVert, xVal: isVert ? -c / a : undefined };
    }
  }

  return null;
}

/**
 * Master parser: Takes any user string, natural prompt, or pasted equation.
 * Returns both forms completely synchronized and calculated!
 */
export function parseMathEquation(raw: string): ParseResult | null {
  if (!raw || !raw.trim()) return null;
  const s = cleanMathStr(raw);

  let parsedCircle: ParseResult['circle'] | undefined;
  let parsedLine: ParseResult['line'] | undefined;
  const matchedPhrases: string[] = [];

  // Check Standard Form Circle
  const stdCircle = parseCircleStandard(s);
  if (stdCircle) {
    const { x0, y0, r } = stdCircle;
    // Calculate expanded General Form: D = -2x0, E = -2y0, F = x0^2 + y0^2 - R^2
    const D = -2 * x0;
    const E = -2 * y0;
    const F = x0 * x0 + y0 * y0 - r * r;
    parsedCircle = {
      mode: 'standard',
      standard: { x0, y0, r },
      general: { D, E, F },
      latex: formatCircleStandard(x0, y0, r),
    };
    matchedPhrases.push(formatCircleStandard(x0, y0, r));
  } else {
    // Check General Form Circle
    const genCircle = parseCircleGeneral(s);
    if (genCircle) {
      const { D, E, F } = genCircle;
      // Calculate standard form: x0 = -D/2, y0 = -E/2, r = sqrt(D^2+E^2-4F)/2
      const x0 = -D / 2;
      const y0 = -E / 2;
      const rSq = Math.max(0.01, (D * D + E * E - 4 * F) / 4);
      const r = Math.sqrt(rSq);
      parsedCircle = {
        mode: 'general',
        general: { D, E, F },
        standard: { x0, y0, r },
        latex: formatCircleGeneral(D, E, F),
      };
      matchedPhrases.push(formatCircleGeneral(D, E, F));
    }
  }

  // Check Line
  const lineRes = parseLine(s);
  if (lineRes) {
    const { A, B, C, k, b, isVertical, xVal } = lineRes;
    parsedLine = {
      mode: isVertical ? 'slopeIntercept' : 'general',
      general: { A, B, C },
      slope: { k, b, isVertical, xVal },
      latex: formatLineEquation(A, B, C),
    };
    matchedPhrases.push(formatLineEquation(A, B, C));
  }

  if (parsedCircle || parsedLine) {
    return {
      circle: parsedCircle,
      line: parsedLine,
      matched: matchedPhrases.join(' & '),
    };
  }

  return null;
}
