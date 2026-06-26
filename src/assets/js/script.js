const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); } });
}, {threshold:0.15});
reveals.forEach(r => obs.observe(r));

const burger = document.querySelector('.burger');
const navMain = document.querySelector('.main-nav');
burger.addEventListener('click', () => {
  const open = navMain.style.display === 'flex';
  navMain.style.display = open ? 'none' : 'flex';
  navMain.style.flexDirection = 'column';
  navMain.style.position='absolute';
  navMain.style.top='100%';
  navMain.style.left='0';
  navMain.style.right='0';
  navMain.style.background='rgba(12,15,13,0.97)';
  navMain.style.padding='20px';
  navMain.style.gap='18px';
});

// Lightbox galerija na stranicama pojedinačnog smeštaja
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const lbImg = document.getElementById('lightbox-img');
  const lbCounter = document.getElementById('lightbox-counter');
  const triggers = [...document.querySelectorAll('[data-lightbox-src]')];
  const images = triggers.map(t => t.getAttribute('data-lightbox-src'));
  let current = 0;

  function renderLightbox(){
    lbImg.src = images[current];
    lbCounter.textContent = (current+1) + ' / ' + images.length;
  }
  function openLightbox(idx){
    current = idx;
    renderLightbox();
    lightbox.classList.add('open');
  }
  function closeLightbox(){ lightbox.classList.remove('open'); }
  function navLightbox(dir){
    current = (current + dir + images.length) % images.length;
    renderLightbox();
  }

  triggers.forEach((t, idx) => t.addEventListener('click', () => openLightbox(idx)));
  document.querySelectorAll('[data-lightbox-close]').forEach(b => b.addEventListener('click', closeLightbox));
  document.querySelectorAll('[data-lightbox-prev]').forEach(b => b.addEventListener('click', () => navLightbox(-1)));
  document.querySelectorAll('[data-lightbox-next]').forEach(b => b.addEventListener('click', () => navLightbox(1)));
  document.addEventListener('keydown', (e) => {
    if(!lightbox.classList.contains('open')) return;
    if(e.key === 'Escape') closeLightbox();
    if(e.key === 'ArrowRight') navLightbox(1);
    if(e.key === 'ArrowLeft') navLightbox(-1);
  });
  lightbox.addEventListener('click', (e) => { if(e.target === lightbox) closeLightbox(); });
}

// Filter chips + sort na kategorijskim listing stranicama (Vile, Apartmani, itd.)
const listingGrid = document.getElementById('listingGrid');
if (listingGrid) {
  const lgCards = [...listingGrid.children];
  const lgChips = document.querySelectorAll('.chip');
  const lgSort = document.getElementById('sortSelect');
  const lgCount = document.getElementById('resultsCount');
  const lgNoResults = document.getElementById('noResults');
  let lgActiveFilter = null;

  function lgVisibleCards(){
    return lgCards.filter(c => !c.classList.contains('batch-2') || c.classList.contains('show'));
  }

  function lgApplyFilter(){
    let visible = 0;
    lgVisibleCards().forEach(card => {
      let show = true;
      if(lgActiveFilter){
        const dist = parseInt(card.dataset.distance || 0);
        const cap = parseInt(card.dataset.capacity || 0);
        const rest = card.dataset.restoran === "1";
        if(lgActiveFilter.type === 'dist') show = dist <= lgActiveFilter.max;
        if(lgActiveFilter.type === 'cap') show = cap >= lgActiveFilter.min;
        if(lgActiveFilter.type === 'restoran') show = rest;
      }
      card.classList.toggle('hidden', !show);
      if(show) visible++;
    });
    if (lgCount) lgCount.innerHTML = `Prikazano <b>${visible}</b> od <b>${lgCards.length}</b>`;
    if (lgNoResults) lgNoResults.classList.toggle('show', visible === 0);
  }

  lgChips.forEach(chip => {
    chip.addEventListener('click', () => {
      lgChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const type = chip.dataset.filter;
      if(type === 'all'){ lgActiveFilter = null; }
      else if(type === 'dist'){ lgActiveFilter = {type:'dist', max: parseInt(chip.dataset.max)}; }
      else if(type === 'cap'){ lgActiveFilter = {type:'cap', min: parseInt(chip.dataset.min)}; }
      else if(type === 'restoran'){ lgActiveFilter = {type:'restoran'}; }
      lgApplyFilter();
    });
  });

  if (lgSort) {
    lgSort.addEventListener('change', () => {
      const val = lgSort.value;
      let sorted = [...lgCards];
      if(val === 'distance') sorted.sort((a,b) => (a.dataset.distance||0) - (b.dataset.distance||0));
      else if(val === 'capacity') sorted.sort((a,b) => (b.dataset.capacity||0) - (a.dataset.capacity||0));
      else if(val === 'name') sorted.sort((a,b) => (a.dataset.name||'').localeCompare(b.dataset.name||'', 'sr'));
      sorted.forEach(card => listingGrid.appendChild(card));
    });
  }

  window.resetListingFilters = function(){
    lgChips.forEach(c => c.classList.remove('active'));
    if (lgChips[0]) lgChips[0].classList.add('active');
    lgActiveFilter = null;
    lgApplyFilter();
  };

  const lgLoadMore = document.getElementById('loadMoreBtn');
  if (lgLoadMore) {
    const lgHasBatch2 = lgCards.some(c => c.classList.contains('batch-2'));
    lgLoadMore.addEventListener('click', function(){
      if (lgHasBatch2) {
        lgCards.filter(c => c.classList.contains('batch-2')).forEach(c => c.classList.add('show'));
        lgApplyFilter();
      }
      this.textContent = "Prikazano je sve";
      this.classList.add('gone');
    });
  }

  lgApplyFilter();
}

// Glasanje zvezdicama na karticama smeštaja
document.querySelectorAll('.feat-stars').forEach(group => {
  const stars = [...group.children];
  let rating = 0;
  const paint = (count) => stars.forEach((s,i) => s.classList.toggle('active', i < count));
  stars.forEach((star, idx) => {
    star.addEventListener('mouseenter', () => paint(idx+1));
    star.addEventListener('click', (e) => {
      e.preventDefault();
      rating = idx+1;
      paint(rating);
    });
  });
  group.addEventListener('mouseleave', () => paint(rating));
});
