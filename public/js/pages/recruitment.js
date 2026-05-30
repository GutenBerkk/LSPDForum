/* ============================================
   LSPD — Recruitment Page
   ============================================ */

function renderRecruitmentPage() {
  if (!currentUser) {
    return `
      <div class="page">
        <div class="page-header">
          <div class="container">
            <h1 class="page-title animate-fade-in-up">Nábor do LSPD</h1>
            <p class="page-subtitle animate-fade-in-up" style="animation-delay: 0.1s;">
              Přidejte se k nám a chraňte město Los Santos
            </p>
          </div>
        </div>

        <section class="section">
          <div class="container">
            <div class="auth-required">
              <div class="auth-required-icon">🔒</div>
              <h3>Přihlášení vyžadováno</h3>
              <p>Pro odeslání náborového formuláře se musíte nejprve přihlásit nebo zaregistrovat.</p>
              <button class="btn btn-gold" onclick="showLoginModal()">Přihlásit se</button>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  return `
    <div class="page">
      <div class="page-header">
        <div class="container">
          <h1 class="page-title animate-fade-in-up">Nábor do LSPD</h1>
          <p class="page-subtitle animate-fade-in-up" style="animation-delay: 0.1s;">
            Vyplňte přihlášku a přidejte se k našemu týmu
          </p>
        </div>
      </div>

      <section class="section">
        <div class="container">
          <div id="recruitmentContent">
            <div class="loading"><div class="loading-spinner"></div></div>
          </div>
        </div>
      </section>
    </div>
  `;
}

async function initRecruitmentPage() {
  if (!currentUser) return;

  const container = document.getElementById('recruitmentContent');
  if (!container) return;

  try {
    // Check existing submissions
    const submissions = await api('/recruitment/my-submissions');
    const pendingSubmission = submissions.find(s => s.status === 'pending');

    if (pendingSubmission) {
      container.innerHTML = `
        <div class="recruitment-form">
          <div class="text-center" style="padding: 20px;">
            <div style="font-size: 3rem; margin-bottom: 12px;">⏳</div>
            <h3 style="font-size: 1.2rem; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;">
              Přihláška čeká na vyřízení
            </h3>
            <p style="color: var(--text-secondary); margin-bottom: 16px;">
              Vaše přihláška ze dne ${formatDate(pendingSubmission.created_at)} je stále ve stavu čekání na posouzení.
            </p>
            <span class="badge badge-pending">Čeká na vyřízení</span>
          </div>
        </div>
      `;
      return;
    }

    // Check if last submission was rejected - allow resubmitting
    const lastSubmission = submissions[0];
    if (lastSubmission) {
      const statusMessages = {
        approved: { icon: '✅', text: 'Vaše přihláška byla schválena!', badge: 'badge-approved', label: 'Schváleno' },
        rejected: { icon: '❌', text: 'Vaše přihláška byla zamítnuta. Můžete podat novou.', badge: 'badge-rejected', label: 'Zamítnuto' },
      };

      const status = statusMessages[lastSubmission.status];
      if (status && lastSubmission.status === 'approved') {
        container.innerHTML = `
          <div class="recruitment-form">
            <div class="text-center" style="padding: 20px;">
              <div style="font-size: 3rem; margin-bottom: 12px;">${status.icon}</div>
              <h3 style="font-size: 1.2rem; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;">
                ${status.text}
              </h3>
              ${lastSubmission.admin_note ? `<p style="color: var(--text-secondary); margin-top: 8px;"><em>"${escapeHtml(lastSubmission.admin_note)}"</em></p>` : ''}
              <span class="badge ${status.badge} mt-2">${status.label}</span>
            </div>
          </div>
        `;
        return;
      }
    }

    // Load questions and render form
    const questions = await api('/recruitment/questions');

    if (questions.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📝</div>
          <h3>Nábor momentálně neprobíhá</h3>
          <p>Zkuste to prosím později.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="recruitment-form">
        <h3>Náborový formulář</h3>
        <form id="recruitmentForm" onsubmit="handleRecruitmentSubmit(event)">
          ${questions.map(q => renderQuestionField(q)).join('')}
          <button type="submit" class="btn btn-gold btn-full mt-3" id="recruitmentSubmitBtn">
            Odeslat přihlášku
          </button>
        </form>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <h3>Chyba</h3>
        <p>${escapeHtml(err.message)}</p>
      </div>
    `;
  }
}

function renderQuestionField(q) {
  const required = q.required ? '<span class="required">*</span>' : '';
  const requiredAttr = q.required ? 'required' : '';

  if (q.type === 'textarea') {
    return `
      <div class="recruitment-question">
        <label for="q_${q.id}">${escapeHtml(q.question)} ${required}</label>
        <textarea class="form-textarea" id="q_${q.id}" name="q_${q.id}" ${requiredAttr}
                  placeholder="Vaše odpověď..."></textarea>
      </div>
    `;
  }

  if (q.type === 'select') {
    let options = [];
    try { options = JSON.parse(q.options || '[]'); } catch {}
    return `
      <div class="recruitment-question">
        <label for="q_${q.id}">${escapeHtml(q.question)} ${required}</label>
        <select class="form-select" id="q_${q.id}" name="q_${q.id}" ${requiredAttr}>
          <option value="">— Vyberte —</option>
          ${options.map(o => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`).join('')}
        </select>
      </div>
    `;
  }

  return `
    <div class="recruitment-question">
      <label for="q_${q.id}">${escapeHtml(q.question)} ${required}</label>
      <input class="form-input" type="text" id="q_${q.id}" name="q_${q.id}" ${requiredAttr}
             placeholder="Vaše odpověď...">
    </div>
  `;
}

async function handleRecruitmentSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('recruitmentSubmitBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Odesílání...';

  try {
    const form = document.getElementById('recruitmentForm');
    const formData = new FormData(form);
    const answers = {};

    for (const [key, value] of formData.entries()) {
      answers[key] = value;
    }

    await api('/recruitment/submit', {
      method: 'POST',
      body: { answers },
    });

    showNotification('Přihláška byla úspěšně odeslána!', 'success');

    // Refresh page to show pending state
    const container = document.getElementById('recruitmentContent');
    if (container) {
      container.innerHTML = `
        <div class="recruitment-form">
          <div class="text-center" style="padding: 20px;">
            <div style="font-size: 3rem; margin-bottom: 12px;">✅</div>
            <h3 style="font-size: 1.2rem; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;">
              Přihláška odeslána!
            </h3>
            <p style="color: var(--text-secondary);">
              Vaše přihláška byla přijata a čeká na posouzení. Děkujeme za váš zájem o službu u LSPD.
            </p>
            <span class="badge badge-pending mt-2">Čeká na vyřízení</span>
          </div>
        </div>
      `;
    }
  } catch (err) {
    showNotification(err.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Odeslat přihlášku';
  }
}
