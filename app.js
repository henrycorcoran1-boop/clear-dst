(function(){
  "use strict";
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var nav = document.getElementById('nav'), prog = document.getElementById('progress'), totop = document.getElementById('totop');
  function onScroll(){
    var st = window.pageYOffset, h = document.documentElement.scrollHeight - window.innerHeight;
    if(prog) prog.style.width = (h>0 ? (st/h*100):0) + '%';
    if(nav) nav.classList.toggle('scrolled', st > 40);
    if(totop) totop.classList.toggle('show', st > 600);
  }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();
  if(totop) totop.addEventListener('click', function(){ window.scrollTo({top:0,behavior:reduce?'auto':'smooth'}); });

  var mb = document.getElementById('menu-btn'), mm = document.getElementById('mobile-menu');
  if(mb && mm){
    mb.addEventListener('click', function(){
      var open = mm.style.display === 'block';
      mm.style.display = open ? 'none' : 'block';
      mb.setAttribute('aria-expanded', String(!open));
    });
    mm.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ mm.style.display='none'; mb.setAttribute('aria-expanded','false'); }); });
  }

  (function(){ var path=(location.pathname.split('/').pop()||'index.html');
    document.querySelectorAll('.nav-links a, #mobile-menu a').forEach(function(a){
      if(a.getAttribute('href')===path) a.classList.add('active'); }); })();

  var revs = document.querySelectorAll('.reveal');
  if(reduce || !('IntersectionObserver' in window)){ revs.forEach(function(r){r.classList.add('in');}); }
  else {
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){
        var sibs = Array.prototype.slice.call(e.target.parentNode.children).filter(function(c){return c.classList.contains('reveal');});
        var i = sibs.indexOf(e.target);
        e.target.style.transitionDelay = (i>0 ? Math.min(i,5)*90 : 0) + 'ms';
        e.target.classList.add('in'); io.unobserve(e.target);
        if(e.target.querySelector('.ds-fill')) e.target.querySelectorAll('.ds-fill').forEach(function(b){ b.style.width=b.getAttribute('data-w'); });
      }});
    },{threshold:.14, rootMargin:'0px 0px -40px 0px'});
    revs.forEach(function(r){ io.observe(r); });
  }
  if(reduce){ document.querySelectorAll('.ds-fill').forEach(function(i){ i.style.width=i.getAttribute('data-w'); }); }

  var cio = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ countUp(e.target); cio.unobserve(e.target); } });
  },{threshold:.5});
  document.querySelectorAll('[data-count]').forEach(function(c){ cio.observe(c); });
  function countUp(el){
    var target = parseFloat(el.getAttribute('data-count')),
        dec = parseInt(el.getAttribute('data-dec')||'0',10),
        pre = el.getAttribute('data-prefix')||'', suf = el.getAttribute('data-suffix')||'';
    var fmt = function(v){ return pre + (dec? v.toFixed(dec) : Math.round(v).toLocaleString('en-IE')) + suf; };
    if(reduce){ el.textContent = fmt(target); return; }
    var dur=1500, t0=null;
    requestAnimationFrame(function step(ts){ if(!t0)t0=ts; var p=Math.min((ts-t0)/dur,1), e=1-Math.pow(1-p,3);
      el.textContent = fmt(target*e); if(p<1) requestAnimationFrame(step); else el.textContent = fmt(target); });
  }

  (function(){
    var wrap = document.getElementById('hero-bars');
    if(wrap){ [58,72,44,66,80,52,74,60].forEach(function(h,i){
      var b=document.createElement('div'); b.className='bar'; b.style.height=h+'%';
      b.style.animationDelay=(i*70)+'ms'; wrap.appendChild(b); }); }
  })();

  if(!reduce && window.matchMedia('(pointer:fine)').matches){
    document.querySelectorAll('.card, .panel[data-tilt]').forEach(function(c){
      var spot = c.querySelector('.spot');
      c.addEventListener('pointermove', function(e){
        var r = c.getBoundingClientRect(), x=e.clientX-r.left, y=e.clientY-r.top;
        if(spot){ spot.style.setProperty('--mx', x+'px'); spot.style.setProperty('--my', y+'px'); }
        var rx = ((y/r.height)-.5)*-5, ry = ((x/r.width)-.5)*5;
        c.style.transform = 'perspective(900px) rotateX('+rx+'deg) rotateY('+ry+'deg)';
      });
      c.addEventListener('pointerleave', function(){ c.style.transform=''; });
    });
    document.querySelectorAll('[data-magnetic]').forEach(function(b){
      b.addEventListener('pointermove', function(e){ var r=b.getBoundingClientRect();
        b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.22)+'px,'+((e.clientY-r.top-r.height/2)*.32)+'px)'; });
      b.addEventListener('pointerleave', function(){ b.style.transform=''; });
    });
  }

  /* background particle constellation (tuned for white bg) */
  if(!reduce){
    var cv = document.getElementById('bg-canvas');
    if(cv){
      var ctx = cv.getContext('2d');
      var W,H,pts,mouse={x:-9999,y:-9999}, DPR=Math.min(window.devicePixelRatio||1,2);
      function resize(){ W=cv.width=innerWidth*DPR; H=cv.height=innerHeight*DPR;
        cv.style.width=innerWidth+'px'; cv.style.height=innerHeight+'px';
        var n=Math.min(Math.round(innerWidth*innerHeight/16000), innerWidth<700?34:96);
        pts=[]; for(var i=0;i<n;i++){ pts.push({x:Math.random()*W,y:Math.random()*H,
          vx:(Math.random()-.5)*.22*DPR, vy:(Math.random()-.5)*.22*DPR}); } }
      window.addEventListener('resize', resize); resize();
      window.addEventListener('pointermove', function(e){ mouse.x=e.clientX*DPR; mouse.y=e.clientY*DPR; }, {passive:true});
      window.addEventListener('pointerleave', function(){ mouse.x=mouse.y=-9999; });
      var LINK=140*DPR, MO=170*DPR;
      (function frame(){
        ctx.clearRect(0,0,W,H);
        for(var i=0;i<pts.length;i++){ var p=pts[i]; p.x+=p.vx; p.y+=p.vy;
          if(p.x<0||p.x>W)p.vx*=-1; if(p.y<0||p.y>H)p.vy*=-1;
          ctx.beginPath(); ctx.arc(p.x,p.y,1.4*DPR,0,6.2832); ctx.fillStyle='rgba(14,42,90,.32)'; ctx.fill();
          for(var j=i+1;j<pts.length;j++){ var q=pts[j], dx=p.x-q.x, dy=p.y-q.y, d=Math.sqrt(dx*dx+dy*dy);
            if(d<LINK){ ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y);
              ctx.strokeStyle='rgba(14,42,90,'+(.10*(1-d/LINK))+')'; ctx.lineWidth=DPR*.6; ctx.stroke(); } }
          var mdx=p.x-mouse.x, mdy=p.y-mouse.y, md=Math.sqrt(mdx*mdx+mdy*mdy);
          if(md<MO){ ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(mouse.x,mouse.y);
            ctx.strokeStyle='rgba(36,114,176,'+(.30*(1-md/MO))+')'; ctx.lineWidth=DPR*.7; ctx.stroke(); } }
        requestAnimationFrame(frame);
      })();
    }
  }
})();
