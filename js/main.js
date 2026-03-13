// ===================================================
// KARTU UCAPAN - Main Gallery Module
// Handles card grid rendering and category filtering
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
  renderGallery('all');
  setupFilters();
  setupHeroScroll();
});

// ── Render Card Grid ───────────────────────────────
function renderGallery(category) {
  const grid = document.getElementById('cardsGrid');
  grid.innerHTML = '';

  const filtered = category === 'all'
    ? CARDS_DATA
    : CARDS_DATA.filter(c => c.category === category);

  filtered.forEach((card, i) => {
    const item = document.createElement('article');
    item.className = 'card-item';
    item.style.animationDelay = `${i * 0.07}s`;
    item.setAttribute('aria-label', `${card.bigText} - ${card.islamicDate}`);

    const badgeClass = `card-badge-${card.category}`;
    const badgeLabel = getCategoryLabel(card.category);
    const cssFilter = CARD_CSS_FILTERS && CARD_CSS_FILTERS[card.id]
      ? `filter:${CARD_CSS_FILTERS[card.id]}`
      : '';

    item.innerHTML = `
      <div class="card-thumb-image">
        <img
          src="${card.bgImage}"
          alt="${card.bigText}"
          loading="lazy"
          style="${cssFilter}"
        >
        <div class="card-thumb-overlay">
          <span class="card-thumb-badge ${badgeClass}">${badgeLabel}</span>
          <div class="card-thumb-text">
            <div class="card-thumb-title">${escapeHtml(card.bigText)}</div>
            <div class="card-thumb-sub">${escapeHtml(card.islamicDate)}</div>
          </div>
        </div>
      </div>
      <div class="card-thumb-bottom">
        <p class="card-thumb-caption">${escapeHtml(card.arabicQuote)}</p>
        <button class="card-thumb-btn" id="btn-card-${card.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Personalisasi Kartu
        </button>
      </div>
    `;

    item.addEventListener('click', () => openEditor(card));
    grid.appendChild(item);
  });
}

// ── Category Label ─────────────────────────────────
function getCategoryLabel(category) {
  const labels = {
    'ramadan':    '🌙 Ramadan',
    'idul-fitri': '🌟 Idul Fitri',
    'idul-adha':  '🕌 Idul Adha',
  };
  return labels[category] || category;
}

// ── Filter Tabs ────────────────────────────────────
function setupFilters() {
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.dataset.category;
      renderGallery(category);
    });
  });
}

// ── Hero Scroll Arrow ──────────────────────────────
function setupHeroScroll() {
  const scrollIndicator = document.querySelector('.hero-scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
    });
  }
}

// ── Escape HTML (shared with editor.js) ────────────
if (typeof escapeHtml === 'undefined') {
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
