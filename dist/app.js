(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const {slides, sections} = window.DECK;
  $('page').max = slides.length;
  $('page-total').textContent = `/ ${slides.length}`;
  let current = 1, overview = false, allBuilt = false;
  const clamp = n => Math.max(1, Math.min(slides.length, Number.isFinite(n) ? Math.round(n) : current));
  const hashPage = () => { const match = location.hash.match(/^#slide-(\d+)$/); return match ? clamp(Number(match[1])) : 1; };
  function render(n, updateHash = true) {
    current = clamp(n);
    const slide = slides[current - 1];
    $('slide-image').src = slide.image;
    $('slide-image').alt = `${current}쪽 · ${slide.title}`;
    $('slide-caption').textContent = slide.paragraphs.join('\n') || slide.title;
    $('page').value = current;
    $('previous').disabled = current === 1;
    $('next').disabled = current === slides.length;
    $('section-name').textContent = slide.section;
    $('slide-title').textContent = slide.title;
    $('progress-bar').style.width = `${current / slides.length * 100}%`;
    $('announcement').textContent = `${current} / ${slides.length}, ${slide.title}`;
    document.title = `${slide.title} · 3D 프린터의 활용`;
    document.querySelectorAll('.slide-link').forEach(el => el.setAttribute('aria-current', String(Number(el.dataset.page) === current)));
    if (updateHash) history.replaceState(null, '', `#slide-${current}`);
    if (overview) $('overview-' + current)?.scrollIntoView({block:'start',behavior:'smooth'});
    if ($('text-panel').open) fillText();
    for (const next of [current - 2, current]) if (slides[next]) { const img = new Image(); img.src = slides[next].image; }
  }
  function setMenu(open) {
    $('sidebar').hidden = !open; $('scrim').hidden = !open;
    $('menu').setAttribute('aria-expanded', String(open));
    if (open) $('search').focus(); else $('menu').focus();
  }
  function renderList() {
    const query = $('search').value.trim().toLocaleLowerCase();
    const matches = slides.filter(s => `${s.number} ${s.title} ${s.paragraphs.join(' ')}`.toLocaleLowerCase().includes(query));
    $('slide-list').replaceChildren();
    $('search-count').textContent = query ? `${matches.length}개 슬라이드 검색됨` : `전체 ${slides.length}장`;
    for (const section of sections) {
      const group = matches.filter(s => s.section === section.title);
      if (!group.length) continue;
      const heading = document.createElement('h3'); heading.textContent = section.title; $('slide-list').append(heading);
      for (const slide of group) {
        const button = document.createElement('button'); button.className = 'slide-link'; button.dataset.page = slide.number;
        button.setAttribute('aria-current', String(slide.number === current));
        const img = document.createElement('img'); img.src = slide.thumb; img.alt = ''; img.loading = 'lazy'; img.width = 384; img.height = 216;
        const title = document.createElement('span'); const num = document.createElement('small'); num.textContent = `${String(slide.number).padStart(2,'0')} / ${slides.length}`;
        title.append(num, document.createTextNode(slide.title)); button.append(img,title);
        button.addEventListener('click', () => {render(slide.number);setMenu(false);$('stage').focus();});
        $('slide-list').append(button);
      }
    }
    if (!matches.length) {const p=document.createElement('p');p.className='no-results';p.textContent='검색 결과가 없습니다. 다른 검색어를 입력해 주세요.';$('slide-list').append(p);}
  }
  function buildAll() {
    if (allBuilt) return;
    allBuilt = true;
    for (const slide of slides) {
      const figure = document.createElement('figure'); figure.id = `overview-${slide.number}`; figure.className = 'overview-slide';
      const button = document.createElement('button'); button.setAttribute('aria-label',`${slide.number}쪽 ${slide.title} 크게 보기`);
      const img = document.createElement('img'); img.src = slide.image; img.alt = slide.title; img.loading = 'lazy'; img.width = 1920; img.height = 1080;
      const caption = document.createElement('figcaption'); caption.textContent = `${String(slide.number).padStart(2,'0')} / ${slides.length} · ${slide.title}`;
      button.append(img); button.addEventListener('click',()=>{setOverview(false);render(slide.number);}); figure.append(button,caption); $('all-view').append(figure);
    }
  }
  function setOverview(value) {
    overview = value; if(value) buildAll();
    document.body.classList.toggle('overview',value); $('single-view').hidden=value; $('all-view').hidden=!value;
    $('view-mode').textContent=value?'한 장씩 보기':'모아보기'; $('view-mode').setAttribute('aria-pressed',String(value));
    if(value) $('overview-'+current).scrollIntoView({block:'start'});
  }
  function fillText() {
    const slide = slides[current-1]; $('text-title').textContent=`${current}쪽 · ${slide.title}`;
    $('text-content').textContent=slide.paragraphs.join('\n\n') || '이미지로 구성된 슬라이드입니다. 슬라이드 화면에서 내용을 확인해 주세요.';
  }
  async function fullscreen() {
    if (document.fullscreenElement) {await document.exitFullscreen();return;}
    if (document.body.classList.contains('presentation')) {document.body.classList.remove('presentation');$('fullscreen').textContent='전체화면';return;}
    try { await document.documentElement.requestFullscreen(); }
    catch { document.body.classList.add('presentation'); }
  }
  $('menu').addEventListener('click',()=>setMenu(true)); $('close-menu').addEventListener('click',()=>setMenu(false)); $('scrim').addEventListener('click',()=>setMenu(false));
  $('search').addEventListener('input',renderList);
  $('previous').addEventListener('click',()=>render(current-1)); $('next').addEventListener('click',()=>render(current+1));
  $('page').addEventListener('change',()=>render(Number($('page').value)));
  $('view-mode').addEventListener('click',()=>setOverview(!overview)); $('fullscreen').addEventListener('click',fullscreen);
  document.addEventListener('fullscreenchange',()=>{document.body.classList.toggle('presentation',!!document.fullscreenElement);$('fullscreen').textContent=document.fullscreenElement?'전체화면 종료':'전체화면';});
  $('text-toggle').addEventListener('click',()=>{fillText();$('text-panel').showModal();$('text-toggle').setAttribute('aria-expanded','true');});
  $('close-text').addEventListener('click',()=>$('text-panel').close());
  $('text-panel').addEventListener('close',()=>$('text-toggle').setAttribute('aria-expanded','false'));
  document.addEventListener('keydown',e=>{
    if (e.key==='Escape') {if(!$('sidebar').hidden)setMenu(false);if(!document.fullscreenElement)document.body.classList.remove('presentation');return;}
    if (e.ctrlKey||e.metaKey||e.altKey||e.target.matches('input,textarea,select')||$('text-panel').open||!$('sidebar').hidden) return;
    if (['ArrowRight','PageDown','ArrowLeft','PageUp','Home','End',' '].includes(e.key) && !overview) {
      if (e.key===' '&&e.target.closest('button,a'))return;
      e.preventDefault(); render(e.key==='Home'?1:e.key==='End'?slides.length:current+(['ArrowLeft','PageUp'].includes(e.key)?-1:1));
    }
    if(e.key.toLowerCase()==='f')fullscreen();
  });
  let start = null;
  $('slide-frame').addEventListener('touchstart',e=>{start=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;},{passive:true});
  $('slide-frame').addEventListener('touchend',e=>{if(!start)return;const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)render(current+(dx<0?1:-1));start=null;},{passive:true});
  window.addEventListener('hashchange',()=>render(hashPage(),false)); window.addEventListener('beforeprint',buildAll);
  render(hashPage()); renderList();
})();
