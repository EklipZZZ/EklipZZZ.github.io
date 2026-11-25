(() => {
  const canvas = document.getElementById('knowledge-graph'), tip = document.getElementById('graph-tooltip');
  const empty = document.getElementById('graph-empty'), source = document.getElementById('paper-data');
  let notes, relations;
  try { notes = JSON.parse(source.textContent); relations = JSON.parse(document.getElementById('paper-relations').textContent) || []; }
  catch { notes = []; relations = []; }
  if (!Array.isArray(notes) || !notes.length) { empty.hidden = false; return; }
  const ctx = canvas.getContext('2d');
  if (!ctx) { empty.hidden = false; return; }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const slug = url => { const match = String(url).match(/\/lun-wen-bi-ji\/([^/]+)\/?/); return match ? decodeURIComponent(match[1]).toLowerCase() : ''; };
  const normalized = x => Array.isArray(x) ? x.map(t => String(t).trim().toLowerCase()).filter(Boolean) : [];
  notes.forEach(n => { n.tags = normalized(n.tags); n.slug = slug(n.url); });
  const index = new Map(notes.map((n,i) => [n.slug,i])), edgeMap = new Map();
  function addEdge(i,j,kind) {
    if (i == null || j == null || i === j) return;
    const key = [i,j].sort((a,b) => a-b).join(':');
    if (!edgeMap.has(key)) edgeMap.set(key,{i,j,kind});
  }
  if (Array.isArray(relations)) relations.forEach(e => addEdge(index.get(e.source),index.get(e.target),e.kind));
  for (let i=0;i<notes.length;i++) for (let j=i+1;j<notes.length;j++)
    if (notes[i].tags.some(t=>notes[j].tags.includes(t))) addEdge(i,j,'共同标签');
  const edges = [...edgeMap.values()];
  let width=0,height=0,nodes=[],hovered=null,dragged=null,moved=false,press=null,mouse={x:-1000,y:-1000},running=false;
  const degree = notes.map((_,i)=>edges.filter(e=>e.i===i||e.j===i).length);
  function resize() {
    const rect=canvas.getBoundingClientRect(), oldW=width, oldH=height;
    width=rect.width; height=rect.height; const dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=width*dpr; canvas.height=height*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    if (!nodes.length) nodes=notes.map((note,i)=>{
      const angle=i*2.399963, radius=Math.sqrt((i+1)/(notes.length+1));
      return {...note,x:width/2+Math.cos(angle)*radius*width*.37,y:height/2+Math.sin(angle)*radius*height*.37,vx:0,vy:0};
    }); else if(oldW && oldH) nodes.forEach(n=>{n.x=n.x/oldW*width;n.y=n.y/oldH*height;});
    draw(); wake();
  }
  function step() {
    nodes.forEach((a,i)=>{
      if(i===dragged)return;
      a.vx+=(width/2-a.x)*.00028; a.vy+=(height/2-a.y)*.00028;
      for(let j=i+1;j<nodes.length;j++){
        const b=nodes[j],dx=a.x-b.x||.01,dy=a.y-b.y||.01,d2=Math.max(dx*dx+dy*dy,100),f=Math.min(170/d2,.35)/Math.sqrt(d2);
        a.vx+=dx*f;a.vy+=dy*f;if(j!==dragged){b.vx-=dx*f;b.vy-=dy*f;}
      }
      const dx=a.x-mouse.x,dy=a.y-mouse.y,d=Math.hypot(dx,dy);
      if(d<105&&d>1&&i!==hovered){a.vx+=dx/d*.14;a.vy+=dy/d*.14;}
    });
    edges.forEach(e=>{const a=nodes[e.i],b=nodes[e.j],dx=b.x-a.x,dy=b.y-a.y,d=Math.max(Math.hypot(dx,dy),1),f=(d-95)*.0007;if(e.i!==dragged){a.vx+=dx/d*f;a.vy+=dy/d*f;}if(e.j!==dragged){b.vx-=dx/d*f;b.vy-=dy/d*f;}});
    nodes.forEach((n,i)=>{if(i===dragged)return;n.vx*=.94;n.vy*=.94;n.x=Math.max(18,Math.min(width-18,n.x+n.vx));n.y=Math.max(18,Math.min(height-18,n.y+n.vy));});
  }
  function draw() {
    ctx.clearRect(0,0,width,height);
    edges.forEach(e=>{const a=nodes[e.i],b=nodes[e.j],active=hovered===e.i||hovered===e.j;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=active?'#d3b5ffcc':e.kind==='共同标签'?'#9884e537':'#b397ef78';ctx.lineWidth=active?1.5:1;ctx.stroke();});
    nodes.forEach((n,i)=>{const active=i===hovered,r=active?7:Math.min(5,3+degree[i]*.25);
      ctx.beginPath();ctx.arc(n.x,n.y,r+7,0,Math.PI*2);ctx.fillStyle=active?'#e3c4ff40':'#a387ff1a';ctx.fill();
      ctx.beginPath();ctx.arc(n.x,n.y,r,0,Math.PI*2);ctx.fillStyle=active?'#fff2cb':degree[i]?'#d2b7ff':'#a99fc8';ctx.fill();
      if(active||n.slug==='e2o'){ctx.font='12px sans-serif';ctx.fillStyle='#f6efff';ctx.fillText(n.slug==='e2o'?'E2O':n.title.slice(0,18),Math.min(n.x+10,width-105),Math.max(n.y-10,14));}
    });
  }
  function animate(){if(document.hidden||reduced){running=false;return;}step();draw();requestAnimationFrame(animate);}
  function wake(){if(!running&&!reduced){running=true;requestAnimationFrame(animate);}else draw();}
  function pos(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
  function find(x,y){let best=null,distance=14;nodes.forEach((n,i)=>{const d=Math.hypot(n.x-x,n.y-y);if(d<distance){distance=d;best=i;}});return best;}
  canvas.addEventListener('pointermove',e=>{
    const p=pos(e);mouse=p;
    if(dragged!==null){const n=nodes[dragged];n.x=Math.max(15,Math.min(width-15,p.x));n.y=Math.max(15,Math.min(height-15,p.y));n.vx=0;n.vy=0;if(press&&Math.hypot(p.x-press.x,p.y-press.y)>4)moved=true;hovered=dragged;}
    else hovered=find(p.x,p.y);
    canvas.style.cursor=dragged!==null?'grabbing':hovered!==null?'grab':'default';tip.hidden=hovered===null;
    if(hovered!==null){tip.textContent=nodes[hovered].title+' · '+degree[hovered]+' 条关联';tip.style.left=Math.max(4,Math.min(p.x+12,width-210))+'px';tip.style.top=Math.max(4,p.y-40)+'px';}
    wake();
  });
  canvas.addEventListener('pointerdown',e=>{const p=pos(e);dragged=find(p.x,p.y);press=p;moved=false;if(dragged!==null){canvas.setPointerCapture(e.pointerId);e.preventDefault();}});
  canvas.addEventListener('pointerup',()=>{if(dragged!==null&&!moved)location.href=nodes[dragged].url;dragged=null;press=null;wake();});
  canvas.addEventListener('pointercancel',()=>{dragged=null;press=null;wake();});
  canvas.addEventListener('pointerleave',()=>{if(dragged===null){hovered=null;tip.hidden=true;mouse={x:-1000,y:-1000};draw();}});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)wake();});
  window.addEventListener('resize',resize);
  resize();
})();
