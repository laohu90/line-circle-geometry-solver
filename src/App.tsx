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
import { MistakeNotebook } from './components/MistakeNotebook';
import { SummaryCard } from './components/SummaryCard';
import { InputPanel } from './components/InputPanel';
import { SaveQuestionModal } from './components/SaveQuestionModal';
import { PRESET_EXAM_PROBLEMS } from './data/presetProblems';
import { MathView } from './components/MathView';
import {
  Globe,
  Plus,
  FileText,
  Sparkles,
} from 'lucide-react';

export default function App() {
  // Multilingual State: Default English, with URL param and localStorage detection
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
    return 'en';
  });

  const t = useMemo(() => TRANSLATIONS[lang] || TRANSLATIONS.en, [lang]);

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

  // Navigation active tab: 'solver' | 'canvas' | 'notebook' | 'cheatsheet'
  const [activeNav, setActiveNav] = useState<'solver' | 'canvas' | 'notebook' | 'cheatsheet'>('solver');

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

  // Mistake Notebook stored in LocalStorage
  const [mistakeQuestions, setMistakeQuestions] = useState<MistakeQuestion[]>(() => {
    try {
      const saved = localStorage.getItem('geometry_mistake_notebook_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return PRESET_EXAM_PROBLEMS;
  });

  // Save Modal open state
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('geometry_mistake_notebook_v2', JSON.stringify(mistakeQuestions));
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
    setStandardCircle((prev) => ({ ...prev, x0: newX, y0: newY }));
    setGeneralCircle((prev) => ({
      ...prev,
      D: -2 * newX,
      E: -2 * newY,
    }));
  };

  const handleUpdateRadiusFromCanvas = (newR: number) => {
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
    setCircleMode('general');
    setGeneralCircle({ D: -4, E: 2, F: -4 });
    setStandardCircle({ x0: 2, y0: -1, r: 3 });
    setLineMode('general');
    setGeneralLine({ A: 3, B: 4, C: -12 });
    setSlopeLine({ k: -0.75, b: 3, isVertical: false });
  };

  // Add current problem to Mistake Notebook
  const handleSaveCurrentProblem = (title: string, tag: string, note: string) => {
    const newEntry: MistakeQuestion = {
      id: 'mq-' + Date.now(),
      title,
      tag: tag || t.keywordsTagSecant,
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
    };
    setMistakeQuestions((prev) => [newEntry, ...prev]);
  };

  const handleDeleteQuestion = (id: string) => {
    setMistakeQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleToggleMastered = (id: string) => {
    setMistakeQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, isMastered: !q.isMastered } : q))
    );
  };

  const handleUpdateNote = (id: string, note: string) => {
    setMistakeQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, userNote: note } : q))
    );
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans text-sm sm:text-base selection:bg-sky-100 selection:text-sky-900">
      {/* 
        TOP BAR CONTRACT:
        Zone 1: Single text wordmark
        Zone 2: 4-5 single-line clean text navigation links
        Zone 3: 1 primary action
      */}
      <header className="flex items-center justify-between gap-6 px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-white sticky top-0 z-40">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2.5"
        >
          <div className="w-7 h-7 rounded bg-slate-900 text-white flex items-center justify-center text-xs font-bold font-mono">
            d
          </div>
          <span>{t.appName}</span>
        </a>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveNav('solver')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
              activeNav === 'solver'
                ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-sky-600'
                : ''
            }`}
          >
            {t.navSolver}
          </button>
          <button
            onClick={() => setActiveNav('canvas')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
              activeNav === 'canvas'
                ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-sky-600'
                : ''
            }`}
          >
            {t.navCanvas}
          </button>
          <button
            onClick={() => setActiveNav('notebook')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
              activeNav === 'notebook'
                ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-sky-600'
                : ''
            }`}
          >
            {t.navNotebook} ({mistakeQuestions.length})
          </button>
          <button
            onClick={() => setActiveNav('cheatsheet')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
              activeNav === 'cheatsheet'
                ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-sky-600'
                : ''
            }`}
          >
            {t.navCheatsheet}
          </button>
        </nav>

        {/* Zone 3: Language Selector + Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Language Switcher */}
          <div className="relative flex items-center">
            <Globe className="w-4 h-4 text-slate-500 absolute left-2 pointer-events-none" />
            <select
              value={lang}
              onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
              className="pl-7 pr-2.5 py-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 focus:outline-none focus:border-sky-500 cursor-pointer transition-colors"
            >
              <option value="en">{t.langEn}</option>
              <option value="es">{t.langEs}</option>
              <option value="fr">{t.langFr}</option>
              <option value="pt">{t.langPt}</option>
              <option value="zh">{t.langZh}</option>
            </select>
          </div>

          <button
            onClick={() => setIsSaveModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t.btnAddNotebook}</span>
          </button>
        </div>
      </header>

      {/* Mobile Nav Bar */}
      <div className="lg:hidden flex items-center justify-around border-b border-slate-200 bg-slate-50 px-2 py-2 text-xs font-medium text-slate-600 overflow-x-auto">
        <button
          onClick={() => setActiveNav('solver')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeNav === 'solver' ? 'bg-white text-slate-900 shadow-xs font-semibold' : ''
          }`}
        >
          {t.navSolver}
        </button>
        <button
          onClick={() => setActiveNav('canvas')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeNav === 'canvas' ? 'bg-white text-slate-900 shadow-xs font-semibold' : ''
          }`}
        >
          {t.navCanvas}
        </button>
        <button
          onClick={() => setActiveNav('notebook')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeNav === 'notebook' ? 'bg-white text-slate-900 shadow-xs font-semibold' : ''
          }`}
        >
          {t.navNotebook} ({mistakeQuestions.length})
        </button>
        <button
          onClick={() => setActiveNav('cheatsheet')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeNav === 'cheatsheet' ? 'bg-white text-slate-900 shadow-xs font-semibold' : ''
          }`}
        >
          {t.navCheatsheet}
        </button>
      </div>

      {/* Main Content Container (Baseline: 1440px desktop) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* VIEW 1: SOLVER & ANALYSIS */}
        {activeNav === 'solver' && (
          <div className="space-y-6">
            {/* Top Quick Verdict Card */}
            <SummaryCard
              analysis={analysis}
              t={t}
              onOpenSaveModal={() => setIsSaveModalOpen(true)}
            />

            {/* Split 2-Column: Left Inputs, Right Canvas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-5">
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
                  t={t}
                  lang={lang}
                  onSelectPreset={handleSelectPreset}
                  onReset={handleReset}
                />
              </div>

              <div className="lg:col-span-7 flex flex-col">
                <div className="flex-1 flex flex-col min-h-[480px]">
                  <GeometryCanvas
                    analysis={analysis}
                    t={t}
                    onUpdateCenter={handleUpdateCenterFromCanvas}
                    onUpdateRadius={handleUpdateRadiusFromCanvas}
                  />
                </div>
              </div>
            </div>

            {/* Detailed Step-by-Step Breakdown with LaTeX */}
            <DetailedSteps
              analysis={analysis}
              circleType={circleMode === 'general' ? 'general' : 'standard'}
              t={t}
              lang={lang}
            />
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
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50"
                >
                  {t.navSolver}
                </button>
              </div>
            </div>

            <div className="h-[640px]">
              <GeometryCanvas
                analysis={analysis}
                t={t}
                onUpdateCenter={handleUpdateCenterFromCanvas}
                onUpdateRadius={handleUpdateRadiusFromCanvas}
              />
            </div>

            {/* Readout bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white border border-slate-200 rounded-lg p-4 text-xs sm:text-sm">
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
          </div>
        )}

        {/* VIEW 3: MISTAKE NOTEBOOK & QUESTION BANK */}
        {activeNav === 'notebook' && (
          <MistakeNotebook
            questions={mistakeQuestions}
            t={t}
            lang={lang}
            onLoadQuestion={(q) => handleSelectPreset(q.id)}
            onDeleteQuestion={handleDeleteQuestion}
            onToggleMastered={handleToggleMastered}
            onUpdateNote={handleUpdateNote}
            onImportQuestions={(imported) => setMistakeQuestions(imported)}
            onOpenSaveModal={() => setIsSaveModalOpen(true)}
          />
        )}

        {/* VIEW 4: EXAM FORMULAS & CHEAT SHEET */}
        {activeNav === 'cheatsheet' && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-6">
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
              {/* Model 1 */}
              <div className="border border-slate-200 rounded-lg p-5 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {t.model1Title}
                  </h3>
                  <span className="text-xs font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-medium">
                    Core
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {t.model1Desc}
                </p>
                <div className="bg-white border border-slate-200 rounded-md p-3.5 text-center">
                  <MathView math={`R^2 = d^2 + \\left(\\frac{L}{2}\\right)^2 \\iff L = 2\\sqrt{R^2 - d^2}`} block />
                </div>
                <div className="text-slate-500 leading-relaxed text-xs">
                  {t.model1Tip}
                </div>
              </div>

              {/* Model 2 */}
              <div className="border border-slate-200 rounded-lg p-5 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {t.model2Title}
                  </h3>
                  <span className="text-xs font-mono text-sky-700 bg-sky-100 px-2 py-0.5 rounded font-medium">
                    Identity
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {t.model2Desc}
                </p>
                <div className="bg-white border border-slate-200 rounded-md p-3.5 text-center">
                  <MathView math={`\\left(x + \\frac{D}{2}\\right)^2 + \\left(y + \\frac{E}{2}\\right)^2 = \\frac{D^2 + E^2 - 4F}{4}`} block />
                </div>
                <div className="text-slate-500 leading-relaxed text-xs">
                  {t.model2Tip}
                </div>
              </div>

              {/* Model 3 */}
              <div className="border border-slate-200 rounded-lg p-5 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {t.model3Title}
                  </h3>
                  <span className="text-xs font-mono text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded font-medium">
                    Extrema
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {t.model3Desc}
                </p>
                <div className="bg-white border border-slate-200 rounded-md p-3.5 text-center space-y-1">
                  <MathView math={`d_{\\min} = |d - R|, \\quad d_{\\max} = d + R`} block />
                </div>
                <div className="text-slate-500 leading-relaxed text-xs">
                  {t.model3Tip}
                </div>
              </div>

              {/* Model 4 */}
              <div className="border border-slate-200 rounded-lg p-5 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {t.model4Title}
                  </h3>
                  <span className="text-xs font-mono text-rose-700 bg-rose-100 px-2 py-0.5 rounded font-medium">
                    Trap
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {t.model4Desc}
                </p>
                <div className="bg-white border border-slate-200 rounded-md p-3.5 text-center">
                  <MathView math={`Ax + By + C = 0 \\iff B \\neq 0 \\lor (B = 0 \\implies x = -C/A)`} block />
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
      <footer className="border-t border-slate-200 py-6 px-6 mt-12 bg-white text-xs text-slate-500">
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
