(() => {
  const canvas = document.getElementById('space-background');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let width, height, particles = [], pointer = {x: -1000, y: -1000};
  function resize() {
    width = innerWidth; height = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = width * dpr; canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(90, Math.max(32, Math.floor(width * height / 17000)));
    particles = Array.from({length: count}, () => ({
      x: Math.random() * width, y: Math.random() * height,
      vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18,
      r: .8 + Math.random() * 1.8, hue: Math.random() > .7 ? 39 : 270
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      if (!motion.matches) {
        const dx = p.x - pointer.x, dy = p.y - pointer.y, d = Math.hypot(dx, dy);
        if (d < 130 && d > 1) { p.vx += dx / d * .045; p.vy += dy / d * .045; }
        p.vx *= .997; p.vy *= .997; p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.hue === 39 ? '#ffd27aa0' : '#b58cff9a'; ctx.fill();
    }
    if (!motion.matches) requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', e => { pointer.x = e.clientX; pointer.y = e.clientY; });
  window.addEventListener('pointerout', e => { if (!e.relatedTarget) pointer = {x:-1000,y:-1000}; });
  const art = document.querySelector('.hero-art');
  if (art && !motion.matches) {
    art.addEventListener('pointermove', e => {
      const r = art.getBoundingClientRect(), x = (e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      art.style.setProperty('--rx', (-y * 12) + 'deg');
      art.style.setProperty('--ry', (x * 14) + 'deg');
      art.style.setProperty('--px', (x * 22) + 'px');
      art.style.setProperty('--py', (y * 22) + 'px');
    });
    art.addEventListener('pointerleave', () => ['--rx','--ry','--px','--py'].forEach(p => art.style.removeProperty(p)));
  }
  resize(); draw();
})();
