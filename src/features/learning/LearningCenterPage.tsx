import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  Award,
  Clock,
  CheckCircle2,
  ExternalLink,
  Plus,
  Layers,
  Sparkles,
} from 'lucide-react';
import { LearningRoadmap, LearningCourse } from '../../types';
import { loadRoadmaps, saveRoadmaps } from '../../services/lifeStorageService';

export const LearningCenterPage: React.FC = () => {
  const [roadmaps, setRoadmaps] = useState<LearningRoadmap[]>([]);
  const [activeRoadmapId, setActiveRoadmapId] = useState<string>('');
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseProvider, setNewCourseProvider] = useState('');
  const [newCourseHours, setNewCourseHours] = useState('20');

  useEffect(() => {
    const loaded = loadRoadmaps();
    setRoadmaps(loaded);
    if (loaded.length > 0) {
      setActiveRoadmapId(loaded[0].id);
    }
  }, []);

  const activeRoadmap = roadmaps.find((r) => r.id === activeRoadmapId) || roadmaps[0];

  const handleToggleCourseStatus = (courseId: string) => {
    if (!activeRoadmap) return;
    const updatedCourses = activeRoadmap.courses.map((c) => {
      if (c.id === courseId) {
        const nextStatus = c.status === 'Completed' ? 'In Progress' : 'Completed';
        const completedHours = nextStatus === 'Completed' ? c.totalHours : Math.floor(c.totalHours / 2);
        return { ...c, status: nextStatus, completedHours } as LearningCourse;
      }
      return c;
    });

    const updatedRoadmaps = roadmaps.map((r) =>
      r.id === activeRoadmap.id ? { ...r, courses: updatedCourses } : r
    );
    setRoadmaps(updatedRoadmaps);
    saveRoadmaps(updatedRoadmaps);
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim() || !activeRoadmap) return;

    const newCourse: LearningCourse = {
      id: `course-${Date.now()}`,
      title: newCourseTitle.trim(),
      provider: newCourseProvider.trim() || 'Self-Study',
      topic: activeRoadmap.category,
      totalHours: Number(newCourseHours) || 20,
      completedHours: 0,
      status: 'Planned',
    };

    const updatedRoadmaps = roadmaps.map((r) =>
      r.id === activeRoadmap.id ? { ...r, courses: [...r.courses, newCourse] } : r
    );

    setRoadmaps(updatedRoadmaps);
    saveRoadmaps(updatedRoadmaps);
    setNewCourseTitle('');
    setNewCourseProvider('');
    setIsAddingCourse(false);
  };

  const totalCompletedHours = activeRoadmap
    ? activeRoadmap.courses.reduce((acc, c) => acc + c.completedHours, 0)
    : 0;
  const totalTargetHours = activeRoadmap
    ? activeRoadmap.courses.reduce((acc, c) => acc + c.totalHours, 0)
    : 0;
  const progressPercent = totalTargetHours > 0 ? Math.round((totalCompletedHours / totalTargetHours) * 100) : 0;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/40 via-card-bg to-slate-900 border border-amber-500/20 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                <GraduationCap className="w-3.5 h-3.5" />
                Skill Mastery & Roadmaps
              </span>
              <span className="text-xs text-text-muted">High-Value Engineering Competencies</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Career Learning Center & Technical Roadmaps
            </h1>
            <p className="text-sm md:text-base text-text-muted max-w-2xl leading-relaxed">
              Track structured technical roadmaps, study hours, verified skills, and self-directed curriculum
              to advance from Senior to Staff/Principal level or transition into specialized AI roles.
            </p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Study Progress</p>
              <p className="text-3xl font-black text-amber-400 mt-1">{progressPercent}%</p>
              <p className="text-[11px] text-text-muted mt-0.5">{totalCompletedHours}h / {totalTargetHours}h completed</p>
            </div>
            <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 border-b border-white/5">
        {roadmaps.map((r) => (
          <button
            key={r.id}
            onClick={() => setActiveRoadmapId(r.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
              activeRoadmap?.id === r.id
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md'
                : 'bg-card-bg text-text-muted hover:text-white border border-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            {r.title}
          </button>
        ))}
      </div>

      {activeRoadmap && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Courses & Curricula */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  Curriculum & Course Tracks
                </h2>
                <p className="text-xs text-text-muted">{activeRoadmap.description}</p>
              </div>

              <button
                onClick={() => setIsAddingCourse(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-amber-500/20"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Course
              </button>
            </div>

            <div className="space-y-3">
              {activeRoadmap.courses.map((course) => {
                const isComplete = course.status === 'Completed';

                return (
                  <div
                    key={course.id}
                    className={`card p-4 border transition-all ${
                      isComplete
                        ? 'border-emerald-500/20 bg-slate-950/40'
                        : 'border-white/5 hover:border-amber-500/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              isComplete
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {course.status}
                          </span>
                          <span className="text-xs text-text-muted font-semibold">{course.provider}</span>
                          <span className="inline-flex items-center gap-1 text-[11px] text-text-muted">
                            <Clock className="w-3 h-3" />
                            {course.completedHours}h / {course.totalHours}h
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{course.title}</h4>
                        {course.notes && (
                          <p className="text-xs text-text-muted leading-relaxed pt-1">{course.notes}</p>
                        )}
                      </div>

                      <button
                        onClick={() => handleToggleCourseStatus(course.id)}
                        className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isComplete
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-900 border-white/10 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        {isComplete ? 'Finished' : 'Mark Done'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Skills Inventory */}
          <div className="lg:col-span-5 space-y-6">
            <div className="card p-6 border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Verified Competencies & Skills
              </h3>
              <p className="text-xs text-text-muted">
                Skills tied to this track with technical depth indicators.
              </p>

              <div className="space-y-2.5">
                {activeRoadmap.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="p-3 rounded-xl bg-slate-950/40 border border-white/5 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-white">{skill.name}</p>
                      <span className="text-[10px] text-text-muted uppercase font-semibold">
                        Level: {skill.level}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        skill.verified
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {skill.verified ? '✓ Verified' : 'In Progress'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {isAddingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="card max-w-md w-full p-6 border border-amber-500/30 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" />
              Add Course or Syllabus
            </h3>

            <form onSubmit={handleAddCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus in Go"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
                  Provider or Author
                </label>
                <input
                  type="text"
                  value={newCourseProvider}
                  onChange={(e) => setNewCourseProvider(e.target.value)}
                  placeholder="e.g. MIT OCW / Coursera / O'Reilly"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
                  Total Estimated Hours
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={newCourseHours}
                  onChange={(e) => setNewCourseHours(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCourse(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-text-muted hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-amber-500/20"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningCenterPage;
