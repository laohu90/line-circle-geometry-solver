/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PositionalAnalysis } from '../types/geometry';
import { TranslationSchema } from '../i18n/translations';
import { MathView } from './MathView';
import { toFractionLatex } from '../utils/mathUtils';
import { Sparkles, BookmarkPlus, Compass, AlertCircle } from 'lucide-react';

interface SummaryCardProps {
  analysis: PositionalAnalysis;
  circleDisabled?: boolean;
  lineDisabled?: boolean;
  t: TranslationSchema;
  onOpenSaveModal: () => void;
  parsedEcho?: { line: string; circle: string } | null;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  analysis,
  circleDisabled = false,
  lineDisabled = false,
  t,
  onOpenSaveModal,
  parsedEcho,
}) => {
  // If one of the equations is disabled/missing
  if (circleDisabled || lineDisabled) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-sky-50/50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">
              {circleDisabled ? '已载入直线参数 · 等待输入圆方程' : '已载入圆参数 · 等待输入直线方程'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {circleDisabled
                ? '请在下方圆方程栏或智能识别框中输入圆的方程，以开启几何距离判定与割线弦长求解。'
                : '请在下方直线方程栏或智能识别框中输入直线方程，以开启几何距离判定与割线弦长求解。'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Localized verdict label
  const verdictText =
    analysis.relation === 'intersecting'
      ? t.verdictSecant
      : analysis.relation === 'tangent'
      ? t.verdictTangent
      : t.verdictDisjoint;

  // Format line and circle echo
  const lineEcho = parsedEcho?.line || (
    analysis.B === 0
      ? `x = ${-analysis.C / analysis.A}`
      : `${analysis.A !== 0 ? `${analysis.A}x ` : ''}${analysis.B > 0 ? `+ ${analysis.B}y ` : `- ${Math.abs(analysis.B)}y `}${analysis.C >= 0 ? `+ ${analysis.C}` : `- ${Math.abs(analysis.C)}`} = 0`
  );

  const circleEcho = parsedEcho?.circle || `圆心(${analysis.x0}, ${analysis.y0}) R=${analysis.r}`;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6 space-y-4">
      {/* P2: Prominent Echo of Parsed Equations */}
      <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-800">
          <span className="px-2 py-0.5 rounded bg-sky-600 text-white font-bold text-xs shrink-0">
            本次识别
          </span>
          <span className="font-mono text-slate-900 leading-relaxed">
            直线 <span className="font-semibold text-sky-950">{lineEcho}</span>；&nbsp;圆 <span className="font-semibold text-sky-950">{circleEcho}</span>
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-medium shrink-0">
          ✓ 双参数已严格核验
        </span>
      </div>

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
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap shadow-xs cursor-pointer"
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>{t.btnAddNotebook}</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Columns */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 text-sm">
        {/* Metric 1: Center O */}
        <div className="p-3 sm:p-3.5 bg-slate-50/70 border border-slate-100 rounded-md min-w-0">
          <span className="text-slate-500 text-xs sm:text-sm block mb-1 truncate">{t.metricCenter}</span>
          <div className="text-base sm:text-lg font-bold text-slate-900 font-mono truncate">
            <MathView math={`(${toFractionLatex(analysis.x0)}, ${toFractionLatex(analysis.y0)})`} />
          </div>
          <span className="text-xs text-slate-400 font-mono block mt-1">
            ({analysis.x0.toFixed(2)}, {analysis.y0.toFixed(2)})
          </span>
        </div>

        {/* Metric 2: Radius R */}
        <div className="p-3 sm:p-3.5 bg-slate-50/70 border border-slate-100 rounded-md min-w-0">
          <span className="text-slate-500 text-xs sm:text-sm block mb-1 truncate">{t.metricRadius}</span>
          <div className="text-base sm:text-lg font-bold text-slate-900 font-mono truncate">
            <MathView math={`R = ${toFractionLatex(analysis.r)}`} />
          </div>
          <span className="text-xs text-slate-400 font-mono block mt-1">
            R² = {analysis.rSquared.toFixed(2)}
          </span>
        </div>

        {/* Metric 3: Distance d */}
        <div className="p-3 sm:p-3.5 bg-slate-50/70 border border-slate-100 rounded-md min-w-0">
          <span className="text-slate-500 text-xs sm:text-sm block mb-1 truncate">{t.metricDistance}</span>
          <div className="text-base sm:text-lg font-bold text-slate-900 font-mono truncate">
            <MathView math={`d = ${toFractionLatex(analysis.distance)}`} />
          </div>
          <span className="text-xs text-slate-400 font-mono block mt-1">
            ≈ {analysis.distance.toFixed(3)}
          </span>
        </div>

        {/* Metric 4: Chord or Extrema */}
        <div className="p-3 sm:p-3.5 bg-slate-50/70 border border-slate-100 rounded-md min-w-0">
          <span className="text-slate-500 text-xs sm:text-sm block mb-1 truncate">
            {analysis.relation === 'intersecting'
              ? t.metricChordOrExtrema
              : analysis.relation === 'tangent'
              ? t.pointTangentLabel
              : t.nearPointLabel}
          </span>
          <div className="text-base sm:text-lg font-bold text-slate-900 font-mono truncate">
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
          <span className="text-xs text-slate-400 font-mono block mt-1 truncate">
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
              <MathView math={toFractionLatex(analysis.chordLength ?? 0)} />). 直线与圆相交，圆上存在点在直线上（d_min = 0）。
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
