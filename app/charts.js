// charts.js — draws NestEgg's spending donut on a <canvas>.
// Plain canvas 2D, no library: slices are drawn from category totals.

export function drawDonut(canvas, slices) {
  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  const cx = size / 2;
  const cy = size / 2;
  const outer = size / 2 - 6;
  const inner = outer * 0.58;
  const total = slices.reduce((sum, s) => sum + s.value, 0);

  ctx.clearRect(0, 0, size, size);
  if (total <= 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, outer, 0, Math.PI * 2);
    ctx.fillStyle = '#f3ead9';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, inner, 0, Math.PI * 2);
    ctx.fillStyle = '#fffdf8';
    ctx.fill();
    return;
  }

  let angle = -Math.PI / 2;
  for (const slice of slices) {
    const sweep = (slice.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outer, angle, angle + sweep);
    ctx.closePath();
    ctx.fillStyle = slice.color;
    ctx.fill();
    angle += sweep;
  }

  // Punch the hole and paint the centre label.
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fillStyle = '#fffdf8';
  ctx.fill();

  ctx.fillStyle = '#143527';
  ctx.font = 'bold 22px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(moneyShort(total), cx, cy - 8);
  ctx.fillStyle = '#6f6558';
  ctx.font = '12px -apple-system, sans-serif';
  ctx.fillText('spent', cx, cy + 14);
}

function moneyShort(value) {
  if (value >= 1000) return '$' + (value / 1000).toFixed(1) + 'k';
  return '$' + Math.round(value);
}

// categoryTotals: [{ label, color, value }] sorted largest first,
// for the legend beside the donut.
export function categoryTotals(transactions, categories) {
  const totals = new Map();
  for (const tx of transactions) {
    if (tx.amount >= 0) continue;
    totals.set(tx.category, (totals.get(tx.category) || 0) + Math.abs(tx.amount));
  }
  return categories
    .map((c) => ({ label: c.label, color: c.color, value: totals.get(c.id) || 0 }))
    .filter((row) => row.value > 0)
    .sort((a, b) => b.value - a.value);
}
