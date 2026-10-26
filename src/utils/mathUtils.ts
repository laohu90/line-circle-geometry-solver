/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Point2D, PositionalAnalysis, CompleteSquareStep, RelationType } from '../types/geometry';
import { SupportedLanguage } from '../i18n/translations';
import {
  gcd,
  makeRational,
  rationalToLatex,
  factorSqrt,
  makeExactRadical,
  exactQuotientWithSqrt,
  exactSqrtOfRational,
  formatNum,
  formatLineEquation,
  formatCircleGeneral,
  formatCircleStandard,
  formatExactIntersection,
  formatExactIntersectionPair,
} from './exactMath';

export {
  gcd,
  formatNum,
  formatLineEquation,
  formatCircleGeneral,
  formatCircleStandard,
  formatExactIntersection,
  formatExactIntersectionPair,
};

// Format a number as an exact fraction LaTeX if rational, else formatted clean float
export function toFractionLatex(val: number): string {
  if (Math.abs(val - Math.round(val)) < 1e-9) {
    return Math.round(val).toString();
  }
  const r = makeRational(val);
  // Only use fraction if denominator is reasonable and error is tiny
  if (r.d <= 100 && Math.abs(val - r.n / r.d) < 1e-6) {
    return rationalToLatex(r);
  }
  return formatNum(val);
}

// Solve Positional Analysis between Line and Circle
export function analyzeLineAndCircle(
  circleType: 'general' | 'standard',
  circleGeneral: { D: number; E: number; F: number },
  circleStandard: { x0: number; y0: number; r: number },
  line: { A: number; B: number; C: number },
  lang: SupportedLanguage = 'en'
): PositionalAnalysis {
  let x0 = 0;
  let y0 = 0;
  let r = 0;
  let rSquared = 0;
  let isValidCircle = true;
  let circleStatusMsg = '';
  let discriminantCircle = 0;
  const completeSquareSteps: CompleteSquareStep[] = [];

  let { D, E, F } = circleGeneral;

  if (circleType === 'standard') {
    x0 = circleStandard.x0;
    y0 = circleStandard.y0;
    r = Math.abs(circleStandard.r);
    rSquared = r * r;
    // Derive D, E, F: (x-x0)^2 + (y-y0)^2 - r^2 = x^2 + y^2 - 2x0 x - 2y0 y + (x0^2 + y0^2 - r^2)
    D = -2 * x0;
    E = -2 * y0;
    F = x0 * x0 + y0 * y0 - rSquared;
    discriminantCircle = D * D + E * E - 4 * F;

    const stdExplanations: Record<SupportedLanguage, { title: string; exp: string }> = {
      en: {
        title: 'Given Standard Form Equation',
        exp: `Directly read from standard form: Center coordinates are $O(${formatNum(x0)}, ${formatNum(y0)})$, Radius $R = ${formatNum(r)}$.`,
      },
      es: {
        title: 'Ecuación Canónica Dada',
        exp: `Lectura directa de la forma canónica: Centro $O(${formatNum(x0)}, ${formatNum(y0)})$, Radio $R = ${formatNum(r)}$.`,
      },
      fr: {
        title: 'Équation Cartésienne Donnée',
        exp: `Lecture directe de la forme cartésienne : Coordonnées du centre $O(${formatNum(x0)}, ${formatNum(y0)})$, Rayon $R = ${formatNum(r)}$.`,
      },
      pt: {
        title: 'Equação Reduzida Fornecida',
        exp: `Leitura direta da forma reduzida: Coordenadas do centro $O(${formatNum(x0)}, ${formatNum(y0)})$, Raio $R = ${formatNum(r)}$.`,
      },
      zh: {
        title: '已知标准方程',
        exp: `直接从标准方程读出：圆心坐标为 $O(${formatNum(x0)}, ${formatNum(y0)})$，半径 $R = ${formatNum(r)}$。`,
      },
    };

    completeSquareSteps.push({
      title: stdExplanations[lang].title,
      latex: formatCircleStandard(x0, y0, r),
      explanation: stdExplanations[lang].exp,
    });
  } else {
    // General Form: x^2 + y^2 + Dx + Ey + F = 0
    discriminantCircle = D * D + E * E - 4 * F;

    const step1Texts: Record<SupportedLanguage, { title: string; exp: string }> = {
      en: {
        title: 'Step 1: Grouping Variables and Moving Constant',
        exp: 'Group terms with x and terms with y into separate brackets, and move constant F to the right side (sign becomes -F).',
      },
      es: {
        title: 'Paso 1: Agrupación de Variables y Trasposición de Constante',
        exp: 'Agrupa los términos con x y con y entre paréntesis y pasa la constante F al lado derecho (cambia a -F).',
      },
      fr: {
        title: 'Étape 1 : Regroupement des Variables et Déplacement de la Constante',
        exp: 'Isolez les termes en x et en y entre parenthèses et transposez la constante F à droite (signe -F).',
      },
      pt: {
        title: 'Passo 1: Agrupamento de Variáveis e Transposição da Constante',
        exp: 'Agrupe os termos com x e com y entre parênteses e passe a constante F para a direita (fica -F).',
      },
      zh: {
        title: '第 1 步：圆的一般方程常数项移项与变量分组',
        exp: '将含有 x 的项、含有 y 的项分别归拢加括号，并将常数项 F 移至等号右侧（变号为 -F）。',
      },
    };

    const dTerm = D === 0 ? '' : D > 0 ? `+ ${D === 1 ? '' : formatNum(D)}x` : `- ${Math.abs(D) === 1 ? '' : formatNum(Math.abs(D))}x`;
    const eTerm = E === 0 ? '' : E > 0 ? `+ ${E === 1 ? '' : formatNum(E)}y` : `- ${Math.abs(E) === 1 ? '' : formatNum(Math.abs(E))}y`;

    completeSquareSteps.push({
      title: step1Texts[lang].title,
      latex: `(x^2 ${dTerm}) + (y^2 ${eTerm}) = ${formatNum(-F)}`,
      explanation: step1Texts[lang].exp,
    });

    // Step 2: Add half-coefficient squared
    const halfD = D / 2;
    const halfE = E / 2;
    const halfDSq = halfD * halfD;
    const halfESq = halfE * halfE;
    const rightSideTotal = -F + halfDSq + halfESq;

    const step2Texts: Record<SupportedLanguage, { title: string; exp: string }> = {
      en: {
        title: 'Step 2: Completing the Square (Add Half-Coefficients Squared)',
        exp: `By the identity (x+a)² = x² + 2ax + a²: add (D/2)² = ${formatNum(halfDSq)} to x, and (E/2)² = ${formatNum(halfESq)} to y. Add the same amounts to the right side to maintain equality.`,
      },
      es: {
        title: 'Paso 2: Completar Cuadrados (Sumar la Mitad del Coeficiente al Cuadrado)',
        exp: `Por la identidad (x+a)² = x² + 2ax + a²: suma (D/2)² = ${formatNum(halfDSq)} a x y (E/2)² = ${formatNum(halfESq)} a y, sumando lo mismo en el lado derecho.`,
      },
      fr: {
        title: 'Étape 2 : Complétion du Carré (Ajout de la Moitié du Coefficient au Carré)',
        exp: `Selon l'identité (x+a)² = x² + 2ax + a² : ajoutez (D/2)² = ${formatNum(halfDSq)} à x et (E/2)² = ${formatNum(halfESq)} à y, en ajoutant les mêmes valeurs à droite.`,
      },
      pt: {
        title: 'Passo 2: Completamento de Quadrados (Somar a Metade do Coeficiente ao Quadrado)',
        exp: `Pela identidade (x+a)² = x² + 2ax + a²: some (D/2)² = ${formatNum(halfDSq)} a x e (E/2)² = ${formatNum(halfESq)} a y, somando o mesmo valor à direita.`,
      },
      zh: {
        title: '第 2 步：配完全平方式（两边同时加上一次项系数一半的平方）',
        exp: `根据完全平方公式 (x+a)² = x² + 2ax + a²：x 分组加上 (D/2)² = ${formatNum(halfDSq)}，y 分组加上 (E/2)² = ${formatNum(halfESq)}，等式右侧同步增加以保持等式成立。`,
      },
    };

    completeSquareSteps.push({
      title: step2Texts[lang].title,
      latex: `\\left(x^2 ${dTerm} + ${formatNum(halfDSq)}\\right) + \\left(y^2 ${eTerm} + ${formatNum(halfESq)}\\right) = ${formatNum(-F)} + ${formatNum(halfDSq)} + ${formatNum(halfESq)}`,
      explanation: step2Texts[lang].exp,
    });

    // Step 3: Complete the square form
    x0 = -halfD;
    y0 = -halfE;
    rSquared = rightSideTotal;
    r = rSquared > 0 ? Math.sqrt(rSquared) : 0;

    const step3Texts: Record<SupportedLanguage, { title: string; exp: string }> = {
      en: {
        title: 'Step 3: Factoring into Standard Circle Equation',
        exp: `The evaluated right-hand side constant is (D² + E² - 4F)/4 = ${formatNum(rightSideTotal)}.`,
      },
      es: {
        title: 'Paso 3: Obtención de la Ecuación Canónica',
        exp: `El valor numérico resultante en el segundo miembro es (D² + E² - 4F)/4 = ${formatNum(rightSideTotal)}.`,
      },
      fr: {
        title: 'Étape 3 : Mise sous Forme Cartésienne',
        exp: `Le résultat constant calculé à droite est (D² + E² - 4F)/4 = ${formatNum(rightSideTotal)}.`,
      },
      pt: {
        title: 'Passo 3: Obtenção da Equação Reduzida',
        exp: `O valor numérico resultante no lado direito é (D² + E² - 4F)/4 = ${formatNum(rightSideTotal)}.`,
      },
      zh: {
        title: '第 3 步：整理得圆的标准方程',
        exp: `右侧计算结果为 (D² + E² - 4F)/4 = ${formatNum(rightSideTotal)}。`,
      },
    };

    completeSquareSteps.push({
      title: step3Texts[lang].title,
      latex: formatCircleStandard(x0, y0, r),
      explanation: step3Texts[lang].exp,
    });

    if (discriminantCircle > 1e-7) {
      isValidCircle = true;
      const factoredR = factorSqrt(Math.round(discriminantCircle));
      const radR = makeExactRadical(factoredR.outside, factoredR.inside, 2);

      const step4Texts: Record<SupportedLanguage, { title: string; exp: string }> = {
        en: {
          title: 'Step 4: Discriminant Check & Extracting Center and Radius',
          exp: `Discriminant is strictly positive (>0), confirming a real circle. Center O(-D/2, -E/2) = (${formatNum(x0)}, ${formatNum(y0)}), Radius R = ${radR.latex}.`,
        },
        es: {
          title: 'Paso 4: Verificación del Discriminante y Extracción de Centro y Radio',
          exp: `El discriminante es positivo (>0), confirmando una circunferencia real. Centro O(-D/2, -E/2) = (${formatNum(x0)}, ${formatNum(y0)}), Radio R = ${radR.latex}.`,
        },
        fr: {
          title: 'Étape 4 : Test du Discriminant et Déduction du Centre et Rayon',
          exp: `Le discriminant est strictement positif (>0), attestant d'un cercle réel. Centre O(-D/2, -E/2) = (${formatNum(x0)}, ${formatNum(y0)}), Rayon R = ${radR.latex}.`,
        },
        pt: {
          title: 'Passo 4: Verificação do Discriminante e Extração de Centro e Raio',
          exp: `O discriminante é estritamente positivo (>0), confirmando uma circunferência real. Centro O(-D/2, -E/2) = (${formatNum(x0)}, ${formatNum(y0)}), Raio R = ${radR.latex}.`,
        },
        zh: {
          title: '第 4 步：判别式检验与确定圆心及半径',
          exp: `判别式大于 0，方程表示真正的圆。圆心 O(-D/2, -E/2) = (${formatNum(x0)}, ${formatNum(y0)})，半径 R = ${radR.latex}。`,
        },
      };

      completeSquareSteps.push({
        title: step4Texts[lang].title,
        latex: `D^2 + E^2 - 4F = ${formatNum(D)}^2 + ${formatNum(E)}^2 - 4(${formatNum(F)}) = ${formatNum(discriminantCircle)} > 0`,
        explanation: step4Texts[lang].exp,
      });
    } else if (Math.abs(discriminantCircle) <= 1e-7) {
      isValidCircle = false;
      circleStatusMsg = `D² + E² - 4F = 0 (${formatNum(x0)}, ${formatNum(y0)})`;
    } else {
      isValidCircle = false;
      circleStatusMsg = `D² + E² - 4F = ${formatNum(discriminantCircle)} < 0`;
    }
  }

  // Normalize Line: Ax + By + C = 0
  let { A, B, C } = line;
  if (Math.abs(A) < 1e-9 && Math.abs(B) < 1e-9) {
    A = 1;
    B = 0;
    C = 0;
  }
  // Canonical sign: ensure A > 0, or if A == 0, B > 0
  if (A < 0 || (Math.abs(A) < 1e-9 && B < 0)) {
    A = -A;
    B = -B;
    C = -C;
  }

  // Distance d = |A*x0 + B*y0 + C| / sqrt(A^2 + B^2)
  const numeratorRaw = A * x0 + B * y0 + C;
  const absNumerator = Math.abs(numeratorRaw);
  const denSq = Math.round(A * A + B * B);
  const den = Math.sqrt(denSq);
  const distance = absNumerator / den;

  // Real Exact Radical for distance d:
  // d = absNumerator / \sqrt{denSq} = (absNumerator * \sqrt{denSq}) / denSq
  const exactDist = exactQuotientWithSqrt(makeRational(absNumerator), denSq);
  const distanceExactLatex = exactDist.latex;
  const distanceFractionLatex = `\\frac{|${formatNum(A)}(${formatNum(x0)}) + ${formatNum(B)}(${formatNum(y0)}) + ${formatNum(C)}|}{\\sqrt{${formatNum(A)}^2 + ${formatNum(B)}^2}} = \\frac{${formatNum(absNumerator)}}{\\sqrt{${formatNum(denSq)}}} = ${distanceExactLatex}`;

  // Positional Relation: compare d and r
  let relation: RelationType = 'intersecting';
  let relationChinese = '相交';
  let relationSummary = '';
  const eps = 1e-6;

  if (distance < r - eps) {
    relation = 'intersecting';
    relationChinese = '相交';
    const summaries: Record<SupportedLanguage, string> = {
      en: `Because center distance d = ${distanceExactLatex} < R = ${formatNum(r)}, the line is secant to the circle with 2 distinct intersection points.`,
      es: `Dado que la distancia al centro d = ${distanceExactLatex} < R = ${formatNum(r)}, la recta es secante con 2 puntos de corte.`,
      fr: `Comme la distance au centre d = ${distanceExactLatex} < R = ${formatNum(r)}, la droite est sécante au cercle avec 2 points d'intersection distincts.`,
      pt: `Como a distância ao centro d = ${distanceExactLatex} < R = ${formatNum(r)}, a reta é secante à circunferência em 2 pontos distintos.`,
      zh: `因为圆心距 d = ${distanceExactLatex} < R = ${formatNum(r)}，所以直线与圆相交，有两个不同的公共交点。`,
    };
    relationSummary = summaries[lang];
  } else if (Math.abs(distance - r) <= eps) {
    relation = 'tangent';
    relationChinese = '相切';
    const summaries: Record<SupportedLanguage, string> = {
      en: `Because center distance d = ${distanceExactLatex} = R = ${formatNum(r)}, the line is tangent to the circle at exactly 1 contact point.`,
      es: `Dado que la distancia al centro d = ${distanceExactLatex} = R = ${formatNum(r)}, la recta es tangente a la circunferencia en 1 único punto.`,
      fr: `Comme la distance au centre d = ${distanceExactLatex} = R = ${formatNum(r)}, la droite est tangente au cercle en exactement 1 point de contact.`,
      pt: `Como a distância ao centro d = ${distanceExactLatex} = R = ${formatNum(r)}, a reta é tangente à circunferência em exatamente 1 ponto de contato.`,
      zh: `因为圆心距 d = ${distanceExactLatex} = R = ${formatNum(r)}，所以直线与圆相切，有且仅有一个切点。`,
    };
    relationSummary = summaries[lang];
  } else {
    relation = 'disjoint';
    relationChinese = '相离';
    const summaries: Record<SupportedLanguage, string> = {
      en: `Because center distance d = ${distanceExactLatex} > R = ${formatNum(r)}, the line is disjoint (exterior) to the circle with 0 intersection points.`,
      es: `Dado que la distancia al centro d = ${distanceExactLatex} > R = ${formatNum(r)}, la recta es exterior a la circunferencia con 0 puntos de contacto.`,
      fr: `Comme la distance au centre d = ${distanceExactLatex} > R = ${formatNum(r)}, la droite est extérieure au cercle (aucun point d'intersection).`,
      pt: `Como a distância ao centro d = ${distanceExactLatex} > R = ${formatNum(r)}, a reta é exterior à circunferência (0 interseções).`,
      zh: `因为圆心距 d = ${distanceExactLatex} > R = ${formatNum(r)}，所以直线与圆相离，没有公共交点。`,
    };
    relationSummary = summaries[lang];
  }

  // Foot of Perpendicular H (x_h, y_h) from (x0, y0) to line Ax + By + C = 0
  const tH = (A * x0 + B * y0 + C) / denSq;
  const footH: Point2D = {
    x: x0 - A * tH,
    y: y0 - B * tH,
  };

  // Intersection points and Chord Length
  const intersectionPoints: Point2D[] = [];
  let chordLength: number | undefined;
  let halfChordLength: number | undefined;
  let chordLengthLatex: string | undefined;
  let fullChordExactLatex: string | undefined;
  let exactIntersectionsLatex: string | undefined;

  if (relation === 'intersecting') {
    halfChordLength = Math.sqrt(Math.max(0, rSquared - distance * distance));
    chordLength = 2 * halfChordLength;

    // Real Exact Radical for Chord Length:
    // R^2 - d^2 = rSquared - (absNumerator^2 / denSq) = (rSquared * denSq - absNumerator^2) / denSq
    const numChordSq = Math.round(rSquared * denSq - absNumerator * absNumerator);
    const denChordSq = denSq;
    const halfChordExact = exactSqrtOfRational(makeRational(numChordSq, denChordSq));
    const fullChordExact = makeExactRadical(2 * halfChordExact.p, halfChordExact.s, halfChordExact.q);

    fullChordExactLatex = fullChordExact.latex;
    chordLengthLatex = `L = 2\\sqrt{R^2 - d^2} = 2\\sqrt{${formatNum(rSquared)} - (${distanceExactLatex})^2} = ${fullChordExact.latex}`;

    // Exact radical coordinates of intersections
    // H = (u_x / denSq, u_y / denSq)
    const ux = B * (B * x0 - A * y0) - A * C;
    const uy = A * (A * y0 - B * x0) - B * C;
    const factoredChord = factorSqrt(numChordSq);
    const vx = -B * factoredChord.outside;
    const vy = A * factoredChord.outside;
    const s = factoredChord.inside;

    const p1XExact = formatExactIntersection(Math.round(ux), Math.round(vx), s, denSq);
    const p1YExact = formatExactIntersection(Math.round(uy), Math.round(vy), s, denSq);
    const p2XExact = formatExactIntersection(Math.round(ux), -Math.round(vx), s, denSq);
    const p2YExact = formatExactIntersection(Math.round(uy), -Math.round(vy), s, denSq);

    exactIntersectionsLatex = `\\left(${formatExactIntersectionPair(Math.round(ux), Math.round(vx), s, denSq)}, ${formatExactIntersectionPair(Math.round(uy), Math.round(vy), s, denSq)}\\right)`;

    // Coordinates of intersections
    const uX = -B / den;
    const uY = A / den;

    intersectionPoints.push({
      x: footH.x + halfChordLength * uX,
      y: footH.y + halfChordLength * uY,
      xLatex: p1XExact,
      yLatex: p1YExact,
    });
    intersectionPoints.push({
      x: footH.x - halfChordLength * uX,
      y: footH.y - halfChordLength * uY,
      xLatex: p2XExact,
      yLatex: p2YExact,
    });
  } else if (relation === 'tangent') {
    intersectionPoints.push({
      ...footH,
      xLatex: toFractionLatex(footH.x),
      yLatex: toFractionLatex(footH.y),
    });
  }

  // Method 2: Algebraic system (消元与韦达定理)
  let algebraicDelta: number | undefined;
  let quadraticCoeffs: { a: number; b: number; c: number } | undefined;
  let vietaSum: number | undefined;
  let vietaProduct: number | undefined;

  if (Math.abs(B) > 1e-7) {
    const k = -A / B;
    const mLine = -C / B;
    const quadA = 1 + k * k;
    const dy = mLine - y0;
    const quadB = -2 * x0 + 2 * k * dy;
    const quadC = x0 * x0 + dy * dy - rSquared;

    quadraticCoeffs = { a: quadA, b: quadB, c: quadC };
    algebraicDelta = quadB * quadB - 4 * quadA * quadC;
    if (Math.abs(quadA) > 1e-7) {
      vietaSum = -quadB / quadA;
      vietaProduct = quadC / quadA;
    }
  } else {
    const lineX = -C / A;
    const dx = lineX - x0;
    const yRemSq = rSquared - dx * dx;
    quadraticCoeffs = { a: 1, b: -2 * y0, c: y0 * y0 - yRemSq };
    algebraicDelta = 4 * yRemSq;
    vietaSum = 2 * y0;
    vietaProduct = y0 * y0 - yRemSq;
  }

  // Distance extrema from points on circle to line
  const minDistToLine = distance < r ? 0 : distance - r;
  const maxDistToLine = distance + r;
  const minDistLatex = distance < r ? '0' : `d - R = ${distanceExactLatex} - ${formatNum(r)} \\approx ${formatNum(minDistToLine)}`;
  const maxDistLatex = `d + R = ${distanceExactLatex} + ${formatNum(r)} \\approx ${formatNum(maxDistToLine)}`;

  return {
    isValidCircle,
    circleStatusMsg,
    discriminantCircle,
    x0,
    y0,
    r,
    rSquared,
    A,
    B,
    C,
    distance,
    distanceFractionLatex,
    distanceExactLatex,
    relation,
    relationChinese,
    relationSummary,
    chordLength,
    halfChordLength,
    chordLengthLatex,
    fullChordExactLatex,
    exactIntersectionsLatex,
    algebraicDelta,
    quadraticCoeffs,
    vietaSum,
    vietaProduct,
    footH,
    intersectionPoints,
    minDistToLine,
    maxDistToLine,
    minDistLatex,
    maxDistLatex,
    completeSquareSteps,
  };
}
