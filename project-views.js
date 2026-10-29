/* One renderer shared by browser enhancement and the static publishing build. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PortfolioProjectViews = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
  const displayTitles = {
    'founder-linkedin-ghostwriting': 'THE FOUNDER’S VOICE',
    'cafe-instagram-refresh': 'SLOW COFFEE. STRONG STORIES.',
    'agency-cold-email-sequence': 'START A CONVERSATION',
    'skincare-welcome-emails': 'A WARMER WELCOME',
    'edtech-seo-articles': 'ANSWERS THAT CONNECT',
    'retail-sales-dashboard': 'MAKING DATA MAKE SENSE',
    'festive-campaign-plan': 'A SEASON TO REMEMBER'
  };
  const order = work => [...work].sort((a, b) =>
    Number(b.slug === 'founder-linkedin-ghostwriting') - Number(a.slug === 'founder-linkedin-ghostwriting'));
  const sample = `<div class="writing-sample"><h4>A POSSIBLE VOICE · DRAFT WRITING SAMPLE</h4>
    <blockquote>Our first onboarding flow explained every feature. It forgot to help someone do one useful thing.<br><br>
    If I were rebuilding it today, I’d start with one question: what does the person on the other side need to accomplish?<br><br>
    One clear next step. One small win. Then a reason to come back.</blockquote>
    <p>Fictional founder scenario, written as an illustrative portfolio sample. Illustrative draft; it is not a client testimonial or a published founder post.</p></div>`;
  // Editorial studies illustrate the proposed process; they are not client artifacts.
  function projectStudy(project, index) {
    const studies = [
      { title: 'A voice people recognise.', words: ['POINT OF VIEW', 'PERSONAL STORY', 'USEFUL INSIGHT'], mark: 'Aa', note: 'VOICE & STORY / LINKEDIN' },
      { title: 'A slower kind of story.', words: ['THE CRAFT', 'THE PEOPLE', 'THE NEIGHBOURHOOD'], mark: 'a.m.', note: 'CONTENT PILLARS / CAFÉ' },
      { title: 'A reason to reply.', words: ['OBSERVATION', 'RELEVANCE', 'CONVERSATION'], mark: '↗', note: 'SEQUENCE STRUCTURE / OUTREACH' },
      { title: 'Welcome. Then wonder.', words: ['INTRODUCE', 'UNDERSTAND', 'GUIDE'], mark: '01', note: 'CUSTOMER JOURNEY / EMAIL' },
      { title: 'Clarity comes first.', words: ['THE QUESTION', 'THE ANSWER', 'THE NEXT STEP'], mark: '?', note: 'INFORMATION DESIGN / CONTENT' },
      { title: 'See the bigger picture.', words: ['CLEAN', 'CONNECT', 'INTERPRET'], mark: '▥', note: 'ANALYTICAL WORKFLOW / DATA' },
      { title: 'Make the moment matter.', words: ['ANTICIPATION', 'DISCOVERY', 'DECISION'], mark: '✧', note: 'CAMPAIGN ARCHITECTURE / FESTIVE' }
    ];
    const study = studies[Object.keys(displayTitles).indexOf(project.slug)] || { title: escapeHTML(project.title), words: ['UNDERSTAND', 'PLAN', 'CREATE'], mark: '+', note: 'CONCEPT EXPLORATION' };
    return `<div class="project-study"><div class="study-note"><span>${study.note}</span><span>CONCEPT STUDY / 0${index + 1}</span></div><div class="study-composition"><span class="study-mark" aria-hidden="true">${study.mark}</span><p>${study.title}</p></div><div class="study-steps">${study.words.map((word, i) => `<span><small>0${i + 1}</small>${word}</span>`).join('')}</div><span class="study-disclaimer">Illustrative direction · proposed process</span></div>`;
  }
  function render(work) {
    return order(work).map((project, i) => {
      const group = project.category === 'Data Analytics' ? 'data' : ['Cold Email', 'Email Marketing', 'Digital Marketing'].includes(project.category) ? 'campaign' : 'content';
      const content = `<summary><span class="project-index" aria-hidden="true">0${i + 1}</span>
      <div><h3>${escapeHTML(displayTitles[project.slug] || project.title)}</h3><span class="project-type">${escapeHTML(project.category)} · Concept exploration</span></div>
      <span class="project-description">${escapeHTML(project.summary)}</span><span class="project-arrow" aria-hidden="true"></span></summary>
      <div class="project-content">${projectStudy(project, i)}
      <dl class="project-facts"><div><dt>CONTEXT</dt><dd>${escapeHTML(project.client)}</dd></div><div><dt>PROPOSED FOCUS</dt><dd>${escapeHTML(project.role)}</dd></div><div><dt>STATUS</dt><dd>Self-initiated concept</dd></div></dl><div><h4>THE OPPORTUNITY</h4><p>${escapeHTML(project.problem)}</p><h4>WHAT I WOULD TEST</h4><p>${escapeHTML(project.test)}</p></div>
      <div><h4>THE PROPOSED APPROACH</h4><ul>${project.approach.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul></div>
      ${project.slug === 'founder-linkedin-ghostwriting' ? sample : ''}
      <div class="planned-outputs"><h4>PLANNED OUTPUTS</h4><ul>${(project.deliverables || []).map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul><p>These are the intended scope of the concept, rather than a claim of completed client deliverables.</p></div>
      <div class="project-actions"><a href="#contact" data-enquire="${escapeHTML(project.slug)}">Discuss a similar brief <span class="inline-arrow" aria-hidden="true"></span></a><button type="button" data-share="${escapeHTML(project.slug)}">Copy project link</button><p class="share-feedback" role="status" aria-live="polite"></p><input class="share-fallback" readonly hidden aria-label="Project link to copy manually"></div>
      <p class="honesty">Self-initiated concept outline. Proposed deliverables are not presented as completed client work; published samples and performance results are not available.</p></div>`;
      return `<details class="project" id="project-${escapeHTML(project.slug)}" data-group="${group}">${content}</details>`;
    }).join('');
  }
  return { order, render };
});
