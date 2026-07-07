(function(){
  "use strict";
  var D = window.CLEARDST;
  var root = document.getElementById('report-root');

  var BAND_COLOR = {red:'var(--red)', amber:'var(--amber)', green:'var(--green)'};

  function esc(s){ return String(s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

  function load(){
    try{
      var r = localStorage.getItem('cleardst_report_v1');
      var a = localStorage.getItem('cleardst_answers_v1');
      return { report: r ? JSON.parse(r) : null, answers: a ? JSON.parse(a) : null };
    }catch(e){ return {report:null, answers:null}; }
  }

  function renderNoReport(){
    var nav = document.getElementById('nav'); if(nav) nav.classList.remove('on-dark');
    root.innerHTML =
      '<section class="phero"><div class="wrap content reveal">'+
        '<span class="eyebrow"><span class="dot"></span> No Report Yet</span>'+
        '<h1>You Haven\'t Completed the Survey</h1>'+
        '<p>Take the 10–14 minute CLEAR-DST survey to generate your bespoke diagnostic report.</p>'+
      '</div></section>'+
      '<section class="section"><div class="wrap">'+
        '<div class="no-report reveal">'+
          '<div class="ico" style="margin:0 auto"><svg viewBox="0 0 24 24"><path d="M9 17v-6M12 17V7M15 17v-3"/><rect x="3" y="3" width="18" height="18" rx="3"/></svg></div>'+
          '<p>No survey data was found in this browser. Reports are generated locally and are not saved anywhere else.</p>'+
          '<a href="survey.html" class="btn btn-primary">Start the Survey<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>'+
        '</div>'+
      '</div></section>';
  }

  function profileLine(s2){
    var parts = [];
    if(s2.A1) parts.push(s2.A1);
    if(s2.A2) parts.push(s2.A2);
    if(s2.A4) parts.push(s2.A4);
    return parts.join(' · ');
  }

  function renderReport(report, answers){
    var nav = document.getElementById('nav'); if(nav) nav.classList.add('on-dark');
    var s2 = (answers && answers.s2) || {};
    var genDate = new Date().toLocaleDateString('en-IE',{day:'numeric',month:'long',year:'numeric'});
    var profile = profileLine(s2);

    var header =
      '<section class="report-header"><div class="wrap">'+
        '<span class="eyebrow"><span class="dot"></span> Bespoke Diagnostic Report</span>'+
        '<h1>Your CLEAR-DST Results</h1>'+
        '<p>Generated '+genDate+(profile? ' · '+esc(profile) : '')+'. This report is based entirely on the answers you just gave — it exists only in this browser.</p>'+
        '<div class="report-meta-row">'+
          '<div class="rm"><b>'+report.overall.toFixed(2)+' / 5</b><span>Overall LEAR Score</span></div>'+
          '<div class="rm"><b>'+D.BAND_LABEL[report.overallBand]+'</b><span>Overall Band</span></div>'+
          '<div class="rm"><b>'+report.answeredCount+' / 36</b><span>Items Scored</span></div>'+
        '</div>'+
      '</div></section>';

    var dimCards = '<section class="section"><div class="wrap">'+
      '<div class="section-head reveal"><span class="eyebrow"><span class="dot"></span> Dimension Scores</span><h2>Leadership · Environment · Architecture · Resources</h2>'+
      '<p>Each dimension is banded RED (needs attention, &lt;3.0), AMBER (developing, 3.0–3.69) or GREEN (strength, 3.7+).</p></div>'+
      '<div class="dim-score-grid">';
    D.DIM_ORDER.forEach(function(dk, i){
      var dim = D.DIMENSIONS[dk], res = report.dims[dk];
      var pct = Math.round((res.avg/5)*100);
      dimCards += '<div class="dim-score '+dim.cls+' reveal" style="transition-delay:'+(i*70)+'ms">'+
        '<div class="ds-name">'+dim.label+'</div>'+
        '<div class="ds-val">'+res.avg.toFixed(2)+'<small> / 5</small></div>'+
        '<div class="ds-track"><div class="ds-fill" data-w="'+pct+'%" style="width:0%;background:'+BAND_COLOR[res.band]+'"></div></div>'+
        '<span class="band-pill '+res.band+'"><i></i>'+D.BAND_LABEL[res.band]+'</span>'+
        '<p style="font-size:12.5px;color:var(--text-sub);margin-top:12px;line-height:1.6">'+esc(D.DIM_BAND_NOTE[dk][res.band])+'</p>'+
      '</div>';
    });
    dimCards += '</div></div></section>';

    var priorityHtml = '<section class="section alt"><div class="wrap">'+
      '<div class="section-head reveal"><span class="eyebrow"><span class="dot"></span> Priority Interventions</span><h2>Your Five Lowest-Scoring Indicators</h2>'+
      '<p>Ranked lowest score first. Each is paired with the specific, practical intervention for that indicator.</p></div>'+
      '<div class="priority-list">';
    report.lowest.forEach(function(it, i){
      var dim = D.DIMENSIONS[it.dim];
      priorityHtml += '<div class="priority-item reveal" style="transition-delay:'+(i*60)+'ms">'+
        '<div class="pi-rank">'+(i+1)+'</div>'+
        '<div class="pi-body">'+
          '<b>'+esc(it.label)+' — scored '+it.score+'/5</b>'+
          '<div class="pi-item"><span class="dim-tag '+dim.cls+'" style="padding:2px 8px;font-size:8.5px"><i></i>'+dim.label+'</span> &nbsp;"'+esc(it.text)+'"</div>'+
          '<p><b style="color:var(--ink)">Recommended:</b> '+esc(it.intervention)+'</p>'+
        '</div>'+
      '</div>';
    });
    priorityHtml += '</div></div></section>';

    var insightsHtml = '';
    if(report.notes && report.notes.length){
      insightsHtml = '<section class="section"><div class="wrap">'+
        '<div class="section-head reveal"><span class="eyebrow"><span class="dot"></span> Culture &amp; Cost</span><h2>What Your Background Data Adds</h2>'+
        '<p>Drawn from your Section 2 answers — linking cultural scores to real workforce outcomes.</p></div>'+
        '<div style="display:flex;flex-direction:column;gap:16px">'+
        report.notes.map(function(n, i){
          return '<div class="insight-card reveal" style="transition-delay:'+(i*60)+'ms"><h4>'+esc(n.title)+'</h4><p>'+n.body+'</p></div>';
        }).join('')+
        '</div></div></section>';
    }

    var actions = '<section class="section alt"><div class="wrap">'+
      '<div class="cta-box reveal"><span class="eyebrow"><span class="dot"></span> Next Steps</span>'+
      '<h2>Save or Share This Report</h2>'+
      '<p>Print to PDF for circulation, or retake the survey for another project or team.</p>'+
      '<div class="report-actions">'+
        '<button class="btn btn-primary" id="btn-print">Print / Save as PDF<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z"/></svg></button>'+
        '<button class="btn btn-ghost" id="btn-retake">Retake the Survey</button>'+
      '</div></div>'+
    '</div></section>';

    root.innerHTML = header + dimCards + priorityHtml + insightsHtml + actions;

    document.getElementById('btn-print').addEventListener('click', function(){ window.print(); });
    document.getElementById('btn-retake').addEventListener('click', function(){
      try{
        localStorage.removeItem('cleardst_report_v1');
        localStorage.removeItem('cleardst_answers_v1');
        localStorage.removeItem('cleardst_draft_v1');
      }catch(e){}
      window.location.href = 'survey.html';
    });

    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      document.querySelectorAll('.ds-fill').forEach(function(f){ f.style.width = f.getAttribute('data-w'); });
    }
  }

  var data = load();
  if(!data.report){ renderNoReport(); }
  else { renderReport(data.report, data.answers); }
})();
