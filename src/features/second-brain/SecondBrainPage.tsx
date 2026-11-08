import React, { useState, useEffect } from 'react';
import {
  Brain,
  Folder,
  Tag,
  Pin,
  Star,
  Plus,
  Search,
  FileText,
  Calendar,
  Save,
  Trash2,
  Share2,
} from 'lucide-react';
import { SecondBrainNote, ParaFolder } from '../../types';
import { loadSecondBrainNotes, saveSecondBrainNotes } from '../../services/lifeStorageService';

const PARA_FOLDERS: { id: ParaFolder; label: string; description: string; color: string }[] = [
  { id: 'projects', label: 'Projects', description: 'Active efforts with a finite deadline', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
  { id: 'areas', label: 'Areas', description: 'Long-term standards & responsibilities', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  { id: 'resources', label: 'Resources', description: 'Topics of ongoing curiosity & knowledge', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  { id: 'archives', label: 'Archives', description: 'Inactive items saved for reference', color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' },
];

export const SecondBrainPage: React.FC = () => {
  const [notes, setNotes] = useState<SecondBrainNote[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<ParaFolder | 'all'>('all');
  const [activeNoteId, setActiveNoteId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');

  useEffect(() => {
    const loaded = loadSecondBrainNotes();
    setNotes(loaded);
    if (loaded.length > 0) {
      setActiveNoteId(loaded[0].id);
      setEditTitle(loaded[0].title);
      setEditContent(loaded[0].content);
      setEditTags(loaded[0].tags.join(', '));
    }
  }, []);

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const handleSelectNote = (note: SecondBrainNote) => {
    setActiveNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditTags(note.tags.join(', '));
    setIsEditing(false);
  };

  const handleSaveNote = () => {
    if (!activeNote) return;
    const tagArray = editTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const updated = notes.map((n) => {
      if (n.id === activeNote.id) {
        return {
          ...n,
          title: editTitle.trim() || 'Untitled Note',
          content: editContent,
          tags: tagArray,
          lastModified: new Date().toISOString().split('T')[0],
        };
      }
      return n;
    });

    setNotes(updated);
    saveSecondBrainNotes(updated);
    setIsEditing(false);
  };

  const handleTogglePin = (noteId: string) => {
    const updated = notes.map((n) =>
      n.id === noteId ? { ...n, isPinned: !n.isPinned } : n
    );
    setNotes(updated);
    saveSecondBrainNotes(updated);
  };

  const handleToggleFavorite = (noteId: string) => {
    const updated = notes.map((n) =>
      n.id === noteId ? { ...n, isFavorite: !n.isFavorite } : n
    );
    setNotes(updated);
    saveSecondBrainNotes(updated);
  };

  const handleCreateNote = () => {
    const newNote: SecondBrainNote = {
      id: `note-${Date.now()}`,
      title: 'New Knowledge Note',
      folder: selectedFolder === 'all' ? 'projects' : selectedFolder,
      tags: ['Idea'],
      content: '# New Idea\n\nCapture insights, architectures, or meeting takeaways here...',
      lastModified: new Date().toISOString().split('T')[0],
    };

    const updated = [newNote, ...notes];
    setNotes(updated);
    saveSecondBrainNotes(updated);
    handleSelectNote(newNote);
    setIsEditing(true);
  };

  const handleDeleteNote = (noteId: string) => {
    const updated = notes.filter((n) => n.id !== noteId);
    setNotes(updated);
    saveSecondBrainNotes(updated);
    if (updated.length > 0) {
      handleSelectNote(updated[0]);
    }
  };

  const filteredNotes = notes.filter((n) => {
    const matchesFolder = selectedFolder === 'all' || n.folder === selectedFolder;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q));
    return matchesFolder && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/40 via-card-bg to-slate-900 border border-indigo-500/20 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                <Brain className="w-3.5 h-3.5" />
                P.A.R.A. Knowledge Vault
              </span>
              <span className="text-xs text-text-muted">Tiago Forte Architecture</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Personal Second Brain & Engineering Vault
            </h1>
            <p className="text-sm md:text-base text-text-muted max-w-2xl leading-relaxed">
              Organize digital knowledge for action, not accumulation. Categorize by Projects, Areas,
              Resources, and Archives so you can recall system architectures and behavioral frameworks in seconds.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/60 p-4 rounded-xl border border-white/5">
            <div className="text-center px-2">
              <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Total Notes</p>
              <p className="text-3xl font-black text-indigo-400 mt-1">{notes.length}</p>
              <p className="text-[11px] text-text-muted mt-0.5">All offline stored</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <button
              onClick={handleCreateNote}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-indigo-500/20"
            >
              <Plus className="w-4 h-4" />
              New Note
            </button>
          </div>
        </div>
      </div>

      {/* P.A.R.A. Folder Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedFolder('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            selectedFolder === 'all'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'bg-card-bg text-text-muted hover:text-white border border-white/5'
          }`}
        >
          All Notes ({notes.length})
        </button>

        {PARA_FOLDERS.map((f) => {
          const count = notes.filter((n) => n.folder === f.id).length;
          return (
            <button
              key={f.id}
              onClick={() => setSelectedFolder(f.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                selectedFolder === f.id
                  ? `${f.color} border shadow-sm`
                  : 'bg-card-bg text-text-muted hover:text-white border border-white/5'
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              {f.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Main Split Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Notes List with Search */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search knowledge vault..."
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
            {filteredNotes.length === 0 ? (
              <div className="card p-6 text-center text-text-muted">
                <FileText className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-semibold">No notes in this folder</p>
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isActive = activeNote?.id === note.id;

                return (
                  <div
                    key={note.id}
                    onClick={() => handleSelectNote(note)}
                    className={`card p-4 cursor-pointer transition-all border ${
                      isActive
                        ? 'border-indigo-500/50 bg-indigo-950/20 shadow-md'
                        : 'border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          {note.isPinned && <Pin className="w-3 h-3 text-amber-400 fill-amber-400" />}
                          {note.isFavorite && <Star className="w-3 h-3 text-pink-400 fill-pink-400" />}
                          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                            {note.folder}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white line-clamp-1">{note.title}</h4>
                      </div>
                      <span className="text-[10px] text-text-muted whitespace-nowrap">
                        {note.lastModified}
                      </span>
                    </div>

                    <p className="text-xs text-text-muted line-clamp-2 mt-1.5 leading-relaxed">
                      {note.content.replace(/^#+\s+/gm, '')}
                    </p>

                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {note.tags.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-900 border border-white/5 text-slate-400"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Note Reader / Editor */}
        <div className="lg:col-span-8">
          {activeNote ? (
            <div className="card p-6 border border-white/10 space-y-6">
              {/* Header Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {activeNote.folder}
                    </span>
                    <span className="text-xs text-text-muted flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Updated {activeNote.lastModified}
                    </span>
                  </div>

                  {isEditing ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="text-xl font-bold text-white bg-slate-900 px-3 py-1.5 rounded-lg border border-indigo-500 focus:outline-none w-full"
                    />
                  ) : (
                    <h2 className="text-xl md:text-2xl font-black text-white">{activeNote.title}</h2>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTogglePin(activeNote.id)}
                    className={`p-2 rounded-lg border transition-colors ${
                      activeNote.isPinned
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-900 text-text-muted border-white/5 hover:text-white'
                    }`}
                    title="Pin Note"
                  >
                    <Pin className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleToggleFavorite(activeNote.id)}
                    className={`p-2 rounded-lg border transition-colors ${
                      activeNote.isFavorite
                        ? 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                        : 'bg-slate-900 text-text-muted border-white/5 hover:text-white'
                    }`}
                    title="Favorite Note"
                  >
                    <Star className="w-4 h-4" />
                  </button>

                  {isEditing ? (
                    <button
                      onClick={handleSaveNote}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
                    >
                      Edit Note
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteNote(activeNote.id)}
                    className="p-2 rounded-lg bg-slate-900 text-text-muted hover:text-rose-400 hover:bg-rose-500/10 border border-white/5 transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tag Editor (If Editing) */}
              {isEditing && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-muted">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder="Architecture, SystemDesign, Distributed"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              {/* Note Content */}
              {isEditing ? (
                <textarea
                  rows={16}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full font-mono text-sm leading-relaxed text-slate-200 bg-slate-950/80 p-4 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500 resize-y"
                />
              ) : (
                <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
                  <div className="whitespace-pre-wrap font-sans">{activeNote.content}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="card p-12 text-center text-text-muted space-y-3">
              <Brain className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-base font-bold text-white">Select or create a note</p>
              <p className="text-xs">Your personal digital garden is waiting for insights.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecondBrainPage;
