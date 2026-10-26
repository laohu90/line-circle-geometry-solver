/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GeneralCircleInput, StandardCircleInput, GeneralLineInput, SlopeInterceptLineInput } from '../types/geometry';

export interface ParseResult {
  circle?: {
    mode: 'general' | 'standard';
    general?: GeneralCircleInput;
    standard?: StandardCircleInput;
  };
  line?: {
    mode: 'general' | 'slopeIntercept';
    general?: GeneralLineInput;
    slope?: SlopeInterceptLineInput;
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
    .toLowerCase();
}

/**
 * Smartly parse any circle equation or line equation from raw text
 */
export function parseMathEquation(raw: string): ParseResult | null {
  const s = cleanMathStr(raw);

  // 1. Try parsing Standard Circle: (x - x0)^2 + (y - y0)^2 = R^2
  // or x^2 + (y - y0)^2 = R^2 or (x - x0)^2 + y^2 = R^2 or x^2 + y^2 = R^2
  const standardCircleRegex =
    /^(?:\(x([+-][0-9.]+)\)\^2|x\^2)\+(?:\(y([+-][0-9.]+)\)\^2|y\^2)=([0-9.]+)(?:\^2)?$/;
  const stdMatch = s.match(standardCircleRegex);
  if (stdMatch) {
    const x0 = stdMatch[1] ? -parseFloat(stdMatch[1]) : 0;
    const y0 = stdMatch[2] ? -parseFloat(stdMatch[2]) : 0;
    let rSquared = parseFloat(stdMatch[3]);
    let r = Math.sqrt(rSquared);
    if (s.endsWith('^2')) {
      r = rSquared;
      rSquared = r * r;
    }
    return {
      circle: {
        mode: 'standard',
        standard: { x0, y0, r },
      },
      matched: `(x - ${x0})^2 + (y - ${y0})^2 = ${rSquared}`,
    };
  }

  // 2. Try parsing General Circle: x^2 + y^2 + Dx + Ey + F = 0
  if (s.includes('x^2') && s.includes('y^2')) {
    // Split by =
    const parts = s.split('=');
    const lhs = parts[0] || '';
    const rhs = parseFloat(parts[1] || '0') || 0;

    // Extract coefficients of x and y
    let dVal = 0;
    let eVal = 0;
    let fVal = -rhs;

    // Matches +Dx or -Dx
    const xMatch = lhs.match(/([+-]?[0-9.]*)x(?!\^)/);
    if (xMatch) {
      const coeff = xMatch[1];
      dVal = coeff === '' || coeff === '+' ? 1 : coeff === '-' ? -1 : parseFloat(coeff);
    }

    // Matches +Ey or -Ey
    const yMatch = lhs.match(/([+-]?[0-9.]*)y(?!\^)/);
    if (yMatch) {
      const coeff = yMatch[1];
      eVal = coeff === '' || coeff === '+' ? 1 : coeff === '-' ? -1 : parseFloat(coeff);
    }

    // Matches lone numbers
    const tokens = lhs.replace(/x\^2|y\^2|[+-]?[0-9.]*[xy]/g, '');
    if (tokens) {
      const numMatch = tokens.match(/[+-]?[0-9.]+/);
      if (numMatch) {
        fVal += parseFloat(numMatch[0]);
      }
    }

    return {
      circle: {
        mode: 'general',
        general: { D: dVal, E: eVal, F: fVal },
      },
      matched: `x^2 + y^2 + (${dVal})x + (${eVal})y + (${fVal}) = 0`,
    };
  }

  // 3. Try parsing Vertical line: x = c
  const vertMatch = s.match(/^x=([+-]?[0-9.]+)$/);
  if (vertMatch) {
    const cVal = parseFloat(vertMatch[1]);
    return {
      line: {
        mode: 'slopeIntercept',
        slope: { k: 0, b: 0, isVertical: true, xVal: cVal },
        general: { A: 1, B: 0, C: -cVal },
      },
      matched: `x = ${cVal}`,
    };
  }

  // 4. Try parsing Slope-Intercept: y = kx + b
  const slopeMatch = s.match(/^y=([+-]?[0-9.]*)x(?:([+-][0-9.]+))?$/);
  if (slopeMatch) {
    const kCoeff = slopeMatch[1];
    const k = kCoeff === '' || kCoeff === '+' ? 1 : kCoeff === '-' ? -1 : parseFloat(kCoeff);
    const b = slopeMatch[2] ? parseFloat(slopeMatch[2]) : 0;
    return {
      line: {
        mode: 'slopeIntercept',
        slope: { k, b, isVertical: false },
        general: { A: k, B: -1, C: b },
      },
      matched: `y = ${k}x ${b >= 0 ? '+' : ''}${b}`,
    };
  }

  // 5. Try parsing General Line: Ax + By + C = 0 or Ax + By = C
  if (s.includes('x') || s.includes('y')) {
    const parts = s.split('=');
    const lhs = parts[0] || '';
    const rhs = parseFloat(parts[1] || '0') || 0;

    let aVal = 0;
    let bVal = 0;
    let cVal = -rhs;

    const xMatch = lhs.match(/([+-]?[0-9.]*)x/);
    if (xMatch) {
      const coeff = xMatch[1];
      aVal = coeff === '' || coeff === '+' ? 1 : coeff === '-' ? -1 : parseFloat(coeff);
    }

    const yMatch = lhs.match(/([+-]?[0-9.]*)y/);
    if (yMatch) {
      const coeff = yMatch[1];
      bVal = coeff === '' || coeff === '+' ? 1 : coeff === '-' ? -1 : parseFloat(coeff);
    }

    const tokens = lhs.replace(/[+-]?[0-9.]*[xy]/g, '');
    if (tokens) {
      const numMatch = tokens.match(/[+-]?[0-9.]+/);
      if (numMatch) {
        cVal += parseFloat(numMatch[0]);
      }
    }

    if (aVal !== 0 || bVal !== 0) {
      return {
        line: {
          mode: 'general',
          general: { A: aVal, B: bVal, C: cVal },
        },
        matched: `${aVal}x + ${bVal}y + ${cVal} = 0`,
      };
    }
  }

  return null;
}
