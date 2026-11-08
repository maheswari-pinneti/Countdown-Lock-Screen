import React, { useState, useEffect } from 'react';
import {
  Wallet,
  PiggyBank,
  TrendingUp,
  ShieldCheck,
  Plus,
  DollarSign,
  ArrowUpRight,
  PieChart,
} from 'lucide-react';
import { BudgetCategory, SavingsGoal } from '../../types';
import {
  loadBudgetCategories,
  saveBudgetCategories,
  loadSavingsGoals,
  saveSavingsGoals,
} from '../../services/lifeStorageService';
import { formatCurrencyValue, SupportedCurrency } from '../../utils/i18n';

export const FinancePage: React.FC = () => {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [currency, setCurrency] = useState<SupportedCurrency>('USD');
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('5000');
  const [newGoalCurrent, setNewGoalCurrent] = useState('1000');

  useEffect(() => {
    setCategories(loadBudgetCategories());
    setSavingsGoals(loadSavingsGoals());
  }, []);

  const totalBudgeted = categories.reduce((sum, c) => sum + c.budgeted, 0);
  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
  const fixedExpenses = categories.filter((c) => c.type === 'fixed').reduce((s, c) => s + c.budgeted, 0);
  const totalSavings = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);

  // Career Runway in months = Total Liquid Savings / Monthly Fixed Expenses
  const runwayMonths = fixedExpenses > 0 ? (totalSavings / fixedExpenses).toFixed(1) : '∞';

  const handleUpdateSpent = (catId: string, delta: number) => {
    const updated = categories.map((c) => {
      if (c.id === catId) {
        return { ...c, spent: Math.max(0, c.spent + delta) };
      }
      return c;
    });
    setCategories(updated);
    saveBudgetCategories(updated);
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    const newGoal: SavingsGoal = {
      id: `sg-${Date.now()}`,
      title: newGoalTitle.trim(),
      targetAmount: Number(newGoalTarget) || 5000,
      currentAmount: Number(newGoalCurrent) || 0,
      targetDate: '2027-01-01',
    };

    const updated = [...savingsGoals, newGoal];
    setSavingsGoals(updated);
    saveSavingsGoals(updated);
    setNewGoalTitle('');
    setIsAddingGoal(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/40 via-card-bg to-slate-900 border border-emerald-500/20 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Wallet className="w-3.5 h-3.5" />
                Career Runway & Financial Freedom
              </span>
              <span className="text-xs text-text-muted">Freedom = Choice</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Personal Finance & Runway Command
            </h1>
            <p className="text-sm md:text-base text-text-muted max-w-2xl leading-relaxed">
              Financial runway is what gives you the leverage to walk away from toxic workplaces,
              negotiate top compensation packages, and take calculated career risks without desperation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="CAD">CAD (C$)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase">Freedom Runway</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400">{runwayMonths} mo</p>
          <p className="text-[11px] text-text-muted">Based on fixed burn of {formatCurrencyValue(fixedExpenses, currency)}/mo</p>
        </div>

        <div className="card p-5 border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase">Total Savings Stash</span>
            <PiggyBank className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-3xl font-black text-sky-400">{formatCurrencyValue(totalSavings, currency)}</p>
          <p className="text-[11px] text-text-muted">Across all active savings targets</p>
        </div>

        <div className="card p-5 border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase">Monthly Budget</span>
            <PieChart className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-black text-white">{formatCurrencyValue(totalBudgeted, currency)}</p>
          <p className="text-[11px] text-text-muted">Total target monthly expenditure</p>
        </div>

        <div className="card p-5 border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase">Spent This Month</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-400">{formatCurrencyValue(totalSpent, currency)}</p>
          <p className="text-[11px] text-text-muted">
            {formatCurrencyValue(Math.max(0, totalBudgeted - totalSpent), currency)} remaining buffer
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Budget Categories (50/30/20) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Monthly Budget & Burn Rate
            </h2>
            <span className="text-xs text-text-muted">50/30/20 Conscious Spending</span>
          </div>

          <div className="space-y-3">
            {categories.map((cat) => {
              const percent = cat.budgeted > 0 ? Math.min(100, Math.round((cat.spent / cat.budgeted) * 100)) : 0;
              const isOver = cat.spent > cat.budgeted;

              return (
                <div key={cat.id} className="card p-4 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          cat.type === 'fixed'
                            ? 'bg-rose-500/20 text-rose-300'
                            : cat.type === 'flexible'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {cat.type}
                      </span>
                      <h4 className="text-sm font-bold text-white">{cat.name}</h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold ${isOver ? 'text-rose-400' : 'text-slate-300'}`}>
                        {formatCurrencyValue(cat.spent, currency)} / {formatCurrencyValue(cat.budgeted, currency)}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleUpdateSpent(cat.id, 50)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300"
                        >
                          +$50
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isOver
                          ? 'bg-rose-500'
                          : percent > 85
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Savings & Freedom Goals */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-emerald-400" />
              Savings & Freedom Milestones
            </h2>
            <button
              onClick={() => setIsAddingGoal(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Goal
            </button>
          </div>

          <div className="space-y-3">
            {savingsGoals.map((goal) => {
              const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

              return (
                <div key={goal.id} className="card p-4 border border-white/5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{goal.title}</h4>
                      <p className="text-[11px] text-text-muted">Target: {goal.targetDate}</p>
                    </div>
                    <span className="text-xs font-black text-emerald-400">{percent}%</span>
                  </div>

                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>{formatCurrencyValue(goal.currentAmount, currency)}</span>
                    <span>Target: {formatCurrencyValue(goal.targetAmount, currency)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Savings Goal Modal */}
      {isAddingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="card max-w-md w-full p-6 border border-emerald-500/30 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" />
              Create Savings Milestone
            </h3>

            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  required
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="e.g. 1-Year Career Sabbatical Runway"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
                    Target Amount ($)
                  </label>
                  <input
                    type="number"
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
                    Current Saved ($)
                  </label>
                  <input
                    type="number"
                    value={newGoalCurrent}
                    onChange={(e) => setNewGoalCurrent(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingGoal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-text-muted hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-emerald-500/20"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancePage;
