/* ============================================
   LSPD — Admin Panel
   ============================================ */

let adminTab = 'dashboard';

function renderAdminPage() {
  if (!currentUser || currentUser.role !== 'admin') {
    return `
      <div class="page">
        <section class="section">
          <div class="container">
            <div class="auth-required">
              <div class="auth-required-icon">🔒</div>
              <h3>Přístup odepřen</h3>
              <p>Admin panel je přístupný pouze uživatelům s rolí admin.</p>
              <a href="#/" class="btn btn-outline">Zpět na hlavní stránku</a>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  return `
    <div class="page">
      <div class="admin-layout">
        <aside class="admin-sidebar">
          <div class="admin-sidebar-title">Admin Panel</div>
          <button class="admin-nav-item active" data-tab="dashboard" onclick="switchAdminTab('dashboard')">
            📊 Dashboard
          </button>
          <button class="admin-nav-item" data-tab="posts" onclick="switchAdminTab('posts')">
            📰 Tiskové zprávy
          </button>
          <button class="admin-nav-item" data-tab="recruitment" onclick="switchAdminTab('recruitment')">
            📝 Nábor
          </button>
          <button class="admin-nav-item" data-tab="questions" onclick="switchAdminTab('questions')">
            ❓ Otázky náboru
          </button>
          <button class="admin-nav-item" data-tab="leadership" onclick="switchAdminTab('leadership')">
            👮 Vedení sboru
          </button>
          <button class="admin-nav-item" data-tab="users" onclick="switchAdminTab('users')">
            👥 Uživatelé
          </button>
          <button class="admin-nav-item" data-tab="messages" onclick="switchAdminTab('messages')">
            📧 Zprávy
          </button>
          <button class="admin-nav-item" data-tab="complaints" onclick="switchAdminTab('complaints')">
            ⚖️ Stížnosti
          </button>
          <button class="admin-nav-item" data-tab="divisions" onclick="switchAdminTab('divisions')">
            🏢 Divize
          </button>
          <button class="admin-nav-item" data-tab="settings" onclick="switchAdminTab('settings')">
            ⚙️ Nastavení
          </button>
        </aside>

        <div class="admin-content" id="adminContent">
          <div class="loading"><div class="loading-spinner"></div></div>
        </div>
      </div>
    </div>
  `;
}

async function initAdminPage() {
  if (!currentUser || currentUser.role !== 'admin') return;
  await switchAdminTab('dashboard');
}

async function switchAdminTab(tab) {
  adminTab = tab;

  // Update active nav item
  document.querySelectorAll('.admin-nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.tab === tab);
  });

  const content = document.getElementById('adminContent');
  if (!content) return;

  content.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>';

  switch (tab) {
    case 'dashboard': await renderAdminDashboard(content); break;
    case 'posts': await renderAdminPosts(content); break;
    case 'recruitment': await renderAdminRecruitment(content); break;
    case 'questions': await renderAdminQuestions(content); break;
    case 'leadership': await renderAdminLeadership(content); break;
    case 'users': await renderAdminUsers(content); break;
    case 'messages': await renderAdminMessages(content); break;
    case 'complaints': await renderAdminComplaints(content); break;
    case 'divisions': await renderAdminDivisions(content); break;
    case 'settings': await renderAdminSettings(content); break;
  }
}

// ===== DASHBOARD =====
async function renderAdminDashboard(container) {
  try {
    const [users, posts, submissions, messages] = await Promise.all([
      api('/users'),
      api('/posts'),
      api('/recruitment/submissions'),
      api('/contact'),
    ]);

    const pendingCount = submissions.filter(s => s.status === 'pending').length;
    const unreadMessages = messages.filter(m => !m.read).length;

    container.innerHTML = `
      <div class="admin-content-header">
        <h2 class="admin-content-title">Dashboard</h2>
      </div>
      <div class="admin-stats">
        <div class="admin-stat-card">
          <div class="admin-stat-label">Uživatelé</div>
          <div class="admin-stat-value">${users.length}</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-label">Tiskové zprávy</div>
          <div class="admin-stat-value">${posts.length}</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-label">Čekající přihlášky</div>
          <div class="admin-stat-value" style="color: var(--status-warning);">${pendingCount}</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-label">Nepřečtené zprávy</div>
          <div class="admin-stat-value" style="color: var(--status-info);">${unreadMessages}</div>
        </div>
      </div>

      <h3 style="margin-bottom: 16px; font-size: 1.1rem;">Poslední přihlášky</h3>
      ${submissions.length > 0 ? `
        <div class="admin-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr><th>Uživatel</th><th>Datum</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${submissions.slice(0, 5).map(s => `
                <tr>
                  <td>${escapeHtml(s.username)}</td>
                  <td>${formatDate(s.created_at)}</td>
                  <td><span class="badge badge-${s.status}">${s.status === 'pending' ? 'Čeká' : s.status === 'approved' ? 'Schváleno' : 'Zamítnuto'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : '<p style="color: var(--text-tertiary);">Žádné přihlášky.</p>'}
    `;
  } catch (err) {
    container.innerHTML = `<p style="color: var(--status-error);">Chyba: ${escapeHtml(err.message)}</p>`;
  }
}

// ===== POSTS =====
async function renderAdminPosts(container) {
  try {
    const posts = await api('/posts');

    container.innerHTML = `
      <div class="admin-content-header">
        <h2 class="admin-content-title">Tiskové zprávy</h2>
        <button class="btn btn-gold" onclick="showCreatePostModal()">+ Nová zpráva</button>
      </div>
      ${posts.length > 0 ? `
        <div class="admin-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr><th>Titulek</th><th>Autor</th><th>Datum</th><th>Akce</th></tr>
            </thead>
            <tbody>
              ${posts.map(p => `
                <tr>
                  <td><strong>${escapeHtml(p.title)}</strong></td>
                  <td>${escapeHtml(p.author)}</td>
                  <td>${formatDate(p.created_at)}</td>
                  <td>
                    <div class="flex gap-2">
                      <button class="btn btn-sm btn-ghost" onclick="showEditPostModal(${p.id})">✏️ Upravit</button>
                      <button class="btn btn-sm btn-danger" onclick="deletePost(${p.id})">🗑️ Smazat</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : `
        <div class="empty-state">
          <div class="empty-state-icon">📰</div>
          <h3>Žádné zprávy</h3>
          <p>Vytvořte první tiskovou zprávu.</p>
        </div>
      `}
    `;
  } catch (err) {
    container.innerHTML = `<p style="color: var(--status-error);">Chyba: ${escapeHtml(err.message)}</p>`;
  }
}

function showCreatePostModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'postModal';
  modal.innerHTML = `
    <div class="modal modal-lg">
      <div class="modal-header">
        <h2 class="modal-title">Nová tisková zpráva</h2>
        <button class="modal-close" onclick="document.getElementById('postModal').remove(); document.body.style.overflow='';">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <form onsubmit="handleCreatePost(event)">
          <div class="form-group">
            <label class="form-label">Titulek</label>
            <input class="form-input" id="postTitle" required placeholder="Titulek zprávy">
          </div>
          <div class="form-group">
            <label class="form-label">Krátký popis</label>
            <input class="form-input" id="postExcerpt" placeholder="Krátký popis pro náhled">
          </div>
          <div class="form-group">
            <label class="form-label">Obsah</label>
            <textarea class="form-textarea" id="postContent" required placeholder="Obsah zprávy..." style="min-height: 200px;"></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Obrázek (volitelné)</label>
            <input type="file" accept="image/*" id="postImageFile" class="form-input" onchange="handlePostImageUpload(event)">
            <input type="hidden" id="postImageUrl">
            <div id="postImagePreview"></div>
          </div>
          <button type="submit" class="btn btn-gold btn-full" id="createPostBtn">Publikovat</button>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  modal.addEventListener('click', e => { if (e.target === modal) { modal.remove(); document.body.style.overflow = ''; } });
}

async function handlePostImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = await uploadFile(file);
    document.getElementById('postImageUrl').value = data.url;
    document.getElementById('postImagePreview').innerHTML = `<img src="${data.url}" style="max-height: 120px; border-radius: 8px; margin-top: 8px;">`;
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

async function handleCreatePost(e) {
  e.preventDefault();
  const btn = document.getElementById('createPostBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Publikování...';

  try {
    await api('/posts', {
      method: 'POST',
      body: {
        title: document.getElementById('postTitle').value.trim(),
        content: document.getElementById('postContent').value.trim(),
        excerpt: document.getElementById('postExcerpt').value.trim() || undefined,
        image: document.getElementById('postImageUrl').value || undefined,
      },
    });

    document.getElementById('postModal')?.remove();
    document.body.style.overflow = '';
    showNotification('Zpráva byla publikována!', 'success');
    await renderAdminPosts(document.getElementById('adminContent'));
  } catch (err) {
    showNotification(err.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Publikovat';
  }
}

async function showEditPostModal(id) {
  try {
    const post = await api(`/posts/${id}`);

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'postEditModal';
    modal.innerHTML = `
      <div class="modal modal-lg">
        <div class="modal-header">
          <h2 class="modal-title">Upravit zprávu</h2>
          <button class="modal-close" onclick="document.getElementById('postEditModal').remove(); document.body.style.overflow='';">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <form onsubmit="handleEditPost(event, ${id})">
            <div class="form-group">
              <label class="form-label">Titulek</label>
              <input class="form-input" id="editPostTitle" required value="${escapeHtml(post.title)}">
            </div>
            <div class="form-group">
              <label class="form-label">Krátký popis</label>
              <input class="form-input" id="editPostExcerpt" value="${escapeHtml(post.excerpt || '')}">
            </div>
            <div class="form-group">
              <label class="form-label">Obsah</label>
              <textarea class="form-textarea" id="editPostContent" required style="min-height: 200px;">${escapeHtml(post.content)}</textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Obrázek</label>
              <input type="file" accept="image/*" class="form-input" onchange="handleEditPostImageUpload(event)">
              <input type="hidden" id="editPostImageUrl" value="${post.image || ''}">
              <div id="editPostImagePreview">${post.image ? `<img src="${post.image}" style="max-height: 120px; border-radius: 8px; margin-top: 8px;">` : ''}</div>
            </div>
            <button type="submit" class="btn btn-gold btn-full" id="editPostBtn">Uložit změny</button>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    modal.addEventListener('click', e => { if (e.target === modal) { modal.remove(); document.body.style.overflow = ''; } });
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

async function handleEditPostImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = await uploadFile(file);
    document.getElementById('editPostImageUrl').value = data.url;
    document.getElementById('editPostImagePreview').innerHTML = `<img src="${data.url}" style="max-height: 120px; border-radius: 8px; margin-top: 8px;">`;
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

async function handleEditPost(e, id) {
  e.preventDefault();
  const btn = document.getElementById('editPostBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Ukládání...';

  try {
    await api(`/posts/${id}`, {
      method: 'PUT',
      body: {
        title: document.getElementById('editPostTitle').value.trim(),
        content: document.getElementById('editPostContent').value.trim(),
        excerpt: document.getElementById('editPostExcerpt').value.trim() || undefined,
        image: document.getElementById('editPostImageUrl').value || null,
      },
    });

    document.getElementById('postEditModal')?.remove();
    document.body.style.overflow = '';
    showNotification('Zpráva byla aktualizována!', 'success');
    await renderAdminPosts(document.getElementById('adminContent'));
  } catch (err) {
    showNotification(err.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Uložit změny';
  }
}

async function deletePost(id) {
  if (!confirm('Opravdu chcete smazat tuto zprávu?')) return;
  try {
    await api(`/posts/${id}`, { method: 'DELETE' });
    showNotification('Zpráva byla smazána.', 'success');
    await renderAdminPosts(document.getElementById('adminContent'));
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

// ===== RECRUITMENT SUBMISSIONS =====
async function renderAdminRecruitment(container) {
  try {
    const submissions = await api('/recruitment/submissions');

    container.innerHTML = `
      <div class="admin-content-header">
        <h2 class="admin-content-title">Náborové přihlášky</h2>
      </div>
      ${submissions.length > 0 ? `
        <div class="admin-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr><th>Uživatel</th><th>Datum</th><th>Status</th><th>Akce</th></tr>
            </thead>
            <tbody>
              ${submissions.map(s => `
                <tr>
                  <td><strong>${escapeHtml(s.username)}</strong></td>
                  <td>${formatDate(s.created_at)}</td>
                  <td><span class="badge badge-${s.status}">${s.status === 'pending' ? 'Čeká' : s.status === 'approved' ? 'Schváleno' : 'Zamítnuto'}</span></td>
                  <td>
                    <div class="flex gap-2 flex-wrap">
                      <button class="btn btn-sm btn-ghost" onclick="viewSubmission(${s.id})">👁️ Zobrazit</button>
                      ${s.status === 'pending' ? `
                        <button class="btn btn-sm btn-success" onclick="updateSubmission(${s.id}, 'approved')">✅ Schválit</button>
                        <button class="btn btn-sm btn-danger" onclick="updateSubmission(${s.id}, 'rejected')">❌ Zamítnout</button>
                      ` : ''}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : `
        <div class="empty-state">
          <div class="empty-state-icon">📝</div>
          <h3>Žádné přihlášky</h3>
        </div>
      `}
    `;
  } catch (err) {
    container.innerHTML = `<p style="color: var(--status-error);">Chyba: ${escapeHtml(err.message)}</p>`;
  }
}

async function viewSubmission(id) {
  try {
    const submissions = await api('/recruitment/submissions');
    const s = submissions.find(sub => sub.id === id);
    if (!s) return;

    // Also get questions for labels
    let questions = [];
    try { questions = await api('/recruitment/questions'); } catch {}

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'submissionModal';
    modal.innerHTML = `
      <div class="modal modal-lg">
        <div class="modal-header">
          <h2 class="modal-title">Přihláška — ${escapeHtml(s.username)}</h2>
          <button class="modal-close" onclick="document.getElementById('submissionModal').remove(); document.body.style.overflow='';">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <div style="margin-bottom: 16px;">
            <span class="badge badge-${s.status}">${s.status === 'pending' ? 'Čeká na vyřízení' : s.status === 'approved' ? 'Schváleno' : 'Zamítnuto'}</span>
            <span style="color: var(--text-tertiary); font-size: 0.85rem; margin-left: 12px;">${formatDateTime(s.created_at)}</span>
          </div>
          <div class="submission-detail">
            ${Object.entries(s.answers).map(([key, value]) => {
              const qId = parseInt(key.replace('q_', ''));
              const q = questions.find(q => q.id === qId);
              return `
                <div class="submission-answer">
                  <div class="submission-question">${q ? escapeHtml(q.question) : key}</div>
                  <div class="submission-answer-text">${escapeHtml(value)}</div>
                </div>
              `;
            }).join('')}
          </div>
          ${s.admin_note ? `<p style="margin-top: 16px; color: var(--text-secondary);"><strong>Poznámka:</strong> ${escapeHtml(s.admin_note)}</p>` : ''}
          ${s.status === 'pending' ? `
            <div class="form-group mt-3">
              <label class="form-label">Poznámka (volitelné)</label>
              <input class="form-input" id="submissionNote" placeholder="Důvod schválení/zamítnutí...">
            </div>
            <div class="flex gap-2 mt-2">
              <button class="btn btn-success" onclick="updateSubmission(${s.id}, 'approved', true)" style="flex:1;">✅ Schválit</button>
              <button class="btn btn-danger" onclick="updateSubmission(${s.id}, 'rejected', true)" style="flex:1;">❌ Zamítnout</button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    modal.addEventListener('click', e => { if (e.target === modal) { modal.remove(); document.body.style.overflow = ''; } });
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

async function updateSubmission(id, status, fromModal = false) {
  const note = fromModal ? (document.getElementById('submissionNote')?.value || '') : '';

  try {
    await api(`/recruitment/submissions/${id}`, {
      method: 'PUT',
      body: { status, admin_note: note },
    });

    if (fromModal) {
      document.getElementById('submissionModal')?.remove();
      document.body.style.overflow = '';
    }

    showNotification(`Přihláška byla ${status === 'approved' ? 'schválena' : 'zamítnuta'}.`, 'success');
    await renderAdminRecruitment(document.getElementById('adminContent'));
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

// ===== QUESTIONS =====
async function renderAdminQuestions(container) {
  try {
    const questions = await api('/recruitment/questions');

    container.innerHTML = `
      <div class="admin-content-header">
        <h2 class="admin-content-title">Otázky náborového formuláře</h2>
        <button class="btn btn-gold" onclick="showCreateQuestionModal()">+ Nová otázka</button>
      </div>
      ${questions.length > 0 ? `
        <div class="admin-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr><th>#</th><th>Otázka</th><th>Typ</th><th>Povinná</th><th>Akce</th></tr>
            </thead>
            <tbody>
              ${questions.map((q, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${escapeHtml(q.question)}</td>
                  <td><span class="badge badge-user">${q.type}</span></td>
                  <td>${q.required ? '✅' : '—'}</td>
                  <td>
                    <div class="flex gap-2">
                      <button class="btn btn-sm btn-ghost" onclick="showEditQuestionModal(${q.id})">✏️</button>
                      <button class="btn btn-sm btn-danger" onclick="deleteQuestion(${q.id})">🗑️</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : `
        <div class="empty-state">
          <div class="empty-state-icon">❓</div>
          <h3>Žádné otázky</h3>
          <p>Přidejte otázky do náborového formuláře.</p>
        </div>
      `}
    `;
  } catch (err) {
    container.innerHTML = `<p style="color: var(--status-error);">Chyba: ${escapeHtml(err.message)}</p>`;
  }
}

function showCreateQuestionModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'questionModal';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2 class="modal-title">Nová otázka</h2>
        <button class="modal-close" onclick="document.getElementById('questionModal').remove(); document.body.style.overflow='';">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <form onsubmit="handleCreateQuestion(event)">
          <div class="form-group">
            <label class="form-label">Otázka</label>
            <input class="form-input" id="newQuestionText" required placeholder="Text otázky">
          </div>
          <div class="form-group">
            <label class="form-label">Typ</label>
            <select class="form-select" id="newQuestionType" onchange="toggleOptionsField()">
              <option value="text">Krátký text</option>
              <option value="textarea">Dlouhý text</option>
              <option value="select">Výběr</option>
            </select>
          </div>
          <div class="form-group hidden" id="optionsGroup">
            <label class="form-label">Možnosti (oddělené čárkou)</label>
            <input class="form-input" id="newQuestionOptions" placeholder="Ano, Ne, Nevím">
          </div>
          <div class="form-group">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="checkbox" id="newQuestionRequired" checked>
              <span class="form-label" style="margin: 0;">Povinná otázka</span>
            </label>
          </div>
          <button type="submit" class="btn btn-gold btn-full">Přidat otázku</button>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  modal.addEventListener('click', e => { if (e.target === modal) { modal.remove(); document.body.style.overflow = ''; } });
}

function toggleOptionsField() {
  const type = document.getElementById('newQuestionType')?.value || document.getElementById('editQuestionType')?.value;
  const group = document.getElementById('optionsGroup');
  if (group) {
    group.classList.toggle('hidden', type !== 'select');
  }
}

async function handleCreateQuestion(e) {
  e.preventDefault();
  try {
    const type = document.getElementById('newQuestionType').value;
    const optionsStr = document.getElementById('newQuestionOptions')?.value || '';
    const options = type === 'select' ? optionsStr.split(',').map(o => o.trim()).filter(Boolean) : undefined;

    await api('/recruitment/questions', {
      method: 'POST',
      body: {
        question: document.getElementById('newQuestionText').value.trim(),
        type,
        options,
        required: document.getElementById('newQuestionRequired').checked ? 1 : 0,
      },
    });

    document.getElementById('questionModal')?.remove();
    document.body.style.overflow = '';
    showNotification('Otázka byla přidána!', 'success');
    await renderAdminQuestions(document.getElementById('adminContent'));
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

async function showEditQuestionModal(id) {
  try {
    const questions = await api('/recruitment/questions');
    const q = questions.find(q => q.id === id);
    if (!q) return;

    let opts = [];
    try { opts = JSON.parse(q.options || '[]'); } catch {}

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'editQuestionModal';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">Upravit otázku</h2>
          <button class="modal-close" onclick="document.getElementById('editQuestionModal').remove(); document.body.style.overflow='';">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <form onsubmit="handleEditQuestion(event, ${id})">
            <div class="form-group">
              <label class="form-label">Otázka</label>
              <input class="form-input" id="editQuestionText" required value="${escapeHtml(q.question)}">
            </div>
            <div class="form-group">
              <label class="form-label">Typ</label>
              <select class="form-select" id="editQuestionType" onchange="toggleEditOptionsField()">
                <option value="text" ${q.type === 'text' ? 'selected' : ''}>Krátký text</option>
                <option value="textarea" ${q.type === 'textarea' ? 'selected' : ''}>Dlouhý text</option>
                <option value="select" ${q.type === 'select' ? 'selected' : ''}>Výběr</option>
              </select>
            </div>
            <div class="form-group ${q.type !== 'select' ? 'hidden' : ''}" id="editOptionsGroup">
              <label class="form-label">Možnosti (oddělené čárkou)</label>
              <input class="form-input" id="editQuestionOptions" value="${opts.join(', ')}">
            </div>
            <div class="form-group">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" id="editQuestionRequired" ${q.required ? 'checked' : ''}>
                <span class="form-label" style="margin: 0;">Povinná otázka</span>
              </label>
            </div>
            <button type="submit" class="btn btn-gold btn-full">Uložit změny</button>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    modal.addEventListener('click', e => { if (e.target === modal) { modal.remove(); document.body.style.overflow = ''; } });
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

function toggleEditOptionsField() {
  const type = document.getElementById('editQuestionType').value;
  const group = document.getElementById('editOptionsGroup');
  if (group) group.classList.toggle('hidden', type !== 'select');
}

async function handleEditQuestion(e, id) {
  e.preventDefault();
  try {
    const type = document.getElementById('editQuestionType').value;
    const optionsStr = document.getElementById('editQuestionOptions')?.value || '';
    const options = type === 'select' ? optionsStr.split(',').map(o => o.trim()).filter(Boolean) : undefined;

    await api(`/recruitment/questions/${id}`, {
      method: 'PUT',
      body: {
        question: document.getElementById('editQuestionText').value.trim(),
        type,
        options,
        required: document.getElementById('editQuestionRequired').checked ? 1 : 0,
      },
    });

    document.getElementById('editQuestionModal')?.remove();
    document.body.style.overflow = '';
    showNotification('Otázka byla aktualizována!', 'success');
    await renderAdminQuestions(document.getElementById('adminContent'));
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

async function deleteQuestion(id) {
  if (!confirm('Opravdu chcete smazat tuto otázku?')) return;
  try {
    await api(`/recruitment/questions/${id}`, { method: 'DELETE' });
    showNotification('Otázka byla smazána.', 'success');
    await renderAdminQuestions(document.getElementById('adminContent'));
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

// ===== LEADERSHIP =====
async function renderAdminLeadership(container) {
  try {
    const members = await api('/leadership');

    container.innerHTML = `
      <div class="admin-content-header">
        <h2 class="admin-content-title">Vedení sboru</h2>
        <button class="btn btn-gold" onclick="showCreateLeaderModal()">+ Přidat člena</button>
      </div>
      ${members.length > 0 ? `
        <div class="admin-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr><th>Foto</th><th>Jméno</th><th>Hodnost</th><th>Pořadí</th><th>Akce</th></tr>
            </thead>
            <tbody>
              ${members.map(m => `
                <tr>
                  <td><img src="${m.photo || avatarUrl(m.name)}" alt="" style="width:40px;height:40px;border-radius:8px;object-fit:cover;" onerror="this.src='${avatarUrl(m.name)}'"></td>
                  <td><strong>${escapeHtml(m.name)}</strong></td>
                  <td><span class="text-gold">${escapeHtml(m.rank)}</span></td>
                  <td>${m.sort_order}</td>
                  <td>
                    <div class="flex gap-2">
                      <button class="btn btn-sm btn-ghost" onclick="showEditLeaderModal(${m.id})">✏️</button>
                      <button class="btn btn-sm btn-danger" onclick="deleteLeader(${m.id})">🗑️</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : `
        <div class="empty-state">
          <div class="empty-state-icon">👮</div>
          <h3>Žádní členové vedení</h3>
        </div>
      `}
    `;
  } catch (err) {
    container.innerHTML = `<p style="color: var(--status-error);">Chyba: ${escapeHtml(err.message)}</p>`;
  }
}

function showCreateLeaderModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'leaderModal';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2 class="modal-title">Nový člen vedení</h2>
        <button class="modal-close" onclick="document.getElementById('leaderModal').remove(); document.body.style.overflow='';">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <form onsubmit="handleCreateLeader(event)">
          <div class="form-group">
            <label class="form-label">Jméno</label>
            <input class="form-input" id="leaderName" required placeholder="Celé jméno">
          </div>
          <div class="form-group">
            <label class="form-label">Hodnost</label>
            <input class="form-input" id="leaderRank" required placeholder="Např. Chief of Police">
          </div>
          <div class="form-group">
            <label class="form-label">Fotka</label>
            <input type="file" accept="image/*" class="form-input" id="leaderPhotoFile" onchange="handleLeaderPhotoUpload(event, 'leader')">
            <input type="hidden" id="leaderPhotoUrl">
            <div id="leaderPhotoPreview"></div>
          </div>
          <button type="submit" class="btn btn-gold btn-full">Přidat</button>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  modal.addEventListener('click', e => { if (e.target === modal) { modal.remove(); document.body.style.overflow = ''; } });
}

async function handleLeaderPhotoUpload(e, prefix) {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = await uploadFile(file);
    document.getElementById(`${prefix}PhotoUrl`).value = data.url;
    document.getElementById(`${prefix}PhotoPreview`).innerHTML = `<img src="${data.url}" style="max-height: 100px; border-radius: 8px; margin-top: 8px;">`;
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

async function handleCreateLeader(e) {
  e.preventDefault();
  try {
    await api('/leadership', {
      method: 'POST',
      body: {
        name: document.getElementById('leaderName').value.trim(),
        rank: document.getElementById('leaderRank').value.trim(),
        photo: document.getElementById('leaderPhotoUrl').value || null,
      },
    });

    document.getElementById('leaderModal')?.remove();
    document.body.style.overflow = '';
    showNotification('Člen vedení byl přidán!', 'success');
    await renderAdminLeadership(document.getElementById('adminContent'));
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

async function showEditLeaderModal(id) {
  try {
    const members = await api('/leadership');
    const m = members.find(m => m.id === id);
    if (!m) return;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'editLeaderModal';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">Upravit člena</h2>
          <button class="modal-close" onclick="document.getElementById('editLeaderModal').remove(); document.body.style.overflow='';">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <form onsubmit="handleEditLeader(event, ${id})">
            <div class="form-group">
              <label class="form-label">Jméno</label>
              <input class="form-input" id="editLeaderName" required value="${escapeHtml(m.name)}">
            </div>
            <div class="form-group">
              <label class="form-label">Hodnost</label>
              <input class="form-input" id="editLeaderRank" required value="${escapeHtml(m.rank)}">
            </div>
            <div class="form-group">
              <label class="form-label">Fotka</label>
              <input type="file" accept="image/*" class="form-input" onchange="handleLeaderPhotoUpload(event, 'editLeader')">
              <input type="hidden" id="editLeaderPhotoUrl" value="${m.photo || ''}">
              <div id="editLeaderPhotoPreview">${m.photo ? `<img src="${m.photo}" style="max-height: 100px; border-radius: 8px; margin-top: 8px;">` : ''}</div>
            </div>
            <div class="form-group">
              <label class="form-label">Pořadí</label>
              <input class="form-input" type="number" id="editLeaderOrder" value="${m.sort_order}">
            </div>
            <button type="submit" class="btn btn-gold btn-full">Uložit změny</button>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    modal.addEventListener('click', e => { if (e.target === modal) { modal.remove(); document.body.style.overflow = ''; } });
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

async function handleEditLeader(e, id) {
  e.preventDefault();
  try {
    await api(`/leadership/${id}`, {
      method: 'PUT',
      body: {
        name: document.getElementById('editLeaderName').value.trim(),
        rank: document.getElementById('editLeaderRank').value.trim(),
        photo: document.getElementById('editLeaderPhotoUrl').value || null,
        sort_order: parseInt(document.getElementById('editLeaderOrder').value) || 0,
      },
    });

    document.getElementById('editLeaderModal')?.remove();
    document.body.style.overflow = '';
    showNotification('Člen vedení byl aktualizován!', 'success');
    await renderAdminLeadership(document.getElementById('adminContent'));
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

async function deleteLeader(id) {
  if (!confirm('Opravdu chcete odebrat tohoto člena vedení?')) return;
  try {
    await api(`/leadership/${id}`, { method: 'DELETE' });
    showNotification('Člen vedení byl odebrán.', 'success');
    await renderAdminLeadership(document.getElementById('adminContent'));
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

// ===== USERS =====
async function renderAdminUsers(container) {
  try {
    const users = await api('/users');

    container.innerHTML = `
      <div class="admin-content-header">
        <h2 class="admin-content-title">Správa uživatelů</h2>
      </div>
      <div class="admin-table-wrapper">
        <table class="admin-table">
          <thead>
            <tr><th>ID</th><th>Uživatel</th><th>Role</th><th>Registrace</th><th>Akce</th></tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td>${u.id}</td>
                <td><strong>${escapeHtml(u.username)}</strong></td>
                <td><span class="badge badge-${u.role}">${u.role}</span></td>
                <td>${formatDate(u.created_at)}</td>
                <td>
                  <div class="flex gap-2">
                    ${u.role === 'user' ? `
                      <button class="btn btn-sm btn-ghost" onclick="changeUserRole(${u.id}, 'admin')">⬆️ Admin</button>
                    ` : `
                      <button class="btn btn-sm btn-ghost" onclick="changeUserRole(${u.id}, 'user')">⬇️ User</button>
                    `}
                    ${u.id !== currentUser.id ? `
                      <button class="btn btn-sm btn-danger" onclick="deleteUser(${u.id}, '${escapeHtml(u.username)}')">🗑️</button>
                    ` : '<span style="color: var(--text-tertiary); font-size: 0.8rem;">Vy</span>'}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<p style="color: var(--status-error);">Chyba: ${escapeHtml(err.message)}</p>`;
  }
}

async function changeUserRole(id, role) {
  try {
    await api(`/users/${id}/role`, { method: 'PUT', body: { role } });
    showNotification(`Role byla změněna na ${role}.`, 'success');
    await renderAdminUsers(document.getElementById('adminContent'));
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

async function deleteUser(id, username) {
  if (!confirm(`Opravdu chcete smazat uživatele "${username}"?`)) return;
  try {
    await api(`/users/${id}`, { method: 'DELETE' });
    showNotification('Uživatel byl smazán.', 'success');
    await renderAdminUsers(document.getElementById('adminContent'));
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

// ===== MESSAGES =====
async function renderAdminMessages(container) {
  try {
    const messages = await api('/contact');

    container.innerHTML = `
      <div class="admin-content-header">
        <h2 class="admin-content-title">Kontaktní zprávy</h2>
      </div>
      ${messages.length > 0 ? `
        <div class="admin-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr><th>Od</th><th>Předmět</th><th>Datum</th><th>Akce</th></tr>
            </thead>
            <tbody>
              ${messages.map(m => `
                <tr style="${!m.read ? 'font-weight: 600;' : ''}">
                  <td>
                    ${escapeHtml(m.name)}<br>
                    <small style="color: var(--text-tertiary);">${escapeHtml(m.email)}</small>
                  </td>
                  <td>${escapeHtml(m.subject)}</td>
                  <td>${formatDate(m.created_at)}</td>
                  <td>
                    <div class="flex gap-2">
                      <button class="btn btn-sm btn-ghost" onclick="viewMessage(${m.id})">👁️ Zobrazit</button>
                      <button class="btn btn-sm btn-danger" onclick="deleteMessage(${m.id})">🗑️</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : `
        <div class="empty-state">
          <div class="empty-state-icon">📧</div>
          <h3>Žádné zprávy</h3>
        </div>
      `}
    `;
  } catch (err) {
    container.innerHTML = `<p style="color: var(--status-error);">Chyba: ${escapeHtml(err.message)}</p>`;
  }
}

async function viewMessage(id) {
  try {
    const messages = await api('/contact');
    const m = messages.find(msg => msg.id === id);
    if (!m) return;

    // Mark as read
    await api(`/contact/${id}/read`, { method: 'PUT' });

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'messageModal';
    modal.innerHTML = `
      <div class="modal modal-lg">
        <div class="modal-header">
          <h2 class="modal-title">Zpráva od ${escapeHtml(m.name)}</h2>
          <button class="modal-close" onclick="document.getElementById('messageModal').remove(); document.body.style.overflow='';">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <div style="margin-bottom: 16px; font-size: 0.875rem; color: var(--text-tertiary);">
            <p><strong>Od:</strong> ${escapeHtml(m.name)} (${escapeHtml(m.email)})</p>
            <p><strong>Předmět:</strong> ${escapeHtml(m.subject)}</p>
            <p><strong>Datum:</strong> ${formatDateTime(m.created_at)}</p>
          </div>
          <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; color: var(--text-primary); line-height: 1.7;">
            ${textToParagraphs(m.message)}
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    modal.addEventListener('click', e => { if (e.target === modal) { modal.remove(); document.body.style.overflow = ''; } });

    // Refresh messages list to show read state
    await renderAdminMessages(document.getElementById('adminContent'));
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

async function deleteMessage(id) {
  if (!confirm('Smazat tuto zprávu?')) return;
  try {
    await api(`/contact/${id}`, { method: 'DELETE' });
    showNotification('Zpráva smazána.', 'success');
    await renderAdminMessages(document.getElementById('adminContent'));
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

// ===== COMPLAINTS =====
async function renderAdminComplaints(container) {
  try {
    const complaints = await api('/complaints');

    container.innerHTML = `
      <div class="admin-content-header">
        <h2 class="admin-content-title">Stížnosti</h2>
      </div>
      ${complaints.length > 0 ? `
        <div class="admin-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr><th>Od</th><th>Předmět</th><th>Datum</th><th>Status</th><th>Akce</th></tr>
            </thead>
            <tbody>
              ${complaints.map(c => `
                <tr>
                  <td>
                    <strong>${escapeHtml(c.name)}</strong><br>
                    <small style="color: var(--text-tertiary);">${escapeHtml(c.email || '')}</small>
                  </td>
                  <td>${escapeHtml(c.subject)}</td>
                  <td>${formatDate(c.created_at)}</td>
                  <td><span class="badge badge-${c.status}">${c.status === 'pending' ? 'Čeká' : c.status === 'resolved' ? 'Vyřešeno' : 'Zamítnuto'}</span></td>
                  <td>
                    <button class="btn btn-sm btn-ghost" onclick="viewComplaint(${c.id})">👁️ Zobrazit</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : `
        <div class="empty-state">
          <div class="empty-state-icon">⚖️</div>
          <h3>Žádné stížnosti</h3>
        </div>
      `}
    `;
  } catch (err) {
    container.innerHTML = `<p style="color: var(--status-error);">Chyba: ${escapeHtml(err.message)}</p>`;
  }
}

async function viewComplaint(id) {
  try {
    const complaints = await api('/complaints');
    const c = complaints.find(comp => comp.id === id);
    if (!c) return;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'complaintModal';
    modal.innerHTML = `
      <div class="modal modal-lg">
        <div class="modal-header">
          <h2 class="modal-title">Stížnost: ${escapeHtml(c.subject)}</h2>
          <button class="modal-close" onclick="document.getElementById('complaintModal').remove(); document.body.style.overflow='';">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <div style="margin-bottom: 16px;">
            <p><strong>Od:</strong> ${escapeHtml(c.name)} (${escapeHtml(c.email || 'Bez emailu')})</p>
            <p><strong>Datum:</strong> ${formatDateTime(c.created_at)}</p>
            <p><strong>Status:</strong> <span class="badge badge-${c.status}">${c.status === 'pending' ? 'Čeká' : c.status === 'resolved' ? 'Vyřešeno' : 'Zamítnuto'}</span></p>
          </div>
          <div style="background: var(--bg-card); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
            ${textToParagraphs(c.message)}
          </div>
          
          <div class="form-group mt-3">
            <label class="form-label">Poznámka administrátora / Řešení</label>
            <textarea class="form-textarea" id="complaintNote" style="min-height: 80px;">${escapeHtml(c.admin_note || '')}</textarea>
          </div>
          <div class="flex gap-2 mt-2">
            <button class="btn btn-success" onclick="updateComplaint(${c.id}, 'resolved')" style="flex:1;">✅ Označit jako vyřešené</button>
            <button class="btn btn-danger" onclick="updateComplaint(${c.id}, 'rejected')" style="flex:1;">❌ Zamítnout stížnost</button>
            <button class="btn btn-outline" onclick="updateComplaint(${c.id}, 'pending')" style="flex:1;">⏳ Vrátit na čekající</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    modal.addEventListener('click', e => { if (e.target === modal) { modal.remove(); document.body.style.overflow = ''; } });
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

async function updateComplaint(id, status) {
  const note = document.getElementById('complaintNote')?.value || '';
  try {
    await api(`/complaints/${id}`, {
      method: 'PUT',
      body: { status, admin_note: note }
    });
    document.getElementById('complaintModal')?.remove();
    document.body.style.overflow = '';
    showNotification('Stížnost aktualizována.', 'success');
    await renderAdminComplaints(document.getElementById('adminContent'));
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

// ===== DIVISIONS =====
async function renderAdminDivisions(container) {
  try {
    const divisions = await api('/divisions');
    container.innerHTML = `
      <div class="admin-content-header">
        <h2 class="admin-content-title">Divize LSPD</h2>
        <button class="btn btn-gold" onclick="showCreateDivisionModal()">+ Přidat divizi</button>
      </div>
      ${divisions.length > 0 ? `
        <div class="admin-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr><th>Fotka</th><th>Jméno</th><th>Popis</th><th>Pořadí</th><th>Akce</th></tr>
            </thead>
            <tbody>
              ${divisions.map(d => `
                <tr>
                  <td><img src="${d.photo || '/img/logo.png'}" style="width:40px;height:40px;border-radius:8px;object-fit:cover;"></td>
                  <td><strong>${escapeHtml(d.name)}</strong></td>
                  <td><div style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(d.description || '')}</div></td>
                  <td>${d.sort_order}</td>
                  <td>
                    <div class="flex gap-2">
                      <button class="btn btn-sm btn-ghost" onclick="showEditDivisionModal(${d.id})">✏️</button>
                      <button class="btn btn-sm btn-danger" onclick="deleteDivision(${d.id})">🗑️</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : `
        <div class="empty-state">
          <div class="empty-state-icon">🏢</div>
          <h3>Žádné divize</h3>
        </div>
      `}
    `;
  } catch (err) {
    container.innerHTML = `<p style="color: var(--status-error);">Chyba: ${escapeHtml(err.message)}</p>`;
  }
}

function showCreateDivisionModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'divisionModal';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2 class="modal-title">Nová Divize</h2>
        <button class="modal-close" onclick="document.getElementById('divisionModal').remove(); document.body.style.overflow='';">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <form onsubmit="handleCreateDivision(event)">
          <div class="form-group">
            <label class="form-label">Název divize</label>
            <input class="form-input" id="divName" required>
          </div>
          <div class="form-group">
            <label class="form-label">Popis / Info</label>
            <textarea class="form-textarea" id="divDesc" style="min-height:80px;"></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Malá fotka (ikona)</label>
            <input type="file" accept="image/*" class="form-input" onchange="handleDivImageUpload(event, 'divPhotoUrl', 'divPhotoPreview')">
            <input type="hidden" id="divPhotoUrl">
            <div id="divPhotoPreview"></div>
          </div>
          <div class="form-group">
            <label class="form-label">Pořadí</label>
            <input class="form-input" type="number" id="divSort" value="0">
          </div>
          <button type="submit" class="btn btn-gold btn-full">Přidat</button>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  modal.addEventListener('click', e => { if (e.target === modal) { modal.remove(); document.body.style.overflow = ''; } });
}

async function handleDivImageUpload(e, urlId, previewId) {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = await uploadFile(file);
    document.getElementById(urlId).value = data.url;
    document.getElementById(previewId).innerHTML = `<img src="${data.url}" style="width: 50px; height: 50px; border-radius: 8px; margin-top: 8px; object-fit: cover;">`;
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

async function handleCreateDivision(e) {
  e.preventDefault();
  try {
    await api('/divisions', {
      method: 'POST',
      body: {
        name: document.getElementById('divName').value.trim(),
        description: document.getElementById('divDesc').value.trim(),
        photo: document.getElementById('divPhotoUrl').value || undefined,
        sort_order: parseInt(document.getElementById('divSort').value || 0)
      }
    });
    document.getElementById('divisionModal')?.remove();
    document.body.style.overflow = '';
    showNotification('Divize přidána', 'success');
    await renderAdminDivisions(document.getElementById('adminContent'));
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

async function showEditDivisionModal(id) {
  try {
    const divisions = await api('/divisions');
    const d = divisions.find(div => div.id === id);
    if (!d) return;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'editDivModal';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">Upravit divizi</h2>
          <button class="modal-close" onclick="document.getElementById('editDivModal').remove(); document.body.style.overflow='';">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <form onsubmit="handleEditDivision(event, ${id})">
            <div class="form-group">
              <label class="form-label">Název divize</label>
              <input class="form-input" id="editDivName" required value="${escapeHtml(d.name)}">
            </div>
            <div class="form-group">
              <label class="form-label">Popis / Info</label>
              <textarea class="form-textarea" id="editDivDesc" style="min-height:80px;">${escapeHtml(d.description || '')}</textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Malá fotka (ikona)</label>
              <input type="file" accept="image/*" class="form-input" onchange="handleDivImageUpload(event, 'editDivPhotoUrl', 'editDivPhotoPreview')">
              <input type="hidden" id="editDivPhotoUrl" value="${d.photo || ''}">
              <div id="editDivPhotoPreview">${d.photo ? `<img src="${d.photo}" style="width: 50px; height: 50px; border-radius: 8px; margin-top: 8px; object-fit: cover;">` : ''}</div>
            </div>
            <div class="form-group">
              <label class="form-label">Pořadí</label>
              <input class="form-input" type="number" id="editDivSort" value="${d.sort_order}">
            </div>
            <button type="submit" class="btn btn-gold btn-full">Uložit</button>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    modal.addEventListener('click', e => { if (e.target === modal) { modal.remove(); document.body.style.overflow = ''; } });
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

async function handleEditDivision(e, id) {
  e.preventDefault();
  try {
    await api(`/divisions/${id}`, {
      method: 'PUT',
      body: {
        name: document.getElementById('editDivName').value.trim(),
        description: document.getElementById('editDivDesc').value.trim(),
        photo: document.getElementById('editDivPhotoUrl').value || undefined,
        sort_order: parseInt(document.getElementById('editDivSort').value || 0)
      }
    });
    document.getElementById('editDivModal')?.remove();
    document.body.style.overflow = '';
    showNotification('Divize upravena', 'success');
    await renderAdminDivisions(document.getElementById('adminContent'));
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

async function deleteDivision(id) {
  if (!confirm('Opravdu chcete smazat tuto divizi?')) return;
  try {
    await api(`/divisions/${id}`, { method: 'DELETE' });
    showNotification('Divize smazána.', 'success');
    await renderAdminDivisions(document.getElementById('adminContent'));
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

// ===== SETTINGS =====
async function renderAdminSettings(container) {
  try {
    const settings = await api('/settings');
    const images = settings.hero_images || [''];
    
    container.innerHTML = `
      <div class="admin-content-header">
        <h2 class="admin-content-title">Hlavní Nastavení</h2>
      </div>
      <div style="background: var(--bg-card); padding: 24px; border-radius: 12px; border: 1px solid var(--border-color); max-width: 800px;">
        <form onsubmit="handleSaveSettings(event)">
          <div class="form-group">
            <label class="form-label">Hlavní barva stránky (HEX)</label>
            <div style="display: flex; gap: 8px;">
              <input type="color" id="setPrimaryColor" value="${settings.primary_color || '#d4af37'}" style="height: 42px; width: 50px; border: none; cursor: pointer; background: transparent;">
              <input type="text" class="form-input" id="setPrimaryColorText" value="${settings.primary_color || '#d4af37'}" onchange="document.getElementById('setPrimaryColor').value = this.value" style="flex:1;">
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Logo stránky</label>
            <div style="display:flex; gap:16px; align-items: flex-start;">
              <div style="flex:1;">
                <input type="file" accept="image/*" class="form-input" onchange="handleDivImageUpload(event, 'setLogoUrl', 'setLogoPreview')">
                <input type="hidden" id="setLogoUrl" value="${settings.logo_url || ''}">
              </div>
              <div id="setLogoPreview" style="background: var(--bg-primary); padding: 8px; border-radius: 8px;">
                <img src="${settings.logo_url || '/img/logo.png'}" style="height: 50px; object-fit: contain;">
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Text sekce "O nás" (Domovská stránka)</label>
            <textarea class="form-textarea" id="setAboutText" style="min-height: 150px;">${escapeHtml(settings.about_us_text || '')}</textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Fotky na domovský banner (Carousel)</label>
            <p style="font-size: 0.8rem; color: var(--text-tertiary); margin-bottom: 8px;">Můžete nahrát více obrázků. Oddělte URL adresy čárkou, nebo nahrajte fotku a zkopírujte její odkaz.</p>
            <input class="form-input" id="setHeroImages" value="${images.join(', ')}">
            <div style="margin-top: 8px;">
              <label class="btn btn-sm btn-outline" style="cursor: pointer;">
                Nahrát fotku pro získání URL
                <input type="file" accept="image/*" style="display:none;" onchange="handleTempImageUpload(event)">
              </label>
              <div id="tempImageResult" style="margin-top:4px; font-size:0.8rem; color:var(--text-secondary);"></div>
            </div>
          </div>

          <button type="submit" class="btn btn-gold btn-full mt-4">Uložit nastavení</button>
        </form>
      </div>
    `;

    document.getElementById('setPrimaryColor').addEventListener('input', function() {
      document.getElementById('setPrimaryColorText').value = this.value;
    });

  } catch (err) {
    container.innerHTML = `<p style="color: var(--status-error);">Chyba: ${escapeHtml(err.message)}</p>`;
  }
}

async function handleTempImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = await uploadFile(file);
    const res = document.getElementById('tempImageResult');
    res.innerHTML = `URL: <strong>${data.url}</strong> (zkopírujte a vložte výše)`;
    
    // Auto-append logic
    const input = document.getElementById('setHeroImages');
    let current = input.value.split(',').map(s=>s.trim()).filter(Boolean);
    current.push(data.url);
    input.value = current.join(', ');
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

async function handleSaveSettings(e) {
  e.preventDefault();
  try {
    const heroInput = document.getElementById('setHeroImages').value;
    const heroArr = heroInput.split(',').map(s => s.trim()).filter(Boolean);

    await api('/settings', {
      method: 'PUT',
      body: {
        primary_color: document.getElementById('setPrimaryColorText').value,
        logo_url: document.getElementById('setLogoUrl').value,
        about_us_text: document.getElementById('setAboutText').value,
        hero_images: heroArr
      }
    });
    
    showNotification('Nastavení uloženo. Obnovte stránku pro projevení změn.', 'success');
    
    // Refresh globals dynamically
    if (typeof fetchSettings === 'function') {
      await fetchSettings();
      await renderAdminSettings(document.getElementById('adminContent'));
    }
  } catch (err) {
    showNotification(err.message, 'error');
  }
}
