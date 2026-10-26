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
} from 'lucide-react';

interface MistakeNotebookProps {
  questions: MistakeQuestion[];
  t: TranslationSchema;
  lang: SupportedLanguage;
  onLoadQuestion: (q: MistakeQuestion) => void;
  onDeleteQuestion: (id: string) => void;
  onToggleMastered: (id: string) => void;
  onUpdateNote: (id: string, note: string) => void;
  onImportQuestions: (imported: MistakeQuestion[]) => void;
  onOpenSaveModal: () => void;
}

export const MistakeNotebook: React.FC<MistakeNotebookProps> = ({
  questions,
  t,
  onLoadQuestion,
  onDeleteQuestion,
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

  // Extract all distinct tags
  const allTags = useMemo(() => {
    return Array.from(new Set(questions.map((q) => q.tag).filter(Boolean)));
  }, [questions]);

  // High-frequency exam keywords
  const popularKeywords = [
    { label: t.keywordsTagSecant, query: 'secant' },
    { label: t.keywordsTagTangent, query: 'tangent' },
    { label: t.keywordsTagDisjoint, query: 'disjoint' },
    { label: t.keywordsTagSquare, query: 'square' },
    { label: t.keywordsTagChord, query: 'chord' },
    { label: t.keywordsTagExtrema, query: 'extrema' },
    { label: t.keywordsTagVertical, query: 'vertical' },
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
      if (selectedTag !== 'all' && q.tag !== selectedTag) return false;
      if (masteredFilter === 'unmastered' && q.isMastered) return false;
      if (masteredFilter === 'mastered' && !q.isMastered) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = q.title.toLowerCase().includes(query);
        const matchNote = q.userNote.toLowerCase().includes(query);
        const matchTag = q.tag.toLowerCase().includes(query);
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
          alert('Import failed. Invalid JSON format.');
        }
      };
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-indigo-600 shrink-0" />
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">{t.notebookTitle}</h2>
            <span className="text-xs sm:text-sm font-mono text-slate-500">
              ({questions.length} {t.notebookCountText})
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.notebookSub}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowGlossary(!showGlossary)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
              showGlossary ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>{t.glossaryTitle}</span>
          </button>
          <button
            onClick={onOpenSaveModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t.btnSaveCurrent}</span>
          </button>
          <button
            onClick={() => window.print()}
            title={t.btnPrint}
            className="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <Printer className="w-4 h-4" />
            <span>{t.btnPrint}</span>
          </button>
          <button
            onClick={handleExportJSON}
            title={t.btnExportJson}
            className="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>{t.btnExportJson}</span>
          </button>
          <label className="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
            <Upload className="w-4 h-4" />
            <span>{t.btnImportJson}</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>
        </div>
      </div>

      {/* Keywords Glossary Box (Collapsible) */}
      {showGlossary && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 text-xs sm:text-sm">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>{t.glossaryTitle}</span>
            </span>
            <span className="text-xs text-slate-500">{t.glossarySub}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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

      {/* Filter and Search Bar with Quick Keywords */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
            />
          </div>

          {/* Mastered & Tag Selectors */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md text-xs sm:text-sm">
              <button
                onClick={() => setMasteredFilter('all')}
                className={`px-3 py-1 font-medium rounded transition-colors whitespace-nowrap ${
                  masteredFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.filterAll} ({questions.length})
              </button>
              <button
                onClick={() => setMasteredFilter('unmastered')}
                className={`px-3 py-1 font-medium rounded transition-colors whitespace-nowrap ${
                  masteredFilter === 'unmastered'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.filterUnmastered} ({questions.filter((q) => !q.isMastered).length})
              </button>
              <button
                onClick={() => setMasteredFilter('mastered')}
                className={`px-3 py-1 font-medium rounded transition-colors whitespace-nowrap ${
                  masteredFilter === 'mastered'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.filterMastered} ({questions.filter((q) => q.isMastered).length})
              </button>
            </div>

            {/* Tag Filter */}
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-3 py-1.5 text-xs sm:text-sm text-slate-700 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-sky-500"
            >
              <option value="all">{t.filterAllTags}</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Popular Keyword Chips for Quick Search */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
          <span className="text-slate-400 flex items-center gap-1 shrink-0">
            <Tag className="w-3.5 h-3.5" />
            <span>Keywords:</span>
          </span>
          {popularKeywords.map((kw, i) => (
            <button
              key={i}
              onClick={() => setSearchQuery(searchQuery === kw.query ? '' : kw.query)}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap font-medium ${
                searchQuery.toLowerCase() === kw.query
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {kw.label}
            </button>
          ))}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-sky-600 hover:underline shrink-0 ml-1"
            >
              Clear filter
            </button>
          )}
        </div>
      </div>

      {/* Question Cards List */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-slate-500 border border-dashed border-slate-200 rounded-lg space-y-2">
          <p className="text-sm sm:text-base font-semibold">{t.noQuestionsFound}</p>
          <p className="text-xs sm:text-sm text-slate-400">
            {t.noQuestionsSub}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`border rounded-lg p-5 transition-all bg-white hover:border-slate-300 ${
                item.isMastered ? 'border-slate-200' : 'border-slate-300 ring-1 ring-slate-200/50'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => onToggleMastered(item.id)}
                    title={item.isMastered ? t.statusUnmastered : t.statusMastered}
                    className="text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                  >
                    {item.isMastered ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-rose-500" />
                    )}
                  </button>
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                    {highlightMatch(item.title, searchQuery)}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
                  <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {highlightMatch(item.tag, searchQuery)}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-xs">{item.date}</span>
                </div>
              </div>

              {/* Card Body: Equations */}
              <div className="py-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
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

                <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
                  <span className="text-slate-500 block mb-1 font-medium">{t.lineInputHeader}:</span>
                  <MathView
                    math={`${item.generalLine.A}x + ${item.generalLine.B}y + ${item.generalLine.C} = 0`}
                  />
                </div>
              </div>

              {/* Card Note / Reflection */}
              <div className="pt-2 text-xs sm:text-sm">
                {editingNoteId === item.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={tempNote}
                      onChange={(e) => setTempNote(e.target.value)}
                      rows={2}
                      className="w-full p-2.5 text-xs sm:text-sm text-slate-800 bg-white border border-slate-300 rounded focus:outline-none focus:border-sky-500"
                      placeholder="Write your reflections..."
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingNoteId(null)}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                      >
                        {t.btnCancel}
                      </button>
                      <button
                        onClick={() => {
                          onUpdateNote(item.id, tempNote);
                          setEditingNoteId(null);
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded hover:bg-slate-800"
                      >
                        {t.btnSaveNote}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3 bg-amber-50/50 border border-amber-100/60 rounded p-3 text-slate-700">
                    <div className="leading-relaxed">
                      <span className="font-semibold text-amber-900 mr-1.5">{t.noteLabel}</span>
                      <span>
                        {item.userNote
                          ? highlightMatch(item.userNote, searchQuery)
                          : t.noNoteText}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setEditingNoteId(item.id);
                        setTempNote(item.userNote);
                      }}
                      title={t.btnEditNote}
                      className="text-slate-400 hover:text-slate-700 shrink-0 p-1"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 text-xs sm:text-sm">
                <span
                  className={`font-medium ${
                    item.isMastered ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {item.isMastered ? t.statusMastered : t.statusUnmastered}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onLoadQuestion(item)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-sky-700 bg-sky-50 rounded-md hover:bg-sky-100 transition-colors"
                  >
                    <span>{t.btnLoadIntoSolver}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteQuestion(item.id)}
                    title={t.btnDelete}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
