[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/overtheraadot/household-budget-a/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/overtheraadot/household-budget-a/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

# NestEgg — Household Budget

A warm, family-focused household budget site for the Alvarez family of four. It shows the month at a glance and gives the household the pages it actually needs: a dashboard, a transactions ledger, monthly budget envelopes, recurring bills, and savings goals — all working, all with real figures, nothing empty or placeholder.

## What it does

- **Dashboard** — November income vs spending, what is left, a donut chart of spending by category, and the most recent transactions.
- **Transactions** — add, edit and delete entries with category, date, amount and note; filter by category; totals update live. Saved in the browser (localStorage).
- **Budgets** — a monthly envelope per category with a progress bar and an over/under verdict; limits are editable.
- **Bills** — recurring bills with due dates; mark paid or unpaid and the totals follow.
- **Goals** — savings goals with progress bars and an add-money control.

The design is warm cream and deep green with serif display headings, and the layout works on a phone as well as a desktop.

## Run it

Serve `app/` with any static HTTP server and open `index.html`:

```sh
cd app
python3 -m http.server 8123
# open http://127.0.0.1:8123/
```

No build step, no network requests — every script, style and figure is a file under `app/`.

## Hand in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored `vendor/makefun-frontend.ts` library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see `LICENSE`.
