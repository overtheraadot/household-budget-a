// budgets.js — monthly envelopes: one limit per category, with a progress
// bar and an over/under verdict. Limits are editable in place.

import { CATEGORIES } from './data.js';
import { money, moneyWhole, escapeHtml, saveState } from './store.js';

export function budgetsView(state) {
  const totalLimit = state.budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = state.budgets.reduce((sum, b) => sum + spentIn(state, b.category), 0);

  const rows = state.budgets.map((budget) => {
    const cat = CATEGORIES.find((c) => c.id === budget.category);
    const spent = spentIn(state, budget.category);
    const left = budget.limit - spent;
    const pct = budget.limit > 0 ? Math.min(100, Math.round((spent / budget.limit) * 100)) : 0;
    const barClass = spent > budget.limit ? 'over' : pct >= 85 ? 'warn' : '';
    const status = spent > budget.limit
      ? `<span class="status-over">Over by ${money(-left)}</span>`
      : pct >= 85
        ? `<span class="status-warn">${money(left)} left — nearly used up</span>`
        : `<span class="status-ok">${money(left)} left</span>`;

    return `<div class="budget-row">
      <div>
        <b>${cat ? escapeHtml(cat.label) : escapeHtml(budget.category)}</b>
        <span class="tag" style="margin-left:0.4rem">${pct}% used</span>
        <div class="progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="${cat ? escapeHtml(cat.label) : ''} budget used"><span class="${barClass}" style="width:${pct}%"></span></div>
        <div class="budget-meta"><b>${money(spent)}</b> spent of ${money(budget.limit)} &middot; ${status}</div>
      </div>
      <div>
        <button class="btn-ghost btn-small" data-budget="${budget.category}">Edit limit</button>
      </div>
    </div>`;
  }).join('');

  return `
    <h1>Budgets</h1>
    <p class="page-intro">November's envelopes for the Alvarez household. Each category gets one monthly limit; the bar shows how much of it is already spent. Tap "Edit limit" when a month needs a different number.</p>

    <div class="grid grid-3">
      <section class="card">
        <p class="stat-label">Total planned</p>
        <p class="stat-value">${moneyWhole(totalLimit)}</p>
        <p class="stat-sub">Across ${state.budgets.length} envelopes</p>
      </section>
      <section class="card">
        <p class="stat-label">Spent against envelopes</p>
        <p class="stat-value">${moneyWhole(totalSpent)}</p>
        <p class="stat-sub">${moneyWhole(totalLimit - totalSpent)} still inside the plan</p>
      </section>
      <section class="card">
        <p class="stat-label">Envelopes over limit</p>
        <p class="stat-value ${overCount(state) > 0 ? 'over' : 'good'}">${overCount(state)}</p>
        <p class="stat-sub">${overCount(state) === 0 ? 'Every envelope is holding so far' : 'Needs attention this week'}</p>
      </section>
    </div>

    <section class="card section-gap">
      <h2>November envelopes</h2>
      ${rows}
      <p class="muted">Groceries is closest to its limit at 89% — the Thanksgiving shop used most of the last envelope. Everything else has comfortable room.</p>
    </section>`;
}

function spentIn(state, category) {
  return state.transactions
    .filter((tx) => tx.category === category && tx.amount < 0)
    .reduce((sum, tx) => sum + -tx.amount, 0);
}

function overCount(state) {
  return state.budgets.filter((b) => spentIn(state, b.category) > b.limit).length;
}

export function afterBudgetsRender(state, rerender) {
  document.querySelectorAll('[data-budget]').forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-budget');
      const budget = state.budgets.find((b) => b.category === category);
      if (!budget) return;
      const cat = CATEGORIES.find((c) => c.id === category);
      const answer = window.prompt(
        `New monthly limit for ${cat ? cat.label : category} (current ${money(budget.limit)}):`,
        String(budget.limit),
      );
      if (answer === null) return;
      const value = Number(answer);
      if (Number.isFinite(value) && value > 0) {
        budget.limit = Math.round(value * 100) / 100;
        saveState(state);
        rerender();
      } else {
        window.alert('Please enter a positive number, for example 300.');
      }
    });
  });
}
