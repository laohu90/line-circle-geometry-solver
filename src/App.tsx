/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  CircleInputMode,
  LineInputMode,
  GeneralCircleInput,
  StandardCircleInput,
  GeneralLineInput,
  SlopeInterceptLineInput,
  MistakeQuestion,
} from './types/geometry';
import { SupportedLanguage, TRANSLATIONS } from './i18n/translations';
import { analyzeLineAndCircle } from './utils/mathUtils';
import { GeometryCanvas } from './components/GeometryCanvas';
import { DetailedSteps } from './components/DetailedSteps';
import { MistakeNotebook, formatTagText, formatNoteText, formatTitleText } from './components/MistakeNotebook';
import { SummaryCard } from './components/SummaryCard';
import { InputPanel } from './components/InputPanel';
import { SaveQuestionModal } from './components/SaveQuestionModal';
import { AdvancedGeometryToolbox } from './components/AdvancedGeometryToolbox';
import { PRESET_EXAM_PROBLEMS } from './data/presetProblems';
import { MathView } from './components/MathView';
import {
  Globe,
  Plus,
  FileText,
  BookmarkCheck,
} from 'lucide-react';

// Normalizer to ensure titles, tags & note prefixes are fully translated in Chinese
function normalizeMistakeQuestion(q: MistakeQuestion): MistakeQuestion {
  // If this is an exam preset problem, directly synchronize its title, tag, and note with the Chinese canonical preset
  if (q.id && q.id.startsWith('preset-')) {
    const canonical = PRESET_EXAM_PROBLEMS.find((p) => p.id === q.id);
    if (canonical) {
      return {
        ...canonical,
        isMastered: q.isMastered ?? canonical.isMastered,
      };
    }
  }

  const title = formatTitleText(q.title || '');
  const tag = formatTagText(q.tag || '') || '相交与弦长';
  const userNote = formatNoteText(q.userNote || '');

  return { ...q, title, tag, userNote };
}

export default function App() {
  // Multilingual State: Default Chinese, with URL param and localStorage detection
  const [lang, setLang] = useState<SupportedLanguage>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const paramLang = urlParams.get('lang');
      if (paramLang && ['en', 'es', 'fr', 'pt', 'zh'].includes(paramLang)) {
        return paramLang as SupportedLanguage;
      }
      const savedLang = localStorage.getItem('geometry_app_lang');
      if (savedLang && ['en', 'es', 'fr', 'pt', 'zh'].includes(savedLang)) {
        return savedLang as SupportedLanguage;
      }
    } catch {
      // fallback
    }
    return 'zh';
  });

  const t = useMemo(() => TRANSLATIONS[lang] || TRANSLATIONS.zh, [lang]);

  // Persist language and sync with URL & DOM
  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLang(newLang);
    try {
      localStorage.setItem('geometry_app_lang', newLang);
      document.documentElement.lang = newLang;
      document.title = `${TRANSLATIONS[newLang]?.appName || 'Line & Circle Solver'} – ${TRANSLATIONS[newLang]?.tagline || 'Geometry Assistant'}`;
      const url = new URL(window.location.href);
      url.searchParams.set('lang', newLang);
      window.history.replaceState({}, '', url.toString());
    } catch {
      // ignore
    }
  };

  // Navigation active tab: 'solver' | 'canvas' | 'toolbox' | 'notebook' | 'cheatsheet'
  const [activeNav, setActiveNav] = useState<'solver' | 'canvas' | 'toolbox' | 'notebook' | 'cheatsheet'>('solver');

  // Circle State (default: x^2 + y^2 - 4x + 2y - 4 = 0 => (x-2)^2 + (y+1)^2 = 9, R = 3)
  const [circleMode, setCircleMode] = useState<CircleInputMode>('general');
  const [generalCircle, setGeneralCircle] = useState<GeneralCircleInput>({
    D: -4,
    E: 2,
    F: -4,
  });
  const [standardCircle, setStandardCircle] = useState<StandardCircleInput>({
    x0: 2,
    y0: -1,
    r: 3,
  });

  // Line State: 3x + 4y - 12 = 0
  const [lineMode, setLineMode] = useState<LineInputMode>('general');
  const [generalLine, setGeneralLine] = useState<GeneralLineInput>({
    A: 3,
    B: 4,
    C: -12,
  });
  const [slopeLine, setSlopeLine] = useState<SlopeInterceptLineInput>({
    k: -0.75,
    b: 3,
    isVertical: false,
  });

  // Single-equation standby states
  const [circleDisabled, setCircleDisabled] = useState(false);
  const [lineDisabled, setLineDisabled] = useState(false);

  // Parsing error and echo state (P1 & P2)
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsedEcho, setParsedEcho] = useState<{ line: string; circle: string } | null>(null);

  // Mistake Notebook stored in LocalStorage (v4 enforces 100% translated titles, tags & notes)
  const [mistakeQuestions, setMistakeQuestions] = useState<MistakeQuestion[]>(() => {
    try {
      const savedV4 = localStorage.getItem('geometry_mistake_notebook_v4');
      if (savedV4) {
        const parsed = JSON.parse(savedV4);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeMistakeQuestion);
        }
      }
      // Migrate from older versions if present
      const savedLegacy =
        localStorage.getItem('geometry_mistake_notebook_v3') ||
        localStorage.getItem('geometry_mistake_notebook_v2') ||
        localStorage.getItem('geometry_mistake_notebook');
      if (savedLegacy) {
        const parsed = JSON.parse(savedLegacy);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeMistakeQuestion);
        }
      }
    } catch {
      // fallback
    }
    return PRESET_EXAM_PROBLEMS.map(normalizeMistakeQuestion);
  });

  // Save Modal open state
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  // Sync to LocalStorage v4 and cleanup legacy caches
  useEffect(() => {
    try {
      localStorage.setItem('geometry_mistake_notebook_v4', JSON.stringify(mistakeQuestions));
      localStorage.removeItem('geometry_mistake_notebook_v3');
      localStorage.removeItem('geometry_mistake_notebook_v2');
      localStorage.removeItem('geometry_mistake_notebook');
    } catch {
      // ignore
    }
  }, [mistakeQuestions]);

  // Main Analytical Calculation Engine
  const analysis = useMemo(() => {
    return analyzeLineAndCircle(
      circleMode === 'general' ? 'general' : 'standard',
      generalCircle,
      standardCircle,
      generalLine,
      lang
    );
  }, [circleMode, generalCircle, standardCircle, generalLine, lang]);

  // Handle Dragging in Canvas
  const handleUpdateCenterFromCanvas = (newX: number, newY: number) => {
    setCircleDisabled(false);
    setStandardCircle((prev) => ({ ...prev, x0: newX, y0: newY }));
    setGeneralCircle((prev) => ({
      ...prev,
      D: -2 * newX,
      E: -2 * newY,
    }));
  };

  const handleUpdateRadiusFromCanvas = (newR: number) => {
    setCircleDisabled(false);
    setStandardCircle((prev) => ({ ...prev, r: newR }));
    if (circleMode === 'general') {
      const x0 = -generalCircle.D / 2;
      const y0 = -generalCircle.E / 2;
      setGeneralCircle((prev) => ({
        ...prev,
        F: x0 * x0 + y0 * y0 - newR * newR,
      }));
    }
  };

  // Load a preset question
  const handleSelectPreset = (presetId: string) => {
    const item = mistakeQuestions.find((q) => q.id === presetId) ||
      PRESET_EXAM_PROBLEMS.find((q) => q.id === presetId);
    if (!item) return;
    setParseError(null);
    setParsedEcho(null);
    setCircleDisabled(false);
    setLineDisabled(false);
    setCircleMode(item.circleMode);
    setGeneralCircle(item.generalCircle);
    setStandardCircle(item.standardCircle);
    setLineMode(item.lineMode);
    setGeneralLine(item.generalLine);
    setSlopeLine(item.slopeLine);
    setActiveNav('solver');
  };

  // Reset to default sample
  const handleReset = () => {
    setParseError(null);
    setParsedEcho(null);
    setCircleDisabled(false);
    setLineDisabled(false);
    setCircleMode('general');
    setGeneralCircle({ D: -4, E: 2, F: -4 });
    setStandardCircle({ x0: 2, y0: -1, r: 3 });
    setLineMode('general');
    setGeneralLine({ A: 3, B: 4, C: -12 });
    setSlopeLine({ k: -0.75, b: 3, isVertical: false });
  };

  // Add current problem to Mistake Notebook
  const handleSaveCurrentProblem = (title: string, tag: string, note: string) => {
    const newEntry: MistakeQuestion = normalizeMistakeQuestion({
      id: 'mq-' + Date.now(),
      title,
      tag: tag || '相交与弦长',
      date: new Date().toISOString().slice(0, 10),
      circleMode,
      generalCircle,
      standardCircle,
      lineMode,
      generalLine,
      slopeLine,
      userNote: note,
      isMastered: false,
      keywords: ['geometry', 'line', 'circle', tag.toLowerCase()],
    });
    setMistakeQuestions((prev) => [newEntry, ...prev].slice(0, 100));
  };

  const handleDeleteQuestion = (id: string) => {
    setMistakeQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleClearAllQuestions = () => {
    setMistakeQuestions([]);
  };

  const handleRestorePresets = () => {
    setMistakeQuestions(PRESET_EXAM_PROBLEMS.map(normalizeMistakeQuestion));
  };

  const handleToggleMastered = (id: string) => {
    setMistakeQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, isMastered: !q.isMastered } : q))
    );
  };

  const handleUpdateNote = (id: string, note: string) => {
    setMistakeQuestions((prev) =>
      prev.map((q) => (q.id === id ? normalizeMistakeQuestion({ ...q, userNote: note }) : q))
    );
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans text-sm sm:text-base selection:bg-sky-100 selection:text-sky-900">
      {/* 
        TOP BAR:
        Tailored for iPhone 13 (390×844) & mobile screens - no overflow, no clipped buttons
      */}
      <header className="flex items-center justify-between gap-2 px-3 sm:px-6 py-2.5 sm:py-3.5 border-b border-slate-200 bg-white sticky top-0 z-40">
        {/* Zone 1: Wordmark */}
        <a
          href="/"
          className="text-sm sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded bg-slate-900 text-white flex items-center justify-center text-xs font-bold font-mono">
            d
          </div>
          <span className="hidden sm:inline">{t.appName}</span>
          <span className="sm:hidden font-bold text-sm">直线与圆</span>
        </a>

        {/* Zone 2: Navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveNav('solver')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeNav === 'solver'
                ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-sky-600'
                : ''
            }`}
          >
            {t.navSolver}
          </button>
          <button
            onClick={() => setActiveNav('canvas')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeNav === 'canvas'
                ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-sky-600'
                : ''
            }`}
          >
            {t.navCanvas}
          </button>
          <button
            onClick={() => setActiveNav('toolbox')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeNav === 'toolbox'
                ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-sky-600'
                : ''
            }`}
          >
            {t.navToolbox}
          </button>
          <button
            onClick={() => setActiveNav('notebook')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeNav === 'notebook'
                ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-sky-600'
                : ''
            }`}
          >
            {t.navNotebook} ({mistakeQuestions.length})
          </button>
          <button
            onClick={() => setActiveNav('cheatsheet')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeNav === 'cheatsheet'
                ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-sky-600'
                : ''
            }`}
          >
            {t.navCheatsheet}
          </button>
        </nav>

        {/* Zone 3: Language Selector + Primary Action (Responsive on 390px) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Language Switcher */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 absolute left-2 pointer-events-none" />
            <select
              value={lang}
              onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
              className="pl-6 sm:pl-7 pr-2 sm:pr-2.5 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 focus:outline-none focus:border-sky-500 cursor-pointer transition-colors"
            >
              <option value="zh">中文</option>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="pt">Português</option>
            </select>
          </div>

          <button
            onClick={() => setIsSaveModalOpen(true)}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{t.btnAddNotebook}</span>
            <span className="sm:hidden">{lang === 'zh' ? '存题' : 'Save'}</span>
          </button>
        </div>
      </header>

      {/* Mobile Nav Bar */}
      <div className="lg:hidden flex items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-medium text-slate-600 overflow-x-auto">
        <button
          onClick={() => setActiveNav('solver')}
          className={`px-2.5 py-1 rounded whitespace-nowrap cursor-pointer ${
            activeNav === 'solver' ? 'bg-white text-slate-900 shadow-xs font-semibold' : ''
          }`}
        >
          {t.navSolver}
        </button>
        <button
          onClick={() => setActiveNav('canvas')}
          className={`px-2.5 py-1 rounded whitespace-nowrap cursor-pointer ${
            activeNav === 'canvas' ? 'bg-white text-slate-900 shadow-xs font-semibold' : ''
          }`}
        >
          {t.navCanvas}
        </button>
        <button
          onClick={() => setActiveNav('toolbox')}
          className={`px-2.5 py-1 rounded whitespace-nowrap cursor-pointer ${
            activeNav === 'toolbox' ? 'bg-white text-slate-900 shadow-xs font-semibold' : ''
          }`}
        >
          {t.navToolbox}
        </button>
        <button
          onClick={() => setActiveNav('notebook')}
          className={`px-2.5 py-1 rounded whitespace-nowrap cursor-pointer ${
            activeNav === 'notebook' ? 'bg-white text-slate-900 shadow-xs font-semibold' : ''
          }`}
        >
          {t.navNotebook} ({mistakeQuestions.length})
        </button>
        <button
          onClick={() => setActiveNav('cheatsheet')}
          className={`px-2.5 py-1 rounded whitespace-nowrap cursor-pointer ${
            activeNav === 'cheatsheet' ? 'bg-white text-slate-900 shadow-xs font-semibold' : ''
          }`}
        >
          {t.navCheatsheet}
        </button>
      </div>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
        {/* VIEW 1: SOLVER & ANALYSIS */}
        {activeNav === 'solver' && (
          <div className="space-y-5 sm:space-y-6">
            {/* Error Banner when parsing failed (P1: Parsing failure should fail overall) */}
            {parseError ? (
              <div className="bg-rose-50 border-2 border-rose-300 rounded-lg p-5 text-center space-y-2 shadow-xs">
                <div className="flex items-center justify-center gap-2 text-rose-800 font-bold text-sm sm:text-base">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
                  <span>方程解析未通过 · 计算结果区已置空</span>
                </div>
                <p className="text-xs sm:text-sm text-rose-700 max-w-xl mx-auto leading-relaxed font-medium">
                  {parseError}
                </p>
                <p className="text-[11px] text-rose-500">
                  （系统严格要求双方程均解析成功才进行计算，未用默认参数填补，已清空结果区以防得到错误答案）
                </p>
              </div>
            ) : (
              /* Top Quick Verdict Card with P2 echo */
              <SummaryCard
                analysis={analysis}
                circleDisabled={circleDisabled}
                lineDisabled={lineDisabled}
                t={t}
                onOpenSaveModal={() => setIsSaveModalOpen(true)}
                parsedEcho={parsedEcho}
              />
            )}

            {/* Split 2-Column: Left Inputs, Right Canvas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
              <div className="lg:col-span-5 min-w-0">
                <InputPanel
                  circleMode={circleMode}
                  setCircleMode={setCircleMode}
                  generalCircle={generalCircle}
                  setGeneralCircle={setGeneralCircle}
                  standardCircle={standardCircle}
                  setStandardCircle={setStandardCircle}
                  lineMode={lineMode}
                  setLineMode={setLineMode}
                  generalLine={generalLine}
                  setGeneralLine={setGeneralLine}
                  slopeLine={slopeLine}
                  setSlopeLine={setSlopeLine}
                  circleDisabled={circleDisabled}
                  setCircleDisabled={setCircleDisabled}
                  lineDisabled={lineDisabled}
                  setLineDisabled={setLineDisabled}
                  t={t}
                  lang={lang}
                  onSelectPreset={handleSelectPreset}
                  onReset={handleReset}
                  onParseSuccess={(info) => {
                    setParsedEcho(info);
                    setParseError(null);
                  }}
                  onParseError={(err) => {
                    setParseError(err);
                    if (err) setParsedEcho(null);
                  }}
                />
              </div>

              <div className="lg:col-span-7 flex flex-col min-w-0">
                <div className="flex-1 flex flex-col min-h-[360px] sm:min-h-[480px]">
                  <GeometryCanvas
                    analysis={analysis}
                    circleDisabled={circleDisabled || !!parseError}
                    lineDisabled={lineDisabled || !!parseError}
                    t={t}
                    onUpdateCenter={handleUpdateCenterFromCanvas}
                    onUpdateRadius={handleUpdateRadiusFromCanvas}
                  />
                </div>
              </div>
            </div>

            {/* Detailed Step-by-Step Breakdown with LaTeX (Hidden when parse error to avoid showing wrong answers) */}
            {!parseError && (
              <DetailedSteps
                analysis={analysis}
                circleType={circleMode === 'general' ? 'general' : 'standard'}
                circleDisabled={circleDisabled}
                lineDisabled={lineDisabled}
                t={t}
                lang={lang}
              />
            )}
          </div>
        )}

        {/* VIEW 2: INTERACTIVE CANVAS FULLSCREEN STAGE */}
        {activeNav === 'canvas' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                  {t.navCanvas}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {t.canvasHint}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveNav('solver')}
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer"
                >
                  {t.navSolver}
                </button>
              </div>
            </div>

            <div className="h-[480px] sm:h-[620px]">
              <GeometryCanvas
                analysis={analysis}
                circleDisabled={circleDisabled}
                lineDisabled={lineDisabled}
                t={t}
                onUpdateCenter={handleUpdateCenterFromCanvas}
                onUpdateRadius={handleUpdateRadiusFromCanvas}
              />
            </div>

            {/* Readout bar */}
            {!circleDisabled && !lineDisabled && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white border border-slate-200 rounded-lg p-3 sm:p-4 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-500">{t.metricCenter}:</span>
                  <span className="font-mono font-semibold ml-1.5">
                    ({analysis.x0.toFixed(2)}, {analysis.y0.toFixed(2)})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">{t.metricDistance}:</span>
                  <span className="font-mono font-semibold ml-1.5">
                    {analysis.distance.toFixed(3)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">{t.metricRadius}:</span>
                  <span className="font-mono font-semibold ml-1.5">
                    {analysis.r.toFixed(3)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">{t.verdictLabel}:</span>
                  <span className="font-semibold text-sky-700 ml-1.5">
                    {analysis.relation === 'intersecting'
                      ? t.verdictSecant
                      : analysis.relation === 'tangent'
                      ? t.verdictTangent
                      : t.verdictDisjoint}
                    {analysis.relation === 'intersecting' && ` (L=${analysis.chordLength?.toFixed(2)})`}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW: ADVANCED GEOMETRY TOOLBOX */}
        {activeNav === 'toolbox' && (
          <AdvancedGeometryToolbox
            initialX0={analysis.x0}
            initialY0={analysis.y0}
            initialR={analysis.r}
            t={t}
            lang={lang}
          />
        )}

        {/* VIEW 3: MISTAKE NOTEBOOK & QUESTION BANK */}
        {activeNav === 'notebook' && (
          <MistakeNotebook
            questions={mistakeQuestions}
            t={t}
            lang={lang}
            onLoadQuestion={(q) => handleSelectPreset(q.id)}
            onDeleteQuestion={handleDeleteQuestion}
            onClearAll={handleClearAllQuestions}
            onRestorePresets={handleRestorePresets}
            onToggleMastered={handleToggleMastered}
            onUpdateNote={handleUpdateNote}
            onImportQuestions={(imported) => setMistakeQuestions(imported.map(normalizeMistakeQuestion))}
            onOpenSaveModal={() => setIsSaveModalOpen(true)}
          />
        )}

        {/* VIEW 4: EXAM FORMULAS & CHEAT SHEET WITH MINIMAL NUMERICAL EXAMPLES */}
        {activeNav === 'cheatsheet' && (
          <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-600 shrink-0" />
                <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                  {t.cheatTitle}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {t.cheatSub}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
              {/* Model 1: 垂径定理与弦长勾股模型 */}
              <div className="border border-slate-200 rounded-lg p-4 sm:p-5 bg-slate-50/50 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {t.model1Title}
                  </h3>
                  <span className="text-xs font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-medium">
                    核心模型
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {t.model1Desc}
                </p>
                <div className="bg-white border border-slate-200 rounded-md p-3 text-center">
                  <MathView math={`R^2 = d^2 + \\left(\\frac{L}{2}\\right)^2 \\iff L = 2\\sqrt{R^2 - d^2}`} block />
                </div>

                {/* Minimal Numerical Example for Model 1 */}
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-md p-3 space-y-1.5 text-xs">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>【最小带数字例题】</span>
                  </div>
                  <div className="text-slate-700 leading-relaxed">
                    <strong>题设：</strong>圆半径 <MathView math="R = 5" />，圆心到直线的距离 <MathView math="d = 3" />。求直线被圆截得的弦长 <MathView math="L" />。
                  </div>
                  <div className="text-slate-700 leading-relaxed bg-white/80 p-2 rounded border border-emerald-100 font-mono space-y-1">
                    <div>半弦长 <MathView math="\frac{L}{2} = \sqrt{R^2 - d^2} = \sqrt{5^2 - 3^2} = 4" /></div>
                    <div>全弦长 <MathView math="L = 2 \times 4 = 8" /></div>
                  </div>
                  <div className="text-emerald-800 text-[11px] font-medium">
                    ⚡ 考场秒记：勾股数 3-4-5，半弦为 4，切记全弦乘以 2 得到 8！
                  </div>
                </div>

                <div className="text-slate-500 leading-relaxed text-xs">
                  {t.model1Tip}
                </div>
              </div>

              {/* Model 2: 圆的一般方程配方法标准转化 */}
              <div className="border border-slate-200 rounded-lg p-4 sm:p-5 bg-slate-50/50 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {t.model2Title}
                  </h3>
                  <span className="text-xs font-mono text-sky-700 bg-sky-100 px-2 py-0.5 rounded font-medium">
                    恒等转化
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {t.model2Desc}
                </p>
                <div className="bg-white border border-slate-200 rounded-md p-3 text-center">
                  <MathView math={`\\left(x + \\frac{D}{2}\\right)^2 + \\left(y + \\frac{E}{2}\\right)^2 = \\frac{D^2 + E^2 - 4F}{4}`} block />
                </div>

                {/* Minimal Numerical Example for Model 2 */}
                <div className="bg-sky-50/70 border border-sky-200/80 rounded-md p-3 space-y-1.5 text-xs">
                  <div className="font-bold text-sky-900 flex items-center gap-1.5">
                    <BookmarkCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>【最小带数字例题】</span>
                  </div>
                  <div className="text-slate-700 leading-relaxed">
                    <strong>题设：</strong>求圆方程 <MathView math="x^2 + y^2 - 4x + 2y - 4 = 0" /> 的圆心坐标与半径 <MathView math="R" />。
                  </div>
                  <div className="text-slate-700 leading-relaxed bg-white/80 p-2 rounded border border-sky-100 font-mono space-y-1">
                    <div>配方：<MathView math="(x - 2)^2 + (y + 1)^2 = 4 + 4 + 1 = 9 = 3^2" /></div>
                    <div>充要检验：<MathView math="D^2 + E^2 - 4F = (-4)^2 + 2^2 - 4(-4) = 36 > 0" /></div>
                  </div>
                  <div className="text-sky-800 text-[11px] font-medium">
                    ⚡ 考场秒记：圆心 <MathView math="O(2, -1)" />，半径 <MathView math="R = \sqrt{9} = 3" />。（若判别式等于0则退化为点圆）。
                  </div>
                </div>

                <div className="text-slate-500 leading-relaxed text-xs">
                  {t.model2Tip}
                </div>
              </div>

              {/* Model 3: 圆上任意一点到直线距离的最值 */}
              <div className="border border-slate-200 rounded-lg p-4 sm:p-5 bg-slate-50/50 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {t.model3Title}
                  </h3>
                  <span className="text-xs font-mono text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded font-medium">
                    极值定理
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {t.model3Desc}
                </p>
                <div className="bg-white border border-slate-200 rounded-md p-3 text-center">
                  <MathView math={`d_{\\min} = |d - R|, \\quad d_{\\max} = d + R`} block />
                </div>

                {/* Minimal Numerical Example for Model 3 */}
                <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-md p-3 space-y-1.5 text-xs">
                  <div className="font-bold text-indigo-900 flex items-center gap-1.5">
                    <BookmarkCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>【最小带数字例题】</span>
                  </div>
                  <div className="text-slate-700 leading-relaxed">
                    <strong>题设：</strong>圆 <MathView math="x^2 + y^2 = 4" />（圆心 <MathView math="(0,0)" />，半径 <MathView math="R = 2" />）与直线 <MathView math="3x + 4y - 20 = 0" />。求圆上的点到直线的最大与最小距离。
                  </div>
                  <div className="text-slate-700 leading-relaxed bg-white/80 p-2 rounded border border-indigo-100 font-mono space-y-1">
                    <div>圆心距 <MathView math="d = \frac{|3(0) + 4(0) - 20|}{\sqrt{3^2 + 4^2}} = \frac{20}{5} = 4 > R" />（相离）</div>
                    <div>最近距离 <MathView math="d_{\min} = d - R = 4 - 2 = 2" /></div>
                    <div>最远距离 <MathView math="d_{\max} = d + R = 4 + 2 = 6" /></div>
                  </div>
                  <div className="text-indigo-800 text-[11px] font-medium">
                    ⚡ 考场秒记：相离时 <MathView math="d_{\min} = d - R" />；若直线与圆相交，则圆上有点在直线上，<MathView math="d_{\min} = 0" />！
                  </div>
                </div>

                <div className="text-slate-500 leading-relaxed text-xs">
                  {t.model3Tip}
                </div>
              </div>

              {/* Model 4: 斜率不存在特殊直线的严谨分类 */}
              <div className="border border-slate-200 rounded-lg p-4 sm:p-5 bg-slate-50/50 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {t.model4Title}
                  </h3>
                  <span className="text-xs font-mono text-rose-700 bg-rose-100 px-2 py-0.5 rounded font-medium">
                    高频陷阱
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {t.model4Desc}
                </p>
                <div className="bg-white border border-slate-200 rounded-md p-3 text-center">
                  <MathView math={`Ax + By + C = 0 \\iff B \\neq 0 \\lor (B = 0 \\implies x = -C/A)`} block />
                </div>

                {/* Minimal Numerical Example for Model 4 */}
                <div className="bg-rose-50/70 border border-rose-200/80 rounded-md p-3 space-y-1.5 text-xs">
                  <div className="font-bold text-rose-900 flex items-center gap-1.5">
                    <BookmarkCheck className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>【最小带数字例题】</span>
                  </div>
                  <div className="text-slate-700 leading-relaxed">
                    <strong>题设：</strong>过点 <MathView math="P(2, 3)" /> 作圆 <MathView math="x^2 + y^2 = 4" /> 的切线，求直线方程。
                  </div>
                  <div className="text-slate-700 leading-relaxed bg-white/80 p-2 rounded border border-rose-100 font-mono space-y-1">
                    <div>① 设斜截式 <MathView math="y - 3 = k(x - 2)" />，由 <MathView math="d = 2" /> 解得 <MathView math="k = \frac{5}{12}" />，得 <MathView math="5x - 12y + 26 = 0" /></div>
                    <div>② 必检特殊线：斜率不存在的竖直线 <MathView math="x = 2" />，圆心到其距离 <MathView math="d = 2 = R" />，恰好也切于点 <MathView math="(2, 0)" />！</div>
                  </div>
                  <div className="text-rose-800 text-[11px] font-medium">
                    ⚡ 考场秒记：切线共有 2 条：<MathView math="x = 2" /> 和 <MathView math="5x - 12y + 26 = 0" />。漏掉竖直线扣一半分数！
                  </div>
                </div>

                <div className="text-slate-500 leading-relaxed text-xs">
                  {t.model4Tip}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Save Question Modal */}
      <SaveQuestionModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveCurrentProblem}
        defaultTitle={`${t.appName} - ${analysis.relation === 'intersecting' ? t.verdictSecant : analysis.relation === 'tangent' ? t.verdictTangent : t.verdictDisjoint}`}
        t={t}
      />

      {/* Subtle Footer */}
      <footer className="border-t border-slate-200 py-6 px-4 sm:px-6 mt-12 bg-white text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">{t.appName}</span>
            <span aria-hidden="true">·</span>
            <span>{t.tagline}</span>
          </div>
          <div className="text-slate-400">
            {t.footerDisclaimer}
          </div>
        </div>
      </footer>
    </div>
  );
}
