/* ============================================================
   CLEAR-DST — survey instrument data, scoring model & intervention
   library. Transcribed from CLEARDST_Full_Survey.xlsx.
   ============================================================ */
window.CLEARDST = (function(){
  "use strict";

  var DIMENSIONS = {
    LEADERSHIP:   { key:'LEADERSHIP',   label:'Leadership',   cls:'leadership',   anchor:'Edmondson (1999)',
                    blurb:'Whether leaders cultivate ideas, safety to speak up, and space to experiment.' },
    ENVIRONMENT:  { key:'ENVIRONMENT',  label:'Environment',  cls:'environment',  anchor:'Nahapiet & Ghoshal (1998)',
                    blurb:'The social capital between clients, consultants and contractors — trust, information flow, alignment.' },
    ARCHITECTURE: { key:'ARCHITECTURE', label:'Architecture', cls:'architecture', anchor:"O'Reilly & Tushman (2013)",
                    blurb:'The structural conditions — governance, decision rights, escalation and information systems.' },
    RESOURCES:    { key:'RESOURCES',    label:'Resources',    cls:'resources',    anchor:'Nohria & Gulati (1996)',
                    blurb:'Slack capacity — time, staffing, skills, budget and tools available to absorb change.' }
  };
  var DIM_ORDER = ['LEADERSHIP','ENVIRONMENT','ARCHITECTURE','RESOURCES'];

  var SECTION1 = [
    {n:1,code:'L-IC',label:'Idea Cultivation',dim:'LEADERSHIP',text:'Leaders encouraged team members to share ideas and suggestions about improving project work.'},
    {n:2,code:'L-PS',label:'Psychological Safety',dim:'LEADERSHIP',text:'Leaders created an environment where people felt comfortable raising concerns or uncertainties.'},
    {n:3,code:'L-CD',label:'Clear Direction',dim:'LEADERSHIP',text:'Leaders communicated clear direction and priorities for the project.'},
    {n:4,code:'L-CO',label:'Collaboration Enablement',dim:'LEADERSHIP',text:'Leaders enabled collaboration across disciplines or project functions.'},
    {n:5,code:'L-FB',label:'Feedback & Development',dim:'LEADERSHIP',text:'Leaders provided constructive feedback that helped the team improve performance.'},
    {n:6,code:'L-OP',label:'Openness / Receptivity',dim:'LEADERSHIP',text:'Leaders demonstrated openness to alternative viewpoints, including those that challenged existing practices.'},
    {n:7,code:'L-CH',label:'Change Championship',dim:'LEADERSHIP',text:'Leaders championed improvements and acted as advocates for change within the project.'},
    {n:8,code:'L-BR',label:'Barrier Removal',dim:'LEADERSHIP',text:'Leaders removed barriers that prevented progress on innovative or improved practices.'},
    {n:9,code:'L-EX',label:'Experimentation Support',dim:'LEADERSHIP',text:'Leaders supported experimentation and small trial changes to project processes or methods.'},

    {n:10,code:'E-CF',label:'Collaborative Culture',dim:'ENVIRONMENT',text:'Collaboration between clients, consultants, and contractors was constructive and solution-focused.'},
    {n:11,code:'E-IS',label:'Information Sharing',dim:'ENVIRONMENT',text:'Information was shared openly between project parties when required.'},
    {n:12,code:'E-EE',label:'Early Engagement',dim:'ENVIRONMENT',text:'Stakeholders engaged early to address issues and uncertainties.'},
    {n:13,code:'E-TD',label:'Transparent Decision-Making',dim:'ENVIRONMENT',text:'Decision-making processes between stakeholders were transparent and timely.'},
    {n:14,code:'E-TR',label:'Trust & Respect',dim:'ENVIRONMENT',text:'Stakeholders demonstrated trust and professional respect toward one another.'},
    {n:15,code:'E-CA',label:'Contractual Alignment',dim:'ENVIRONMENT',text:'Contractual arrangements supported cooperation rather than conflict.'},
    {n:16,code:'E-KT',label:'Knowledge Transfer',dim:'ENVIRONMENT',text:'Learning from past projects or similar experiences was shared across organisations.'},
    {n:17,code:'E-DT',label:'Digital Tool Support',dim:'ENVIRONMENT',text:'Digital tools supported coordination and information flow.'},
    {n:18,code:'E-CM',label:'Conflict Management',dim:'ENVIRONMENT',text:'Conflicting stakeholder priorities were managed productively rather than allowed to escalate.'},

    {n:19,code:'A-RR',label:'Role Clarity',dim:'ARCHITECTURE',text:'Roles and responsibilities were clearly defined and understood across the project.'},
    {n:20,code:'A-GE',label:'Governance Effectiveness',dim:'ARCHITECTURE',text:'Project governance arrangements supported progress rather than creating barriers.'},
    {n:21,code:'A-DT',label:'Decision Timeliness',dim:'ARCHITECTURE',text:'Decisions about changes or variations were made in a timely manner.'},
    {n:22,code:'A-CP',label:'Change Process Clarity',dim:'ARCHITECTURE',text:'Processes for managing design changes were clear and consistently applied.'},
    {n:23,code:'A-EP',label:'Escalation Process',dim:'ARCHITECTURE',text:'Procedures for approving or escalating issues were efficient and well understood.'},
    {n:24,code:'A-IC',label:'Interdisciplinary Coordination',dim:'ARCHITECTURE',text:'Coordination between design, commercial, and delivery functions worked effectively.'},
    {n:25,code:'A-RM',label:'Risk Management',dim:'ARCHITECTURE',text:'Risk and uncertainty were managed in a transparent and proactive manner.'},
    {n:26,code:'A-LL',label:'Lessons Learned Integration',dim:'ARCHITECTURE',text:'Feedback and lessons from earlier project stages were incorporated into later stages.'},
    {n:27,code:'A-IM',label:'Information Management',dim:'ARCHITECTURE',text:'Information and documentation were organised and accessible when needed.'},

    {n:28,code:'R-TI',label:'Time Availability',dim:'RESOURCES',text:'Sufficient time was available to explore or test improved ways of working.'},
    {n:29,code:'R-ST',label:'Staffing Adequacy',dim:'RESOURCES',text:'Adequate staffing was available to meet project demands without compromising quality.'},
    {n:30,code:'R-TE',label:'Technical Expertise Access',dim:'RESOURCES',text:'Team members had access to the expertise required to solve technical problems.'},
    {n:31,code:'R-SS',label:'Specialist Skill Availability',dim:'RESOURCES',text:'Specialist skills (e.g., digital, regulatory, engineering) were available when needed.'},
    {n:32,code:'R-BF',label:'Budget Flexibility',dim:'RESOURCES',text:'Project budgets allowed for improvements or adjustments where justified.'},
    {n:33,code:'R-TA',label:'Tool Accessibility',dim:'RESOURCES',text:'Tools and systems required for coordination and delivery were accessible and functional.'},
    {n:34,code:'R-TO',label:'Training Opportunities',dim:'RESOURCES',text:'Training or upskilling opportunities were available for new methods or technologies.'},
    {n:35,code:'R-TS',label:'Technical Support',dim:'RESOURCES',text:'Technical support was available when issues arose with tools, platforms, or equipment.'},
    {n:36,code:'R-MC',label:'Surge Capacity',dim:'RESOURCES',text:'Additional capacity could be mobilised when unexpected challenges emerged.'}
  ];

  var INTERVENTIONS = {
    'L-IC':"Introduce a standing agenda item at team or site meetings for raising improvement ideas, with a visible log of what was tried and why.",
    'L-PS':"Train leaders in psychological-safety practices — inviting dissent, responding non-punitively to concerns — and model it visibly in meetings.",
    'L-CD':"Issue a short project charter restating priorities at each phase gate so direction doesn't rely on word-of-mouth.",
    'L-CO':"Schedule structured cross-discipline touchpoints (e.g. a weekly design–commercial–delivery huddle) rather than relying on ad hoc contact.",
    'L-FB':"Introduce short, regular 1:1 or crew debriefs focused on specific, actionable feedback rather than annual appraisals alone.",
    'L-OP':"Create a low-friction channel — anonymous suggestion box, retro board — for challenging existing practice without reputational risk.",
    'L-CH':"Nominate visible improvement champions at leadership level with mandate and time allocated to sponsor pilot changes.",
    'L-BR':"Add a standing 'blockers' review to leadership meetings with named owners and closure deadlines.",
    'L-EX':"Ring-fence a small budget and time allowance for trialling new methods on a limited scope before full rollout.",
    'E-CF':"Run a joint client–consultant–contractor partnering workshop early in the project to agree shared behavioural norms.",
    'E-IS':"Adopt a common data environment with agreed access rules, so information sharing doesn't depend on individual relationships.",
    'E-EE':"Bring key subcontractors and stakeholders into design review before packages are frozen, not after award.",
    'E-TD':"Publish a decision log so stakeholders can see who decided what, and when.",
    'E-TR':"Establish and enforce a code of conduct for meetings and correspondence; address disrespectful behaviour promptly.",
    'E-CA':"Review contract incentive structures — e.g. moving toward collaborative forms — so commercial terms reward cooperation, not adversarial claims.",
    'E-KT':"Run structured lessons-learned workshops at phase-end and feed outputs into a searchable repository for future projects.",
    'E-DT':"Audit current digital coordination tools for gaps and standardise on a single platform across parties where feasible.",
    'E-CM':"Introduce an early-warning and escalation protocol for stakeholder conflicts before they reach formal dispute.",
    'A-RR':"Publish and maintain a RACI matrix for the project team, reviewed at each major stage gate.",
    'A-GE':"Simplify governance layers where approvals are duplicated; set service-level targets for sign-off turnaround.",
    'A-DT':"Set target turnaround times for variation and change decisions, and track adherence on a dashboard.",
    'A-CP':"Document a single change-control process and train all design and delivery staff on it.",
    'A-EP':"Define clear escalation thresholds and routes, and communicate them to the full team, not just management.",
    'A-IC':"Establish a standing design–commercial–delivery coordination forum with a fixed cadence.",
    'A-RM':"Move to a live, jointly-owned risk register reviewed at every project meeting rather than a static document.",
    'A-LL':"Mandate a lessons-learned review at each phase gate with actions tracked into the next stage's plan.",
    'A-IM':"Standardise document naming and version control, and audit the information management system quarterly.",
    'R-TI':"Build explicit contingency or exploration time into programme baselines rather than assuming it will be found.",
    'R-ST':"Review resourcing plans against actual workload data before mobilisation, not just at bid stage.",
    'R-TE':"Create a rapid-access route to internal or external technical specialists for time-critical problems.",
    'R-SS':"Map specialist skill needs against the programme early and pre-book scarce resources (digital, regulatory, engineering).",
    'R-BF':"Set aside a discretionary improvement budget line, separate from contingency, ring-fenced for process or tooling upgrades.",
    'R-TA':"Audit tool and system uptime; fix recurring IT or licensing blockers reported by site teams.",
    'R-TO':"Establish a minimum annual training allocation per role and track completion against it.",
    'R-TS':"Set service-level response targets for technical or IT support requests and monitor against them.",
    'R-MC':"Pre-agree a surge or flex resourcing arrangement (framework subcontractors, agency panel) for unexpected demand spikes."
  };

  var DIM_BAND_NOTE = {
    LEADERSHIP: {
      red:"Leadership behaviours are currently a primary constraint on innovation readiness. Psychological safety and visible sponsorship of change need direct, near-term attention from senior leadership.",
      amber:"Leadership provides a partial platform for change — some enabling behaviours are present, but inconsistently. Targeted coaching and clearer championship of improvement will lift this further.",
      green:"Leadership behaviours are a genuine strength. The priority is protecting this — embedding it into how new leaders are selected and onboarded — rather than active remediation."
    },
    ENVIRONMENT: {
      red:"The inter-organisational climate — trust, information flow and contractual alignment — is currently working against collaboration. This is likely to be surfacing as friction, rework or disputes.",
      amber:"Collaboration between parties is workable but fragile in places. Strengthening information-sharing infrastructure and early engagement will reduce the risk of it degrading under pressure.",
      green:"Cross-party collaboration is a genuine asset. Maintain it through onboarding of new stakeholders and by protecting the structures (CDE, partnering norms) that produced it."
    },
    ARCHITECTURE: {
      red:"Structural conditions — governance, decision rights, escalation — are impeding progress. Decisions are likely slow or unpredictable, and this compounds every other dimension.",
      amber:"Structures broadly function but have inconsistent points of friction, most likely around decision timeliness or lessons-learned integration. These are usually low-cost to fix.",
      green:"Governance and decision structures are supporting delivery well. Periodically stress-test them against larger or more complex projects to confirm they scale."
    },
    RESOURCES: {
      red:"Available slack — time, staffing, skills, budget, tools — is insufficient to support exploration or improvement work alongside delivery pressure. This dimension typically has to be addressed before other interventions can land.",
      amber:"Resourcing is adequate for business-as-usual but leaves little margin for improvement work. Small, targeted investments (training time, specialist access) will disproportionately help.",
      green:"Resource slack is a genuine enabler here. Use it deliberately — this is the dimension most likely to fund experimentation identified in other areas."
    }
  };

  var SECTION2 = [
    {part:'A', partTitle:'Professional Profile', id:'A1', label:'Role level', dim:null, type:'single',
      question:'Which best describes your current or most recent role?',
      options:['Site / Field Operative','Technician / Junior Professional (0–5 yrs)','Engineer / Professional (5–10 yrs)',
        'Senior Engineer / Senior Professional (10–15 yrs)','Project Manager / Associate','Senior Project Manager / Principal',
        'Director / Partner / C-Suite','Other (please specify)'], other:true},
    {part:'A', id:'A2', label:'Sector', dim:null, type:'single',
      question:'Which construction sector best describes your primary work?',
      options:['Civil / Infrastructure','Building / Commercial','Residential','Industrial / Energy','Specialist Consultancy','Client / Public Body','Other (please specify)'], other:true},
    {part:'A', id:'A3', label:'Organisation size', dim:null, type:'single',
      question:'How many people work in your organisation?',
      options:['Fewer than 10','10–49','50–249','250–999','1,000 or more']},
    {part:'A', id:'A4', label:'Country of work', dim:null, type:'single',
      question:'Where are you primarily based?',
      options:['Ireland','United Kingdom','Europe (other)','Middle East','North America','Other (please specify)'], other:true},
    {part:'A', id:'A5', label:'Years of experience', dim:null, type:'single',
      question:'How many years have you worked in the construction industry?',
      options:['Less than 5','5–9','10–14','15–19','20 or more']},

    {part:'B', partTitle:'Departure Experience', id:'B1', label:'Departure type', dim:null, type:'single',
      question:'Which best describes your most recent experience?',
      options:['I voluntarily left a construction organisation','I seriously considered leaving but stayed',
        'I have not seriously considered leaving a construction role']},
    {part:'B', id:'B2', label:'Primary reason for leaving', dim:null, type:'single', skipIf:{q:'B1',eq:2},
      question:'What was the PRIMARY reason you left or considered leaving?',
      optionGroups:[
        {group:'Culture & People',options:[
          {text:'Poor psychological safety / fear of speaking up',dim:'ENVIRONMENT'},
          {text:'Poor leadership behaviours or management style',dim:'LEADERSHIP'},
          {text:'Lack of autonomy or decision-making authority',dim:'ARCHITECTURE'},
          {text:'Insufficient access to tools, training, or resources',dim:'RESOURCES'}]},
        {group:'Career & Development',options:[
          {text:'Limited career progression opportunities'},{text:'Lack of recognition or professional development'},
          {text:'Better opportunity elsewhere'}]},
        {group:'Practical',options:[
          {text:'Salary or financial package'},{text:'Work location or travel demands'},
          {text:'Workload or work-life balance'},{text:'Project or contract ending'}]},
        {group:'Other',options:[{text:'Organisational restructure or redundancy'},{text:'Other (please specify)'}]}
      ], other:true},
    {part:'B', id:'B3', label:'Contributing factors', dim:null, type:'multi', skipIf:{q:'B1',eq:2},
      question:'Were any of the following ALSO factors, even if not the primary reason? Select all that apply.',
      optionGroups:[
        {group:'Culture & People',options:[
          {text:'Poor psychological safety / fear of speaking up',dim:'ENVIRONMENT'},
          {text:'Poor leadership behaviours or management style',dim:'LEADERSHIP'},
          {text:'Lack of autonomy or decision-making authority',dim:'ARCHITECTURE'},
          {text:'Insufficient access to tools, training, or resources',dim:'RESOURCES'}]},
        {group:'Career & Development',options:[
          {text:'Limited career progression opportunities'},{text:'Lack of recognition or professional development'},
          {text:'Better opportunity elsewhere'}]},
        {group:'Practical',options:[
          {text:'Salary or financial package'},{text:'Work location or travel demands'},
          {text:'Workload or work-life balance'},{text:'Project or contract ending'}]},
        {group:'Other',options:[{text:'Organisational restructure or redundancy'},{text:'Other (please specify)'}]}
      ]},
    {part:'B', id:'B4', label:'Consideration period', dim:null, type:'single', skipIf:{q:'B1',eq:2},
      question:'How long did you consider leaving before acting or deciding to stay?',
      options:['I left / decided without prolonged consideration','Less than 3 months','3–6 months','6–12 months','More than 12 months']},

    {part:'C', partTitle:'Transition & Knowledge', id:'C1', label:'Vacancy duration', dim:null, type:'single', skipIf:{q:'B1',eq:2},
      question:'Approximately how long was it before the role was filled or covered after departure?',
      options:['Less than 1 month','1–3 months','3–6 months','More than 6 months',"Don't know / not applicable"]},
    {part:'C', id:'C2', label:'Time to full productivity', dim:null, type:'single',
      question:'In your experience, how long does it typically take someone new in your type of role to reach full productivity?',
      options:['Less than 1 month','1–3 months','3–6 months','6–12 months','More than 12 months']},
    {part:'C', id:'C3', label:'Knowledge capture', dim:'ARCHITECTURE', type:'single',
      question:'When you or a colleague left a role, how much of the project-critical knowledge they held was captured in organisational systems?',
      options:['Almost all of it was captured in systems','Most of it was captured','About half was captured',
        'Most was held personally and left with them','Almost none was captured — knowledge was largely lost']},
    {part:'C', id:'C4', label:'Recruitment route', dim:null, type:'single', skipIf:{q:'B1',eq:2},
      question:'How was the vacancy typically filled in your organisation?',
      options:['Internal transfer or promotion','Direct hire (no agency)','Recruitment agency','Interim / contractor cover',
        'Role was not replaced',"Don't know"]}
  ];

  function bandFor(score){
    if(score < 3.0) return 'red';
    if(score < 3.7) return 'amber';
    return 'green';
  }
  var BAND_LABEL = {red:'Needs Attention',amber:'Developing',green:'Strength'};

  function computeReport(answers){
    // answers.s1 = { 'L-IC': 4, ... }  answers.s2 = { A1:'...', B2:'...', B3:[...], C3:'...', ... }
    var dims = {};
    DIM_ORDER.forEach(function(d){ dims[d] = {sum:0,count:0}; });
    var itemScores = [];
    SECTION1.forEach(function(item){
      var v = answers.s1 ? answers.s1[item.code] : null;
      if(v){
        dims[item.dim].sum += v; dims[item.dim].count++;
        itemScores.push({code:item.code,label:item.label,dim:item.dim,score:v,text:item.text});
      }
    });
    var dimResults = {}, overallSum=0, overallCount=0;
    DIM_ORDER.forEach(function(d){
      var c = dims[d];
      var avg = c.count? c.sum/c.count : 0;
      dimResults[d] = {avg:avg, band:bandFor(avg), count:c.count};
      overallSum += c.sum; overallCount += c.count;
    });
    var overall = overallCount? overallSum/overallCount : 0;

    itemScores.sort(function(a,b){ return a.score-b.score || a.n-b.n; });
    var lowest = itemScores.slice(0,5).map(function(it){
      return {code:it.code,label:it.label,dim:it.dim,score:it.score,text:it.text,intervention:INTERVENTIONS[it.code]};
    });

    var s2 = answers.s2 || {};
    var notes = [];
    // Departure/turnover attribution
    var leftOrConsidered = s2.B1 && s2.B1 !== 'I have not seriously considered leaving a construction role';
    if(leftOrConsidered && s2.B2){
      var b2dim = findDim('B2', s2.B2);
      if(b2dim){
        notes.push({
          type:'attribution',
          title:'Departure linked to '+DIMENSIONS[b2dim].label,
          body:'The primary reason given for leaving or seriously considering leaving — "'+s2.B2+'" — maps to the '+DIMENSIONS[b2dim].label+
            ' dimension, which scored in the "'+BAND_LABEL[dimResults[b2dim].band]+'" band ('+dimResults[b2dim].avg.toFixed(2)+'/5) in this survey. '+
            'This is a direct, primary-data link between a culturally-addressable factor and turnover risk.'
        });
      }
    }
    if(s2.B3 && s2.B3.length){
      var secDims = {};
      s2.B3.forEach(function(t){ var d=findDim('B3',t); if(d) secDims[d]=true; });
      var secDimList = Object.keys(secDims).map(function(d){ return DIMENSIONS[d].label; });
      if(secDimList.length){
        notes.push({
          type:'secondary',
          title:'Secondary cultural contributors',
          body:'Contributing factors also cited '+secDimList.join(', ')+' — even where the primary reason was practical (salary, location, workload), '+
            'culture was a compounding driver rather than the sole cause.'
        });
      }
    }
    if(s2.C3){
      var c3idx = ['Almost all of it was captured in systems','Most of it was captured','About half was captured',
        'Most was held personally and left with them','Almost none was captured — knowledge was largely lost'].indexOf(s2.C3);
      if(c3idx >= 2){
        var archBand = dimResults.ARCHITECTURE.band;
        notes.push({
          type:'knowledge',
          title:'Knowledge loss amplifier',
          body:'Knowledge capture was reported as low ("'+s2.C3+'"). Combined with an Architecture score of '+
            dimResults.ARCHITECTURE.avg.toFixed(2)+'/5 ('+BAND_LABEL[archBand]+'), this suggests project-critical knowledge is at meaningful '+
            'risk of walking out the door with departing staff — prioritise the lessons-learned and information-management interventions above.'
        });
      }
    }
    if(s2.B4 && s2.B4 !== 'I left / decided without prolonged consideration'){
      notes.push({
        type:'disengagement',
        title:'Pre-departure disengagement window',
        body:'A consideration period of "'+s2.B4+'" was reported before leaving or deciding to stay. Research on disengagement '+
          '(Gallup; Harter et al., 2002) suggests productivity during this window typically falls to 60–75% of normal — '+
          'addressing the primary driver above sooner reduces this hidden cost.'
      });
    }
    if(s2.C1 && s2.C1 !== "Don't know / not applicable"){
      notes.push({
        type:'vacancy',
        title:'Vacancy & ramp-up exposure',
        body:'Reported vacancy duration was "'+s2.C1+'"'+(s2.C2? ' with new starters typically taking "'+s2.C2+'" to reach full productivity':'')+
          '. Combined, this is the direct productivity cost of turnover in this role — independent of recruitment fees.'
      });
    }

    return {
      dims: dimResults, overall: overall, overallBand: bandFor(overall),
      lowest: lowest, notes: notes, s2: s2,
      answeredCount: itemScores.length
    };
  }

  function findDim(qid, text){
    var q = SECTION2.filter(function(x){ return x.id===qid; })[0];
    if(!q || !q.optionGroups) return null;
    for(var g=0; g<q.optionGroups.length; g++){
      for(var o=0; o<q.optionGroups[g].options.length; o++){
        var opt = q.optionGroups[g].options[o];
        if(opt.text === text) return opt.dim || null;
      }
    }
    return null;
  }

  return {
    DIMENSIONS: DIMENSIONS, DIM_ORDER: DIM_ORDER, SECTION1: SECTION1, SECTION2: SECTION2,
    INTERVENTIONS: INTERVENTIONS, DIM_BAND_NOTE: DIM_BAND_NOTE, BAND_LABEL: BAND_LABEL,
    bandFor: bandFor, computeReport: computeReport
  };
})();
