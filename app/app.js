// app.js — NestEgg's router and entry point.
// Hash routes, one per section, so every page is reached by a link:
//   #/                Dashboard
//   #/transactions    Transactions
//   #/budgets         Budgets
//   #/bills           Bills
//   #/goals           Goals
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { loadState } from './store.js';
import { dashboard, afterDashboardRender } from './dashboard.js';
import { transactionsView, afterTransactionsRender } from './transactions.js';
import { budgetsView, afterBudgetsRender } from './budgets.js';
import { billsView, afterBillsRender } from './bills.js';
import { goalsView, afterGoalsRender } from './goals.js';

const app = document.getElementById('app');
const navLinks = [...document.querySelectorAll('.main-nav a')];
const state = loadState();

const TITLES = {
  '': 'NestEgg — Household Budget',
  transactions: 'Transactions | NestEgg',
  budgets: 'Budgets | NestEgg',
  bills: 'Bills | NestEgg',
  goals: 'Savings Goals | NestEgg',
};

function render() {
  window.__shotReady = false;
  const route = (location.hash.match(/^#\/([^/?]+)/) || [null, ''])[1] || '';
  const rerender = () => render();

  let html = '';
  let after = null;
  if (route === 'transactions') {
    html = transactionsView(state);
    after = () => afterTransactionsRender(state, rerender);
  } else if (route === 'budgets') {
    html = budgetsView(state);
    after = () => afterBudgetsRender(state, rerender);
  } else if (route === 'bills') {
    html = billsView(state);
    after = () => afterBillsRender(state, rerender);
  } else if (route === 'goals') {
    html = goalsView(state);
    after = () => afterGoalsRender(state, rerender);
  } else {
    html = dashboard(state);
    after = () => afterDashboardRender(state);
  }

  document.title = TITLES[route] || TITLES[''];
  for (const link of navLinks) {
    link.classList.toggle('active', (link.getAttribute('data-route') || '') === route);
  }
  app.innerHTML = html;
  if (after) after();
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
