// dashboard.js — the home page: the month at a glance.
// Income vs spending, what is left, the spending donut, recent activity.

import { HOUSEHOLD, CATEGORIES } from './data.js';
import { money, moneyWhole, monthSpent, monthIncome, escapeHtml, niceDate } from './store.js';
import { drawDonut, categoryTotals } from './charts.js';

export function dashboard(state) {
  const spent = monthSpent(state.transactions);
  const income = monthIncome(state.transactions, HOUSEHOLD.income);
  const remaining = income - spent;
  const budgetTotal = state.budgets.reduce((sum, b) => sum + b.limit, 0);
  const recent = [...state.transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);
  const slices = categoryTotals(state.transactions, CATEGORIES);
  const topCategory = slices[0];

  return `
    <h1>Good evening, Alvarez family</h1>
    <p class="page-intro">Here is November 2026 so far — what came in, what went out, and what is left for the last days of the month.</p>

    <div class="grid grid-3">
      <section class="card">
        <p class="stat-label">Income this month</p>
        <p class="stat-value good">${moneyWhole(income)}</p>
        <p class="stat-sub">Maya $3,850 &middot; Daniel $3,000</p>
      </section>
      <section class="card">
        <p class="stat-label">Spent so far</p>
        <p class="stat-value">${moneyWhole(spent)}</p>
        <p class="stat-sub">of ${moneyWhole(budgetTotal)} planned across envelopes</p>
      </section>
      <section class="card">
        <p class="stat-label">Left to spend</p>
        <p class="stat-value ${remaining < 0 ? 'over' : 'good'}">${moneyWhole(remaining)}</p>
        <p class="stat-sub">${remaining >= 0 ? 'On track — room for the last week' : 'Over the monthly income'}</p>
      </section>
    </div>

    <div class="grid grid-2 section-gap">
      <section class="card">
        <h2>Where the money went</h2>
        <div class="chart-wrap">
          <canvas id="spending-donut" width="220" height="220" role="img" aria-label="Donut chart of spending by category"></canvas>
          <ul class="legend chart-legend">
            ${slices.map((s) => `<li><span class="swatch" style="background:${s.color}"></span>${escapeHtml(s.label)}<span class="legend-amount">${moneyWhole(s.value)}</span></li>`).join('')}
          </ul>
        </div>
        ${topCategory ? `<p class="muted">Biggest slice: <b>${escapeHtml(topCategory.label)}</b> at ${moneyWhole(topCategory.value)} — mostly the rent and the weekly shop.</p>` : ''}
      </section>

      <section class="card">
        <h2>Recent transactions</h2>
        <table>
          <thead><tr><th>Date</th><th>What</th><th class="amount">Amount</th></tr></thead>
          <tbody>
            ${recent.map((tx) => {
              const cat = CATEGORIES.find((c) => c.id === tx.category);
              return `<tr>
                <td>${niceDate(tx.date)}</td>
                <td>${escapeHtml(tx.description)}<br><span class="tag">${cat ? escapeHtml(cat.label) : 'Other'}</span></td>
                <td class="amount ${tx.amount < 0 ? 'money-out' : 'money-in'}">${money(tx.amount)}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
        <p><a href="#/transactions">See all transactions &rarr;</a></p>
      </section>
    </div>

    <div class="grid grid-2 section-gap">
      <section class="card">
        <h2>This month's envelopes</h2>
        <p class="muted">Groceries is the envelope to watch: $843.70 of $950 used with a week still to go. Housing, utilities and transport are all inside their limits.</p>
        <p><a class="btn" href="#/budgets">Check the budgets</a></p>
      </section>
      <section class="card">
        <h2>Bills still to pay</h2>
        <p class="muted">Three bills are still open in November: Daniel's phone plan ($55, due Nov 24), car insurance ($132, due Nov 28) and home insurance ($78, due Nov 30).</p>
        <p><a class="btn" href="#/bills">See the bills</a></p>
      </section>
    </div>`;
}

export function afterDashboardRender(state) {
  const canvas = document.getElementById('spending-donut');
  if (canvas) drawDonut(canvas, categoryTotals(state.transactions, CATEGORIES));
}
