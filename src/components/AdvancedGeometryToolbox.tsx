/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TranslationSchema, SupportedLanguage } from '../i18n/translations';
import { MathView } from './MathView';
import {
  formatNum,
  formatLineEquation,
  formatCircleStandard,
  factorSqrt,
  makeExactRadical,
} from '../utils/exactMath';
import {
  Compass,
  CircleDot,
  GitCommit,
  GitBranch,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface AdvancedGeometryToolboxProps {
  initialX0: number;
  initialY0: number;
  initialR: number;
  t: TranslationSchema;
  lang: SupportedLanguage;
}

export const AdvancedGeometryToolbox: React.FC<AdvancedGeometryToolboxProps> = ({
  initialX0,
  initialY0,
  initialR,
  t,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'tangent' | 'point' | 'twoCircles' | 'midpoint'>('tangent');

  // Shared circle reference
  const [c1, setC1] = useState({ x0: initialX0, y0: initialY0, r: initialR });

  // 1. Tangent Line State
  const [tangentP, setTangentP] = useState({ x: 5, y: 3 });

  // 2. Point vs Circle State
  const [pointP, setPointP] = useState({ x: 4, y: 2 });

  // 3. Two Circles State
  const [c2, setC2] = useState({ x0: -1, y0: 3, r: 2 });

  // 4. Midpoint Chord State
  const [chordM, setChordM] = useState({ x: initialX0 + 1, y: initialY0 + 1 });

  // --- MODEL 1: TANGENT LINE SOLVER ---
  const dxT = tangentP.x - c1.x0;
  const dyT = tangentP.y - c1.y0;
  const distSqT = dxT * dxT + dyT * dyT;
  const distT = Math.sqrt(distSqT);
  const eps = 1e-6;

  let tangentVerdict: 'on' | 'outside' | 'inside' = 'outside';
  if (Math.abs(distT - c1.r) < eps) tangentVerdict = 'on';
  else if (distT < c1.r) tangentVerdict = 'inside';

  // Tangent segment length
  const tangentSegLength = distT > c1.r ? Math.sqrt(distSqT - c1.r * c1.r) : 0;
  const radTanSeg = distT > c1.r ? makeExactRadical(1, Math.round(distSqT - c1.r * c1.r), 1) : null;

  // Tangents from outside point: solve for slope k
  const t_dx = c1.x0 - tangentP.x;
  const t_dy = c1.y0 - tangentP.y;
  const quad_a = t_dx * t_dx - c1.r * c1.r;
  const quad_b = -2 * t_dx * t_dy;
  const quad_c = t_dy * t_dy - c1.r * c1.r;

  const tangentLines: { A: number; B: number; C: number; eq: string }[] = [];
  if (tangentVerdict === 'on') {
    const A = dxT;
    const B = dyT;
    const C = -(A * tangentP.x + B * tangentP.y);
    tangentLines.push({ A, B, C, eq: formatLineEquation(A, B, C) });
  } else if (tangentVerdict === 'outside') {
    if (Math.abs(Math.abs(t_dx) - c1.r) < eps) {
      tangentLines.push({ A: 1, B: 0, C: -tangentP.x, eq: `x = ${formatNum(tangentP.x)}` });
    }
    const delta = quad_b * quad_b - 4 * quad_a * quad_c;
    if (Math.abs(quad_a) > 1e-7 && delta >= -1e-9) {
      const sqrtDelta = Math.sqrt(Math.max(0, delta));
      const k1 = (-quad_b + sqrtDelta) / (2 * quad_a);
      const k2 = (-quad_b - sqrtDelta) / (2 * quad_a);

      tangentLines.push({
        A: k1,
        B: -1,
        C: tangentP.y - k1 * tangentP.x,
        eq: formatLineEquation(k1, -1, tangentP.y - k1 * tangentP.x),
      });

      if (Math.abs(k1 - k2) > 1e-5 && tangentLines.length < 2) {
        tangentLines.push({
          A: k2,
          B: -1,
          C: tangentP.y - k2 * tangentP.x,
          eq: formatLineEquation(k2, -1, tangentP.y - k2 * tangentP.x),
        });
      }
    }
  }

  // Chord of contact (切点弦方程): (x1 - x0)(x - x0) + (y1 - y0)(y - y0) = r^2
  const chordOfContactA = dxT;
  const chordOfContactB = dyT;
  const chordOfContactC = -(chordOfContactA * tangentP.x + chordOfContactB * tangentP.y - (distSqT - c1.r * c1.r));
  const chordOfContactEq = formatLineEquation(chordOfContactA, chordOfContactB, -(chordOfContactA * c1.x0 + chordOfContactB * c1.y0 + c1.r * c1.r));

  // --- MODEL 2: POINT VS CIRCLE & EXTREMA ---
  const ptDx = pointP.x - c1.x0;
  const ptDy = pointP.y - c1.y0;
  const ptDistSq = ptDx * ptDx + ptDy * ptDy;
  const ptDist = Math.sqrt(ptDistSq);

  let pointRelation = 'outside';
  let ptMinDist = 0;
  let ptMaxDist = 0;
  if (Math.abs(ptDist - c1.r) < eps) {
    pointRelation = 'on';
    ptMinDist = 0;
    ptMaxDist = 2 * c1.r;
  } else if (ptDist < c1.r) {
    pointRelation = 'inside';
    ptMinDist = c1.r - ptDist;
    ptMaxDist = c1.r + ptDist;
  } else {
    pointRelation = 'outside';
    ptMinDist = ptDist - c1.r;
    ptMaxDist = ptDist + c1.r;
  }

  const ptUnitX = ptDist > 1e-9 ? ptDx / ptDist : 1;
  const ptUnitY = ptDist > 1e-9 ? ptDy / ptDist : 0;
  const closestPoint = {
    x: c1.x0 + c1.r * ptUnitX,
    y: c1.y0 + c1.r * ptUnitY,
  };
  const farthestPoint = {
    x: c1.x0 - c1.r * ptUnitX,
    y: c1.y0 - c1.r * ptUnitY,
  };

  // --- MODEL 3: TWO CIRCLES POSITIONAL RELATION ---
  const cDistX = c2.x0 - c1.x0;
  const cDistY = c2.y0 - c1.y0;
  const centerDistanceSq = cDistX * cDistX + cDistY * cDistY;
  const centerDistance = Math.sqrt(centerDistanceSq);

  const rSum = c1.r + c2.r;
  const rDiff = Math.abs(c1.r - c2.r);

  let twoCirclesRelation: 'exterior' | 'externallyTangent' | 'secant' | 'internallyTangent' | 'interior' = 'secant';
  let relationName = '';

  if (centerDistance > rSum + eps) {
    twoCirclesRelation = 'exterior';
    relationName = lang === 'zh' ? '外离 (4条公切线)' : 'Exterior / Disjoint (4 Common Tangents)';
  } else if (Math.abs(centerDistance - rSum) <= eps) {
    twoCirclesRelation = 'externallyTangent';
    relationName = lang === 'zh' ? '外切 (3条公切线)' : 'Externally Tangent (3 Common Tangents)';
  } else if (centerDistance > rDiff + eps && centerDistance < rSum - eps) {
    twoCirclesRelation = 'secant';
    relationName = lang === 'zh' ? '相交 (2条公切线，存在公共弦)' : 'Intersecting / Secant (2 Common Tangents)';
  } else if (Math.abs(centerDistance - rDiff) <= eps && centerDistance > eps) {
    twoCirclesRelation = 'internallyTangent';
    relationName = lang === 'zh' ? '内切 (1条公切线)' : 'Internally Tangent (1 Common Tangent)';
  } else {
    twoCirclesRelation = 'interior';
    relationName = lang === 'zh' ? '内含 (0条公切线)' : 'Interior / Concentric (0 Common Tangents)';
  }

  // Radical Axis / Common Chord Line: C1 - C2 = 0
  const radA = 2 * (c2.x0 - c1.x0);
  const radB = 2 * (c2.y0 - c1.y0);
  const radC =
    c1.x0 * c1.x0 +
    c1.y0 * c1.y0 -
    c1.r * c1.r -
    (c2.x0 * c2.x0 + c2.y0 * c2.y0 - c2.r * c2.r);
  const commonChordEq = formatLineEquation(radA, radB, radC);

  let commonChordLength: number | null = null;
  let commonChordRadicalLatex = '';
  if (twoCirclesRelation === 'secant' && centerDistance > 1e-9) {
    const d1 = Math.abs(radA * c1.x0 + radB * c1.y0 + radC) / Math.sqrt(radA * radA + radB * radB);
    const halfSq = Math.max(0, c1.r * c1.r - d1 * d1);
    commonChordLength = 2 * Math.sqrt(halfSq);
    const chordFactored = factorSqrt(Math.round(4 * halfSq * 100));
    commonChordRadicalLatex = makeExactRadical(chordFactored.outside, chordFactored.inside, 10).latex;
  }

  // --- MODEL 4: MIDPOINT CHORD & POINT DIFFERENCE METHOD ---
  const mDx = chordM.x - c1.x0;
  const mDy = chordM.y - c1.y0;
  const mDistSq = mDx * mDx + mDy * mDy;
  const isMInside = mDistSq < c1.r * c1.r - eps;

  const chordA = mDx;
  const chordB = mDy;
  const chordC = -(chordA * chordM.x + chordB * chordM.y);
  const midpointChordEq = formatLineEquation(chordA, chordB, chordC);
  const midpointChordLength = isMInside ? 2 * Math.sqrt(c1.r * c1.r - mDistSq) : 0;
  const midChordExact = isMInside
    ? makeExactRadical(2, Math.round(c1.r * c1.r - mDistSq), 1)
    : null;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-sky-600 shrink-0" />
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">{t.toolboxTitle}</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{t.toolboxSub}</p>
        </div>

        {/* Toolbox Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md text-xs sm:text-sm overflow-x-auto">
          <button
            onClick={() => setActiveTab('tangent')}
            className={`px-3 py-1.5 font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'tangent' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>{lang === 'zh' ? '切线方程' : 'Tangents'}</span>
          </button>
          <button
            onClick={() => setActiveTab('point')}
            className={`px-3 py-1.5 font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'point' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CircleDot className="w-3.5 h-3.5" />
            <span>{lang === 'zh' ? '点与圆及最值' : 'Point vs Circle'}</span>
          </button>
          <button
            onClick={() => setActiveTab('twoCircles')}
            className={`px-3 py-1.5 font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'twoCircles' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{lang === 'zh' ? '两圆位置关系' : 'Two Circles'}</span>
          </button>
          <button
            onClick={() => setActiveTab('midpoint')}
            className={`px-3 py-1.5 font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'midpoint' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span>{lang === 'zh' ? '中点弦·点差法' : 'Midpoint Chord'}</span>
          </button>
        </div>
      </div>

      {/* Reference Circle Quick Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">
            {lang === 'zh' ? '基准圆 C₁' : 'Reference Circle C₁'}:
          </span>
          <MathView math={formatCircleStandard(c1.x0, c1.y0, c1.r)} className="font-mono" />
        </div>
        <div className="flex items-center gap-3 text-slate-600 font-mono text-xs">
          <span>O({formatNum(c1.x0)}, {formatNum(c1.y0)})</span>
          <span>R = {formatNum(c1.r)}</span>
        </div>
      </div>

      {/* TAB 1: TANGENT SOLVER */}
      {activeTab === 'tangent' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                {t.toolTangentTitle}
              </h3>
              <p className="text-xs text-slate-500">{t.toolTangentDesc}</p>
            </div>
            {/* Point P Input */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="font-semibold text-slate-700">P(x₁, y₁):</span>
              <input
                type="number"
                step="any"
                value={tangentP.x}
                onChange={(e) => setTangentP((prev) => ({ ...prev, x: parseFloat(e.target.value) || 0 }))}
                className="w-16 px-2 py-1 text-center font-mono border border-slate-200 rounded"
              />
              <input
                type="number"
                step="any"
                value={tangentP.y}
                onChange={(e) => setTangentP((prev) => ({ ...prev, y: parseFloat(e.target.value) || 0 }))}
                className="w-16 px-2 py-1 text-center font-mono border border-slate-200 rounded"
              />
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Card: Verdict & Tangent Lines */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">
                  {lang === 'zh' ? '点 P 与圆的位置判定' : 'Point P Position Verdict'}:
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    tangentVerdict === 'on'
                      ? 'bg-amber-100 text-amber-800'
                      : tangentVerdict === 'outside'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {tangentVerdict === 'on'
                    ? lang === 'zh' ? '在圆上 (恰有 1 条切线)' : 'On Circle (1 Tangent)'
                    : tangentVerdict === 'outside'
                    ? lang === 'zh' ? '在圆外 (恰有 2 条切线)' : 'Outside Circle (2 Tangents)'
                    : lang === 'zh' ? '在圆内 (无实切线)' : 'Inside Circle (No Tangents)'}
                </span>
              </div>

              {tangentVerdict === 'inside' ? (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800">
                  {lang === 'zh'
                    ? '点 P 在圆的内部，无法向圆引出任何实切线。'
                    : 'Point P is strictly inside the circle; no real tangent lines can be drawn.'}
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-800 block">
                    {lang === 'zh' ? '求得的切线方程：' : 'Solved Tangent Line Equations:'}
                  </span>
                  {tangentLines.map((line, idx) => (
                    <div key={idx} className="bg-white p-2.5 rounded border border-slate-200 font-mono text-sm font-semibold text-slate-900 flex items-center justify-between">
                      <span>{lang === 'zh' ? `切线 l${idx + 1}` : `Tangent Line ${idx + 1}`}:</span>
                      <MathView math={line.eq} />
                    </div>
                  ))}
                  {tangentVerdict === 'outside' && radTanSeg && (
                    <div className="pt-2 text-xs text-slate-600 flex items-center justify-between border-t border-slate-200">
                      <span>{lang === 'zh' ? '切线长 (PT)：' : 'Tangent Segment Length:'}</span>
                      <span className="font-mono font-semibold text-slate-900">
                        <MathView math={`|PT| = ${radTanSeg.latex} \\approx ${tangentSegLength.toFixed(3)}`} />
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Card: Chord of Contact & Formula Breakdown */}
            <div className="p-4 bg-sky-50/50 border border-sky-100 rounded-lg space-y-3">
              <span className="text-xs font-semibold text-sky-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>{lang === 'zh' ? '切点弦方程 (高考秒杀模型)' : 'Chord of Contact (Polar Line)'}</span>
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'zh'
                  ? '过圆外一点 P(x₁, y₁) 作圆的切线，切点分别为 A, B。切点弦 AB 的直线方程可由「点代入公式」直接秒出：'
                  : 'When two tangents are drawn from P(x₁, y₁) to the circle, the line passing through both contact points (chord of contact) is given by:'}
              </p>
              <div className="bg-white p-2.5 rounded border border-sky-200 text-center font-mono text-sm">
                <MathView math="(x_1 - x_0)(x - x_0) + (y_1 - y_0)(y - y_0) = R^2" block />
              </div>
              <div className="text-xs text-slate-700 flex items-center justify-between">
                <span>{lang === 'zh' ? '当前切点弦方程：' : 'Evaluated Chord of Contact:'}</span>
                <MathView math={chordOfContactEq} className="font-semibold text-sky-950 font-mono" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: POINT VS CIRCLE */}
      {activeTab === 'point' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                {t.toolPointCircleTitle}
              </h3>
              <p className="text-xs text-slate-500">{t.toolPointCircleDesc}</p>
            </div>
            {/* Point P Input */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="font-semibold text-slate-700">P(x, y):</span>
              <input
                type="number"
                step="any"
                value={pointP.x}
                onChange={(e) => setPointP((prev) => ({ ...prev, x: parseFloat(e.target.value) || 0 }))}
                className="w-16 px-2 py-1 text-center font-mono border border-slate-200 rounded"
              />
              <input
                type="number"
                step="any"
                value={pointP.y}
                onChange={(e) => setPointP((prev) => ({ ...prev, y: parseFloat(e.target.value) || 0 }))}
                className="w-16 px-2 py-1 text-center font-mono border border-slate-200 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
              <span className="text-xs text-slate-500 block">{lang === 'zh' ? '点心距 |OP|' : 'Distance |OP|'}</span>
              <div className="text-lg font-bold font-mono text-slate-900">
                {ptDist.toFixed(3)}
              </div>
              <span className="text-xs text-slate-500">
                {lang === 'zh' ? '半径 R =' : 'Radius R ='} {formatNum(c1.r)}
              </span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
              <span className="text-xs text-slate-500 block">{lang === 'zh' ? '最短距离 d_min' : 'Min Distance d_min'}</span>
              <div className="text-lg font-bold font-mono text-emerald-700">
                {ptMinDist.toFixed(3)}
              </div>
              <span className="text-xs text-slate-500">
                {pointRelation === 'outside' ? '|OP| - R' : pointRelation === 'inside' ? 'R - |OP|' : '0 (On Circle)'}
              </span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
              <span className="text-xs text-slate-500 block">{lang === 'zh' ? '最大距离 d_max' : 'Max Distance d_max'}</span>
              <div className="text-lg font-bold font-mono text-indigo-700">
                {ptMaxDist.toFixed(3)}
              </div>
              <span className="text-xs text-slate-500">
                {pointRelation === 'inside' ? 'R + |OP|' : '|OP| + R'}
              </span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm space-y-2">
            <span className="font-semibold text-slate-900">
              {lang === 'zh' ? '圆上最值对应点坐标：' : 'Coordinates of Extrema Points on Circle:'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-white p-3 rounded border border-slate-200 font-mono">
                <span className="text-slate-500 text-xs block mb-1">
                  {lang === 'zh' ? '最近点 P_min：' : 'Closest Point P_min:'}
                </span>
                <MathView math={`(${formatNum(closestPoint.x)}, ${formatNum(closestPoint.y)})`} />
              </div>
              <div className="bg-white p-3 rounded border border-slate-200 font-mono">
                <span className="text-slate-500 text-xs block mb-1">
                  {lang === 'zh' ? '最远点 P_max：' : 'Farthest Point P_max:'}
                </span>
                <MathView math={`(${formatNum(farthestPoint.x)}, ${formatNum(farthestPoint.y)})`} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TWO CIRCLES POSITIONAL RELATION */}
      {activeTab === 'twoCircles' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                {t.toolTwoCirclesTitle}
              </h3>
              <p className="text-xs text-slate-500">{t.toolTwoCirclesDesc}</p>
            </div>
            {/* Circle 2 Input */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <span className="font-semibold text-slate-700">C₂ (x₀, y₀, R):</span>
              <input
                type="number"
                step="any"
                value={c2.x0}
                onChange={(e) => setC2((prev) => ({ ...prev, x0: parseFloat(e.target.value) || 0 }))}
                className="w-14 px-2 py-1 text-center font-mono border border-slate-200 rounded"
              />
              <input
                type="number"
                step="any"
                value={c2.y0}
                onChange={(e) => setC2((prev) => ({ ...prev, y0: parseFloat(e.target.value) || 0 }))}
                className="w-14 px-2 py-1 text-center font-mono border border-slate-200 rounded"
              />
              <input
                type="number"
                step="any"
                min="0.1"
                value={c2.r}
                onChange={(e) => setC2((prev) => ({ ...prev, r: Math.max(0.1, parseFloat(e.target.value) || 0.1) }))}
                className="w-14 px-2 py-1 text-center font-mono border border-slate-200 rounded"
              />
            </div>
          </div>

          {/* Relation Overview */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{relationName}</span>
              </div>
              <div className="text-xs font-mono text-slate-600">
                d = {centerDistance.toFixed(3)}, R₁ + R₂ = {rSum.toFixed(2)}, |R₁ - R₂| = {rDiff.toFixed(2)}
              </div>
            </div>

            {/* Radical Axis / Common Chord */}
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-semibold text-slate-800">
                  {twoCirclesRelation === 'secant'
                    ? lang === 'zh' ? '两圆公共弦所在直线方程 (相减消二次项)：' : 'Common Chord Line Equation (C₁ - C₂ = 0):'
                    : lang === 'zh' ? '根轴方程 (Radical Axis)：' : 'Radical Axis Equation:'}
                </span>
                <MathView math={commonChordEq} className="font-mono font-bold text-slate-900" />
              </div>

              {twoCirclesRelation === 'secant' && commonChordLength !== null && (
                <div className="flex items-center justify-between text-xs sm:text-sm bg-white p-2.5 rounded border border-slate-200">
                  <span className="text-slate-600 font-medium">
                    {lang === 'zh' ? '公共弦长 L：' : 'Common Chord Length L:'}
                  </span>
                  <div className="font-mono font-bold text-sky-800">
                    <MathView math={`L = ${commonChordRadicalLatex || commonChordLength.toFixed(3)} \\approx ${commonChordLength.toFixed(3)}`} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MIDPOINT CHORD & POINT DIFFERENCE METHOD */}
      {activeTab === 'midpoint' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                {t.toolMidpointChordTitle}
              </h3>
              <p className="text-xs text-slate-500">{t.toolMidpointChordDesc}</p>
            </div>
            {/* Midpoint M Input */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="font-semibold text-slate-700">M(x_m, y_m):</span>
              <input
                type="number"
                step="any"
                value={chordM.x}
                onChange={(e) => setChordM((prev) => ({ ...prev, x: parseFloat(e.target.value) || 0 }))}
                className="w-16 px-2 py-1 text-center font-mono border border-slate-200 rounded"
              />
              <input
                type="number"
                step="any"
                value={chordM.y}
                onChange={(e) => setChordM((prev) => ({ ...prev, y: parseFloat(e.target.value) || 0 }))}
                className="w-16 px-2 py-1 text-center font-mono border border-slate-200 rounded"
              />
            </div>
          </div>

          {!isMInside ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-xs sm:text-sm text-rose-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">
                  {lang === 'zh' ? '注意：点 M 不在圆的内部' : 'Warning: Point M is not strictly inside circle'}
                </span>
                {lang === 'zh'
                  ? '弦的中点必须严格位于圆的内部（|OM| < R）。当前点 M 位于圆上或圆外，无法构成以此为中点的割线弦。'
                  : 'The midpoint of a chord must be strictly inside the circle (|OM| < R).'}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">
                    {lang === 'zh' ? '点差法求得弦所在直线方程：' : 'Solved Chord Line Equation via Point Difference:'}
                  </span>
                  <MathView math={midpointChordEq} className="font-mono font-bold text-base text-slate-900" />
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>{lang === 'zh' ? '弦长 L = 2√(R² - |OM|²)：' : 'Chord Length L = 2√(R² - |OM|²):'}</span>
                  <span className="font-mono font-bold text-slate-900">
                    <MathView math={midChordExact ? `L = ${midChordExact.latex} \\approx ${midpointChordLength.toFixed(3)}` : `L = ${midpointChordLength.toFixed(3)}`} />
                  </span>
                </div>
              </div>

              {/* Point Difference Method Theoretical Breakdown */}
              <div className="p-4 bg-sky-50/50 border border-sky-100 rounded-lg space-y-2 text-xs sm:text-sm">
                <span className="font-semibold text-sky-900 block">
                  {lang === 'zh' ? '「点差法」考场标准规范答题推导步骤：' : 'Point Difference Method (点差法) Derivation:'}
                </span>
                <div className="space-y-1.5 text-slate-600 leading-relaxed font-mono text-xs">
                  <div>
                    1. 设弦两端点 A(x₁, y₁), B(x₂, y₂) 在圆上：(x₁ - x₀)² + (y₁ - y₀)² = R²，(x₂ - x₀)² + (y₂ - y₀)² = R²
                  </div>
                  <div>
                    2. 两式相减：(x₁ - x₂)(x₁ + x₂ - 2x₀) + (y₁ - y₂)(y₁ + y₂ - 2y₀) = 0
                  </div>
                  <div>
                    3. 代入中点坐标 x₁ + x₂ = 2x_m, y₁ + y₂ = 2y_m：(x₁ - x₂)(x_m - x₀) + (y₁ - y₂)(y_m - y₀) = 0
                  </div>
                  <div className="text-slate-900 font-semibold">
                    4. 得斜率关系：k_AB · k_OM = -1 (即 OM 垂直于弦 AB)！
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
