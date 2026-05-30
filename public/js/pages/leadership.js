/* ============================================
   LSPD — Leadership Page
   ============================================ */

function renderLeadershipPage() {
  return `
    <div class="page">
      <div class="page-header">
        <div class="container">
          <h1 class="page-title animate-fade-in-up">Vedení sboru</h1>
          <p class="page-subtitle animate-fade-in-up" style="animation-delay: 0.1s;">
            Naše vedení se skládá z nejzkušenějších a nejdéle sloužících příslušníků LSPD
          </p>
        </div>
      </div>

      <section class="section">
        <div class="container">
          <div class="leadership-grid" id="leadershipGrid">
            <div class="loading" style="grid-column: 1/-1;"><div class="loading-spinner"></div></div>
          </div>
        </div>
      </section>
    </div>
  `;
}

async function initLeadershipPage() {
  try {
    const members = await api('/leadership');
    const grid = document.getElementById('leadershipGrid');

    if (!grid) return;

    if (members.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <div class="empty-state-icon">👮</div>
          <h3>Žádní členové vedení</h3>
          <p>Vedení sboru bude doplněno.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = members.map((m, i) => `
      <div class="leader-card scroll-reveal" style="transition-delay: ${i * 0.1}s;">
        <img src="${m.photo || avatarUrl(m.name)}" alt="${escapeHtml(m.name)}" class="leader-photo"
             onerror="this.src='${avatarUrl(m.name)}'">
        <div class="leader-info">
          <h3 class="leader-name">${escapeHtml(m.name)}</h3>
          <p class="leader-rank">${escapeHtml(m.rank)}</p>
        </div>
      </div>
    `).join('');

    initScrollReveal();
  } catch (err) {
    const grid = document.getElementById('leadershipGrid');
    if (grid) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <div class="empty-state-icon">⚠️</div>
          <h3>Chyba při načítání</h3>
          <p>${escapeHtml(err.message)}</p>
        </div>
      `;
    }
  }
}
