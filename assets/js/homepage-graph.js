(() => {
  const canvas = document.getElementById('knowledge-graph');
  const tip = document.getElementById('graph-tooltip');
  const empty = document.getElementById('graph-empty');
  const source = document.getElementById('paper-data');
  let notes;
  try { notes = JSON.parse(source.textContent); } catch { notes = []; }
  if (!Array.isArray(notes) || !notes.length) { empty.hidden = false; return; }
  const ctx = canvas.getContext('2d');
  if (!ctx) { empty.hidden = false; return; }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0, height = 0, hovered = null, frame = 0, nodes = [], edges = [];
  const normalized = x => Array.isArray(x) ? x.map(t => String(t).trim().toLowerCase()).filter(Boolean) : [];
  notes.forEach(n => { n.tags = normalized(n.tags); });
  for (let i = 0; i < notes.length; i++) for (let j = i + 1; j < notes.length; j++) {
    if (notes[i].tags.some(tag => notes[j].tags.includes(tag))) edges.push([i, j]);
  }
  function resize() {
    const box = canvas.getBoundingClientRect();
    const oldWidth = width, oldHeight = height;
    width = box.width; height = box.height;
    const scale = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * scale); canvas.height = Math.round(height * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    if (!nodes.length) nodes = notes.map((note, i) => {
      const angle = i * 2.399963, radius = Math.sqrt((i + 1) / (notes.length + 1));
      return { ...note, x: width / 2 + Math.cos(angle) * radius * width * .38, y: height / 2 + Math.sin(angle) * radius * height * .38, vx: 0, vy: 0 };
    });
    else nodes.forEach(n => { n.x = n.x / oldWidth * width; n.y = n.y / oldHeight * height; });
    draw();
  }
  function step() {
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.vx += (width / 2 - a.x) * .00035; a.vy += (height / 2 - a.y) * .00035;
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j], dx = a.x - b.x || .01, dy = a.y - b.y || .01, d2 = Math.max(dx * dx + dy * dy, 100), force = Math.min(160 / d2, .4);
        a.vx += dx * force / Math.sqrt(d2); a.vy += dy * force / Math.sqrt(d2);
        b.vx -= dx * force / Math.sqrt(d2); b.vy -= dy * force / Math.sqrt(d2);
      }
    }
    edges.forEach(([i, j]) => {
      const a = nodes[i], b = nodes[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.max(Math.hypot(dx, dy), 1), f = (d - 78) * .001;
      a.vx += dx / d * f; a.vy += dy / d * f; b.vx -= dx / d * f; b.vy -= dy / d * f;
    });
    nodes.forEach(n => { n.vx *= .9; n.vy *= .9; n.x = Math.max(20, Math.min(width - 20, n.x + n.vx)); n.y = Math.max(20, Math.min(height - 20, n.y + n.vy)); });
  }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    edges.forEach(([i, j]) => {
      const a = nodes[i], b = nodes[j]; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = hovered === i || hovered === j ? '#a8dc9c99' : '#83b99b38'; ctx.lineWidth = 1; ctx.stroke();
    });
    nodes.forEach((n, i) => {
      const radius = hovered === i ? 6 : 3.5;
      ctx.beginPath(); ctx.arc(n.x, n.y, radius + 5, 0, Math.PI * 2); ctx.fillStyle = '#a5dc8c19'; ctx.fill();
      ctx.beginPath(); ctx.arc(n.x, n.y, radius, 0, Math.PI * 2); ctx.fillStyle = hovered === i ? '#f0ffd3' : '#b8df9c'; ctx.fill();
    });
  }
  function animate() { step(); draw(); if (++frame < 900) requestAnimationFrame(animate); }
  canvas.addEventListener('pointermove', event => {
    const rect = canvas.getBoundingClientRect(), x = event.clientX - rect.left, y = event.clientY - rect.top;
    let best = -1, distance = 13;
    nodes.forEach((n, i) => { const d = Math.hypot(n.x - x, n.y - y); if (d < distance) { best = i; distance = d; } });
    hovered = best < 0 ? null : best; canvas.style.cursor = best < 0 ? 'default' : 'pointer'; tip.hidden = best < 0;
    if (best >= 0) { tip.textContent = nodes[best].title; tip.style.left = Math.min(x + 12, width - 210) + 'px'; tip.style.top = Math.max(4, y - 35) + 'px'; }
    draw();
  });
  canvas.addEventListener('pointerleave', () => { hovered = null; tip.hidden = true; draw(); });
  canvas.addEventListener('click', () => { if (hovered !== null) location.href = nodes[hovered].url; });
  window.addEventListener('resize', resize);
  resize();
  if (!reduced) animate();
})();
