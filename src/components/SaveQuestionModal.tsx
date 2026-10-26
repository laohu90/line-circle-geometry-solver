/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, BookmarkPlus } from 'lucide-react';
import { TranslationSchema } from '../i18n/translations';

interface SaveQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, tag: string, note: string) => void;
  defaultTitle?: string;
  t: TranslationSchema;
}

export const SaveQuestionModal: React.FC<SaveQuestionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultTitle = 'Line and Circle Geometry Problem',
  t,
}) => {
  const commonTags = [
    t.keywordsTagSecant,
    t.keywordsTagTangent,
    t.keywordsTagDisjoint,
    t.keywordsTagSquare,
    t.keywordsTagChord,
    t.keywordsTagExtrema,
    t.keywordsTagVertical,
  ];

  const [title, setTitle] = useState(defaultTitle);
  const [tag, setTag] = useState(t.keywordsTagSecant);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(title.trim(), tag, note.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookmarkPlus className="w-5 h-5 text-indigo-600 shrink-0" />
            <h3 className="text-base font-semibold text-slate-900">{t.modalTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-medium text-slate-700 mb-1.5">
              {t.modalFieldTitle}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.modalFieldTitlePlaceholder}
              className="w-full px-3.5 py-2 text-xs sm:text-sm text-slate-800 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1.5">
              {t.modalFieldTag}
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {commonTags.map((tg) => (
                <button
                  type="button"
                  key={tg}
                  onClick={() => setTag(tg)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    tag === tg
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tg}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder={t.modalFieldCustomTag}
              className="w-full px-3.5 py-2 text-xs sm:text-sm text-slate-800 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1.5">
              {t.modalFieldNote}
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.modalFieldNotePlaceholder}
              className="w-full p-3 text-xs sm:text-sm text-slate-800 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              {t.btnCancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-xs"
            >
              {t.btnConfirmSave}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
