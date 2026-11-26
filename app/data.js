// NestEgg seed data: the Alvarez household, a family of four.
// Maya (teacher) and Daniel (electrician), with Sofia (9) and Leo (6).
// Figures are for November 2026. All amounts are in US dollars.

export const HOUSEHOLD = {
  name: 'The Alvarez Household',
  members: ['Maya', 'Daniel', 'Sofia', 'Leo'],
  month: 'November 2026',
  monthKey: '2026-11',
  income: 6850,
  incomeSources: [
    { label: "Maya's teaching salary", amount: 3850 },
    { label: "Daniel's electrician pay", amount: 3000 },
  ],
};

export const CATEGORIES = [
  { id: 'groceries', label: 'Groceries', color: '#1e4d38' },
  { id: 'housing', label: 'Housing', color: '#c08a2d' },
  { id: 'utilities', label: 'Utilities', color: '#5b7fa6' },
  { id: 'transport', label: 'Transport', color: '#7a5a8c' },
  { id: 'dining', label: 'Dining out', color: '#a43d2a' },
  { id: 'kids', label: 'Kids & school', color: '#4d8a7a' },
  { id: 'health', label: 'Health', color: '#8c6d4f' },
  { id: 'fun', label: 'Fun & leisure', color: '#b97a1e' },
  { id: 'other', label: 'Other', color: '#6f6558' },
];

export const SEED_BUDGETS = [
  { category: 'groceries', limit: 950 },
  { category: 'housing', limit: 1850 },
  { category: 'utilities', limit: 420 },
  { category: 'transport', limit: 380 },
  { category: 'dining', limit: 240 },
  { category: 'kids', limit: 310 },
  { category: 'health', limit: 180 },
  { category: 'fun', limit: 200 },
  { category: 'other', limit: 150 },
];

export const SEED_TRANSACTIONS = [
  { id: 't01', date: '2026-11-01', description: 'Rent — Maple Street apartment', category: 'housing', amount: -1850, note: 'Monthly rent, due the 1st' },
  { id: 't02', date: '2026-11-02', description: 'GreenMart weekly shop', category: 'groceries', amount: -142.60, note: 'Groceries for the week' },
  { id: 't03', date: '2026-11-03', description: 'City power & light', category: 'utilities', amount: -118.40, note: 'October electricity bill' },
  { id: 't04', date: '2026-11-04', description: 'Fuel — Shell on 5th Ave', category: 'transport', amount: -46.20, note: 'Daniel’s truck' },
  { id: 't05', date: '2026-11-06', description: 'Sofia’s school lunch money', category: 'kids', amount: -45.00, note: 'November lunch card top-up' },
  { id: 't06', date: '2026-11-07', description: 'GreenMart weekly shop', category: 'groceries', amount: -168.35, note: 'Includes Thanksgiving pantry items' },
  { id: 't07', date: '2026-11-08', description: 'Sunday pizza night', category: 'dining', amount: -38.50, note: 'Family pizza, delivery' },
  { id: 't08', date: '2026-11-09', description: 'Water bill', category: 'utilities', amount: -64.75, note: 'City water, quarterly' },
  { id: 't09', date: '2026-11-10', description: 'Pharmacy — Leo’s inhaler refill', category: 'health', amount: -28.90, note: 'Prescription refill' },
  { id: 't10', date: '2026-11-11', description: 'Bus passes — Maya & Daniel', category: 'transport', amount: -96.00, note: 'Monthly transit passes' },
  { id: 't11', date: '2026-11-12', description: 'GreenMart weekly shop', category: 'groceries', amount: -155.80, note: 'Groceries for the week' },
  { id: 't12', date: '2026-11-13', description: 'Leo’s football boots', category: 'kids', amount: -54.99, note: 'New boots, outgrew the old pair' },
  { id: 't13', date: '2026-11-14', description: 'Cinema — family film night', category: 'fun', amount: -42.00, note: 'Four tickets, Saturday matinee' },
  { id: 't14', date: '2026-11-15', description: 'Internet & TV', category: 'utilities', amount: -89.00, note: 'Monthly broadband + TV' },
  { id: 't15', date: '2026-11-17', description: 'GreenMart weekly shop', category: 'groceries', amount: -131.45, note: 'Groceries for the week' },
  { id: 't16', date: '2026-11-18', description: 'Dentist check-up — Sofia', category: 'health', amount: -65.00, note: 'Six-month check-up, co-pay' },
  { id: 't17', date: '2026-11-19', description: 'Takeaway tacos', category: 'dining', amount: -27.40, note: 'Thursday treat' },
  { id: 't18', date: '2026-11-20', description: 'Fuel — Shell on 5th Ave', category: 'transport', amount: -52.75, note: 'Daniel’s truck' },
  { id: 't19', date: '2026-11-21', description: 'GreenMart weekly shop', category: 'groceries', amount: -149.20, note: 'Groceries for the week' },
  { id: 't20', date: '2026-11-22', description: 'Library book fair — Sofia & Leo', category: 'kids', amount: -23.50, note: 'Two books each' },
  { id: 't21', date: '2026-11-23', description: 'Streaming subscription', category: 'fun', amount: -15.99, note: 'Monthly family plan' },
  { id: 't22', date: '2026-11-24', description: 'Phone plan — Maya', category: 'utilities', amount: -55.00, note: 'Monthly mobile plan' },
  { id: 't23', date: '2026-11-25', description: 'Thanksgiving groceries', category: 'groceries', amount: -96.30, note: 'Turkey, sides and pie' },
];

export const SEED_BILLS = [
  { id: 'b01', name: 'Rent — Maple Street apartment', amount: 1850, dueDay: 1, paid: true, note: 'Paid on the 1st' },
  { id: 'b02', name: 'Electricity — City Power & Light', amount: 118.40, dueDay: 3, paid: true, note: 'October usage' },
  { id: 'b03', name: 'Water bill', amount: 64.75, dueDay: 8, paid: true, note: 'Quarterly' },
  { id: 'b04', name: 'Internet & TV', amount: 89.00, dueDay: 15, paid: true, note: 'Broadband + TV bundle' },
  { id: 'b05', name: 'Phone plan — Maya', amount: 55.00, dueDay: 24, paid: true, note: 'Mobile plan' },
  { id: 'b06', name: 'Phone plan — Daniel', amount: 55.00, dueDay: 24, paid: false, note: 'Mobile plan' },
  { id: 'b07', name: 'Car insurance', amount: 132.00, dueDay: 28, paid: false, note: 'Monthly premium, due Nov 28' },
  { id: 'b08', name: 'Home insurance', amount: 78.00, dueDay: 30, paid: false, note: 'Monthly premium, due Nov 30' },
];

export const SEED_GOALS = [
  { id: 'g01', name: 'Emergency fund', target: 10000, saved: 6250, note: 'Six months of essentials, for peace of mind' },
  { id: 'g02', name: 'Family holiday — beach trip', target: 2400, saved: 1480, note: 'A week by the coast next summer' },
  { id: 'g03', name: 'New car down payment', target: 5000, saved: 1200, note: 'Replacing the old truck in 2027' },
  { id: 'g04', name: 'Kids’ college jar', target: 3000, saved: 860, note: 'A little each month for Sofia and Leo' },
];

export function seedState() {
  return {
    transactions: SEED_TRANSACTIONS.map((t) => ({ ...t })),
    budgets: SEED_BUDGETS.map((b) => ({ ...b })),
    bills: SEED_BILLS.map((b) => ({ ...b })),
    goals: SEED_GOALS.map((g) => ({ ...g })),
  };
}
