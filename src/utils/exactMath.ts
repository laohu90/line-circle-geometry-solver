/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Greatest Common Divisor
export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

// Least Common Multiple
export function lcm(a: number, b: number): number {
  return Math.abs(Math.round(a * b)) / gcd(a, b);
}

export interface Rational {
  n: number; // numerator
  d: number; // denominator (always > 0)
}

export function makeRational(n: number, d: number = 1): Rational {
  if (d === 0) return { n: 0, d: 1 };
  if (d < 0) {
    n = -n;
    d = -d;
  }
  // If n or d are not clean integers, scale up
  if (!Number.isInteger(n) || !Number.isInteger(d)) {
    const scale = 10000;
    n = Math.round(n * scale);
    d = Math.round(d * scale);
  }
  const g = gcd(n, d);
  return { n: Math.round(n / g), d: Math.round(d / g) };
}

export function rationalToLatex(r: Rational): string {
  if (r.d === 1) return `${r.n}`;
  if (r.n < 0) return `-\\frac{${Math.abs(r.n)}}{${r.d}}`;
  return `\\frac{${r.n}}{${r.d}}`;
}

// Convert float to clean string without trailing .00
export function formatNum(n: number): string {
  if (Math.abs(n - Math.round(n)) < 1e-9) {
    return Math.round(n).toString();
  }
  return n.toFixed(2).replace(/\.?0+$/, '');
}

/**
 * Simplify square root of an integer N: \sqrt{N} = outside * \sqrt{inside}
 * where `inside` is square-free.
 */
export function factorSqrt(n: number): { outside: number; inside: number } {
  const roundN = Math.round(n);
  if (roundN <= 0) return { outside: 0, inside: 1 };
  let outside = 1;
  let inside = roundN;

  for (let i = Math.floor(Math.sqrt(inside)); i >= 2; i--) {
    if (inside % (i * i) === 0) {
      outside *= i;
      inside /= (i * i);
    }
  }
  return { outside, inside };
}

/**
 * Exact radical expression: (p * \sqrt{s}) / q
 * Example: 2\sqrt{5}, \frac{9\sqrt{5}}{5}, \sqrt{3}, 4
 */
export interface ExactRadical {
  p: number; // multiplier before radical
  s: number; // square-free radicand (1 if rational)
  q: number; // denominator (always > 0)
  latex: string;
  approx: number;
}

export function makeExactRadical(p: number, s: number, q: number): ExactRadical {
  if (q < 0) {
    p = -p;
    q = -q;
  }
  // Simplify radical if s is not square-free
  const factored = factorSqrt(s);
  p *= factored.outside;
  s = factored.inside;

  if (s === 0) {
    return { p: 0, s: 1, q: 1, latex: '0', approx: 0 };
  }
  if (s === 1) {
    const g = gcd(p, q);
    p /= g;
    q /= g;
    const latex = q === 1 ? `${p}` : p < 0 ? `-\\frac{${Math.abs(p)}}{${q}}` : `\\frac{${p}}{${q}}`;
    return { p, s: 1, q, latex, approx: p / q };
  }

  // Simplify gcd of (p, q)
  const g = gcd(p, q);
  p /= g;
  q /= g;

  const sign = p < 0 ? '-' : '';
  const absP = Math.abs(p);
  const sqrtPart = absP === 1 ? `\\sqrt{${s}}` : `${absP}\\sqrt{${s}}`;

  let latex = '';
  if (q === 1) {
    latex = `${sign}${sqrtPart}`;
  } else {
    latex = `${sign}\\frac{${sqrtPart}}{${q}}`;
  }

  const approx = (p * Math.sqrt(s)) / q;
  return { p, s, q, latex, approx };
}

/**
 * Rationalize and simplify a quotient N / \sqrt{D} where N is rational and D is integer:
 * N / \sqrt{D} = (N * \sqrt{D}) / D
 */
export function exactQuotientWithSqrt(num: Rational, dInt: number): ExactRadical {
  if (num.n === 0) return makeExactRadical(0, 1, 1);
  // (num.n / num.d) / \sqrt{dInt} = (num.n * \sqrt{dInt}) / (num.d * dInt)
  const numeratorP = num.n;
  const denominatorQ = num.d * dInt;
  return makeExactRadical(numeratorP, dInt, denominatorQ);
}

/**
 * Exact square root of a rational number: \sqrt{n / d} = \sqrt{n * d} / d
 */
export function exactSqrtOfRational(r: Rational): ExactRadical {
  if (r.n <= 0) return makeExactRadical(0, 1, 1);
  // \sqrt{n/d} = \sqrt{n*d} / d
  return makeExactRadical(1, r.n * r.d, r.d);
}

/**
 * Format linear polynomial line: Ax + By + C = 0
 * Cleanly formats signs and omits 1, e.g. "3x + 4y - 12 = 0", "2x - y + 5 = 0"
 */
export function formatLineEquation(A: number, B: number, C: number): string {
  const parts: string[] = [];

  // A term
  if (A !== 0) {
    if (A === 1) parts.push('x');
    else if (A === -1) parts.push('-x');
    else parts.push(`${formatNum(A)}x`);
  }

  // B term
  if (B !== 0) {
    const bSign = B > 0 ? (parts.length > 0 ? '+ ' : '') : '- ';
    const absB = Math.abs(B);
    const bStr = absB === 1 ? 'y' : `${formatNum(absB)}y`;
    parts.push(`${bSign}${bStr}`);
  }

  // C term
  if (C !== 0) {
    const cSign = C > 0 ? (parts.length > 0 ? '+ ' : '') : '- ';
    parts.push(`${cSign}${formatNum(Math.abs(C))}`);
  }

  if (parts.length === 0) return '0 = 0';
  return `${parts.join(' ')} = 0`;
}

/**
 * Format circle general equation: x^2 + y^2 + Dx + Ey + F = 0
 */
export function formatCircleGeneral(D: number, E: number, F: number): string {
  const parts = ['x^2 + y^2'];

  if (D !== 0) {
    const sign = D > 0 ? '+ ' : '- ';
    const absD = Math.abs(D);
    parts.push(`${sign}${absD === 1 ? 'x' : `${formatNum(absD)}x`}`);
  }

  if (E !== 0) {
    const sign = E > 0 ? '+ ' : '- ';
    const absE = Math.abs(E);
    parts.push(`${sign}${absE === 1 ? 'y' : `${formatNum(absE)}y`}`);
  }

  if (F !== 0) {
    const sign = F > 0 ? '+ ' : '- ';
    parts.push(`${sign}${formatNum(Math.abs(F))}`);
  }

  return `${parts.join(' ')} = 0`;
}

/**
 * Format circle standard equation: (x - x0)^2 + (y - y0)^2 = R^2
 * Avoids (y - -2)^2 or 9.00
 */
export function formatCircleStandard(x0: number, y0: number, r: number): string {
  const xPart = x0 === 0 ? 'x^2' : x0 > 0 ? `(x - ${formatNum(x0)})^2` : `(x + ${formatNum(Math.abs(x0))})^2`;
  const yPart = y0 === 0 ? 'y^2' : y0 > 0 ? `(y - ${formatNum(y0)})^2` : `(y + ${formatNum(Math.abs(y0))})^2`;
  const rSq = Math.round(r * r * 1000) / 1000;
  return `${xPart} + ${yPart} = ${formatNum(rSq)}`;
}

/**
 * Format exact radical with addition: (u + v * \sqrt{s}) / w
 * If s is square-free:
 * Example: (16 + 4\sqrt{5}) / 5
 */
export function formatExactIntersection(u: number, v: number, s: number, w: number): string {
  if (w < 0) {
    u = -u;
    v = -v;
    w = -w;
  }
  const factored = factorSqrt(s);
  v *= factored.outside;
  s = factored.inside;

  if (s === 1 || v === 0) {
    const totalNum = u + v;
    const g = gcd(totalNum, w);
    const redNum = totalNum / g;
    const redDen = w / g;
    if (redDen === 1) return `${redNum}`;
    return redNum < 0 ? `-\\frac{${Math.abs(redNum)}}{${redDen}}` : `\\frac{${redNum}}{${redDen}}`;
  }

  const g = gcd(gcd(u, v), w);
  u /= g;
  v /= g;
  w /= g;

  const absV = Math.abs(v);
  const sqrtPart = absV === 1 ? `\\sqrt{${s}}` : `${absV}\\sqrt{${s}}`;
  const sign = v > 0 ? '+' : '-';

  if (u === 0) {
    if (w === 1) return v > 0 ? sqrtPart : `-${sqrtPart}`;
    return v > 0 ? `\\frac{${sqrtPart}}{${w}}` : `-\\frac{${sqrtPart}}{${w}}`;
  }

  if (w === 1) {
    return `${u} ${sign} ${sqrtPart}`;
  }
  return `\\frac{${u} ${sign} ${sqrtPart}}{${w}}`;
}

/**
 * Format exact radical pair: (u \pm |v| * \sqrt{s}) / w
 * Example: \frac{16 \pm 4\sqrt{5}}{5}
 */
export function formatExactIntersectionPair(u: number, v: number, s: number, w: number): string {
  if (w < 0) {
    u = -u;
    w = -w;
  }
  const factored = factorSqrt(s);
  v = Math.abs(v) * factored.outside;
  s = factored.inside;

  if (s === 1 || v === 0) {
    return rationalToLatex(makeRational(u, w));
  }

  const g = gcd(gcd(u, v), w);
  u /= g;
  v /= g;
  w /= g;

  const sqrtPart = v === 1 ? `\\sqrt{${s}}` : `${v}\\sqrt{${s}}`;

  if (u === 0) {
    if (w === 1) return `\\pm ${sqrtPart}`;
    return `\\pm \\frac{${sqrtPart}}{${w}}`;
  }

  if (w === 1) {
    return `${u} \\pm ${sqrtPart}`;
  }
  return `\\frac{${u} \\pm ${sqrtPart}}{${w}}`;
}
