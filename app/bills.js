// bills.js — recurring bills: what is due, when, and whether it is paid.
// Marking a bill paid updates the totals and the count at once.

import { money, escapeHtml, saveState } from './store.js';

const TODAY = 26; // Day of the month shown on the dashboard (Nov 26, 2026).

export function billsView(state) {
  const open = state.bills.filter((b) => !b.paid);
  const paid = state.bills.filter((b) => b.paid);
  const openTotal = open.reduce((sum, b) => sum + b.amount, 0);
  const paidTotal = paid.reduce((sum, b) => sum + b.amount, 0);

  const row = (bill) => {
    const due = bill.paid
      ? `<span class="paid-badge">Paid</span>`
      : bill.dueDay < TODAY
        ? `<span class="overdue-badge">Overdue — due Nov ${bill.dueDay}</span>`
        : bill.dueDay === TODAY
          ? `<span class="due-badge">Due today</span>`
          : `<span class="due-badge">Due Nov ${bill.dueDay}</span>`;
    return `<div class="bill-row">
      <div>
        <div class="bill-name">${escapeHtml(bill.name)}</div>
        <div class="bill-meta">${escapeHtml(bill.note || '')} &middot; ${due}</div>
      </div>
      <div class="bill-amount">${money(bill.amount)}</div>
      ${bill.paid
        ? `<button class="btn-ghost btn-small" data-unpay="${bill.id}">Mark unpaid</button>`
        : `<button class="btn btn-small" data-pay="${bill.id}">Mark paid</button>`}
    </div>`;
  };

  return `
    <h1>Bills</h1>
    <p class="page-intro">The Alvarez household's recurring bills for November 2026. Mark a bill paid as soon as it leaves the account, and the totals below follow.</p>

    <div class="grid grid-3">
      <section class="card">
        <p class="stat-label">Still to pay</p>
        <p class="stat-value ${open.length ? 'over' : 'good'}">${money(openTotal)}</p>
        <p class="stat-sub">${open.length} bill${open.length === 1 ? '' : 's'} open</p>
      </section>
      <section class="card">
        <p class="stat-label">Already paid</p>
        <p class="stat-value good">${money(paidTotal)}</p>
        <p class="stat-sub">${paid.length} bill${paid.length === 1 ? '' : 's'} settled</p>
      </section>
      <section class="card">
        <p class="stat-label">Next due</p>
        <p class="stat-value">${open.length ? 'Nov ' + Math.min(...open.map((b) => b.dueDay)) : '—'}</p>
        <p class="stat-sub">${open.length ? escapeHtml(open.reduce((a, b) => (b.dueDay < a.dueDay ? b : a)).name) : 'Nothing left this month'}</p>
      </section>
    </div>

    <section class="card section-gap">
      <h2>Still to pay</h2>
      ${open.length ? open.map(row).join('') : '<p class="empty-note">Nothing left to pay this month — well done.</p>'}
    </section>

    <section class="card section-gap">
      <h2>Paid in November</h2>
      ${paid.length ? paid.map(row).join('') : '<p class="empty-note">No bills paid yet this month.</p>'}
    </section>`;
}

export function afterBillsRender(state, rerender) {
  document.querySelectorAll('[data-pay]').forEach((button) => {
    button.addEventListener('click', () => {
      const bill = state.bills.find((b) => b.id === button.getAttribute('data-pay'));
      if (bill) {
        bill.paid = true;
        saveState(state);
        rerender();
      }
    });
  });
  document.querySelectorAll('[data-unpay]').forEach((button) => {
    button.addEventListener('click', () => {
      const bill = state.bills.find((b) => b.id === button.getAttribute('data-unpay'));
      if (bill) {
        bill.paid = false;
        saveState(state);
        rerender();
      }
    });
  });
}
