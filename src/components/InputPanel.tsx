/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CircleInputMode,
  LineInputMode,
  GeneralCircleInput,
  StandardCircleInput,
  GeneralLineInput,
  SlopeInterceptLineInput,
} from '../types/geometry';
import { TranslationSchema, SupportedLanguage } from '../i18n/translations';
import { MathView } from './MathView';
import { Sparkles, RotateCcw, Sliders, Wand2, Check, AlertCircle, Unlock, CircleSlash } from 'lucide-react';
import { PRESET_EXAM_PROBLEMS } from '../data/presetProblems';
import { parseMathEquation } from '../utils/equationParser';
import {
  formatCircleGeneral,
  formatCircleStandard,
  formatLineEquation,
} from '../utils/exactMath';

interface InputPanelProps {
  circleMode: CircleInputMode;
  setCircleMode: (mode: CircleInputMode) => void;
  generalCircle: GeneralCircleInput;
  setGeneralCircle: React.Dispatch<React.SetStateAction<GeneralCircleInput>>;
  standardCircle: StandardCircleInput;
  setStandardCircle: React.Dispatch<React.SetStateAction<StandardCircleInput>>;

  lineMode: LineInputMode;
  setLineMode: (mode: LineInputMode) => void;
  generalLine: GeneralLineInput;
  setGeneralLine: React.Dispatch<React.SetStateAction<GeneralLineInput>>;
  slopeLine: SlopeInterceptLineInput;
  setSlopeLine: React.Dispatch<React.SetStateAction<SlopeInterceptLineInput>>;

  circleDisabled: boolean;
  setCircleDisabled: (disabled: boolean) => void;
  lineDisabled: boolean;
  setLineDisabled: (disabled: boolean) => void;

  t: TranslationSchema;
  lang: SupportedLanguage;
  onSelectPreset: (presetId: string) => void;
  onReset: () => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  circleMode,
  setCircleMode,
  generalCircle,
  setGeneralCircle,
  standardCircle,
  setStandardCircle,
  lineMode,
  setLineMode,
  generalLine,
  setGeneralLine,
  slopeLine,
  setSlopeLine,
  circleDisabled,
  setCircleDisabled,
  lineDisabled,
  setLineDisabled,
  t,
  lang,
  onSelectPreset,
  onReset,
}) => {
  // Quick equation text parser state
  const [rawEquation, setRawEquation] = useState('');
  const [parseFeedback, setParseFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Parameter Exploration Slider Toggle
  const [showSlider, setShowSlider] = useState(false);

  // Sync slope line to general line
  const handleSlopeChange = (newSlope: Partial<SlopeInterceptLineInput>) => {
    setLineDisabled(false);
    const updated = { ...slopeLine, ...newSlope };
    setSlopeLine(updated);
    if (updated.isVertical) {
      setGeneralLine({ A: 1, B: 0, C: -(updated.xVal ?? 0) });
    } else {
      setGeneralLine({ A: updated.k, B: -1, C: updated.b });
    }
  };

  // Bidirectional sync when editing general circle
  const handleGeneralCircleChange = (key: 'D' | 'E' | 'F', val: number) => {
    setCircleDisabled(false);
    const updated = { ...generalCircle, [key]: val };
    setGeneralCircle(updated);
    const discVal = updated.D ** 2 + updated.E ** 2 - 4 * updated.F;
    const x0 = -updated.D / 2;
    const y0 = -updated.E / 2;
    const r = discVal > 0 ? Math.sqrt(discVal) / 2 : 0;
    setStandardCircle({ x0, y0, r });
  };

  // Bidirectional sync when editing standard circle
  const handleStandardCircleChange = (key: 'x0' | 'y0' | 'r', val: number) => {
    setCircleDisabled(false);
    const updated = { ...standardCircle, [key]: val };
    setStandardCircle(updated);
    const D = -2 * updated.x0;
    const E = -2 * updated.y0;
    const F = updated.x0 ** 2 + updated.y0 ** 2 - updated.r ** 2;
    setGeneralCircle({ D, E, F });
  };

  // Quick Parse submission
  const handleQuickParse = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = rawEquation.trim();
    if (!trimmed) {
      setParseFeedback({
        type: 'error',
        msg: lang === 'zh' ? '无法识别此方程，请检查格式' : t.quickParseEmptyError,
      });
      return;
    }

    const res = parseMathEquation(trimmed);
    if (!res || (!res.circle && !res.line)) {
      setParseFeedback({
        type: 'error',
        msg: lang === 'zh' ? '无法识别此方程，请检查格式（支持一般式、标准式、直线方程，分号隔开可同时解析两个）' : t.quickParseError,
      });
      return;
    }

    // Both circle and line are recognized
    if (res.circle && res.line) {
      setCircleDisabled(false);
      setLineDisabled(false);

      if (res.circle.general) setGeneralCircle(res.circle.general);
      if (res.circle.standard) setStandardCircle(res.circle.standard);
      setCircleMode(res.circle.mode);

      if (res.line.mode === 'slopeIntercept' && res.line.slope) {
        setLineMode('slopeIntercept');
        setSlopeLine(res.line.slope);
        if (res.line.general) setGeneralLine(res.line.general);
      } else if (res.line.general) {
        setLineMode('general');
        setGeneralLine(res.line.general);
        if (res.line.slope) setSlopeLine(res.line.slope);
      }

      setParseFeedback({
        type: 'success',
        msg: lang === 'zh'
          ? `已成功识别圆与直线方程并同步参数！`
          : `${t.quickParseSuccess} (${res.matched})`,
      });
    } else if (res.circle && !res.line) {
      // ONLY circle recognized: update circle, reset and gray out line
      setCircleDisabled(false);
      setLineDisabled(true);

      if (res.circle.general) setGeneralCircle(res.circle.general);
      if (res.circle.standard) setStandardCircle(res.circle.standard);
      setCircleMode(res.circle.mode);

      // Reset line parameters to 0
      setGeneralLine({ A: 0, B: 0, C: 0 });
      setSlopeLine({ k: 0, b: 0, isVertical: false });

      setParseFeedback({
        type: 'success',
        msg: lang === 'zh'
          ? `已成功识别圆方程（已自动切换并更新参数）。直线参数已重置置灰，等待输入直线方程。`
          : `Circle equation recognized. Line parameters have been reset.`,
      });
    } else if (!res.circle && res.line) {
      // ONLY line recognized: update line, reset and gray out circle
      setLineDisabled(false);
      setCircleDisabled(true);

      if (res.line.mode === 'slopeIntercept' && res.line.slope) {
        setLineMode('slopeIntercept');
        setSlopeLine(res.line.slope);
        if (res.line.general) setGeneralLine(res.line.general);
      } else if (res.line.general) {
        setLineMode('general');
        setGeneralLine(res.line.general);
        if (res.line.slope) setSlopeLine(res.line.slope);
      }

      // Reset circle parameters to 0
      setGeneralCircle({ D: 0, E: 0, F: 0 });
      setStandardCircle({ x0: 0, y0: 0, r: 0 });

      setParseFeedback({
        type: 'success',
        msg: lang === 'zh'
          ? `已成功识别直线方程。圆参数已重置置灰，等待输入圆方程。`
          : `Line equation recognized. Circle parameters have been reset.`,
      });
    }
  };

  // General circle discriminant check: D^2 + E^2 - 4F
  const disc = generalCircle.D ** 2 + generalCircle.E ** 2 - 4 * generalCircle.F;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6 space-y-5">
      {/* Quick Text Equation Parser (Smart Input like Wolfram/Symbolab) */}
      <div className="space-y-2">
        <form onSubmit={handleQuickParse} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-800">
            <span className="flex items-center gap-1.5">
              <Wand2 className="w-4 h-4 text-sky-600 shrink-0" />
              <span>{t.btnQuickParse}</span>
            </span>
            <button
              type="button"
              onClick={() => setShowSlider(!showSlider)}
              className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded transition-colors ${
                showSlider ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{t.sliderTitle}</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={rawEquation}
              onChange={(e) => {
                setRawEquation(e.target.value);
                if (parseFeedback) setParseFeedback(null);
              }}
              placeholder={lang === 'zh' ? '粘贴方程，如 (x-1)²+(y+2)²=9 或 3x+4y-12=0 (支持分号隔开两个)' : t.quickParsePlaceholder}
              className="flex-1 px-3 py-2 text-xs sm:text-sm text-slate-800 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-sky-500 font-mono min-w-0"
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap shadow-xs shrink-0 cursor-pointer"
            >
              {t.btnQuickParse}
            </button>
          </div>
        </form>

        {/* Feedback message (Error is prominent red under paste box, persists until typing or resolved) */}
        {parseFeedback && (
          <div
            className={`p-2.5 rounded-md text-xs sm:text-sm flex items-start gap-2 ${
              parseFeedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-300'
            }`}
          >
            {parseFeedback.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <span className="leading-snug">{parseFeedback.msg}</span>
          </div>
        )}

        {/* Dynamic Parameter Slider Deck */}
        {showSlider && (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3 text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900">{t.sliderTitle}</span>
              <span className="text-xs text-slate-500 font-mono">Ax + By + C = 0</span>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-600">{t.sliderParamC} (C):</span>
                <span className="font-mono font-bold text-slate-900">{generalLine.C.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="-25"
                max="25"
                step="0.5"
                value={generalLine.C}
                onChange={(e) => {
                  setLineDisabled(false);
                  setGeneralLine((prev) => ({ ...prev, C: parseFloat(e.target.value) }));
                }}
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-600">{t.sliderParamK} (k):</span>
                <span className="font-mono font-bold text-slate-900">{slopeLine.k.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.1"
                value={slopeLine.k}
                onChange={(e) => handleSlopeChange({ k: parseFloat(e.target.value) })}
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      <div className="h-[1px] bg-slate-100" />

      {/* Quick Preset Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-800">
            <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
            <span>{t.presetSectionTitle}</span>
          </div>
          <button
            onClick={() => {
              setCircleDisabled(false);
              setLineDisabled(false);
              onReset();
            }}
            title={t.btnReset}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.btnReset}</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {PRESET_EXAM_PROBLEMS.slice(0, 5).map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setCircleDisabled(false);
                setLineDisabled(false);
                onSelectPreset(preset.id);
              }}
              className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 hover:text-slate-900 transition-colors truncate max-w-full"
            >
              {preset.localizedTitles[lang] || preset.title}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[1px] bg-slate-100" />

      {/* CIRCLE INPUT SECTION */}
      <div className={`space-y-3 transition-opacity ${circleDisabled ? 'opacity-55' : ''}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${circleDisabled ? 'bg-slate-400' : 'bg-blue-600'}`} />
            <span>{t.circleInputHeader}</span>
            {circleDisabled && (
              <span className="text-xs font-normal text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                {lang === 'zh' ? '未输入（已置灰）' : 'Inactive'}
              </span>
            )}
          </label>

          <div className="flex items-center gap-1.5">
            {circleDisabled ? (
              <button
                type="button"
                onClick={() => {
                  setCircleDisabled(false);
                  setGeneralCircle({ D: -4, E: 2, F: -4 });
                  setStandardCircle({ x0: 2, y0: -1, r: 3 });
                }}
                className="flex items-center gap-1 px-2 py-0.5 text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded font-medium transition-colors"
              >
                <Unlock className="w-3 h-3" />
                <span>{lang === 'zh' ? '激活圆参数' : 'Activate'}</span>
              </button>
            ) : null}

            {/* Mode Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md text-xs sm:text-sm overflow-x-auto">
              <button
                onClick={() => {
                  setCircleDisabled(false);
                  setCircleMode('general');
                }}
                className={`px-2.5 py-1 font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                  circleMode === 'general' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                {t.circleGeneralTab}
              </button>
              <button
                onClick={() => {
                  setCircleDisabled(false);
                  setCircleMode('standard');
                }}
                className={`px-2.5 py-1 font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                  circleMode === 'standard' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                {t.circleStandardTab}
              </button>
            </div>
          </div>
        </div>

        {circleMode === 'general' ? (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="min-w-0">
                <label className="block text-xs text-slate-500 mb-1 font-mono">D (x)</label>
                <input
                  type="number"
                  step="any"
                  value={generalCircle.D}
                  onChange={(e) =>
                    handleGeneralCircleChange('D', parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-slate-800 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
              <div className="min-w-0">
                <label className="block text-xs text-slate-500 mb-1 font-mono">E (y)</label>
                <input
                  type="number"
                  step="any"
                  value={generalCircle.E}
                  onChange={(e) =>
                    handleGeneralCircleChange('E', parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-slate-800 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
              <div className="min-w-0">
                <label className="block text-xs text-slate-500 mb-1 font-mono">F</label>
                <input
                  type="number"
                  step="any"
                  value={generalCircle.F}
                  onChange={(e) =>
                    handleGeneralCircleChange('F', parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-slate-800 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
            </div>

            {/* Current general equation preview */}
            <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-md text-xs sm:text-sm">
              <span className="text-slate-500">{t.currentEquation}</span>
              <MathView
                math={formatCircleGeneral(generalCircle.D, generalCircle.E, generalCircle.F)}
                className="font-medium"
              />
            </div>

            {/* General form condition notice (Including D^2+E^2-4F = 0 degenerate point circle) */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 px-1 gap-1">
              <span>{t.conditionCheck} <strong className="font-mono text-slate-800">{disc.toFixed(1)}</strong></span>
              <span
                className={`font-semibold ${
                  disc > 1e-6
                    ? 'text-emerald-700'
                    : Math.abs(disc) <= 1e-6
                    ? 'text-amber-700'
                    : 'text-rose-600'
                }`}
              >
                {disc > 1e-6
                  ? (lang === 'zh' ? '✓ D²+E²-4F > 0（构成有效实圆）' : t.validCircle)
                  : Math.abs(disc) <= 1e-6
                  ? (lang === 'zh' ? '⚠ D²+E²-4F = 0（退化为点圆/单点）' : t.pointCircle)
                  : (lang === 'zh' ? '✗ D²+E²-4F < 0（虚圆，无实数轨迹）' : t.imaginaryCircle)}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="min-w-0">
                <label className="block text-xs text-slate-500 mb-1 font-mono">x₀ (h)</label>
                <input
                  type="number"
                  step="any"
                  value={standardCircle.x0}
                  onChange={(e) =>
                    handleStandardCircleChange('x0', parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-slate-800 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
              <div className="min-w-0">
                <label className="block text-xs text-slate-500 mb-1 font-mono">y₀ (k)</label>
                <input
                  type="number"
                  step="any"
                  value={standardCircle.y0}
                  onChange={(e) =>
                    handleStandardCircleChange('y0', parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-slate-800 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
              <div className="min-w-0">
                <label className="block text-xs text-slate-500 mb-1 font-mono">R (radius)</label>
                <input
                  type="number"
                  step="any"
                  min="0.001"
                  value={standardCircle.r}
                  onChange={(e) =>
                    handleStandardCircleChange(
                      'r',
                      Math.max(0.001, parseFloat(e.target.value) || 0.1)
                    )
                  }
                  className="w-full px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-slate-800 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-md text-xs sm:text-sm">
              <span className="text-slate-500">{t.currentEquation}</span>
              <MathView
                math={formatCircleStandard(standardCircle.x0, standardCircle.y0, standardCircle.r)}
                className="font-medium"
              />
            </div>
          </div>
        )}
      </div>

      <div className="h-[1px] bg-slate-100" />

      {/* LINE INPUT SECTION */}
      <div className={`space-y-3 transition-opacity ${lineDisabled ? 'opacity-55' : ''}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${lineDisabled ? 'bg-slate-400' : 'bg-sky-600'}`} />
            <span>{t.lineInputHeader}</span>
            {lineDisabled && (
              <span className="text-xs font-normal text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                {lang === 'zh' ? '未输入（已置灰）' : 'Inactive'}
              </span>
            )}
          </label>

          <div className="flex items-center gap-1.5">
            {lineDisabled ? (
              <button
                type="button"
                onClick={() => {
                  setLineDisabled(false);
                  setGeneralLine({ A: 3, B: 4, C: -12 });
                  setSlopeLine({ k: -0.75, b: 3, isVertical: false });
                }}
                className="flex items-center gap-1 px-2 py-0.5 text-xs text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded font-medium transition-colors"
              >
                <Unlock className="w-3 h-3" />
                <span>{lang === 'zh' ? '激活直线参数' : 'Activate'}</span>
              </button>
            ) : null}

            {/* Line Mode Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md text-xs sm:text-sm overflow-x-auto">
              <button
                onClick={() => {
                  setLineDisabled(false);
                  setLineMode('general');
                }}
                className={`px-2.5 py-1 font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                  lineMode === 'general' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                {t.lineGeneralTab}
              </button>
              <button
                onClick={() => {
                  setLineDisabled(false);
                  setLineMode('slopeIntercept');
                }}
                className={`px-2.5 py-1 font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                  lineMode === 'slopeIntercept' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                {t.lineSlopeTab}
              </button>
            </div>
          </div>
        </div>

        {lineMode === 'general' ? (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="min-w-0">
                <label className="block text-xs text-slate-500 mb-1 font-mono">A (x)</label>
                <input
                  type="number"
                  step="any"
                  value={generalLine.A}
                  onChange={(e) => {
                    setLineDisabled(false);
                    setGeneralLine((prev) => ({ ...prev, A: parseFloat(e.target.value) || 0 }));
                  }}
                  className="w-full px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-slate-800 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
              <div className="min-w-0">
                <label className="block text-xs text-slate-500 mb-1 font-mono">B (y)</label>
                <input
                  type="number"
                  step="any"
                  value={generalLine.B}
                  onChange={(e) => {
                    setLineDisabled(false);
                    setGeneralLine((prev) => ({ ...prev, B: parseFloat(e.target.value) || 0 }));
                  }}
                  className="w-full px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-slate-800 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
              <div className="min-w-0">
                <label className="block text-xs text-slate-500 mb-1 font-mono">C</label>
                <input
                  type="number"
                  step="any"
                  value={generalLine.C}
                  onChange={(e) => {
                    setLineDisabled(false);
                    setGeneralLine((prev) => ({ ...prev, C: parseFloat(e.target.value) || 0 }));
                  }}
                  className="w-full px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-slate-800 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-md text-xs sm:text-sm">
              <span className="text-slate-500">{t.currentLineEquation}</span>
              <MathView
                math={formatLineEquation(generalLine.A, generalLine.B, generalLine.C)}
                className="font-medium"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={slopeLine.isVertical}
                  onChange={(e) => {
                    setLineDisabled(false);
                    handleSlopeChange({ isVertical: e.target.checked });
                  }}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
                <span>{t.verticalLineCheck}</span>
              </label>
            </div>

            {slopeLine.isVertical ? (
              <div>
                <label className="block text-xs text-slate-500 mb-1 font-mono">
                  c (x = c)
                </label>
                <input
                  type="number"
                  step="any"
                  value={slopeLine.xVal ?? 0}
                  onChange={(e) =>
                    handleSlopeChange({ xVal: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-1.5 text-xs sm:text-sm text-slate-800 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="min-w-0">
                  <label className="block text-xs text-slate-500 mb-1 font-mono">k (slope)</label>
                  <input
                    type="number"
                    step="any"
                    value={slopeLine.k}
                    onChange={(e) =>
                      handleSlopeChange({ k: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-slate-800 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
                <div className="min-w-0">
                  <label className="block text-xs text-slate-500 mb-1 font-mono">b (intercept)</label>
                  <input
                    type="number"
                    step="any"
                    value={slopeLine.b}
                    onChange={(e) =>
                      handleSlopeChange({ b: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-slate-800 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-md text-xs sm:text-sm">
              <span className="text-slate-500">{t.currentLineEquation}</span>
              <MathView
                math={
                  slopeLine.isVertical
                    ? `x = ${slopeLine.xVal ?? 0}`
                    : `y = ${slopeLine.k}x ${slopeLine.b >= 0 ? '+' : ''}${slopeLine.b}`
                }
                className="font-medium"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
