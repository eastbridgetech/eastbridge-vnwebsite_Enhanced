(() => {
  'use strict';
  const ready = fn => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn();
  ready(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = matchMedia('(pointer: fine)').matches;
    const header = document.querySelector('.site-header');
    const progress = document.createElement('div');
    progress.className = 'page-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.append(progress);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
      header?.classList.toggle('scrolled', scrollY > 18);
    };
    addEventListener('scroll', onScroll, {passive:true}); onScroll();
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.main-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); });
      nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { if (innerWidth <= 1020) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); } }));
    }
    const switcher = document.querySelector('.language-switcher');
    const langTrigger = document.querySelector('.lang-trigger');
    const cluster = document.querySelector('.nav-cluster');
    const clusterTrigger = document.querySelector('.nav-cluster-trigger');
    const closeMenus = except => {
      if (except !== 'lang') { switcher?.classList.remove('open'); langTrigger?.setAttribute('aria-expanded','false'); }
      if (except !== 'cluster') { cluster?.classList.remove('open'); clusterTrigger?.setAttribute('aria-expanded','false'); }
    };
    langTrigger?.addEventListener('click', e => { e.stopPropagation(); const open = switcher.classList.toggle('open'); langTrigger.setAttribute('aria-expanded', String(open)); closeMenus(open ? 'lang' : null); });
    clusterTrigger?.addEventListener('click', e => { e.stopPropagation(); const open = cluster.classList.toggle('open'); clusterTrigger.setAttribute('aria-expanded', String(open)); closeMenus(open ? 'cluster' : null); });
    document.addEventListener('click', e => { if (!switcher?.contains(e.target) && !cluster?.contains(e.target)) closeMenus(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenus(); });
    document.querySelectorAll('.lang-option[data-local]').forEach(link => link.addEventListener('click', e => {
      const host = location.hostname.toLowerCase();
      const localMode = host === 'localhost' || host === '127.0.0.1' || host.endsWith('.github.io') || location.protocol === 'file:';
      if (localMode) { e.preventDefault(); location.href = link.dataset.local; }
    }));
    const hero = document.querySelector('[data-slider]');
    if (hero) {
      const slides = [...hero.querySelectorAll('.hero-slide')];
      const dots = [...hero.querySelectorAll('.hero-dots button')];
      const title = hero.querySelector('.hero-content [data-title]');
      const copy = hero.querySelector('.hero-content [data-copy]');
      const eyebrow = hero.querySelector('.hero-content [data-eyebrow]');
      const primary = hero.querySelector('.hero-content [data-primary]');
      const secondary = hero.querySelector('.hero-content [data-secondary]');
      let active = 0, timer;
      const show = index => {
        active = (index + slides.length) % slides.length;
        slides.forEach((slide,i) => slide.classList.toggle('active',i===active));
        dots.forEach((dot,i) => dot.classList.toggle('active',i===active));
        const slide=slides[active], content=hero.querySelector('.hero-content');
        content?.classList.add('is-changing');
        setTimeout(() => {
          if (title) title.innerHTML=slide.dataset.title||'';
          if (copy) copy.textContent=slide.dataset.copy||'';
          if (eyebrow) eyebrow.textContent=slide.dataset.eyebrow||'';
          if (primary) { primary.textContent=slide.dataset.primary||''; primary.href=slide.dataset.primaryHref||'#'; }
          if (secondary) { secondary.textContent=slide.dataset.secondary||''; secondary.href=slide.dataset.secondaryHref||'#'; }
          content?.classList.remove('is-changing');
        },160);
      };
      const stop=()=>timer&&clearInterval(timer);
      const start=()=>{ stop(); if(!reduced) timer=setInterval(()=>show(active+1),7200); };
      hero.querySelector('.hero-arrow.prev')?.addEventListener('click',()=>{show(active-1);start();});
      hero.querySelector('.hero-arrow.next')?.addEventListener('click',()=>{show(active+1);start();});
      dots.forEach((dot,i)=>dot.addEventListener('click',()=>{show(i);start();}));
      hero.addEventListener('mouseenter',stop); hero.addEventListener('mouseleave',start); show(0); start();
    }
    document.querySelectorAll('img[src$=".webp"]').forEach(img => img.addEventListener('error', () => { if (!img.dataset.fallbackTried) { img.dataset.fallbackTried='true'; img.src=img.getAttribute('src').replace(/\.webp(?:\?.*)?$/i,'.jpg'); } }));
    const reveals=[...document.querySelectorAll('.reveal')];
    reveals.forEach((el,i)=>el.style.setProperty('--delay',`${Math.min((i%6)*70,350)}ms`));
    if ('IntersectionObserver' in window && !reduced) {
      const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.1,rootMargin:'0px 0px -40px 0px'});
      reveals.forEach(el=>observer.observe(el));
    } else reveals.forEach(el=>el.classList.add('visible'));
    document.querySelectorAll('.cursor-glow').forEach(card=>card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();card.style.setProperty('--mx',`${e.clientX-r.left}px`);card.style.setProperty('--my',`${e.clientY-r.top}px`);}));
    if (finePointer && !reduced) {
      document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('pointermove', e => { const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5; card.style.setProperty('--rx',`${-y*5}deg`); card.style.setProperty('--ry',`${x*6}deg`); card.style.setProperty('--tz','8px'); });
        card.addEventListener('pointerleave',()=>{card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg');card.style.setProperty('--tz','0px');});
      });
      document.querySelectorAll('.interactive-hero').forEach(el=>el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.setProperty('--hx',`${((e.clientX-r.left)/r.width-.5)*18}px`);el.style.setProperty('--hy',`${((e.clientY-r.top)/r.height-.5)*12}px`);}));
    }
    const contactForm=document.querySelector('[data-contact-form]');
    contactForm?.addEventListener('submit',e=>{e.preventDefault();const data=new FormData(contactForm);const subject=encodeURIComponent(`${data.get('subject')||'Website enquiry'} — ${data.get('name')||''}`);const body=encodeURIComponent([`Name: ${data.get('name')||''}`,`Company: ${data.get('company')||''}`,`Email: ${data.get('email')||''}`,`Phone: ${data.get('phone')||''}`,`Privacy consent: ${data.get('consent')==='on'?'Yes':'No'}`,'',data.get('message')||''].join('\n'));location.href=`mailto:info@eastbridgetechnologies.com?subject=${subject}&body=${body}`;});
    const host=location.hostname.toLowerCase(), path=location.pathname, isAsset=/\.(css|js|png|jpe?g|webp|svg|xml|txt|json|ico|woff2?)$/i.test(path);
    if(!isAsset&&(host==='eastbridge.my'||host==='www.eastbridge.my')&&!path.startsWith('/ms/')){const target=document.documentElement.dataset.msPath||'/ms/';if(path==='/'||document.documentElement.lang!=='ms')location.replace(target+location.search+location.hash);}
    if(!isAsset&&(host==='eastbridge.sg'||host==='www.eastbridge.sg')&&!path.startsWith('/zh/')){const target=document.documentElement.dataset.zhPath||'/zh/';if(path==='/'||!document.documentElement.lang.startsWith('zh'))location.replace(target+location.search+location.hash);}
  });
})();