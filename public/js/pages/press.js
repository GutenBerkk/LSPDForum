/* ============================================
   LSPD — Press Releases Page
   ============================================ */

function renderPressPage() {
  return `
    <div class="page">
      <div class="page-header">
        <div class="container">
          <h1 class="page-title animate-fade-in-up">Tiskové zprávy</h1>
          <p class="page-subtitle animate-fade-in-up" style="animation-delay: 0.1s;">
            Oficiální tiskové zprávy a oznámení LSPD
          </p>
        </div>
      </div>

      <section class="section">
        <div class="container">
          <div class="posts-grid" id="postsGrid">
            <div class="loading" style="grid-column: 1/-1;"><div class="loading-spinner"></div></div>
          </div>
        </div>
      </section>
    </div>
  `;
}

async function initPressPage() {
  try {
    const posts = await api('/posts');
    const grid = document.getElementById('postsGrid');

    if (!grid) return;

    if (posts.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <div class="empty-state-icon">📰</div>
          <h3>Žádné tiskové zprávy</h3>
          <p>Zatím nebyly publikovány žádné tiskové zprávy.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = posts.map((post, i) => `
      <div class="card post-card scroll-reveal" style="transition-delay: ${i * 0.08}s;" onclick="navigateToPost(${post.id})">
        ${post.image ? `<img src="${post.image}" alt="${escapeHtml(post.title)}" class="card-image">` : ''}
        <div class="card-body">
          <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
            <span class="badge" style="background: var(--gold); color: var(--navy-deep);">${escapeHtml(post.tag || 'Informace')}</span>
            <span class="post-date" style="margin: 0;">${formatDate(post.created_at)}</span>
          </div>
          <h3 class="card-title">${escapeHtml(post.title)}</h3>
          <p class="card-text">${escapeHtml(post.excerpt || post.content.substring(0, 150) + '...')}</p>
          <div class="card-meta">
            <span>✍️ ${escapeHtml(post.author)}</span>
          </div>
        </div>
      </div>
    `).join('');

    initScrollReveal();
  } catch (err) {
    const grid = document.getElementById('postsGrid');
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

function navigateToPost(id) {
  window.location.hash = `#/press/${id}`;
}

// Post detail page
function renderPostDetailPage(id) {
  return `
    <div class="page">
      <section class="section">
        <div class="container">
          <div class="post-detail" id="postDetail">
            <div class="loading"><div class="loading-spinner"></div></div>
          </div>
        </div>
      </section>
    </div>
  `;
}

async function initPostDetailPage(id) {
  try {
    const post = await api(`/posts/${id}`);
    const container = document.getElementById('postDetail');

    if (!container) return;

    container.innerHTML = `
      <a href="#/press" class="btn btn-ghost mb-3" style="margin-bottom: 24px; display: inline-flex;">
        ← Zpět na tiskové zprávy
      </a>
      ${post.image ? `<img src="${post.image}" alt="${escapeHtml(post.title)}" class="post-detail-image">` : ''}
      <h1 class="post-detail-title">${escapeHtml(post.title)}</h1>
      <div class="post-detail-meta">
        <span class="badge" style="background: var(--gold); color: var(--navy-deep);">${escapeHtml(post.tag || 'Informace')}</span>
        <span>📅 ${formatDate(post.created_at)}</span>
        <span>✍️ ${escapeHtml(post.author)}</span>
      </div>
      <div class="post-detail-content">
        ${textToParagraphs(post.content)}
      </div>
    `;
  } catch (err) {
    const container = document.getElementById('postDetail');
    if (container) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">⚠️</div>
          <h3>Zpráva nenalezena</h3>
          <p>${escapeHtml(err.message)}</p>
          <a href="#/press" class="btn btn-outline mt-2">Zpět</a>
        </div>
      `;
    }
  }
}
