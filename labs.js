window.WincyLabs = (() => {
  const copy = {
    fr: ['Avant / après','Optimisation d’un circuit de validation','Rationalisez le parcours de quatre dossiers entre leur dépôt et la décision.','Avant','Après','Niveau d’optimisation','Dépôt','Décision','Délai moyen illustratif','jours','Du plan au terrain','Déploiement sur douze semaines','Choisissez un jalon pour voir quels chantiers sont terminés, en cours ou à venir.','Cadrer','Tester','Déployer','Diagnostic','Conception','Pilote','Formation','Lancement','Suivi','Semaine','Chantiers terminés','En cours','À venir','Terminé'],
    en: ['Before / after','Streamlining an approval process','Streamline the journey of four applications from submission to decision.','Before','After','Optimisation level','Submission','Decision','Illustrative average lead time','days','From plan to practice','A twelve-week rollout','Choose a milestone to see which workstreams are complete, active or upcoming.','Frame','Test','Roll out','Discovery','Design','Pilot','Training','Launch','Review','Week','Completed workstreams','Active','Upcoming','Complete'],
    ar: ['قبل / بعد','تحسين مسار الموافقة','بسّط مسار أربعة ملفات من الإيداع إلى اتخاذ القرار.','قبل','بعد','مستوى التحسين','الإيداع','القرار','متوسط المدة التوضيحي','أيام','من الخطة إلى الميدان','تنفيذ على مدى اثني عشر أسبوعاً','اختر محطة لرؤية الأعمال المكتملة والجارية والقادمة.','التأطير','الاختبار','التنفيذ','التشخيص','التصميم','التجربة','التدريب','الإطلاق','المتابعة','الأسبوع','الأعمال المكتملة','جارٍ','قادم','مكتمل']
  };
  const colors=['#263e35','#a7492e','#8c795c','#5e7462'];
  const milestones=[2,7,12], spans=[[1,2],[2,4],[4,7],[6,9],[9,11],[11,12]];
  const interpolate=(a,b,t)=>a+(b-a)*t;
  function heading(num,title,subject){return `<header class="lab-mast"><span>WINCY / LAB 0${num}</span><span>${subject}</span></header><h2 class="lab-heading">${title}<i>.</i></h2>`}
  function optimisation(lang){
    const w=copy[lang];
    return `<section class="lab-section flow-lab" id="optimisation">${heading(2,w[0],w[1])}<div class="lab-layout"><div class="flow-plot"><div class="plot-ends"><span>${w[6]}</span><span>${w[7]}</span></div><svg viewBox="0 0 620 270" preserveAspectRatio="none" aria-hidden="true">${colors.map((c,i)=>`<g fill="none" stroke="${c}"><path data-route="${i}" stroke-width="2.4"/><circle r="5.5" fill="${c}" stroke="#efeee8" stroke-width="2" data-packet="${i}"/></g>`).join('')}</svg></div><div class="lab-console"><p>${w[2]}</p><div class="lab-readout"><span>${w[8]}</span><strong><b data-days>12</b> <small>${w[9]}</small></strong></div><label for="optimise-level">${w[5]}</label><input type="range" id="optimise-level" min="0" max="100" value="0"><div class="range-ends"><span>${w[3]}</span><span>${w[4]}</span></div></div></div></section>`;
  }
  // Interpolated control points straighten each route while keeping its endpoints fixed.
  function curves(i,t){
    const y=45+i*60, sign=i%2?1:-1;
    const mix=(x,a,target)=>[x,interpolate(a,target,t)];
    return [ [12,y],mix(100,y, y),mix(120,135+sign*130,y),mix(206,135+sign*75,y),
      mix(290,135+sign*75,y),mix(322,135-sign*170,y),mix(403,135-sign*72,y),
      mix(477,135-sign*72,y),mix(516,y,y),[608,y] ];
  }
  function updateFlow(root,value){
    const t=value/100;
    root.querySelector('[data-days]').textContent=Math.round(interpolate(12,5,t));
    root.querySelectorAll('[data-route]').forEach((path,i)=>{
      const pts=curves(i,t), fmt=p=>p.join(',');
      path.setAttribute('d','M'+fmt(pts[0])+' C'+pts.slice(1).map(fmt).join(' '));
      const pt=path.getPointAtLength(path.getTotalLength()*(.14+i*.13+t*.42));
      const dot=root.querySelector('[data-packet="'+i+'"]');dot.setAttribute('cx',pt.x);dot.setAttribute('cy',pt.y);
    });
  }
  function deployment(lang){
    const w=copy[lang];
    return `<section class="lab-section deploy-lab" id="deploiement">${heading(3,w[10],w[11])}<div class="lab-layout"><div class="timeline"><div class="time-scale" dir="ltr"><span>01</span><span>04</span><span>08</span><span>12</span></div>${spans.map(([start,end],i)=>`<div class="work-row"><span>${w[16+i]}</span><div class="rail" dir="ltr"><div class="work-bar" style="left:${(start-1)/12*100}%;width:${(end-start+1)/12*100}%"><i></i></div></div></div>`).join('')}</div><div class="lab-console"><p>${w[12]}</p><div class="lab-readout" aria-live="polite"><span>${w[23]}</span><strong data-complete>1 / 6</strong></div><div class="phase-controls">${milestones.map((week,i)=>`<button type="button" aria-pressed="${i===0}"><small>${w[22]} ${week}</small>${w[13+i]}</button>`).join('')}</div></div></div></section>`;
  }
  function mount(lang,signal){
    const w=copy[lang],flow=document.querySelector('.flow-lab'),range=flow.querySelector('input');
    const refresh=()=>updateFlow(flow,Number(range.value));refresh();range.addEventListener('input',refresh,{signal});
    const timeline=document.querySelector('.deploy-lab'), buttons=timeline.querySelectorAll('button');
    function select(i){
      const week=milestones[i];
      buttons.forEach((button,j)=>button.setAttribute('aria-pressed',String(i===j)));
      timeline.querySelector('[data-complete]').textContent=spans.filter(([,end])=>end<=week).length+' / 6';
      timeline.querySelectorAll('.work-row').forEach((row,j)=>{
        const [start,end]=spans[j],share=Math.max(0,Math.min(1,(week-start+1)/(end-start+1)));
        row.querySelector('i').style.transform='scaleX('+share+')';
        const state=share===1?w[26]:share?w[24]:w[25];row.querySelector('.rail').setAttribute('role','img');row.querySelector('.rail').setAttribute('aria-label',state);row.title=state;
      });
    }
    buttons.forEach((button,i)=>button.addEventListener('click',()=>select(i),{signal}));select(0);
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window){
      const watch=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('lab-enter');watch.unobserve(entry.target)}}),{threshold:.12});
      document.querySelectorAll('.lab-section,.method-step').forEach(el=>watch.observe(el));signal.addEventListener('abort',()=>watch.disconnect(),{once:true});
    }
  }
  return {optimisation,deployment,mount};
})();
