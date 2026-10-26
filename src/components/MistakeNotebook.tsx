/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { MistakeQuestion } from '../types/geometry';
import { TranslationSchema, SupportedLanguage } from '../i18n/translations';
import { MathView } from './MathView';
import {
  Bookmark,
  Trash2,
  CheckCircle2,
  Circle,
  ArrowUpRight,
  Printer,
  Download,
  Upload,
  Search,
  Tag,
  Edit3,
  Plus,
  HelpCircle,
  Sparkles,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface MistakeNotebookProps {
  questions: MistakeQuestion[];
  t: TranslationSchema;
  lang: SupportedLanguage;
  onLoadQuestion: (q: MistakeQuestion) => void;
  onDeleteQuestion: (id: string) => void;
  onClearAll: () => void;
  onRestorePresets?: () => void;
  onToggleMastered: (id: string) => void;
  onUpdateNote: (id: string, note: string) => void;
  onImportQuestions: (imported: MistakeQuestion[]) => void;
  onOpenSaveModal: () => void;
}

// Tag translation map
export function formatTagText(tag: string): string {
  if (!tag) return '';
  const trimmed = tag.trim();
  if (
    trimmed === 'Secant & Chord' ||
    trimmed === 'Secante y Cuerda' ||
    trimmed === 'Sécante et Corde' ||
    trimmed === 'Secante e Corda' ||
    trimmed === '相交弦长'
  ) {
    return '相交与弦长';
  }
  if (
    trimmed === 'Tangent & Contact' ||
    trimmed === 'Tangente y Contacto' ||
    trimmed === 'Tangente et Contact' ||
    trimmed === 'Tangente e Contato' ||
    trimmed === '切线验证'
  ) {
    return '相切与切线';
  }
  if (
    trimmed === 'Distance Extrema' ||
    trimmed === 'Distancias Extremas' ||
    trimmed === 'Distances Extrêmes' ||
    trimmed === 'Distâncias Extremas' ||
    trimmed === '最值问题' ||
    trimmed === '距离极值'
  ) {
    return '最值距离';
  }
  if (
    trimmed === 'Vertical Line x=c' ||
    trimmed === 'Recta Vertical x=c' ||
    trimmed === 'Droite Verticale x=c' ||
    trimmed === 'Reta Vertical x=c' ||
    trimmed === '垂直特殊线' ||
    trimmed === '垂直特殊线 x=c'
  ) {
    return '竖直线防坑';
  }
  if (
    trimmed === 'Perpendicular Chord' ||
    trimmed === 'Cuerda Perpendicular' ||
    trimmed === 'Corde Perpendiculaire' ||
    trimmed === 'Corda Perpendicular' ||
    trimmed === '参数逆推'
  ) {
    return '垂径定理';
  }
  return trimmed;
}

// Format note with fully translated Chinese prefixes
export function formatNoteText(text: string): string {
  if (!text) return '';
  return text
    .replace(/^Pitfall[:：]?\s*/i, '易错坑点：')
    .replace(/^Core Principle[:：]?\s*/i, '核心原理：')
    .replace(/^Exam Strategy[:：]?\s*/i, '考场策略：')
    .replace(/^High Frequency Mistake[:：]?\s*/i, '高频陷阱：')
    .replace(/^Geometric Insight[:：]?\s*/i, '几何洞察：')
    .replace(/^易错警示[:：]?\s*/g, '易错坑点：')
    .replace(/^考点精髓[:：]?\s*/g, '核心原理：')
    .replace(/^复习备忘[:：]?\s*/g, '考场策略：')
    .replace(/^致命陷阱[:：]?\s*/g, '高频陷阱：')
    .replace(/^特殊几何直观[:：]?\s*/g, '几何洞察：')
    .replace(/^Trampa[:：]?\s*/i, '易错坑点：')
    .replace(/^Piège[:：]?\s*/i, '易错坑点：')
    .replace(/^Pegadinha[:：]?\s*/i, '易错坑点：')
    .replace(/^Principio Clave[:：]?\s*/i, '核心原理：')
    .replace(/^Principe Clé[:：]?\s*/i, '核心原理：')
    .replace(/^Princípio Chave[:：]?\s*/i, '核心原理：')
    .replace(/^Estrategia de Examen[:：]?\s*/i, '考场策略：')
    .replace(/^Stratégie d'Examen[:：]?\s*/i, '考场策略：')
    .replace(/^Estratégia de Prova[:：]?\s*/i, '考场策略：')
    .replace(/^Error Frecuente[:：]?\s*/i, '高频陷阱：')
    .replace(/^Erreur Fréquente[:：]?\s*/i, '高频陷阱：')
    .replace(/^Erro Frequente[:：]?\s*/i, '高频陷阱：')
    .replace(/^Visión Geométrica[:：]?\s*/i, '几何洞察：')
    .replace(/^Intuition Géométrique[:：]?\s*/i, '几何洞察：')
    .replace(/^Intuição Geométrica[:：]?\s*/i, '几何洞察：');
}

export const MistakeNotebook: React.FC<MistakeNotebookProps> = ({
  questions,
  t,
  lang,
  onLoadQuestion,
  onDeleteQuestion,
  onClearAll,
  onRestorePresets,
  onToggleMastered,
  onUpdateNote,
  onImportQuestions,
  onOpenSaveModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [masteredFilter, setMasteredFilter] = useState<'all' | 'unmastered' | 'mastered'>('all');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');
  const [showGlossary, setShowGlossary] = useState(false);

  // Clear confirmation dialog state
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);

  // Extract all distinct tags with counts
  const tagCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const q of questions) {
      const formatted = formatTagText(q.tag);
      if (formatted) {
        map.set(formatted, (map.get(formatted) || 0) + 1);
      }
    }
    return map;
  }, [questions]);

  const allTags = useMemo(() => Array.from(tagCounts.keys()), [tagCounts]);

  // High-frequency exam keywords in Chinese
  const popularKeywords = [
    { label: '相交与弦长', query: '相交与弦长' },
    { label: '相切与切线', query: '相切与切线' },
    { label: '最值距离', query: '最值距离' },
    { label: '竖直线防坑', query: '竖直线防坑' },
    { label: '垂径定理', query: '垂径定理' },
  ];

  // Highlight helper for search keywords
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-amber-100 text-amber-900 px-0.5 rounded font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Filtered questions
  const filtered = useMemo(() => {
    return questions.filter((q) => {
      const formattedTag = formatTagText(q.tag);
      if (selectedTag !== 'all' && formattedTag !== selectedTag) return false;
      if (masteredFilter === 'unmastered' && q.isMastered) return false;
      if (masteredFilter === 'mastered' && !q.isMastered) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = q.title.toLowerCase().includes(query);
        const matchNote = formatNoteText(q.userNote).toLowerCase().includes(query);
        const matchTag = formattedTag.toLowerCase().includes(query);
        const matchKeywords = q.keywords?.some((k) => k.toLowerCase().includes(query));
        if (!matchTitle && !matchNote && !matchTag && !matchKeywords) return false;
      }
      return true;
    });
  }, [questions, selectedTag, masteredFilter, searchQuery]);

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `GeometryNotebook_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            onImportQuestions(parsed);
          }
        } catch {
          // Fallback ignore invalid json
        }
      };
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-6 space-y-5 sm:space-y-6">
      {/* Top Header & Actions (Tailored for mobile 390px) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-indigo-600 shrink-0" />
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">{t.notebookTitle}</h2>
            <span className="text-xs sm:text-sm font-mono text-slate-500">
              ({questions.length} {t.notebookCountText})
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t.notebookSub}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setShowGlossary(!showGlossary)}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer shrink-0 ${
              showGlossary ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.glossaryTitle}</span>
          </button>
          <button
            onClick={onOpenSaveModal}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.btnSaveCurrent}</span>
          </button>

          {/* Clear All Button with confirmation modal */}
          {questions.length > 0 && (
            <button
              onClick={() => setShowClearConfirmModal(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-md hover:bg-rose-100 transition-colors whitespace-nowrap cursor-pointer shrink-0"
              title={lang === 'zh' ? '清空错题本' : 'Clear All'}
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>{lang === 'zh' ? '清空错题' : 'Clear'}</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            title={t.btnPrint}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.btnPrint}</span>
          </button>
          <button
            onClick={handleExportJSON}
            title={t.btnExportJson}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.btnExportJson}</span>
          </button>
          <label className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shrink-0">
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.btnImportJson}</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>
        </div>
      </div>

      {/* Keywords Glossary Box (Collapsible) */}
      {showGlossary && (
        <div className="p-3.5 sm:p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 text-xs sm:text-sm">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>{t.glossaryTitle}</span>
            </span>
            <span className="text-xs text-slate-500">{t.glossarySub}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            <div className="p-2.5 bg-white border border-slate-200 rounded">
              <div className="font-semibold text-slate-900">{t.keywordsTagSquare}</div>
              <div className="text-slate-500 text-xs mt-0.5">
                (x+a)² = x² + 2ax + a² · D² + E² - 4F &gt; 0
              </div>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded">
              <div className="font-semibold text-slate-900">{t.keywordsTagChord}</div>
              <div className="text-slate-500 text-xs mt-0.5">
                Rt△OHA: R² = d² + (L/2)² ⇒ L = 2√(R² - d²)
              </div>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded">
              <div className="font-semibold text-slate-900">{t.keywordsTagExtrema}</div>
              <div className="text-slate-500 text-xs mt-0.5">
                d_min = |d - R|, d_max = d + R
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
            />
          </div>

          {/* Mastered Filter & Tag Selectors */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <div className="flex items-center gap-1 p-0.5 sm:p-1 bg-slate-100 rounded-md text-xs shrink-0">
              <button
                onClick={() => setMasteredFilter('all')}
                className={`px-2.5 py-1 font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                  masteredFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.filterAll} ({questions.length})
              </button>
              <button
                onClick={() => setMasteredFilter('unmastered')}
                className={`px-2.5 py-1 font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                  masteredFilter === 'unmastered'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.filterUnmastered} ({questions.filter((q) => !q.isMastered).length})
              </button>
              <button
                onClick={() => setMasteredFilter('mastered')}
                className={`px-2.5 py-1 font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                  masteredFilter === 'mastered'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.filterMastered} ({questions.filter((q) => q.isMastered).length})
              </button>
            </div>

            {/* Tag Filter Dropdown */}
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-2 py-1 text-xs text-slate-700 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-sky-500 cursor-pointer shrink-0"
            >
              <option value="all">{t.filterAllTags}</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag} ({tagCounts.get(tag) || 0})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Interactive Tag Filter Chips Bar in Pure Chinese */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 pt-0.5">
          <span className="text-slate-400 flex items-center gap-1 shrink-0 font-medium text-[11px] sm:text-xs">
            <Tag className="w-3.5 h-3.5" />
            <span>{lang === 'zh' ? '标签筛选:' : 'Tags:'}</span>
          </span>

          <button
            onClick={() => setSelectedTag('all')}
            className={`px-2.5 py-1 rounded-full transition-colors whitespace-nowrap font-medium cursor-pointer shrink-0 text-xs ${
              selectedTag === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {lang === 'zh' ? '全部' : 'All'} ({questions.length})
          </button>

          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? 'all' : tag)}
              className={`px-2.5 py-1 rounded-full transition-colors whitespace-nowrap font-medium cursor-pointer shrink-0 text-xs ${
                selectedTag === tag
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tag} ({tagCounts.get(tag) || 0})
            </button>
          ))}

          {selectedTag !== 'all' && (
            <button
              onClick={() => setSelectedTag('all')}
              className="text-xs text-sky-600 hover:underline shrink-0 ml-1 cursor-pointer font-medium"
            >
              {lang === 'zh' ? '清除标签' : 'Clear tag'}
            </button>
          )}
        </div>

        {/* Popular Keyword Chips for Quick Search */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          <span className="text-slate-400 shrink-0 font-medium text-[11px] sm:text-xs">
            {lang === 'zh' ? '高频考点:' : 'Keywords:'}
          </span>
          {popularKeywords.map((kw, i) => (
            <button
              key={i}
              onClick={() => setSearchQuery(searchQuery === kw.query ? '' : kw.query)}
              className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap font-medium cursor-pointer shrink-0 text-xs ${
                searchQuery.toLowerCase() === kw.query
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {kw.label}
            </button>
          ))}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-sky-600 hover:underline shrink-0 ml-1 cursor-pointer"
            >
              {lang === 'zh' ? '清空搜索' : 'Clear search'}
            </button>
          )}
        </div>
      </div>

      {/* Question Cards List */}
      {filtered.length === 0 ? (
        <div className="py-12 sm:py-14 text-center text-slate-500 border border-dashed border-slate-200 rounded-lg space-y-3 p-4">
          <p className="text-sm sm:text-base font-semibold">{t.noQuestionsFound}</p>
          <p className="text-xs sm:text-sm text-slate-400">
            {t.noQuestionsSub}
          </p>
          {questions.length === 0 && onRestorePresets && (
            <div className="pt-2">
              <button
                onClick={onRestorePresets}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{lang === 'zh' ? '恢复默认经典高考题库' : 'Restore Default Questions'}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5 sm:gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`border rounded-lg p-3.5 sm:p-5 transition-all bg-white hover:border-slate-300 ${
                item.isMastered ? 'border-slate-200' : 'border-slate-300 ring-1 ring-slate-200/50'
              }`}
            >
              {/* Card Header (Responsive wrap on iPhone 13 390px) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    onClick={() => onToggleMastered(item.id)}
                    title={item.isMastered ? t.statusUnmastered : t.statusMastered}
                    className="text-slate-400 hover:text-emerald-600 transition-colors shrink-0 cursor-pointer"
                  >
                    {item.isMastered ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-rose-500" />
                    )}
                  </button>
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 truncate">
                    {highlightMatch(item.title, searchQuery)}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0 ml-7 sm:ml-0">
                  <button
                    onClick={() => setSelectedTag(formatTagText(item.tag))}
                    className="font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded transition-colors cursor-pointer"
                    title={lang === 'zh' ? `按此标签筛选: ${formatTagText(item.tag)}` : `Filter by tag: ${formatTagText(item.tag)}`}
                  >
                    {highlightMatch(formatTagText(item.tag), searchQuery)}
                  </button>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-xs">{item.date}</span>
                </div>
              </div>

              {/* Card Body: Equations */}
              <div className="py-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-md border border-slate-100 min-w-0 overflow-x-auto">
                  <span className="text-slate-500 block mb-1 font-medium">{t.circleInputHeader}:</span>
                  {item.circleMode === 'general' ? (
                    <MathView
                      math={`x^2 + y^2 ${item.generalCircle.D >= 0 ? '+' : ''}${item.generalCircle.D}x ${item.generalCircle.E >= 0 ? '+' : ''}${item.generalCircle.E}y ${item.generalCircle.F >= 0 ? '+' : ''}${item.generalCircle.F} = 0`}
                    />
                  ) : (
                    <MathView
                      math={`(x - ${item.standardCircle.x0})^2 + (y - ${item.standardCircle.y0})^2 = ${item.standardCircle.r * item.standardCircle.r}`}
                    />
                  )}
                </div>

                <div className="bg-slate-50 p-2.5 rounded-md border border-slate-100 min-w-0 overflow-x-auto">
                  <span className="text-slate-500 block mb-1 font-medium">{t.lineInputHeader}:</span>
                  <MathView
                    math={`${item.generalLine.A}x + ${item.generalLine.B}y + ${item.generalLine.C} = 0`}
                  />
                </div>
              </div>

              {/* Card Note / Reflection (Formatted with translated Chinese prefixes) */}
              <div className="pt-1.5 text-xs">
                {editingNoteId === item.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={tempNote}
                      onChange={(e) => setTempNote(e.target.value)}
                      rows={2}
                      className="w-full p-2 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:outline-none focus:border-sky-500"
                      placeholder="写下本题的易错坑点、核心原理或解题心得..."
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingNoteId(null)}
                        className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                      >
                        {t.btnCancel}
                      </button>
                      <button
                        onClick={() => {
                          onUpdateNote(item.id, tempNote);
                          setEditingNoteId(null);
                        }}
                        className="px-2.5 py-1 text-xs font-medium text-white bg-slate-900 rounded hover:bg-slate-800 cursor-pointer"
                      >
                        {t.btnSaveNote}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2.5 bg-amber-50/50 border border-amber-100/70 rounded p-2.5 text-slate-700">
                    <div className="leading-relaxed">
                      <span className="font-semibold text-amber-900 mr-1.5">{t.noteLabel}</span>
                      <span>
                        {item.userNote
                          ? highlightMatch(formatNoteText(item.userNote), searchQuery)
                          : t.noNoteText}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setEditingNoteId(item.id);
                        setTempNote(formatNoteText(item.userNote));
                      }}
                      title={t.btnEditNote}
                      className="text-slate-400 hover:text-slate-700 shrink-0 p-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Card Footer Actions (Never crushed on mobile) */}
              <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-xs">
                <span
                  className={`font-medium ${
                    item.isMastered ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {item.isMastered ? t.statusMastered : t.statusUnmastered}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onLoadQuestion(item)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-sky-700 bg-sky-50 rounded-md hover:bg-sky-100 transition-colors cursor-pointer"
                  >
                    <span>{t.btnLoadIntoSolver}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteQuestion(item.id)}
                    title={t.btnDelete}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Clear All Confirmation Dialog Modal */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-lg max-w-sm w-full p-5 sm:p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {lang === 'zh' ? '确定清空错题本？' : 'Clear Mistake Notebook?'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {lang === 'zh'
                ? '此操作将永久清空您保存的全部题目与易错反思记录，清空后无法撤销。'
                : 'This will permanently remove all saved questions and notes from your local notebook.'}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowClearConfirmModal(false)}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {t.btnCancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearAll();
                  setShowClearConfirmModal(false);
                }}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
              >
                {lang === 'zh' ? '确认清空' : 'Confirm Clear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
