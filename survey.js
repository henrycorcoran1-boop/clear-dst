(function(){
  "use strict";
  var D = window.CLEARDST;
  var SHORT_LABELS = ['Str. Disagree','Disagree','Neutral','Agree','Str. Agree'];
  var STEPS = [
    {type:'intro'},
    {type:'likert', dim:'LEADERSHIP'},
    {type:'likert', dim:'ENVIRONMENT'},
    {type:'likert', dim:'ARCHITECTURE'},
    {type:'likert', dim:'RESOURCES'},
    {type:'section2', part:'A', title:'Professional Profile'},
    {type:'section2', part:'B', title:'Departure Experience'},
    {type:'section2', part:'C', title:'Transition & Knowledge'},
    {type:'review'}
  ];
  var DRAFT_KEY = 'cleardst_draft_v1';

  var state = loadDraft() || {step:0, s1:{}, s2:{}};
  var root = document.getElementById('survey-root');

  function loadDraft(){
    try{ var r = localStorage.getItem(DRAFT_KEY); return r ? JSON.parse(r) : null; }catch(e){ return null; }
  }
  function saveDraft(){
    try{ localStorage.setItem(DRAFT_KEY, JSON.stringify(state)); }catch(e){}
  }
  function esc(s){ return String(s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

  function flatOptions(q){
    if(q.options) return q.options.map(function(t){ return {text:t}; });
    var out = [];
    q.optionGroups.forEach(function(g){ g.options.forEach(function(o){ out.push({text:o.text, group:g.group, dim:o.dim}); }); });
    return out;
  }
  function findQ(id){ return D.SECTION2.filter(function(q){ return q.id===id; })[0]; }
  function shouldSkip(q){
    if(!q.skipIf) return false;
    var refQ = findQ(q.skipIf.q);
    var refOpts = flatOptions(refQ);
    var target = refOpts[q.skipIf.eq] && refOpts[q.skipIf.eq].text;
    return state.s2[q.skipIf.q] === target;
  }

  function renderIntro(c){
    c.innerHTML =
      '<div class="qcard">'+
        '<div class="dim-tag environment"><i></i>Before You Begin</div>'+
        '<h2 style="margin:16px 0 14px;font-size:24px;text-transform:uppercase;letter-spacing:.01em">CLEAR-DST Survey Instrument</h2>'+
        '<p style="color:var(--text-sub);font-size:14.5px;line-height:1.75;margin-bottom:14px">This survey has two sections. <b style="color:var(--ink)">Section 1</b> (36 items, 8–10 minutes) rates your experience of your current or most recent construction project organisation on a 1–5 scale: 1 = Strongly Disagree, 5 = Strongly Agree. <b style="color:var(--ink)">Section 2</b> (13 questions, 3–4 minutes) asks about your professional background and — if relevant — your experience of leaving or considering leaving a construction organisation.</p>'+
        '<p style="color:var(--text-sub);font-size:14.5px;line-height:1.75;margin-bottom:14px">Your responses are completely anonymous — no individual or organisation is identifiable from the data. Answers are processed in your browser to generate your report; nothing is sent to a server. This study has received ethical approval from the UCD Human Research Ethics Committee.</p>'+
        '<p style="color:var(--text-sub);font-size:14.5px;line-height:1.75">At the end you will receive a bespoke report scoring the Leadership, Environment, Architecture and Resources (LEAR) dimensions of your organisation, with the specific interventions recommended for your lowest-scoring areas.</p>'+
      '</div>';
  }

  function renderLikertPart(dimKey, c){
    var dim = D.DIMENSIONS[dimKey];
    var items = D.SECTION1.filter(function(i){ return i.dim===dimKey; });
    var html = '<div class="part-head">'+
      '<div class="dim-tag '+dim.cls+'"><i></i>'+dim.label+'</div>'+
      '<h2>'+dim.label+' Dimension</h2>'+
      '<p>'+dim.blurb+' Anchor: '+dim.anchor+'. Rate each statement about your current or most recent project organisation.</p>'+
      '<div class="likert-scale-key"><span>1 · Strongly Disagree</span><span>2 · Disagree</span><span>3 · Neutral</span><span>4 · Agree</span><span>5 · Strongly Agree</span></div>'+
    '</div>';
    items.forEach(function(item){
      html += '<div class="qcard"><div class="qnum">Item '+item.n+' of 36 · '+dim.label+'</div>'+
        '<div class="qtext">'+esc(item.text)+'</div>'+
        '<div class="likert">'+
        [1,2,3,4,5].map(function(v){
          var checked = state.s1[item.code]===v ? ' checked' : '';
          return '<label><input type="radio" name="li_'+item.code+'" value="'+v+'" data-code="'+item.code+'"'+checked+'>'+
            '<span class="lopt"><b>'+v+'</b><span>'+SHORT_LABELS[v-1]+'</span></span></label>';
        }).join('')+
        '</div></div>';
    });
    c.innerHTML = html;
    c.querySelectorAll('input[type=radio][data-code]').forEach(function(inp){
      inp.addEventListener('change', function(){
        state.s1[inp.getAttribute('data-code')] = parseInt(inp.value,10);
        saveDraft(); clearError();
      });
    });
  }

  function renderChoiceQuestion(q, idx){
    var opts = flatOptions(q);
    var isMulti = q.type==='multi';
    var current = state.s2[q.id];
    if(isMulti && !Array.isArray(current)) current = [];
    var groups = {};
    var order = [];
    opts.forEach(function(o){
      var g = o.group || '_';
      if(!groups[g]){ groups[g]=[]; order.push(g); }
      groups[g].push(o);
    });
    var html = '<div class="qcard" data-qid="'+q.id+'"><div class="qnum">'+q.id+' · '+(isMulti?'Select all that apply':'Choose one')+'</div>'+
      '<div class="qtext">'+esc(q.question)+'</div><div class="choice-list">';
    order.forEach(function(g){
      if(g!=='_') html += '<div style="font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin:12px 0 2px;font-weight:700">'+esc(g)+'</div>';
      groups[g].forEach(function(o){
        var name = isMulti ? ('q_'+q.id+'[]') : ('q_'+q.id);
        var type = isMulti ? 'checkbox' : 'radio';
        var checked = isMulti ? (current.indexOf(o.text)>-1) : (current===o.text);
        html += '<label><input type="'+type+'" name="'+name+'" value="'+esc(o.text)+'" data-qid="'+q.id+'" data-multi="'+isMulti+'"'+(checked?' checked':'')+'>'+
          '<span class="copt"><i></i>'+esc(o.text)+'</span></label>';
      });
    });
    html += '</div>';
    var showOther = isMulti ? current.indexOf('Other (please specify)')>-1 : current==='Other (please specify)';
    html += '<input type="text" class="other-input" data-other-for="'+q.id+'" placeholder="Please specify…" value="'+esc(state.s2[q.id+'_other']||'')+'" style="display:'+(showOther?'block':'none')+'">';
    html += '</div>';
    return html;
  }

  function renderSection2Part(partKey, title, c){
    var questions = D.SECTION2.filter(function(q){ return q.part===partKey && !shouldSkip(q); });
    var html = '<div class="part-head">'+
      '<div class="dim-tag environment"><i></i>Section 2 · Part '+partKey+'</div>'+
      '<h2>'+title+'</h2>'+
      '<p>Your responses here are anonymous and help link cultural conditions to real workforce outcomes.</p>'+
    '</div>';
    questions.forEach(function(q){ html += renderChoiceQuestion(q); });
    c.innerHTML = html;

    c.querySelectorAll('input[data-qid]').forEach(function(inp){
      inp.addEventListener('change', function(){
        var qid = inp.getAttribute('data-qid');
        var isMulti = inp.getAttribute('data-multi')==='true';
        if(isMulti){
          var arr = Array.isArray(state.s2[qid]) ? state.s2[qid].slice() : [];
          if(inp.checked){ if(arr.indexOf(inp.value)===-1) arr.push(inp.value); }
          else { arr = arr.filter(function(v){ return v!==inp.value; }); }
          state.s2[qid] = arr;
        } else {
          state.s2[qid] = inp.value;
        }
        saveDraft(); clearError();
        var isB1 = qid==='B1';
        renderStep(); // re-render to reflect other-input visibility & any skip-logic changes
        if(isB1){ /* no-op, renderStep already recalculated skip logic */ }
      });
    });
    c.querySelectorAll('.other-input').forEach(function(inp){
      inp.addEventListener('input', function(){
        state.s2[inp.getAttribute('data-other-for')+'_other'] = inp.value;
        saveDraft();
      });
    });
  }

  function renderReview(c){
    var s1Count = Object.keys(state.s1).length;
    var visibleQs = D.SECTION2.filter(function(q){ return !shouldSkip(q); });
    var answeredQs = visibleQs.filter(function(q){
      var v = state.s2[q.id];
      return q.type==='multi' ? true : !!v;
    });
    c.innerHTML = '<div class="qcard">'+
      '<div class="dim-tag architecture"><i></i>Review &amp; Generate</div>'+
      '<h2 style="margin:16px 0 14px;font-size:24px;text-transform:uppercase;letter-spacing:.01em">Ready to Generate Your Report</h2>'+
      '<div class="panel-rows" style="margin-bottom:6px">'+
        '<div class="prow"><span>Section 1 — LEAR items answered</span><b>'+s1Count+' / 36</b></div>'+
        '<div class="prow"><span>Section 2 — questions answered</span><b>'+answeredQs.length+' / '+visibleQs.length+'</b></div>'+
      '</div>'+
      '<p style="color:var(--text-sub);font-size:13.5px;margin-top:16px;line-height:1.7">Your report is generated instantly in your browser from these answers — nothing is uploaded. You can print or save it as a PDF from the report page.</p>'+
    '</div>';
  }

  function stepTitle(step){
    if(step.type==='intro') return 'Introduction';
    if(step.type==='likert') return D.DIMENSIONS[step.dim].label;
    if(step.type==='section2') return 'Background · '+step.title;
    return 'Review';
  }

  function clearError(){ var e=document.getElementById('step-error'); if(e) e.remove(); }
  function showError(msg){
    clearError();
    var d = document.createElement('div');
    d.id = 'step-error';
    d.style.cssText = 'background:rgba(198,67,61,.10);border:1px solid rgba(198,67,61,.3);color:var(--red);padding:12px 16px;border-radius:10px;font-size:13px;margin-top:16px';
    d.textContent = msg;
    document.getElementById('part-nav').before(d);
  }

  function validateCurrent(){
    var step = STEPS[state.step];
    if(step.type==='likert'){
      var items = D.SECTION1.filter(function(i){ return i.dim===step.dim; });
      var missing = items.filter(function(i){ return !state.s1[i.code]; });
      if(missing.length){ showError('Please rate all '+items.length+' statements before continuing ('+missing.length+' remaining).'); return false; }
    }
    if(step.type==='section2'){
      var questions = D.SECTION2.filter(function(q){ return q.part===step.part && !shouldSkip(q); });
      for(var i=0;i<questions.length;i++){
        var q = questions[i];
        if(q.type==='multi') continue; // optional
        var v = state.s2[q.id];
        if(!v){ showError('Please answer: "'+q.question+'"'); return false; }
        if(v==='Other (please specify)' && !(state.s2[q.id+'_other']||'').trim()){
          showError('Please specify your answer for: "'+q.question+'"'); return false;
        }
      }
    }
    return true;
  }

  function normalizeS2(){
    var out = {};
    Object.keys(state.s2).forEach(function(k){
      if(k.indexOf('_other')>-1) return;
      var v = state.s2[k];
      if(Array.isArray(v)){
        out[k] = v.map(function(t){
          return t==='Other (please specify)' && state.s2[k+'_other'] ? 'Other: '+state.s2[k+'_other'] : t;
        });
      } else if(v==='Other (please specify)' && state.s2[k+'_other']){
        out[k] = 'Other: '+state.s2[k+'_other'];
      } else {
        out[k] = v;
      }
    });
    return out;
  }

  function generateReport(){
    var report = D.computeReport({s1: state.s1, s2: normalizeS2()});
    try{
      localStorage.setItem('cleardst_report_v1', JSON.stringify(report));
      localStorage.setItem('cleardst_answers_v1', JSON.stringify({s1: state.s1, s2: normalizeS2()}));
      localStorage.removeItem(DRAFT_KEY);
    }catch(e){}
    window.location.href = 'report.html';
  }

  function renderStep(){
    var step = STEPS[state.step];
    var body = document.createElement('div');
    if(step.type==='intro') renderIntro(body);
    else if(step.type==='likert') renderLikertPart(step.dim, body);
    else if(step.type==='section2') renderSection2Part(step.part, step.title, body);
    else if(step.type==='review') renderReview(body);

    var nav = document.createElement('div');
    nav.className = 'part-nav'; nav.id = 'part-nav';
    var isLast = state.step === STEPS.length-1;
    var isFirst = state.step === 0;
    nav.innerHTML =
      (isFirst ? '<span></span>' : '<button class="btn btn-ghost" id="btn-back">Back</button>')+
      '<span class="step-count">Step '+(state.step+1)+' of '+STEPS.length+'</span>'+
      '<button class="btn btn-primary" id="btn-next">'+(isLast ? 'Generate My Report' : (isFirst ? 'Begin Survey' : 'Next'))+
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>';

    root.innerHTML = '';
    root.appendChild(body);
    root.appendChild(nav);

    if(!isFirst) document.getElementById('btn-back').addEventListener('click', function(){
      state.step--; saveDraft(); renderStep(); window.scrollTo({top:0,behavior:'smooth'});
    });
    document.getElementById('btn-next').addEventListener('click', function(){
      if(!validateCurrent()) return;
      if(isLast){ generateReport(); return; }
      state.step++; saveDraft(); renderStep(); window.scrollTo({top:0,behavior:'smooth'});
    });

    updateProgress();
  }

  function updateProgress(){
    var pct = Math.round((state.step/(STEPS.length-1))*100);
    document.getElementById('sp-label').textContent = stepTitle(STEPS[state.step]);
    document.getElementById('sp-pct').textContent = pct+'%';
    document.getElementById('survey-fill').style.width = pct+'%';
  }

  renderStep();
})();
