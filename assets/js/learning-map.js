(() => {
  const list=document.getElementById('lm-list'), search=document.getElementById('lm-search'), module=document.getElementById('lm-module'), status=document.getElementById('lm-status'), count=document.getElementById('lm-count');
  const el=(tag,cls,text)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(text!=null)x.textContent=text;return x};
  fetch('/assets/data/learning-plan.json').then(r=>{if(!r.ok)throw Error();return r.json()}).then(rows=>{
    const modules=[...new Set(rows.map(r=>r.module).filter(Boolean))];
    for(const m of modules){let o=el('option','',m);o.value=m;module.append(o)}
    document.getElementById('lm-total').textContent=rows.length;
    document.getElementById('lm-done').textContent=rows.filter(r=>r.done).length;
    document.getElementById('lm-remaining').textContent=rows.filter(r=>!r.done).length;
    document.getElementById('lm-modules').textContent=modules.length;
    function render(){
      const q=search.value.trim().toLowerCase();
      let filtered=rows.filter(r=>(!module.value||r.module===module.value)&&(!status.value||(status.value==='done')===r.done)&&(!q||Object.values(r).some(v=>String(v||'').toLowerCase().includes(q))));
      count.textContent=`显示 ${filtered.length} / ${rows.length} 项`;list.replaceChildren();
      for(const m of modules){const group=filtered.filter(r=>r.module===m);if(!group.length)continue;
        const section=el('section','lm-group'), head=el('div','lm-group-head');head.append(el('h2','',m),el('span','',`${group.length} 项`));section.append(head);
        for(const r of group){const card=el('details','lm-card'), summary=el('summary','lm-summary'), mark=el('span',r.done?'lm-check done':'lm-check',r.done?'✓':'');
          const title=el('span','lm-title');title.append(el('strong','',r.topic||'未命名任务'));if(r.stage!=null)title.append(el('small','',`阶段 ${r.stage}`));
          summary.append(mark,title,el('span','lm-state',r.done?'已打卡':'未打卡'),el('span','lm-chevron','+'));card.append(summary);
          const details=el('div','lm-details');for(const [key,label] of [['learn','学习内容'],['practice','手写实现'],['problems','LeetCode'],['file','代码文件'],['priority','重点程度'],['note','备注']]){if(!r[key])continue;const p=el('div','lm-detail');p.append(el('span','',label),el('p','',r[key]));details.append(p)}
          if(r.url){const a=el('a','lm-problem-link','查看题目 ↗');a.href=r.url;a.target='_blank';a.rel='noopener noreferrer';details.append(a)}
          if(!details.childNodes.length)details.append(el('p','lm-no-detail','此项暂无补充说明。'));card.append(details);section.append(card)}list.append(section)}
      if(!filtered.length)list.append(el('p','lm-empty','没有找到匹配的任务。'));
    }
    [search,module,status].forEach(x=>x.addEventListener(x===search?'input':'change',render));render();
  }).catch(()=>{count.textContent='';list.textContent='学习计划暂时无法加载，请稍后刷新。'});
})();
