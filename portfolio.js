'use strict';

(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const menu = $('#siteMenu');
  const menuButton = $('.menu-toggle');
  const backdrop = $('.menu-backdrop');
  let returnFocus;

  function setMenu(open, restoreFocus = true) {
    if (open) returnFocus = document.activeElement;
    menu.inert = !open;
    menu.classList.toggle('is-open', open);
    backdrop.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    $('#content').inert = open;
    $('.chapter-rail').inert = open;
    $('footer').inert = open;
    if (open) menu.querySelector('a').focus({ preventScroll: true });
    else if (restoreFocus && returnFocus) returnFocus.focus({ preventScroll: true });
  }

  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  backdrop.addEventListener('click', () => setMenu(false));
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    const target = $(link.getAttribute('href'));
    setMenu(false, false);
    // Focus the destination, so keyboard users continue in the selected chapter.
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }));
  document.addEventListener('keydown', event => {
    if (menuButton.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') setMenu(false);
    if (event.key !== 'Tab') return;
    const focusable = [menuButton, ...menu.querySelectorAll('a')];
    const first = focusable[0], last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });

  // Static seeded particles: no endless animation loop or layout changes.
  let seed = 42;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  for (let i = 0; i < 65; i++) {
    const dot = document.createElement('i');
    dot.style.left = `${random() * 100}%`;
    dot.style.top = `${random() * 100}%`;
    dot.style.opacity = String(.08 + random() * .25);
    $('.stars').append(dot);
  }

  const chapterLinks = $$('.chapter-rail a');
  const sections = chapterLinks.map(a => $(a.getAttribute('href')));
  let scrollFrame = 0;
  function updateReading() {
    scrollFrame = 0;
    const end = document.documentElement.scrollHeight - innerHeight;
    $('.reading-progress').style.width = `${end > 0 ? 100 * scrollY / end : 0}%`;
    let current = sections[0];
    for (const section of sections) if (section.getBoundingClientRect().top <= innerHeight * .5) current = section;
    if (scrollY >= end - 5) current = sections.at(-1);
    document.body.dataset.chapter = current.id;
    chapterLinks.forEach(link => {
      if (link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateReading);
  }, { passive: true });
  addEventListener('resize', updateReading);
  updateReading();

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .08 });
  $$('.section-heading, .bio-copy, .timeline > div, .contact > h2').forEach(el => {
    el.classList.add('reveal'); revealObserver.observe(el);
  });
  document.documentElement.classList.add('motion-ready');
  const connectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); connectionObserver.unobserve(entry.target); }
    });
  }, { threshold: .3 });
  connectionObserver.observe($('.connection-section'));

  const notes = [
    'Start with curiosity. Look closely enough to find a better question.',
    'Connect the audience, the message and the goal before choosing a direction.',
    'Turn that connection into something useful, clear and considered.'
  ];
  const pathButtons = $$('[data-path]');
  function selectPath(index) {
    pathButtons.forEach((button, i) => {
      button.classList.toggle('active', i === index);
      button.setAttribute('aria-pressed', String(i === index));
    });
    $('#pathNote').textContent = notes[index];
    $('.neural-map').dataset.connection = String(index);
  }
  pathButtons.forEach((button, i) => {
    button.addEventListener('click', () => selectPath(i));
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const index = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (i + (event.key === 'ArrowRight' ? 1 : -1) + 3) % 3;
      pathButtons[index].focus(); selectPath(index);
    });
  });

  const projects = window.PortfolioProjectViews.order(window.WORK || []);
  if (!$('#projectList').children.length) $('#projectList').innerHTML = window.PortfolioProjectViews.render(projects);

  const projectCards = $$('.project');
  const filters = $$('[data-filter]');
  function filterProjects(group, announce = true) {
    let count = 0;
    projectCards.forEach(card => {
      card.hidden = group !== 'all' && card.dataset.group !== group;
      if (!card.hidden) count++;
    });
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === group)));
    if (announce) $('#projectCount').textContent = `${count} ${count === 1 ? 'exploration' : 'explorations'}`;
    requestAnimationFrame(updateReading);
  }
  filters.forEach(button => button.addEventListener('click', () => filterProjects(button.dataset.filter)));
  $('#workToolbar').hidden = false;
  filterProjects('all');

  async function copyText(value, feedback, fallback) {
    try {
      await navigator.clipboard.writeText(value);
      feedback.textContent = 'Link copied.';
      fallback.hidden = true;
    } catch {
      fallback.value = value;
      fallback.hidden = false;
      fallback.focus(); fallback.select();
      feedback.textContent = 'Select and copy this link.';
    }
  }
  $$('[data-share]').forEach(button => button.addEventListener('click', () => {
    const card = button.closest('.project');
    const url = new URL(location.href);
    url.hash = card.id;
    copyText(url.href, card.querySelector('.share-feedback'), card.querySelector('.share-fallback'));
  }));
  function openLinkedProject() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const card = document.getElementById(id);
    if (!card?.classList.contains('project')) return;
    filterProjects('all');
    card.open = true;
    requestAnimationFrame(() => card.scrollIntoView({ behavior: 'instant', block: 'start' }));
  }
  addEventListener('hashchange', openLinkedProject);
  openLinkedProject();

  $$('[data-role-filter]').forEach(link => link.addEventListener('click', () => {
    filterProjects(link.dataset.roleFilter);
  }));

  // Web3Forms direct delivery, with a local email fallback when unavailable.
  const enquiryForm = $('#enquiryForm');
  let selectedProject = null;
  let enquiryDraft = null;
  let sendingEnquiry = false;
  const deliveryKey = () => String(window.SITE?.web3formsKey || '').trim();
  const submitButton = $('.prepare-enquiry');
  const idleSubmitLabel = () => deliveryKey() ? 'Send enquiry' : 'Prepare email';
  $('.compose-note').textContent = deliveryKey()
    ? 'Your name, email and message are sent through Web3Forms to Navya’s inbox. You can also use the email fallback.'
    : 'Prepare a message to open in your email app or copy and send yourself.';
  submitButton.firstChild.textContent = `${idleSubmitLabel()} `;
  $('#contactCompose').hidden = false;
  function hideDraft() {
    $('#emailDraft').hidden = true;
    $('#enquiryFeedback').textContent = '';
    $('#enquiryCopyFallback').hidden = true;
    enquiryDraft = null;
  }
  function setBrief(project) {
    selectedProject = project;
    $('#selectedBrief').hidden = !project;
    $('#selectedBriefText').textContent = project ? `Inspired by: ${project.title}` : '';
    hideDraft();
  }
  $$('[data-enquire]').forEach(link => link.addEventListener('click', event => {
    if (sendingEnquiry) { event.preventDefault(); return; }
    setBrief(projects.find(project => project.slug === link.dataset.enquire));
    enquiryForm.elements.enquiryType.value = 'collaboration';
  }));
  $('#clearBrief').addEventListener('click', () => {
    setBrief(null);
    $('#enquiryMessage').focus();
  });
  $$('.contact-options a').forEach((link, index) => link.addEventListener('click', event => {
    event.preventDefault();
    if (sendingEnquiry) return;
    enquiryForm.elements.enquiryType.value = index === 0 ? 'role' : 'collaboration';
    if (index === 0) setBrief(null);
    hideDraft();
    $('#contactCompose').scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth', block: 'center' });
    $('#composeTitle').focus({ preventScroll: true });
  }));
  enquiryForm.addEventListener('input', hideDraft);
  enquiryForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (sendingEnquiry) return;
    if (enquiryForm.elements.botcheck.checked) return;
    $('#deliveryStatus').textContent = '';
    $('#deliveryStatus').dataset.state = '';
    const data = new FormData(enquiryForm);
    const name = String(data.get('name')).trim();
    const organisation = String(data.get('organisation')).trim();
    const replyEmail = String(data.get('email')).trim();
    const message = String(data.get('message')).trim();
    if (!name || !message) {
      const input = !name ? $('#enquiryName') : $('#enquiryMessage');
      input.setCustomValidity('Please add a little detail here.');
      input.reportValidity();
      input.addEventListener('input', () => input.setCustomValidity(''), { once: true });
      return;
    }
    const type = data.get('enquiryType') === 'role' ? 'Role or internship enquiry' : 'Creative collaboration';
    const subject = selectedProject ? `${type}: ${selectedProject.title}` : `${type}${organisation ? ` — ${organisation}` : ''}`;
    const body = `Hi Navya,\n\n${message}${selectedProject ? `\n\nProject reference: ${selectedProject.title}` : ''}\n\n${name}\n${replyEmail}${organisation ? `\n${organisation}` : ''}`;
    const key = deliveryKey();
    if (key) {
      sendingEnquiry = true;
      const locked = [...enquiryForm.elements].map(element => [element, element.disabled]);
      locked.forEach(([element]) => element.disabled = true);
      enquiryForm.setAttribute('aria-busy', 'true');
      submitButton.firstChild.textContent = 'Sending… ';
      $('#emailDraft').hidden = true;
      $('#deliveryStatus').textContent = 'Sending your enquiry…';
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({ access_key: key, subject, from_name: 'Navya Gupta Portfolio', name, email: replyEmail, replyto: replyEmail, organisation, message, enquiry_type: type, project_reference: selectedProject?.title || '', botcheck: false })
        });
        const result = await response.json();
        if (!response.ok || result.success !== true) throw new Error('Delivery rejected');
        $('#deliveryStatus').textContent = 'Your enquiry was submitted successfully. Thank you for getting in touch.';
        $('#deliveryStatus').dataset.state = 'success';
        enquiryForm.reset();
        setBrief(null);
        return;
      } catch {
        $('#deliveryStatus').textContent = 'Your enquiry could not be confirmed as sent. Your message is still here. You can try again or use the email option below.';
        $('#deliveryStatus').dataset.state = 'error';
      } finally {
        clearTimeout(timeout);
        sendingEnquiry = false;
        locked.forEach(([element, disabled]) => element.disabled = disabled);
        enquiryForm.removeAttribute('aria-busy');
        submitButton.firstChild.textContent = `${idleSubmitLabel()} `;
      }
    } else {
      $('#deliveryStatus').textContent = 'Direct delivery is currently unavailable. You can open or copy your email below.';
    }
    enquiryDraft = { subject, body };
    $('#draftSubject').textContent = subject;
    $('#draftBody').textContent = body;
    $('#openEmailDraft').href = `mailto:hello@studionavya.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    $('#emailDraft').hidden = false;
    $('#openEmailDraft').focus({ preventScroll: true });
    $('#emailDraft').scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth', block: 'nearest' });
  });
  $('#copyEnquiry').addEventListener('click', async () => {
    if (!enquiryDraft) return;
    const value = `To: hello@studionavya.com\nSubject: ${enquiryDraft.subject}\n\n${enquiryDraft.body}`;
    try {
      await navigator.clipboard.writeText(value);
      $('#enquiryFeedback').textContent = 'Message copied. Paste it into your email app when you’re ready.';
    } catch {
      const fallback = $('#enquiryCopyFallback');
      fallback.value = value; fallback.hidden = false; fallback.focus(); fallback.select();
      $('#enquiryFeedback').textContent = 'Select and copy your message below.';
    }
  });

  $('#year').textContent = new Date().getFullYear();
  const email = document.createElement('a');
  email.className = 'contact-address';
  email.href = 'mailto:hello@studionavya.com';
  email.textContent = 'hello@studionavya.com';
  $('.contact').append(email);

  // Start audio only after an explicit gesture; ramp gain to avoid clicks.
  let audio, gain, soundBusy = false;
  const sound = $('#sound');
  const setSoundUI = enabled => {
    sound.setAttribute('aria-pressed', String(enabled));
    sound.textContent = enabled ? 'Sound on' : 'Sound off';
  };
  sound.addEventListener('click', async () => {
    if (soundBusy) return;
    soundBusy = true;
    const enabled = sound.getAttribute('aria-pressed') === 'true';
    try {
      if (!audio) {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) throw new Error('Audio unavailable');
        audio = new Audio();
        gain = audio.createGain(); gain.gain.value = 0; gain.connect(audio.destination);
        [130.81, 196, 261.63].forEach(frequency => {
          const oscillator = audio.createOscillator();
          oscillator.frequency.value = frequency; oscillator.connect(gain); oscillator.start();
        });
      }
      if (enabled) {
        gain.gain.setTargetAtTime(0, audio.currentTime, .06);
        await new Promise(resolve => setTimeout(resolve, 200));
        await audio.suspend();
      } else {
        await audio.resume();
        gain.gain.setTargetAtTime(.014, audio.currentTime, .18);
      }
      setSoundUI(!enabled);
    } catch {
      sound.textContent = 'Sound unavailable'; sound.disabled = true;
    } finally { soundBusy = false; }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && audio) { gain.gain.value = 0; audio.suspend(); setSoundUI(false); }
  });
  // A changed system preference must take effect without reloading.
  motion.addEventListener('change', () => {
    if (motion.matches) $$('.reveal').forEach(el => el.classList.add('visible'));
  });
  document.documentElement.classList.remove('no-js');
})();
