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
  hasConjunctionError?: boolean;
  error?: string;
}

// Clean and normalize math string
function cleanMathStr(str: string): string {
  let cleaned = str
    .replace(/\s+/g, '')
    .replace(/（/g, '(')
    .replace(/）/g, ')')
    .replace(/＋/g, '+')
    .replace(/－/g, '-')
    .replace(/＝/g, '=')
    .replace(/²/g, '^2')
    .replace(/₀/g, '0')
    .toLowerCase();

  // Strip Chinese natural language prefixes (e.g. "圆的展开式", "圆的标准方程", "圆方程", "系数为0的直线", "直线方程", etc.)
  cleaned = cleaned.replace(/^[^a-z0-9(+-]+/, '');
  return cleaned;
}

/**
 * Robust polynomial term parser for general circle equation:
 * E.g. "x^2+y^2-4x+6y-3=0" or "x^2+y^2-4=0" or "x^2+y^2+Dx+Ey+F=0"
 */
function parseCircleGeneral(eq: string): { D: number; E: number; F: number; error?: string } | null {
  const parts = eq.split('=');
  if (parts.length > 2) return null;

  let lhs = parts[0] || '';
  const rhs = parts.length === 2 ? parseFloat(parts[1] || '0') || 0 : 0;

  // Must contain x^2 and y^2
  if (!lhs.includes('x^2') || !lhs.includes('y^2')) return null;

  // Split into signed tokens: e.g. +x^2, +y^2, -4x, +6y, -3
  const tokenRegex = /([+-]?[^+-]+)/g;
  const rawTokens = lhs.match(tokenRegex);
  if (!rawTokens) return null;

  let d = 0;
  let e = 0;
  let f = -rhs; // subtract right hand side
  let leadCoeffX = 1;
  let leadCoeffY = 1;

  for (const token of rawTokens) {
    const t = token.trim();
    if (!t) continue;

    if (t === 'x^2' || t === '+x^2') {
      leadCoeffX = 1;
    } else if (t === '-x^2') {
      leadCoeffX = -1;
    } else if (t.endsWith('x^2')) {
      const c = t.slice(0, -3);
      leadCoeffX = c === '' || c === '+' ? 1 : c === '-' ? -1 : parseFloat(c);
    } else if (t === 'y^2' || t === '+y^2') {
      leadCoeffY = 1;
    } else if (t === '-y^2') {
      leadCoeffY = -1;
    } else if (t.endsWith('y^2')) {
      const c = t.slice(0, -3);
      leadCoeffY = c === '' || c === '+' ? 1 : c === '-' ? -1 : parseFloat(c);
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

  // Normalize coefficients if equal: Ax^2 + Ay^2 + Dx + Ey + F = 0
  if (leadCoeffX !== leadCoeffY || leadCoeffX <= 0) {
    if (leadCoeffX < 0 && leadCoeffY < 0 && leadCoeffX === leadCoeffY) {
      d = -d / leadCoeffX;
      e = -e / leadCoeffX;
      f = -f / leadCoeffX;
    } else {
      return { D: 0, E: 0, F: 0, error: '方程不是圆（x²与y²系数不相等）' };
    }
  } else if (leadCoeffX !== 1) {
    d = d / leadCoeffX;
    e = e / leadCoeffX;
    f = f / leadCoeffX;
  }

  // Check existence condition (R² = (D² + E² - 4F) / 4)
  const disc = d * d + e * e - 4 * f;
  if (disc <= 1e-9) {
    return {
      D: d,
      E: e,
      F: f,
      error: '半径必须为正（D² + E² - 4F ≤ 0，方程退化为点或虚圆）',
    };
  }

  return { D: d, E: e, F: f };
}

/**
 * Parse standard form circle: (x - x0)^2 + (y - y0)^2 = R^2
 * Supports:
 * - (x-1)^2+(y+2)^2=9
 * - (x-1)^2+(y+2)^2=3^2
 * - (x+2)^2+y^2=4
 * - x^2+(y-3)^2=16
 * - x^2+y^2=25
 * - (x-1)^2+(y+2)^2-9=0
 */
function parseCircleStandard(eq: string): { x0: number; y0: number; r: number } | { error: string } | null {
  const parts = eq.split('=');
  let lhs = parts[0];
  let rhsVal: number | null = null;

  if (parts.length === 2) {
    const rhsStr = parts[1];
    // Check if rhs is e.g. 3^2
    const sqMatch = rhsStr.match(/^([0-9.]+)\^2$/);
    if (sqMatch) {
      const base = parseFloat(sqMatch[1]);
      if (!isNaN(base)) {
        rhsVal = base * base;
      }
    } else {
      const parsed = parseFloat(rhsStr);
      if (!isNaN(parsed)) {
        rhsVal = parsed;
      }
    }
  }

  // If RHS is not set or equation is formatted as LHS - R^2 = 0
  if (rhsVal === null && parts.length === 2 && parts[1] === '0') {
    // Check trailing constant e.g. -9 or -16
    const constMatch = lhs.match(/([+-][0-9.]+)$/);
    if (constMatch) {
      const c = parseFloat(constMatch[1]);
      if (c < 0) {
        rhsVal = -c;
        lhs = lhs.slice(0, constMatch.index);
      }
    }
  }

  // Standard form pattern check
  const hasX2 = lhs.includes('(x') || lhs.includes('x^2');
  const hasY2 = lhs.includes('(y') || lhs.includes('y^2');
  if (!hasX2 || !hasY2) return null;

  // If lhs contains linear terms outside of squares (e.g. -4x, +6y), it is General Form, not Standard Form!
  const withoutParens = lhs
    .replace(/\(x[+-]?[0-9.]*\)\^2/g, '')
    .replace(/\(y[+-]?[0-9.]*\)\^2/g, '')
    .replace(/x\^2/g, '')
    .replace(/y\^2/g, '');
  if (withoutParens.includes('x') || withoutParens.includes('y')) {
    return null;
  }

  if (rhsVal !== null && rhsVal <= 0) {
    return { error: '半径必须为正（R² ≤ 0，不能为零或负数）' };
  }

  if (rhsVal === null || rhsVal <= 0) return null;
  const r = Math.sqrt(rhsVal);

  // Pattern for x-part: (x-1)^2, (x+2)^2, (x)^2, x^2
  let x0 = 0;
  const xMatch = lhs.match(/\(x([+-][0-9.]+)\)\^2/);
  if (xMatch) {
    x0 = -parseFloat(xMatch[1]);
  } else if (lhs.includes('(x)^2') || lhs.includes('x^2')) {
    x0 = 0;
  } else {
    return null;
  }

  // Pattern for y-part: (y-1)^2, (y+2)^2, (y)^2, y^2
  let y0 = 0;
  const yMatch = lhs.match(/\(y([+-][0-9.]+)\)\^2/);
  if (yMatch) {
    y0 = -parseFloat(yMatch[1]);
  } else if (lhs.includes('(y)^2') || lhs.includes('y^2')) {
    y0 = 0;
  } else {
    return null;
  }

  return { x0, y0, r };
}

/**
 * Parse line equation:
 * 1. x = c (vertical line)
 * 2. y = kx + b or y = kx or y = b
 * 3. Ax + By + C = 0 or Ax + By = C (supports 0x + 1y - 2 = 0)
 */
function parseLine(eq: string): { A: number; B: number; C: number; k: number; b: number; isVertical: boolean; xVal?: number; error?: string } | null {
  // Reject circle equations
  if (eq.includes('^2') || eq.includes('x^2') || eq.includes('y^2')) {
    return null;
  }

  // 1. Vertical line: x = c
  const vertMatch = eq.match(/^x=([+-]?[0-9.]+)$/);
  if (vertMatch) {
    const cVal = parseFloat(vertMatch[1]);
    return { A: 1, B: 0, C: -cVal, k: 0, b: 0, isVertical: true, xVal: cVal };
  }

  // 2. Slope-intercept: y = kx + b or y = kx or y = b
  const slopeMatch = eq.match(/^y=([+-]?[0-9.]*)x(?:([+-][0-9.]+))?$/);
  if (slopeMatch) {
    const kCoeff = slopeMatch[1];
    const k = kCoeff === '' || kCoeff === '+' ? 1 : kCoeff === '-' ? -1 : parseFloat(kCoeff);
    const b = slopeMatch[2] ? parseFloat(slopeMatch[2]) : 0;
    return { A: k, B: -1, C: b, k, b, isVertical: false };
  }

  // Horizontal line: y = b
  const horizMatch = eq.match(/^y=([+-]?[0-9.]+)$/);
  if (horizMatch) {
    const bVal = parseFloat(horizMatch[1]);
    return { A: 0, B: 1, C: -bVal, k: 0, b: bVal, isVertical: false };
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
    } else {
      return { A: 0, B: 0, C: 0, k: 0, b: 0, isVertical: false, error: '直线方程无效（A与B不能同时为0）' };
    }
  }

  return null;
}

/**
 * Helper to parse a single equation string chunk for either Circle or Line
 */
function parseSingleEquationChunk(chunk: string): 
  | { type: 'circle'; circle: NonNullable<ParseResult['circle']> }
  | { type: 'line'; line: NonNullable<ParseResult['line']> }
  | { type: 'error'; error: string }
  | null {
  const s = cleanMathStr(chunk);
  if (!s) return null;

  // 1. Check Standard Form Circle
  const stdRes = parseCircleStandard(s);
  if (stdRes) {
    if ('error' in stdRes) {
      return { type: 'error', error: stdRes.error };
    }
    const { x0, y0, r } = stdRes;
    const D = -2 * x0;
    const E = -2 * y0;
    const F = x0 * x0 + y0 * y0 - r * r;

    return {
      type: 'circle' as const,
      circle: {
        mode: 'standard' as const,
        standard: { x0, y0, r },
        general: { D, E, F },
        latex: formatCircleStandard(x0, y0, r),
      },
    };
  }

  // 2. Check General Form Circle (配方法转标准式)
  const genRes = parseCircleGeneral(s);
  if (genRes) {
    if (genRes.error) {
      return { type: 'error', error: genRes.error };
    }
    const { D, E, F } = genRes;
    const x0 = -D / 2;
    const y0 = -E / 2;
    const rSq = (D * D + E * E - 4 * F) / 4;
    const r = Math.sqrt(rSq);

    return {
      type: 'circle' as const,
      circle: {
        mode: 'general' as const,
        general: { D, E, F },
        standard: { x0, y0, r },
        latex: formatCircleGeneral(D, E, F),
      },
    };
  }

  // 3. Check Line Equation
  const lineRes = parseLine(s);
  if (lineRes) {
    if (lineRes.error) {
      return { type: 'error', error: lineRes.error };
    }
    const { A, B, C, k, b, isVertical, xVal } = lineRes;
    return {
      type: 'line' as const,
      line: {
        mode: isVertical ? ('slopeIntercept' as const) : ('general' as const),
        general: { A, B, C },
        slope: { k, b, isVertical, xVal },
        latex: formatLineEquation(A, B, C),
      },
    };
  }

  return null;
}

/**
 * Master parser: Takes any user string, natural prompt, or pasted equation.
 * Supports multiple equations separated by newline, semicolon, comma, &, 和, 与.
 * Correctly identifies single or dual equations.
 */
export function parseMathEquation(raw: string): ParseResult | null {
  if (!raw || !raw.trim()) return null;

  const trimmed = raw.trim();

  // Explicit check for Chinese natural language conjunctions (和、与、及)
  // If conjunctions are present and not separated by standard semicolons/newlines, abort and notify user
  if (/[和与及]/.test(trimmed) && !trimmed.includes(';') && !trimmed.includes('；') && !trimmed.includes('\n')) {
    return {
      matched: '',
      hasConjunctionError: true,
      error: '检测到自然语言连词（和/与/及），请改用分号分隔直线与圆方程，如：x=2; (x)^2+(y)^2=9',
    };
  }

  // Split by explicit delimiters: newline, semicolon (; ；), &
  const chunks = trimmed
    .split(/[\n\r;；&]+/)
    .map((c) => c.trim())
    .filter(Boolean);

  let parsedCircle: ParseResult['circle'] | undefined;
  let parsedLine: ParseResult['line'] | undefined;
  const matchedPhrases: string[] = [];
  let foundError: string | undefined;

  // Parse each chunk
  for (const chunk of chunks) {
    const res = parseSingleEquationChunk(chunk);
    if (res?.type === 'error') {
      foundError = res.error;
    } else if (res?.type === 'circle' && !parsedCircle) {
      parsedCircle = res.circle;
      matchedPhrases.push(res.circle.latex);
    } else if (res?.type === 'line' && !parsedLine) {
      parsedLine = res.line;
      matchedPhrases.push(res.line.latex);
    }
  }

  // If no chunks matched via splitting, try the whole raw string directly
  if (!parsedCircle && !parsedLine && !foundError) {
    const res = parseSingleEquationChunk(trimmed);
    if (res?.type === 'error') {
      foundError = res.error;
    } else if (res?.type === 'circle') {
      parsedCircle = res.circle;
      matchedPhrases.push(res.circle.latex);
    } else if (res?.type === 'line') {
      parsedLine = res.line;
      matchedPhrases.push(res.line.latex);
    }
  }

  return {
    circle: parsedCircle,
    line: parsedLine,
    matched: matchedPhrases.join(' & '),
    error: foundError,
  };
}
