// transactions.js — the full ledger: list, filter, add, edit and delete.
// Every change is saved to localStorage and the totals update at once.

import { CATEGORIES } from './data.js';
import { money, monthSpent, escapeHtml, niceDate, saveState } from './store.js';

let filterCategory = 'all';
let editingId = null;

export function transactionsView(state) {
  const spent = monthSpent(state.transactions);
  const shown = state.transactions
    .filter((tx) => filterCategory === 'all' || tx.category === filterCategory)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  const shownSpent = shown.reduce((sum, tx) => sum + (tx.amount < 0 ? -tx.amount : 0), 0);
  const editing = editingId ? state.transactions.find((tx) => tx.id === editingId) : null;

  const biggest = state.transactions.reduce((worst, tx) => (tx.amount < (worst?.amount ?? 0) ? tx : worst), null);

  const rows = shown.map((tx) => {
    const cat = CATEGORIES.find((c) => c.id === tx.category);
    return `<tr>
      <td>${niceDate(tx.date)}</td>
      <td>${escapeHtml(tx.description)}${tx.note ? `<br><span class="muted">${escapeHtml(tx.note)}</span>` : ''}</td>
      <td><span class="tag">${cat ? escapeHtml(cat.label) : 'Other'}</span></td>
      <td class="amount ${tx.amount < 0 ? 'money-out' : 'money-in'}">${money(tx.amount)}</td>
      <td class="hide-phone">
        <button class="btn-ghost btn-small" data-edit="${tx.id}">Edit</button>
        <button class="btn-danger btn-small" data-delete="${tx.id}">Delete</button>
      </td>
    </tr>`;
  }).join('');

  return `
    <h1>Transactions</h1>
    <p class="page-intro">Every dollar in and out for November 2026. Add a purchase as it happens, fix a mistake, or filter by category to see where the money is going.</p>

    <div class="grid grid-3">
      <section class="card">
        <p class="stat-label">Spent in November</p>
        <p class="stat-value">${money(spent)}</p>
        <p class="stat-sub">${state.transactions.length} transactions recorded</p>
      </section>
      <section class="card">
        <p class="stat-label">Showing now</p>
        <p class="stat-value">${money(shownSpent)}</p>
        <p class="stat-sub">${shown.length} transaction${shown.length === 1 ? '' : 's'}${filterCategory === 'all' ? '' : ' in ' + escapeHtml(CATEGORIES.find((c) => c.id === filterCategory)?.label || '')}</p>
      </section>
      <section class="card">
        <p class="stat-label">Biggest single spend</p>
        <p class="stat-value">${biggest ? money(biggest.amount) : '—'}</p>
        <p class="stat-sub">${biggest ? escapeHtml(biggest.description) + ', ' + niceDate(biggest.date) : 'No spending recorded yet'}</p>
      </section>
    </div>

    <section class="card section-gap">
      <h2>${editing ? 'Edit transaction' : 'Add a transaction'}</h2>
      <form class="tx-form" id="tx-form">
        <label>Date
          <input type="date" name="date" required value="${editing ? editing.date : '2026-11-26'}">
        </label>
        <label>Amount (use a minus for spending)
          <input type="number" name="amount" step="0.01" required value="${editing ? editing.amount : '-25.00'}">
        </label>
        <label class="full">Description
          <input type="text" name="description" required maxlength="120" placeholder="e.g. GreenMart weekly shop" value="${editing ? escapeHtml(editing.description) : ''}">
        </label>
        <label>Category
          <select name="category">
            ${CATEGORIES.map((c) => `<option value="${c.id}" ${editing && editing.category === c.id ? 'selected' : ''}>${escapeHtml(c.label)}</option>`).join('')}
          </select>
        </label>
        <label>Note (optional)
          <input type="text" name="note" maxlength="120" placeholder="e.g. Includes Leo's snacks" value="${editing ? escapeHtml(editing.note || '') : ''}">
        </label>
        <div class="form-actions">
          <button class="btn" type="submit">${editing ? 'Save changes' : 'Add transaction'}</button>
          ${editing ? '<button class="btn-ghost" type="button" id="cancel-edit">Cancel</button>' : ''}
        </div>
      </form>
    </section>

    <section class="card section-gap">
      <div class="toolbar">
        <label for="cat-filter"><b>Filter by category</b></label>
        <select id="cat-filter">
          <option value="all" ${filterCategory === 'all' ? 'selected' : ''}>All categories</option>
          ${CATEGORIES.map((c) => `<option value="${c.id}" ${filterCategory === c.id ? 'selected' : ''}>${escapeHtml(c.label)}</option>`).join('')}
        </select>
        <span class="spacer"></span>
        <span class="total-line">Showing ${money(shownSpent)} spent</span>
      </div>
      <table>
        <thead><tr><th>Date</th><th>What</th><th>Category</th><th class="amount">Amount</th><th class="hide-phone">Actions</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="5" class="empty-note">No transactions in this category yet.</td></tr>'}</tbody>
      </table>
    </section>`;
}

export function afterTransactionsRender(state, rerender) {
  const filter = document.getElementById('cat-filter');
  if (filter) {
    filter.addEventListener('change', () => {
      filterCategory = filter.value;
      rerender();
    });
  }

  const form = document.getElementById('tx-form');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const amount = Number(data.get('amount'));
      if (!Number.isFinite(amount) || amount === 0) return;
      const description = String(data.get('description') || '').trim();
      if (!description) return;
      if (editingId) {
        const tx = state.transactions.find((t) => t.id === editingId);
        if (tx) {
          tx.date = String(data.get('date'));
          tx.amount = amount;
          tx.description = description;
          tx.category = String(data.get('category'));
          tx.note = String(data.get('note') || '').trim();
        }
        editingId = null;
      } else {
        state.transactions.push({
          id: 't' + Date.now().toString(36),
          date: String(data.get('date')),
          amount,
          description,
          category: String(data.get('category')),
          note: String(data.get('note') || '').trim(),
        });
      }
      saveState(state);
      rerender();
    });
  }

  const cancel = document.getElementById('cancel-edit');
  if (cancel) {
    cancel.addEventListener('click', () => {
      editingId = null;
      rerender();
    });
  }

  document.querySelectorAll('[data-edit]').forEach((button) => {
    button.addEventListener('click', () => {
      editingId = button.getAttribute('data-edit');
      rerender();
      document.getElementById('tx-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  document.querySelectorAll('[data-delete]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-delete');
      const tx = state.transactions.find((t) => t.id === id);
      if (tx && window.confirm(`Delete "${tx.description}" (${money(tx.amount)})?`)) {
        state.transactions = state.transactions.filter((t) => t.id !== id);
        if (editingId === id) editingId = null;
        saveState(state);
        rerender();
      }
    });
  });
}
