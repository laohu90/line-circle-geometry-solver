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
    title: '一般式配方与割线截得弦长',
    tag: '相交与弦长',
    date: '2026-10-20',
    circleMode: 'general',
    generalCircle: { D: -4, E: 2, F: -4 }, // (x-2)^2 + (y+1)^2 = 9, R=3
    standardCircle: { x0: 2, y0: -1, r: 3 },
    lineMode: 'general',
    generalLine: { A: 3, B: 4, C: -12 }, // d = 2. Chord L = 2*sqrt(9 - 4) = 2*sqrt(5)
    slopeLine: { k: -0.75, b: 3, isVertical: false },
    userNote: '易错坑点：求弦长时切记是 L = 2√(R² - d²)，很多同学考场上一紧张漏乘了 2，误把半弦长当成了全弦长！',
    isMastered: false,
    keywords: ['secant', 'chord', 'square', 'pythagoras', 'cuerda', 'corde', '弦长', '配方法', '相交与弦长', '一般式配方与割线截得弦长'],
    localizedTitles: {
      zh: '一般式配方与割线截得弦长',
      en: '一般式配方与割线截得弦长',
      es: 'Completar Cuadrados de Forma General y Longitud de Cuerda Secante',
      fr: 'Complétion du Carré sous Forme Générale et Corde Sécante',
      pt: 'Completamento de Quadrados da Forma Geral e Comprimento da Corda Secante',
    },
    localizedTags: {
      zh: '相交与弦长',
      en: '相交与弦长',
      es: '相交与弦长',
      fr: '相交与弦长',
      pt: '相交与弦长',
    },
    localizedNotes: {
      zh: '易错坑点：求弦长时切记是 L = 2√(R² - d²)，很多同学考场上一紧张漏乘了 2，误把半弦长当成了全弦长！',
      en: '易错坑点：求弦长时切记是 L = 2√(R² - d²)，很多同学考场上一紧张漏乘了 2，误把半弦长当成了全弦长！',
      es: '易错坑点：La longitud de la cuerda es L = 2√(R² - d²). ¡No olvides multiplicar la semicuerda por 2!',
      fr: '易错坑点：La formule de la corde est L = 2√(R² - d²). N\'oubliez pas de multiplier la demi-corde par 2 !',
      pt: '易错坑点：O comprimento da corda é L = 2√(R² - d²). Não se esqueça de multiplicar a semicorda por 2!',
    },
  },
  {
    id: 'preset-2',
    title: '圆上点到直线最大最小距离',
    tag: '最值距离',
    date: '2026-10-21',
    circleMode: 'standard',
    generalCircle: { D: -2, E: -4, F: 1 },
    standardCircle: { x0: 1, y0: 2, r: 2 }, // (x-1)^2 + (y-2)^2 = 4, R=2
    lineMode: 'general',
    generalLine: { A: 5, B: 12, C: 12 }, // d = 41/13 > 2 => Disjoint. d_min = 15/13, d_max = 67/13
    slopeLine: { k: -0.41666, b: -1, isVertical: false },
    userNote: '核心原理：圆上点到直线的距离极值恒满足 d_min = |d - R|，d_max = d + R。圆心过垂线即可找到对应的最近点与最远点。',
    isMastered: true,
    keywords: ['extrema', 'distance', 'disjoint', 'max', 'min', 'extremos', '最值问题', '最值距离', '相离', '圆上点到直线最大最小距离'],
    localizedTitles: {
      zh: '圆上点到直线最大最小距离',
      en: '圆上点到直线最大最小距离',
      es: 'Distancias Extremas: Máxima y Mínima del Círculo a la Recta',
      fr: 'Distances Extrêmes : Maximale et Minimale du Cercle à la Droite',
      pt: 'Distâncias Extremas: Máxima e Mínima da Circunferência à Reta',
    },
    localizedTags: {
      zh: '最值距离',
      en: '最值距离',
      es: '最值距离',
      fr: '最值距离',
      pt: '最值距离',
    },
    localizedNotes: {
      zh: '核心原理：圆上点到直线的距离极值恒满足 d_min = |d - R|，d_max = d + R。圆心过垂线即可找到对应的最近点与最远点。',
      en: '核心原理：圆上点到直线的距离极值恒满足 d_min = |d - R|，d_max = d + R。圆心过垂线即可找到对应的最近点与最远点。',
      es: '核心原理：Las distancias extremas siempre satisfacen d_mín = |d - R| y d_máx = d + R.',
      fr: '核心原理：Les distances extrêmes vérifient toujours d_min = |d - R| et d_max = d + R.',
      pt: '核心原理：As distâncias extremas sempre satisfazem d_mín = |d - R| e d_máx = d + R.',
    },
  },
  {
    id: 'preset-3',
    title: '相切临界值判定（d=R 且 Δ=0）',
    tag: '相切与切线',
    date: '2026-10-22',
    circleMode: 'general',
    generalCircle: { D: 0, E: 0, F: -25 }, // x^2 + y^2 = 25, R=5
    standardCircle: { x0: 0, y0: 0, r: 5 },
    lineMode: 'general',
    generalLine: { A: 3, B: 4, C: -25 }, // d = 25/5 = 5 = R => Tangent at (3, 4)
    slopeLine: { k: -0.75, b: 6.25, isVertical: false },
    userNote: '考场策略：直线与圆相切的几何条件 d = R 比代数判别式 Δ = 0 计算量小得多，含参题务必优先列出 d = R 解方程！',
    isMastered: false,
    keywords: ['tangent', 'contact', 'critical', 'discriminant', 'tangente', '切线验证', '相切', '相切与切线', '相切临界值判定（d=R 且 Δ=0）'],
    localizedTitles: {
      zh: '相切临界值判定（d=R 且 Δ=0）',
      en: '相切临界值判定（d=R 且 Δ=0）',
      es: 'Verificación de Tangencia Crítica (d = R y Discriminante Δ = 0)',
      fr: 'Vérification de la Tangente Critique (d = R et Discriminant Δ = 0)',
      pt: 'Verificação da Tangência Crítica (d = R e Discriminante Δ = 0)',
    },
    localizedTags: {
      zh: '相切与切线',
      en: '相切与切线',
      es: '相切与切线',
      fr: '相切与切线',
      pt: '相切与切线',
    },
    localizedNotes: {
      zh: '考场策略：直线与圆相切的几何条件 d = R 比代数判别式 Δ = 0 计算量小得多，含参题务必优先列出 d = R 解方程！',
      en: '考场策略：直线与圆相切的几何条件 d = R 比代数判别式 Δ = 0 计算量小得多，含参题务必优先列出 d = R 解方程！',
      es: '考场策略：Comprobar d = R es mucho más rápido y seguro que calcular el discriminante Δ = 0.',
      fr: '考场策略：Tester d = R est bien plus rapide et sûr que de développer le discriminant Δ = 0.',
      pt: '考场策略：Verificar d = R é muito mais rápido e seguro do que desenvolver o discriminante Δ = 0.',
    },
  },
  {
    id: 'preset-4',
    title: '斜率不存在陷阱：竖直线 x=c',
    tag: '竖直线防坑',
    date: '2026-10-23',
    circleMode: 'standard',
    generalCircle: { D: -6, E: 0, F: 5 },
    standardCircle: { x0: 3, y0: 0, r: 2 }, // (x-3)^2 + y^2 = 4, R=2
    lineMode: 'general',
    generalLine: { A: 1, B: 0, C: -4 }, // x = 4 => d = 1. Chord L = 2*sqrt(4-1) = 2*sqrt(3)
    slopeLine: { k: 0, b: 0, isVertical: true, xVal: 4 },
    userNote: '高频陷阱：设直线方程为 y = kx + b 时极易漏掉斜率不存在的特殊直线 x = c，需分类讨论或使用一般式 Ax + By + C = 0！',
    isMastered: true,
    keywords: ['vertical', 'slope', 'undefined', 'perpendicular', 'verticale', '垂直特殊线', '竖直线防坑', '斜率不存在', '斜率不存在陷阱：竖直线 x=c'],
    localizedTitles: {
      zh: '斜率不存在陷阱：竖直线 x=c',
      en: '斜率不存在陷阱：竖直线 x=c',
      es: 'Trampa de la Pendiente Indefinida: Recta Vertical x = c',
      fr: 'Piège de la Pente Non Définie : Droite Verticale x = c',
      pt: 'Armadilha do Coeficiente Angular Indefinido: Reta Vertical x = c',
    },
    localizedTags: {
      zh: '竖直线防坑',
      en: '竖直线防坑',
      es: '竖直线防坑',
      fr: '竖直线防坑',
      pt: '竖直线防坑',
    },
    localizedNotes: {
      zh: '高频陷阱：设直线方程为 y = kx + b 时极易漏掉斜率不存在的特殊直线 x = c，需分类讨论或使用一般式 Ax + By + C = 0！',
      en: '高频陷阱：设直线方程为 y = kx + b 时极易漏掉斜率不存在的特殊直线 x = c，需分类讨论或使用一般式 Ax + By + C = 0！',
      es: '高频陷阱：Al asumir y = kx + b se olvidan las rectas verticales con pendiente indefinida.',
      fr: '高频陷阱：Poser y = kx + b fait omettre les droites verticales de pente non définie.',
      pt: '高频陷阱：Supor y = kx + b ignora retas verticais com coeficiente angular inexistente.',
    },
  },
  {
    id: 'preset-5',
    title: '直径割线：直线过圆心（d=0）',
    tag: '垂径定理',
    date: '2026-10-24',
    circleMode: 'general',
    generalCircle: { D: -2, E: -2, F: -2 }, // (x-1)^2 + (y-1)^2 = 4, R=2
    standardCircle: { x0: 1, y0: 1, r: 2 },
    lineMode: 'general',
    generalLine: { A: 1, B: 1, C: -2 }, // x + y - 2 = 0, d = 0, Chord L = 2R = 4
    slopeLine: { k: -1, b: 2, isVertical: false },
    userNote: '几何洞察：当 d = 0 时，直线过圆心，截得弦长恰好为圆的直径 2R，也是所有割线弦长的最大值。',
    isMastered: false,
    keywords: ['diameter', 'center', 'chord', 'maximum', 'diámetro', 'diamètre', 'diâmetro', '直径', '割线', '垂径定理', '直径割线：直线过圆心（d=0）'],
    localizedTitles: {
      zh: '直径割线：直线过圆心（d=0）',
      en: '直径割线：直线过圆心（d=0）',
      es: 'Cuerda Diametral: Recta que pasa por el Centro (d = 0)',
      fr: 'Corde Diamétrale : Droite Passant par le Centre (d = 0)',
      pt: 'Corda Diametral: Reta Passando pelo Centro (d = 0)',
    },
    localizedTags: {
      zh: '垂径定理',
      en: '垂径定理',
      es: '垂径定理',
      fr: '垂径定理',
      pt: '垂径定理',
    },
    localizedNotes: {
      zh: '几何洞察：当 d = 0 时，直线过圆心，截得弦长恰好为圆的直径 2R，也是所有割线弦长的最大值。',
      en: '几何洞察：当 d = 0 时，直线过圆心，截得弦长恰好为圆的直径 2R，也是所有割线弦长的最大值。',
      es: '几何洞察：Cuando d = 0, la recta pasa por el centro y la cuerda alcanza su máximo valor, el diámetro 2R.',
      fr: '几何洞察：Quand d = 0, la droite passe par le centre et la corde atteint sa valeur maximale, le diamètre 2R.',
      pt: '几何洞察：Quando d = 0, a reta passa pelo centro e a corda atinge seu valor máximo, o diâmetro 2R.',
    },
  },
];
