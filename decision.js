/* The three terraces always share the same 100 illustrative units. */
window.WincyTable = (() => {
  const editions = {
    fr: ['Table de décision', 'Répartition illustrative des ressources', 'Choisissez une priorité', 'Socle', 'Croissance', 'Exploration', 'Consolider', 'Développer', 'Explorer', 'Renforcer les opérations avant d’engager de nouveaux projets.', 'Donner plus de moyens aux offres qui ont déjà fait leurs preuves.', 'Réserver une part plus importante aux essais sur de nouveaux marchés.'],
    en: ['Decision table', 'Illustrative resource allocation', 'Choose a priority', 'Core', 'Growth', 'Exploration', 'Consolidate', 'Expand', 'Explore', 'Strengthen operations before taking on new projects.', 'Back the offers that have already proved their worth.', 'Set aside a larger share for trials in new markets.'],
    ar: ['طاولة القرار', 'توزيع توضيحي للموارد', 'اختر أولوية', 'الأساس', 'النمو', 'الاستكشاف', 'الترسيخ', 'التوسع', 'الاستكشاف', 'تقوية العمليات الحالية قبل إطلاق مشاريع جديدة.', 'تخصيص موارد أكبر للعروض التي أثبتت نجاحها.', 'تخصيص حصة أكبر لاختبار أسواق جديدة.']
  };
  const scenarios = [[65,25,10],[30,55,15],[25,30,45]];
  const tones = ['#d0b486','#df7750','#a6b6a8'];
  function markup(lang) {
    const w = editions[lang];
    return `<section class="tableau lab-section" id="decision" aria-label="${w[0]}"><div class="tableau-head"><span>WINCY / LAB 01</span><span class="tableau-index" dir="ltr">01 — 03</span></div><h2 class="lab-heading">${w[0]}<i>.</i></h2><canvas aria-hidden="true"></canvas><div class="tableau-panel"><p class="tableau-legend">${w[1]}</p><div class="tableau-values">${tones.map((color,i)=>`<div style="--tone:${color}"><span>${w[3+i]}</span><strong>${scenarios[0][i]}%</strong></div>`).join('')}</div><p class="tableau-note" aria-live="polite">${w[9]}</p><fieldset><legend>${w[2]}</legend>${scenarios.map((_,i)=>`<button type="button" aria-pressed="${i===0}" data-case="${i}">${w[6+i]}</button>`).join('')}</fieldset></div></section>`;
  }
  function mount(host, lang, signal) {
    if (!host) return;
    const canvas=host.querySelector('canvas'), ctx=canvas.getContext('2d');
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    let active=0, current=scenarios[0].slice(), frame=0, last=0, visible=true, width=0, height=0;
    const values=host.querySelectorAll('.tableau-values strong');
    function draw(){
      if(!ctx||!width||!height)return;
      ctx.clearRect(0,0,width,height);
      const u=Math.min(width/24,height/16), cx=width/2, cy=height*.63;
      const point=(x,y,z)=>[cx+(x-y)*u,cy+(x+y)*u*.46-z*u];
      function face(vertices,fill,stroke){
        ctx.beginPath(); vertices.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();
        ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.65;ctx.stroke()}
      }
      for(let n=-6;n<=6;n++){
        for(const [a,b] of [[point(n,-6,0),point(n,6,0)],[point(-6,n,0),point(6,n,0)]]){
          ctx.strokeStyle='rgba(225,213,185,.12)';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke();
        }
      }
      const shades=[['#dfc79e','#8e7859','#675941'],['#e9926d','#a6573b','#82432e'],['#b8c7b9','#798e81','#596e64']];
      for(let x=0;x<9;x++) for(let y=0;y<9;y++){
        const group=Math.floor(x/3), xx=x-4.5, yy=y-4.5;
        const profile=.66+.34*Math.sin(Math.PI*(y+.5)/9);
        const h=.16+current[group]*.095*profile, edge=.89;
        const p=(dx,dy,z)=>point(xx+dx,yy+dy,z), [top,right,left]=shades[group];
        face([p(0,edge,0),p(edge,edge,0),p(edge,edge,h),p(0,edge,h)],left);
        face([p(edge,0,0),p(edge,edge,0),p(edge,edge,h),p(edge,0,h)],right);
        face([p(0,0,h),p(edge,0,h),p(edge,edge,h),p(0,edge,h)],top,'rgba(255,244,210,.26)');
      }
    }
    function animate(now){
      frame=0;const step=reduced.matches?1:1-Math.exp(-Math.min(60,now-last)/135);last=now;
      current=current.map((v,i)=>Math.abs(v-scenarios[active][i])<.06?scenarios[active][i]:v+(scenarios[active][i]-v)*step);
      draw();if(visible&&current.some((v,i)=>v!==scenarios[active][i]))frame=requestAnimationFrame(animate);
    }
    function start(){if(visible&&!frame){last=performance.now();frame=requestAnimationFrame(animate)}}
    const resize=new ResizeObserver(()=>{const box=canvas.getBoundingClientRect();width=box.width;height=box.height;const ratio=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);ctx?.setTransform(ratio,0,0,ratio,0,0);draw()});
    resize.observe(canvas);
    const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)start()});io.observe(host);
    host.querySelectorAll('button').forEach((button,i)=>button.addEventListener('click',()=>{
      active=i;host.querySelectorAll('button').forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));
      values.forEach((v,j)=>v.textContent=scenarios[i][j]+'%');
      host.querySelector('.tableau-index').textContent='0'+(i+1)+' — 03';
      host.querySelector('.tableau-note').textContent=editions[lang][9+i];start();
    },{signal}));
    signal.addEventListener('abort',()=>{resize.disconnect();io.disconnect();cancelAnimationFrame(frame)},{once:true});
  }
  return {markup,mount};
})();
