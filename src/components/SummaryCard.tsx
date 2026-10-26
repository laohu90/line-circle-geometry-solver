/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PositionalAnalysis } from '../types/geometry';
import { TranslationSchema } from '../i18n/translations';
import { MathView } from './MathView';
import { toFractionLatex } from '../utils/mathUtils';
import { Sparkles, BookmarkPlus, Compass } from 'lucide-react';

interface SummaryCardProps {
  analysis: PositionalAnalysis;
  t: TranslationSchema;
  onOpenSaveModal: () => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ analysis, t, onOpenSaveModal }) => {
  // Localized verdict label
  const verdictText =
    analysis.relation === 'intersecting'
      ? t.verdictSecant
      : analysis.relation === 'tangent'
      ? t.verdictTangent
      : t.verdictDisjoint;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 space-y-4">
      {/* Top Header & Verdict Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-sky-600 shrink-0" />
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">
              {t.summaryCardTitle}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.summaryCardSub}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Positional Verdict Tag */}
          <div
            className={`px-3 py-1.5 rounded-md font-bold text-xs sm:text-sm flex items-center gap-2 ${
              analysis.relation === 'intersecting'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : analysis.relation === 'tangent'
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                analysis.relation === 'intersecting'
                  ? 'bg-emerald-500'
                  : analysis.relation === 'tangent'
                  ? 'bg-amber-500'
                  : 'bg-indigo-500'
              }`}
            />
            <span className="whitespace-nowrap">{verdictText}</span>
          </div>

          <button
            onClick={onOpenSaveModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap shadow-xs"
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>{t.btnAddNotebook}</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Columns */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 text-sm">
        {/* Metric 1: Center O */}
        <div className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-md">
          <span className="text-slate-500 text-xs sm:text-sm block mb-1">{t.metricCenter}</span>
          <div className="text-base sm:text-lg font-bold text-slate-900 font-mono">
            <MathView math={`(${toFractionLatex(analysis.x0)}, ${toFractionLatex(analysis.y0)})`} />
          </div>
          <span className="text-xs text-slate-400 font-mono block mt-1">
            ({analysis.x0.toFixed(2)}, {analysis.y0.toFixed(2)})
          </span>
        </div>

        {/* Metric 2: Radius R */}
        <div className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-md">
          <span className="text-slate-500 text-xs sm:text-sm block mb-1">{t.metricRadius}</span>
          <div className="text-base sm:text-lg font-bold text-slate-900 font-mono">
            <MathView math={`R = ${toFractionLatex(analysis.r)}`} />
          </div>
          <span className="text-xs text-slate-400 font-mono block mt-1">
            R² = {analysis.rSquared.toFixed(2)}
          </span>
        </div>

        {/* Metric 3: Distance d */}
        <div className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-md">
          <span className="text-slate-500 text-xs sm:text-sm block mb-1">{t.metricDistance}</span>
          <div className="text-base sm:text-lg font-bold text-slate-900 font-mono">
            <MathView math={`d = ${toFractionLatex(analysis.distance)}`} />
          </div>
          <span className="text-xs text-slate-400 font-mono block mt-1">
            ≈ {analysis.distance.toFixed(3)}
          </span>
        </div>

        {/* Metric 4: Chord or Extrema */}
        <div className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-md">
          <span className="text-slate-500 text-xs sm:text-sm block mb-1">
            {analysis.relation === 'intersecting'
              ? t.metricChordOrExtrema
              : analysis.relation === 'tangent'
              ? t.pointTangentLabel
              : t.nearPointLabel}
          </span>
          <div className="text-base sm:text-lg font-bold text-slate-900 font-mono">
            {analysis.relation === 'intersecting' ? (
              <MathView math={`L = ${toFractionLatex(analysis.chordLength ?? 0)}`} />
            ) : analysis.relation === 'tangent' ? (
              <MathView
                math={`(${toFractionLatex(analysis.footH.x)}, ${toFractionLatex(analysis.footH.y)})`}
              />
            ) : (
              <MathView math={`d_{\\min} = ${toFractionLatex(analysis.minDistToLine)}`} />
            )}
          </div>
          <span className="text-xs text-slate-400 font-mono block mt-1">
            {analysis.relation === 'intersecting'
              ? `½ L = ${analysis.halfChordLength?.toFixed(3)}`
              : analysis.relation === 'tangent'
              ? 'd = R'
              : `d_max = ${analysis.maxDistToLine.toFixed(2)}`}
          </span>
        </div>
      </div>

      {/* Quick Verdict Summary Text */}
      <div className="p-3.5 bg-sky-50/50 border border-sky-100 rounded-md text-xs sm:text-sm text-slate-700 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-slate-900">{t.fastAnswerLabel}: </span>
          <span className="ml-1">{analysis.relationSummary}</span>
          {analysis.relation === 'intersecting' && (
            <span className="ml-1 font-mono font-semibold text-emerald-800">
              L = {analysis.chordLength?.toFixed(3)} ({t.exactValueLabel}:{' '}
              <MathView math={toFractionLatex(analysis.chordLength ?? 0)} />).
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
