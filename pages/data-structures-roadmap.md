---
layout: default
title: "数据结构与算法：学习路线"
permalink: "/data-structures-roadmap/"
---

<style>
body:has(.learning-view) .reading-shell { max-width: none; width: 100%; padding: 24px clamp(12px, 2.5vw, 40px) 40px; }
body:has(.learning-view) .reading-paper { max-width: none; width: 100%; padding: clamp(14px, 2vw, 28px); }
.learning-view { margin: 0; }
.learning-view-head { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.learning-view-head h1 { margin: 0; font-size: clamp(1.5rem, 2.4vw, 2rem); }
.learning-view-head p { margin: .25rem 0 0; color: #6f6c80; font-size: .9rem; }
.learning-view-actions { display: flex; gap: .55rem; flex-wrap: wrap; align-items: center; }
.learning-view-actions button { border: 1px solid #d8d0e5; border-radius: 8px; background: #fff; color: #5c4777; padding: .4rem .65rem; font: inherit; font-size: .82rem; cursor: pointer; }
.learning-view-actions button[aria-pressed="true"] { background: #6d4a91; color: white; border-color: #6d4a91; }
.learning-view-actions button:focus-visible { outline: 3px solid #a98bd2; outline-offset: 2px; }
.learning-view-link { font-size: .85rem; white-space: nowrap; }
.learning-view-viewport { --table-scale: .8; position: relative; width: 100%; height: max(680px, calc(100vh - 230px)); overflow: hidden; border: 1px solid #e3e0ef; border-radius: 12px; background: #fff; }
.learning-view-frame { display: block; width: calc(100% / var(--table-scale)); height: calc(100% / var(--table-scale)); max-width: none; border: 0; transform: scale(var(--table-scale)); transform-origin: top left; }
@media (max-width: 700px) { body:has(.learning-view) .reading-shell { padding: 14px 8px 28px; } body:has(.learning-view) .reading-paper { padding: 14px 10px; } .learning-view-viewport { height: 72vh; min-height: 480px; } }
</style>

<section class="learning-view">
  <div class="learning-view-head">
    <div><h1>数据结构与算法学习计划</h1><p>飞书表格视图 · 记录学习与练习</p></div>
    <div class="learning-view-actions"><span>表格缩放</span><button type="button" data-scale=".65" aria-pressed="false">65%</button><button type="button" data-scale=".8" aria-pressed="true">80%</button><button type="button" data-scale="1" aria-pressed="false">100%</button><a class="learning-view-link" href="https://kcnnjotuedu2.feishu.cn/share/base/view/shrcnZZdt5Yj5fHuI7AjXvI68Kf" target="_blank" rel="noopener noreferrer">在飞书中打开 ↗</a></div>
  </div>
  <div class="learning-view-viewport"><iframe class="learning-view-frame" src="https://kcnnjotuedu2.feishu.cn/share/base/view/shrcnZZdt5Yj5fHuI7AjXvI68Kf" title="数据结构与算法学习计划飞书表格" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe></div>
  <p>如果表格没有显示，可以<a href="https://kcnnjotuedu2.feishu.cn/share/base/view/shrcnZZdt5Yj5fHuI7AjXvI68Kf">直接打开飞书表格</a>。</p>
</section>

<script>
(() => {
  const viewport = document.querySelector('.learning-view-viewport');
  const controls = document.querySelectorAll('.learning-view-actions button[data-scale]');
  controls.forEach(button => button.addEventListener('click', () => {
    viewport.style.setProperty('--table-scale', button.dataset.scale);
    controls.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  }));
})();
</script>
