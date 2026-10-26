/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PositionalAnalysis } from '../types/geometry';
import { TranslationSchema, SupportedLanguage } from '../i18n/translations';
import { MathView } from './MathView';
import { toFractionLatex } from '../utils/mathUtils';
import { Copy, Check, Sparkles, BookOpen } from 'lucide-react';

interface DetailedStepsProps {
  analysis: PositionalAnalysis;
  circleType: 'general' | 'standard';
  t: TranslationSchema;
  lang: SupportedLanguage;
}

export const DetailedSteps: React.FC<DetailedStepsProps> = ({ analysis, circleType, t }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'square' | 'distance' | 'chord' | 'algebraic'>('all');
  const [copied, setCopied] = useState(false);

  // Copy full solution markdown/text
  const handleCopySolution = () => {
    const text = `
[${t.appName}]
1. Circle Analysis:
   Center O(${analysis.x0}, ${analysis.y0}), Radius R = ${analysis.r.toFixed(3)} (R^2 = ${analysis.rSquared.toFixed(2)})
2. General Line Equation:
   ${analysis.A}x + ${analysis.B}y + ${analysis.C} = 0
3. Distance from Center to Line:
   d = |${analysis.A}(${analysis.x0}) + ${analysis.B}(${analysis.y0}) + ${analysis.C}| / sqrt(${analysis.A}^2 + ${analysis.B}^2) = ${analysis.distance.toFixed(3)}
4. Positional Verdict:
   ${analysis.relationSummary}
${analysis.relation === 'intersecting' ? `5. Chord Length:\n   L = 2 * sqrt(R^2 - d^2) = ${analysis.chordLength?.toFixed(3)}` : ''}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6">
      {/* Header with Title and Copy */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-600 shrink-0" />
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">{t.stepsHeader}</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.stepsSub}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Sub-tabs for filtering steps */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md text-xs sm:text-sm overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 font-medium rounded transition-colors whitespace-nowrap ${
                activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.tabAllSteps}
            </button>
            <button
              onClick={() => setActiveTab('square')}
              className={`px-3 py-1 font-medium rounded transition-colors whitespace-nowrap ${
                activeTab === 'square' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.tabSquareStep}
            </button>
            <button
              onClick={() => setActiveTab('chord')}
              className={`px-3 py-1 font-medium rounded transition-colors whitespace-nowrap ${
                activeTab === 'chord' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.tabChordStep}
            </button>
          </div>

          <button
            onClick={handleCopySolution}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? t.btnCopied : t.btnCopySolution}</span>
          </button>
        </div>
      </div>

      {/* Steps Content */}
      <div className="divide-y divide-slate-100 text-sm">
        {/* SECTION 1: Completing the Square */}
        {(activeTab === 'all' || activeTab === 'square') && (
          <section className="py-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs flex items-center justify-center font-bold shrink-0">
                  1
                </span>
                <span>{t.tabSquareStep}</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {circleType === 'general' ? 'General → Standard' : 'Standard Check'}
              </span>
            </div>

            {analysis.completeSquareSteps.map((step, idx) => (
              <div key={idx} className="bg-slate-50/70 border border-slate-100 rounded-lg p-4 space-y-2">
                <div className="text-xs sm:text-sm font-semibold text-slate-800">{step.title}</div>
                <div className="bg-white border border-slate-200 rounded-md p-3.5 overflow-x-auto text-center">
                  <MathView math={step.latex} block />
                </div>
                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.explanation}</div>
              </div>
            ))}

            {/* Core result highlight card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-sky-50/40 border border-sky-100 rounded-lg text-xs sm:text-sm">
              <div>
                <span className="text-slate-500 block mb-0.5">{t.metricCenter}:</span>
                <div className="font-semibold text-slate-900 font-mono text-base">
                  <MathView math={`(${toFractionLatex(analysis.x0)}, ${toFractionLatex(analysis.y0)})`} />
                </div>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">{t.metricRadius}:</span>
                <div className="font-semibold text-slate-900 font-mono text-base">
                  <MathView math={`R = ${toFractionLatex(analysis.r)}`} />
                  <span className="text-slate-400 text-xs ml-1.5">({analysis.r.toFixed(3)})</span>
                </div>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">R²:</span>
                <div className="font-semibold text-slate-900 font-mono text-base">
                  <MathView math={`R^2 = ${toFractionLatex(analysis.rSquared)}`} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 2: Line Equation & Distance d Calculation */}
        {(activeTab === 'all' || activeTab === 'distance') && (
          <section className="py-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs flex items-center justify-center font-bold shrink-0">
                  2
                </span>
                <span>{t.step5Title}</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                Ax + By + C = 0
              </span>
            </div>

            <div className="space-y-3">
              <div className="text-xs sm:text-sm text-slate-600">
                {t.currentLineEquation}
                <MathView
                  math={`${toFractionLatex(analysis.A)}x + ${toFractionLatex(analysis.B)}y + ${toFractionLatex(analysis.C)} = 0`}
                  className="mx-1.5 font-semibold"
                />
                , {t.metricCenter} =
                <MathView
                  math={`O(${toFractionLatex(analysis.x0)}, ${toFractionLatex(analysis.y0)})`}
                  className="mx-1.5 font-semibold"
                />
                .
              </div>

              {/* Point to line formula card */}
              <div className="bg-slate-50/70 border border-slate-100 rounded-lg p-4 space-y-2">
                <div className="text-xs sm:text-sm font-semibold text-slate-800">{t.step5Desc}</div>
                <div className="bg-white border border-slate-200 rounded-md p-3.5 overflow-x-auto text-center space-y-2">
                  <MathView math={`d = \\frac{|Ax_0 + By_0 + C|}{\\sqrt{A^2 + B^2}}`} block />
                  <MathView math={`d = ${analysis.distanceFractionLatex}`} block />
                  <MathView
                    math={`d = ${toFractionLatex(analysis.distance)} \\approx ${analysis.distance.toFixed(4)}`}
                    block
                  />
                </div>
                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  分子为绝对值代入结果，分母为法向量模长
                  <MathView math="\sqrt{A^2+B^2}" className="mx-1" />
                  。
                </div>
              </div>

              {/* Perpendicular Foot Coordinates */}
              <div className="p-3.5 bg-amber-50/40 border border-amber-100 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
                <div>
                  <span className="font-semibold text-amber-900">{t.pointFootLabel} (Chord Midpoint M):</span>
                  <div className="text-slate-600 mt-0.5">
                    Foot of perpendicular from center onto line:
                  </div>
                </div>
                <div className="font-mono font-semibold text-slate-900 text-base">
                  <MathView
                    math={`H(${toFractionLatex(analysis.footH.x)}, ${toFractionLatex(analysis.footH.y)})`}
                  />
                  <span className="text-slate-400 text-xs ml-1.5">
                    ({analysis.footH.x.toFixed(2)}, {analysis.footH.y.toFixed(2)})
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 3: Positional Verdict Decision */}
        {activeTab === 'all' && (
          <section className="py-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs flex items-center justify-center font-bold shrink-0">
                  3
                </span>
                <span>{t.step6Title}</span>
              </h3>
            </div>

            {/* Position decision matrix card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div
                className={`p-4 rounded-lg border transition-all ${
                  analysis.relation === 'intersecting'
                    ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-300'
                    : 'bg-white border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-emerald-800">{t.verdictSecant}</span>
                  <span className="text-xs font-mono text-emerald-700 font-semibold">d &lt; R</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.verdictSecantDesc}
                </p>
                {analysis.relation === 'intersecting' && (
                  <div className="mt-2.5 pt-2 border-t border-emerald-200 text-xs sm:text-sm font-semibold text-emerald-700 flex items-center gap-1.5">
                    <Check className="w-4 h-4 shrink-0" /> {t.verdictSecant}
                  </div>
                )}
              </div>

              <div
                className={`p-4 rounded-lg border transition-all ${
                  analysis.relation === 'tangent'
                    ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-300'
                    : 'bg-white border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-amber-800">{t.verdictTangent}</span>
                  <span className="text-xs font-mono text-amber-700 font-semibold">d = R</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.verdictTangentDesc}
                </p>
                {analysis.relation === 'tangent' && (
                  <div className="mt-2.5 pt-2 border-t border-amber-200 text-xs sm:text-sm font-semibold text-amber-700 flex items-center gap-1.5">
                    <Check className="w-4 h-4 shrink-0" /> {t.verdictTangent}
                  </div>
                )}
              </div>

              <div
                className={`p-4 rounded-lg border transition-all ${
                  analysis.relation === 'disjoint'
                    ? 'bg-indigo-50/80 border-indigo-300 ring-1 ring-indigo-300'
                    : 'bg-white border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-indigo-800">{t.verdictDisjoint}</span>
                  <span className="text-xs font-mono text-indigo-700 font-semibold">d &gt; R</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.verdictDisjointDesc}
                </p>
                {analysis.relation === 'disjoint' && (
                  <div className="mt-2.5 pt-2 border-t border-indigo-200 text-xs sm:text-sm font-semibold text-indigo-700 flex items-center gap-1.5">
                    <Check className="w-4 h-4 shrink-0" /> {t.verdictDisjoint}
                  </div>
                )}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm leading-relaxed text-slate-700">
              <span className="font-semibold text-slate-900">{t.fastAnswerLabel}: </span>
              {analysis.relationSummary}
            </div>
          </section>
        )}

        {/* SECTION 4: Chord Theorem & Dual Method Comparison */}
        {(activeTab === 'all' || activeTab === 'chord') && analysis.relation === 'intersecting' && (
          <section className="py-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-bold shrink-0">
                  4
                </span>
                <span>{t.tabChordStep}</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Method 1: Geometric Chord Theorem */}
              <div className="border border-emerald-200 bg-emerald-50/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    {t.geometricMethodTitle}
                  </span>
                  <span className="text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-mono font-semibold">
                    {t.geometricMethodBadge}
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.geometricMethodDesc}
                </div>

                <div className="bg-white border border-emerald-200 rounded-md p-3.5 text-center space-y-2">
                  <MathView math={`R^2 = d^2 + \\left(\\frac{L}{2}\\right)^2`} block />
                  <MathView
                    math={`\\frac{L}{2} = \\sqrt{R^2 - d^2} = \\sqrt{${toFractionLatex(analysis.rSquared)} - (${toFractionLatex(analysis.distance)})^2}`}
                    block
                  />
                  <div className="pt-2 border-t border-slate-100">
                    <MathView
                      math={
                        analysis.chordLengthLatex ||
                        `L = 2\\sqrt{R^2 - d^2} = ${toFractionLatex(analysis.chordLength || 0)}`
                      }
                      block
                      className="font-bold text-emerald-800 text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Method 2: Algebraic Elimination & Vieta */}
              <div className="border border-slate-200 bg-white rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    {t.algebraicMethodTitle}
                  </span>
                  <span className="text-xs text-slate-500 font-mono font-medium">
                    {t.algebraicMethodBadge}
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.algebraicMethodDesc}
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 text-center space-y-2">
                  {analysis.quadraticCoeffs && (
                    <>
                      <MathView
                        math={`ax^2 + bx + c = 0 \\implies (${toFractionLatex(analysis.quadraticCoeffs.a)})x^2 + (${toFractionLatex(analysis.quadraticCoeffs.b)})x + (${toFractionLatex(analysis.quadraticCoeffs.c)}) = 0`}
                        block
                      />
                      <MathView
                        math={`\\Delta = b^2 - 4ac = ${toFractionLatex(analysis.algebraicDelta || 0)} > 0`}
                        block
                      />
                      <MathView
                        math={`L = \\sqrt{1 + k^2}|x_1 - x_2| = \\sqrt{1 + k^2}\\frac{\\sqrt{\\Delta}}{|a|} = ${toFractionLatex(analysis.chordLength || 0)}`}
                        block
                        className="font-bold text-slate-900 text-base"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Intersections list */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm space-y-1.5">
              <span className="font-semibold text-slate-900">{t.intersectionCoordsTitle}</span>
              <div className="flex flex-wrap gap-4 pt-1 font-mono text-sm">
                {analysis.intersectionPoints.map((p, i) => (
                  <span key={i} className="text-slate-800">
                    {i === 0 ? 'Point A: ' : 'Point B: '}
                    <MathView math={`(${toFractionLatex(p.x)}, ${toFractionLatex(p.y)})`} />
                    <span className="text-slate-500 text-xs ml-1.5">
                      ({p.x.toFixed(3)}, {p.y.toFixed(3)})
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 5: Extrema & Triangle Properties */}
        {activeTab === 'all' && (
          <section className="py-5 space-y-3">
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold shrink-0">
                5
              </span>
              <span>{t.extremaDistancesTitle}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-lg space-y-1.5">
                <span className="font-semibold text-slate-900">{t.extremaDistancesTitle}</span>
                <p className="text-slate-600 leading-relaxed">
                  d_min = |d - R|, d_max = d + R:
                </p>
                <div className="pt-1.5 space-y-1 font-mono text-sm">
                  <div>
                    {t.nearPointLabel}: <MathView math={`d_{\\min} = ${analysis.minDistLatex}`} />
                  </div>
                  <div>
                    {t.farPointLabel}: <MathView math={`d_{\\max} = ${analysis.maxDistLatex}`} />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-lg space-y-1.5">
                <span className="font-semibold text-slate-900">{t.trianglePropertiesTitle}</span>
                {analysis.relation === 'intersecting' && analysis.chordLength ? (
                  <div className="space-y-1 text-slate-600">
                    <div>
                      {t.metricDistance}: <MathView math={`d = ${toFractionLatex(analysis.distance)}`} />
                    </div>
                    <div>
                      Area of △OAB:
                      <MathView
                        math={`S = \\frac{1}{2} d \\cdot L = ${toFractionLatex(0.5 * analysis.distance * analysis.chordLength)}`}
                      />
                    </div>
                    <div>
                      Subtended Angle θ:
                      <MathView
                        math={`\\theta \\approx ${(
                          (2 * Math.asin((analysis.chordLength / (2 * analysis.r))) * 180) /
                          Math.PI
                        ).toFixed(1)}^\\circ`}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500">
                    Line does not intersect circle; no chord triangle formed.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
