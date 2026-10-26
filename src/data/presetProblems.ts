/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MistakeQuestion } from '../types/geometry';
import { SupportedLanguage } from '../i18n/translations';

export interface LocalizedPreset extends MistakeQuestion {
  localizedTitles: Record<SupportedLanguage, string>;
  localizedTags: Record<SupportedLanguage, string>;
  localizedNotes: Record<SupportedLanguage, string>;
}

export const PRESET_EXAM_PROBLEMS: LocalizedPreset[] = [
  {
    id: 'preset-1',
    title: 'General Form Completing Square & Secant Chord Length',
    tag: 'Secant & Chord',
    date: '2026-10-20',
    circleMode: 'general',
    generalCircle: { D: -4, E: 2, F: -4 }, // (x-2)^2 + (y+1)^2 = 9, R=3
    standardCircle: { x0: 2, y0: -1, r: 3 },
    lineMode: 'general',
    generalLine: { A: 3, B: 4, C: -12 }, // d = 2. Chord L = 2*sqrt(9 - 4) = 2*sqrt(5)
    slopeLine: { k: -0.75, b: 3, isVertical: false },
    userNote: 'Pitfall: The chord length formula is L = 2√(R² - d²). Do not forget to multiply the half-chord by 2!',
    isMastered: false,
    keywords: ['secant', 'chord', 'square', 'pythagoras', 'cuerda', 'corde', '弦长', '配方法'],
    localizedTitles: {
      en: 'General Form Completing Square & Secant Chord Length',
      es: 'Completar Cuadrados de Forma General y Longitud de Cuerda Secante',
      fr: 'Complétion du Carré sous Forme Générale et Corde Sécante',
      pt: 'Completamento de Quadrados da Forma Geral e Comprimento da Corda Secante',
      zh: '经典压轴：一般式配方与割线截得弦长计算',
    },
    localizedTags: {
      en: 'Secant & Chord',
      es: 'Secante y Cuerda',
      fr: 'Sécante et Corde',
      pt: 'Secante e Corda',
      zh: '相交弦长',
    },
    localizedNotes: {
      en: 'Pitfall: The chord length formula is L = 2√(R² - d²). Do not forget to multiply the half-chord by 2!',
      es: 'Trampa: La longitud de la cuerda es L = 2√(R² - d²). ¡No olvides multiplicar la semicuerda por 2!',
      fr: 'Piège : La formule de la corde est L = 2√(R² - d²). N\'oubliez pas de multiplier la demi-corde par 2 !',
      pt: 'Pegadinha: O comprimento da corda é L = 2√(R² - d²). Não se esqueça de multiplicar a semicorda por 2!',
      zh: '易错警示：求弦长时切记是 2√(R² - d²)，很多同学考场上一紧张漏乘了 2，误把半弦长当成了全弦长！',
    },
  },
  {
    id: 'preset-2',
    title: 'Extrema Distance: Maximum & Minimum from Circle to Line',
    tag: 'Distance Extrema',
    date: '2026-10-21',
    circleMode: 'standard',
    generalCircle: { D: -2, E: -4, F: 1 },
    standardCircle: { x0: 1, y0: 2, r: 2 }, // (x-1)^2 + (y-2)^2 = 4, R=2
    lineMode: 'general',
    generalLine: { A: 5, B: 12, C: 12 }, // d = 41/13 > 2 => Disjoint. d_min = 15/13, d_max = 67/13
    slopeLine: { k: -0.41666, b: -1, isVertical: false },
    userNote: 'Core Principle: Extreme distances from circle to line always satisfy d_min = |d - R| and d_max = d + R.',
    isMastered: true,
    keywords: ['extrema', 'distance', 'disjoint', 'max', 'min', 'extremos', '最值问题', '相离'],
    localizedTitles: {
      en: 'Extrema Distance: Maximum & Minimum from Circle to Line',
      es: 'Distancias Extremas: Máxima y Mínima del Círculo a la Recta',
      fr: 'Distances Extrêmes : Maximale et Minimale du Cercle à la Droite',
      pt: 'Distâncias Extremas: Máxima e Mínima da Circunferência à Reta',
      zh: '高考真题选填：圆上点到直线的最大/最小距离',
    },
    localizedTags: {
      en: 'Distance Extrema',
      es: 'Distancias Extremas',
      fr: 'Distances Extrêmes',
      pt: 'Distâncias Extremas',
      zh: '最值问题',
    },
    localizedNotes: {
      en: 'Core Principle: Extreme distances from circle to line always satisfy d_min = |d - R| and d_max = d + R.',
      es: 'Principio Clave: Las distancias extremas siempre satisfacen d_mín = |d - R| y d_máx = d + R.',
      fr: 'Principe Clé : Les distances extrêmes vérifient toujours d_min = |d - R| et d_max = d + R.',
      pt: 'Princípio Chave: As distâncias extremas sempre satisfazem d_mín = |d - R| e d_máx = d + R.',
      zh: '考点精髓：圆上点到直线的距离极值恒满足 d_min = |d - R|，d_max = d + R。圆心过垂线即可找到对应的最近点与最远点。',
    },
  },
  {
    id: 'preset-3',
    title: 'Critical Tangent Verification (d = R & Discriminant Δ = 0)',
    tag: 'Tangent & Contact',
    date: '2026-10-22',
    circleMode: 'general',
    generalCircle: { D: 0, E: 0, F: -25 }, // x^2 + y^2 = 25, R=5
    standardCircle: { x0: 0, y0: 0, r: 5 },
    lineMode: 'general',
    generalLine: { A: 3, B: 4, C: -25 }, // d = 25/5 = 5 = R => Tangent at (3, 4)
    slopeLine: { k: -0.75, b: 6.25, isVertical: false },
    userNote: 'Exam Strategy: Verifying d = R is substantially faster and less error-prone than solving discriminant Δ = 0.',
    isMastered: false,
    keywords: ['tangent', 'contact', 'critical', 'discriminant', 'tangente', '切线验证', '相切'],
    localizedTitles: {
      en: 'Critical Tangent Verification (d = R & Discriminant Δ = 0)',
      es: 'Verificación de Tangencia Crítica (d = R y Discriminante Δ = 0)',
      fr: 'Vérification de la Tangente Critique (d = R et Discriminant Δ = 0)',
      pt: 'Verificação da Tangência Crítica (d = R e Discriminante Δ = 0)',
      zh: '模拟题压轴：含参相切临界值判定 (d = R)',
    },
    localizedTags: {
      en: 'Tangent & Contact',
      es: 'Tangente y Contacto',
      fr: 'Tangente et Contact',
      pt: 'Tangente e Contato',
      zh: '切线验证',
    },
    localizedNotes: {
      en: 'Exam Strategy: Verifying d = R is substantially faster and less error-prone than solving discriminant Δ = 0.',
      es: 'Estrategia de Examen: Comprobar d = R es mucho más rápido y seguro que calcular el discriminante Δ = 0.',
      fr: 'Stratégie d\'Examen : Tester d = R est bien plus rapide et sûr que de développer le discriminant Δ = 0.',
      pt: 'Estratégia de Prova: Verificar d = R é muito mais rápido e seguro do que desenvolver o discriminante Δ = 0.',
      zh: '复习备忘：直线与圆相切的几何条件 d = R 比代数判别式 Δ = 0 计算量小得多，含参题务必优先列出 d = R 解方程！',
    },
  },
  {
    id: 'preset-4',
    title: 'Undefined Slope Case Trap: Vertical Line x = c',
    tag: 'Vertical Line x=c',
    date: '2026-10-23',
    circleMode: 'standard',
    generalCircle: { D: -6, E: 0, F: 5 },
    standardCircle: { x0: 3, y0: 0, r: 2 }, // (x-3)^2 + y^2 = 4, R=2
    lineMode: 'general',
    generalLine: { A: 1, B: 0, C: -4 }, // x = 4 => d = 1. Chord L = 2*sqrt(4-1) = 2*sqrt(3)
    slopeLine: { k: 0, b: 0, isVertical: true, xVal: 4 },
    userNote: 'High Frequency Mistake: Assuming line is y = kx + b misses vertical lines where slope is undefined!',
    isMastered: true,
    keywords: ['vertical', 'slope', 'undefined', 'perpendicular', 'verticale', '垂直特殊线', '斜率不存在'],
    localizedTitles: {
      en: 'Undefined Slope Case Trap: Vertical Line x = c',
      es: 'Trampa de la Pendiente Indefinida: Recta Vertical x = c',
      fr: 'Piège de la Pente Non Définie : Droite Verticale x = c',
      pt: 'Armadilha do Coeficiente Angular Indefinido: Reta Vertical x = c',
      zh: '易错防坑：斜率不存在的特殊直线 x = c',
    },
    localizedTags: {
      en: 'Vertical Line x=c',
      es: 'Recta Vertical x=c',
      fr: 'Droite Verticale x=c',
      pt: 'Reta Vertical x=c',
      zh: '垂直特殊线',
    },
    localizedNotes: {
      en: 'High Frequency Mistake: Assuming line is y = kx + b misses vertical lines where slope is undefined!',
      es: 'Error Frecuente: Al asumir y = kx + b se olvidan las rectas verticales con pendiente indefinida.',
      fr: 'Erreur Fréquente : Poser y = kx + b fait omettre les droites verticales de pente non définie.',
      pt: 'Erro Frequente: Supor y = kx + b ignora retas verticais com coeficiente angular inexistente.',
      zh: '致命陷阱：设直线方程为 y = kx + b 时极易漏掉斜率不存在的直线 x = c，需分类讨论或使用一般式 Ax + By + C = 0！',
    },
  },
  {
    id: 'preset-5',
    title: 'Diameter Secant: Line Passing Through Circle Center (d = 0)',
    tag: 'Perpendicular Chord',
    date: '2026-10-24',
    circleMode: 'general',
    generalCircle: { D: -2, E: -2, F: -2 }, // (x-1)^2 + (y-1)^2 = 4, R=2
    standardCircle: { x0: 1, y0: 1, r: 2 },
    lineMode: 'general',
    generalLine: { A: 1, B: 1, C: -2 }, // x + y - 2 = 0, d = 0, Chord L = 2R = 4
    slopeLine: { k: -1, b: 2, isVertical: false },
    userNote: 'Geometric Insight: When distance d = 0, the line passes through the center and chord equals diameter 2R.',
    isMastered: false,
    keywords: ['diameter', 'center', 'chord', 'maximum', 'diámetro', 'diamètre', 'diâmetro', '直径', '割线'],
    localizedTitles: {
      en: 'Diameter Secant: Line Passing Through Circle Center (d = 0)',
      es: 'Cuerda Diametral: Recta que pasa por el Centro (d = 0)',
      fr: 'Corde Diamétrale : Droite Passant par le Centre (d = 0)',
      pt: 'Corda Diametral: Reta Passando pelo Centro (d = 0)',
      zh: '2024八省联考模拟：弦长为直径 2R 逆推参数 (d = 0)',
    },
    localizedTags: {
      en: 'Perpendicular Chord',
      es: 'Cuerda Perpendicular',
      fr: 'Corde Perpendiculaire',
      pt: 'Corda Perpendicular',
      zh: '参数逆推',
    },
    localizedNotes: {
      en: 'Geometric Insight: When distance d = 0, the line passes through the center and chord equals diameter 2R.',
      es: 'Visión Geométrica: Cuando d = 0, la recta pasa por el centro y la cuerda alcanza su máximo valor, el diámetro 2R.',
      fr: 'Intuition Géométrique : Quand d = 0, la droite passe par le centre et la corde atteint sa valeur maximale, le diamètre 2R.',
      pt: 'Intuição Geométrica: Quando d = 0, a reta passa pelo centro e a corda atinge seu valor máximo, o diâmetro 2R.',
      zh: '特殊几何直观：当 d = 0 时，直线过圆心，截得弦长恰好为圆的直径 2R，也是所有割线弦长的最大值。',
    },
  },
];
