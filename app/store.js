// store.js — NestEgg's state: load the seed on first visit, then keep
// every change in localStorage so the family's edits survive a reload.

import { seedState } from './data.js';

const STORAGE_KEY = 'nestegg-v1';

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.transactions) && Array.isArray(parsed.budgets)) {
        return parsed;
      }
    }
  } catch (err) {
    // A corrupt saved copy falls back to the seed below.
  }
  const fresh = seedState();
  saveState(fresh);
  return fresh;
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    // Private mode or a full store: the page still works for this visit.
  }
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  return loadState();
}

// Money helpers: amounts are stored as signed numbers, negative = spent.
export function money(value) {
  const sign = value < 0 ? '−' : '';
  return sign + '$' + Math.abs(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function moneyWhole(value) {
  const sign = value < 0 ? '−' : '';
  return sign + '$' + Math.abs(Math.round(value)).toLocaleString('en-US');
}

export function monthSpent(transactions) {
  return transactions.reduce((sum, tx) => sum + (tx.amount < 0 ? -tx.amount : 0), 0);
}

export function monthIncome(transactions, baseIncome) {
  const extra = transactions.reduce((sum, tx) => sum + (tx.amount > 0 ? tx.amount : 0), 0);
  return baseIncome + extra;
}

export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function niceDate(iso) {
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
