/* ============================================
   LSPD — Divisions
   ============================================ */

async function renderDivisionsPage() {
  let content = '';
  try {
    const divisions = await api('/divisions');

    if (divisions.length > 0) {
      content = `
        <div class="divisions-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; margin-top: 32px;">
          ${divisions.map((d, i) => `
            <div class="division-card scroll-reveal" style="transition-delay: ${i * 0.1}s; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden; display: flex; flex-direction: column; transition: all var(--transition);">
              <div style="padding: 24px; display: flex; align-items: center; gap: 16px; border-bottom: 1px solid var(--border-color);">
                <img src="${d.photo || '/img/logo.png'}" alt="${escapeHtml(d.name)}" style="width: 60px; height: 60px; object-fit: contain; border-radius: var(--radius-sm);">
                <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--gold);">${escapeHtml(d.name)}</h3>
              </div>
              <div style="padding: 24px; flex: 1;">
                <p style="color: var(--text-secondary); line-height: 1.6;">${textToParagraphs(d.description || 'Žádné informace nejsou dostupné.')}</p>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      content = `
        <div class="empty-state scroll-reveal" style="margin-top: 40px;">
          <div class="empty-state-icon" style="font-size: 3rem; margin-bottom: 16px;">🏢</div>
          <h3>Žádná oddělení k zobrazení</h3>
          <p>Momentálně zde nejsou žádná oddělení LSPD.</p>
        </div>
      `;
    }
  } catch (err) {
    content = `
      <div class="container text-center mt-4" style="color: var(--status-error);">
        Chyba při načítání divizí: ${escapeHtml(err.message)}
      </div>
    `;
  }

  return `
    <div class="page">
      <section class="page-header" style="background-image: url('${globalSettings.hero_images?.[0] || '/img/hero-bg.png'}');">
        <div class="page-header-overlay"></div>
        <div class="container relative z-10 text-center animate-fade-in-up">
          <h1 class="page-title">Oddělení LSPD</h1>
          <p class="page-subtitle">Seznamte se s jednotlivými odděleními a jejich specializacemi.</p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          ${content}
        </div>
      </section>
    </div>
  `;
}

async function initDivisionsPage() {
  initScrollReveal();
  
  // Add hover effects for division cards dynamically
  const cards = document.querySelectorAll('.division-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
      card.style.boxShadow = 'var(--shadow-md)';
      card.style.borderColor = 'var(--border-gold)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = 'none';
      card.style.borderColor = 'var(--border-color)';
    });
  });
}
