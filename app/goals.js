// goals.js — savings goals: a target, what is saved so far, and a way to
// add money. Progress is a bar plus a plain-language line.

import { money, moneyWhole, escapeHtml, saveState } from './store.js';

export function goalsView(state) {
  const totalSaved = state.goals.reduce((sum, g) => sum + g.saved, 0);
  const totalTarget = state.goals.reduce((sum, g) => sum + g.target, 0);

  const cards = state.goals.map((goal) => {
    const pct = goal.target > 0 ? Math.min(100, Math.round((goal.saved / goal.target) * 100)) : 0;
    const remaining = Math.max(0, goal.target - goal.saved);
    return `<section class="card">
      <div class="goal-head">
        <h2>${escapeHtml(goal.name)}</h2>
        <span class="goal-amount">${moneyWhole(goal.saved)} <span class="muted">of ${moneyWhole(goal.target)}</span></span>
      </div>
      <div class="progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="${escapeHtml(goal.name)} progress"><span style="width:${pct}%"></span></div>
      <p class="budget-meta">${pct}% saved &middot; ${remaining > 0 ? moneyWhole(remaining) + ' to go' : 'Goal reached — well done!'}</p>
      <p class="muted">${escapeHtml(goal.note || '')}</p>
      <div class="goal-actions">
        <input type="number" min="1" step="1" placeholder="Amount $" data-goal-amount="${goal.id}" aria-label="Amount to add to ${escapeHtml(goal.name)}">
        <button class="btn btn-small" data-goal-add="${goal.id}">Add money</button>
      </div>
    </section>`;
  }).join('');

  return `
    <h1>Savings goals</h1>
    <p class="page-intro">What the Alvarez family is saving for. Every goal shows its target, what is already set aside, and how far is left — add money whenever there is a little spare.</p>

    <div class="grid grid-3">
      <section class="card">
        <p class="stat-label">Saved across all goals</p>
        <p class="stat-value good">${moneyWhole(totalSaved)}</p>
        <p class="stat-sub">${state.goals.length} goals in progress</p>
      </section>
      <section class="card">
        <p class="stat-label">Total targets</p>
        <p class="stat-value">${moneyWhole(totalTarget)}</p>
        <p class="stat-sub">${moneyWhole(totalTarget - totalSaved)} still to save</p>
      </section>
      <section class="card">
        <p class="stat-label">Closest to done</p>
        <p class="stat-value">${closestGoal(state)}</p>
        <p class="stat-sub">Emergency fund is 63% there</p>
      </section>
    </div>

    <div class="grid grid-2 section-gap">
      ${cards}
    </div>

    <section class="card section-gap">
      <h2>How the family saves</h2>
      <p>On payday, $400 moves straight into the emergency fund before anything else is spent. Whatever is left at the end of the month is split between the holiday jar and the car fund — the kids' college jar gets $50 on the 1st, no matter what.</p>
    </section>`;
}

function closestGoal(state) {
  let best = null;
  let bestPct = -1;
  for (const goal of state.goals) {
    const pct = goal.target > 0 ? goal.saved / goal.target : 0;
    if (pct > bestPct) {
      bestPct = pct;
      best = goal;
    }
  }
  return best ? escapeHtml(best.name) : '—';
}

export function afterGoalsRender(state, rerender) {
  document.querySelectorAll('[data-goal-add]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-goal-add');
      const input = document.querySelector(`[data-goal-amount="${id}"]`);
      const goal = state.goals.find((g) => g.id === id);
      if (!goal || !input) return;
      const value = Number(input.value);
      if (!Number.isFinite(value) || value <= 0) {
        window.alert('Enter an amount above $0 to add.');
        return;
      }
      goal.saved = Math.round((goal.saved + value) * 100) / 100;
      saveState(state);
      rerender();
    });
  });
}
