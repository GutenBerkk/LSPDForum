/* ============================================
   LSPD — Recruitment Page
   ============================================ */

function renderRecruitmentPage() {
  const infoSections = `
    <!-- Co nabízíme -->
    <section class="section" style="background: var(--bg-card);">
      <div class="container">
        <div class="section-header scroll-reveal">
          <h2 class="section-title">POŽADAVKY A VÝBĚR</h2>
        </div>
        <div style="max-width: 800px; margin: 0 auto; background: var(--bg-modal); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 32px;" class="scroll-reveal">
          <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 16px; display: flex; align-items: flex-start; gap: 12px;">
              <span style="color: var(--gold); font-size: 1.2rem;">✓</span>
              <span>Věk minimálně 21 let</span>
            </li>
            <li style="margin-bottom: 16px; display: flex; align-items: flex-start; gap: 12px;">
              <span style="color: var(--gold); font-size: 1.2rem;">✓</span>
              <span>GED nebo vyšší vzdělání</span>
            </li>
            <li style="margin-bottom: 16px; display: flex; align-items: flex-start; gap: 12px;">
              <span style="color: var(--gold); font-size: 1.2rem;">✓</span>
              <span>Čistý trestní rejstřík</span>
            </li>
            <li style="margin-bottom: 16px; display: flex; align-items: flex-start; gap: 12px;">
              <span style="color: var(--gold); font-size: 1.2rem;">✓</span>
              <span>Driving License</span>
            </li>
            <li style="margin-bottom: 16px; display: flex; align-items: flex-start; gap: 12px;">
              <span style="color: var(--gold); font-size: 1.2rem;">✓</span>
              <span>Fyzická a psychická způsobilost</span>
            </li>
            <li style="margin-bottom: 16px; display: flex; align-items: flex-start; gap: 12px;">
              <span style="color: var(--gold); font-size: 1.2rem;">✓</span>
              <span>Odolnost vůči stresu, týmová spolupráce</span>
            </li>
            <li style="margin-bottom: 16px; display: flex; align-items: flex-start; gap: 12px;">
              <span style="color: var(--gold); font-size: 1.2rem;">✓</span>
              <span>Ochota sloužit ve ztížených podmínkách</span>
            </li>
            <li style="display: flex; align-items: flex-start; gap: 12px;">
              <span style="color: var(--gold); font-size: 1.2rem;">✓</span>
              <span>Úspěšné absolvování výběrového řízení a výcviku</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Co očekáváme -->
    <section class="section">
      <div class="container">
        <div class="section-header scroll-reveal">
          <h2 class="section-title">CO NABÍZÍME</h2>
        </div>
        <div style="max-width: 800px; margin: 0 auto; background: var(--bg-modal); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 32px;" class="scroll-reveal">
          <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 16px; display: flex; align-items: flex-start; gap: 12px;">
              <span style="color: var(--gold); font-size: 1.2rem;">✓</span>
              <span>Služba u respektované státní ozbrojené složky</span>
            </li>
            <li style="margin-bottom: 16px; display: flex; align-items: flex-start; gap: 12px;">
              <span style="color: var(--gold); font-size: 1.2rem;">✓</span>
              <span>Kariérní růst a možnost specializace</span>
            </li>
            <li style="margin-bottom: 16px; display: flex; align-items: flex-start; gap: 12px;">
              <span style="color: var(--gold); font-size: 1.2rem;">✓</span>
              <span>Přístup k moderní technice, vozidlům a výstroji</span>
            </li>
            <li style="margin-bottom: 16px; display: flex; align-items: flex-start; gap: 12px;">
              <span style="color: var(--gold); font-size: 1.2rem;">✓</span>
              <span>Výcvik na profesionální úrovni</span>
            </li>
            <li style="margin-bottom: 16px; display: flex; align-items: flex-start; gap: 12px;">
              <span style="color: var(--gold); font-size: 1.2rem;">✓</span>
              <span>Stabilní podmínky a profesionální vedení</span>
            </li>
            <li style="margin-bottom: 16px; display: flex; align-items: flex-start; gap: 12px;">
              <span style="color: var(--gold); font-size: 1.2rem;">✓</span>
              <span>Možnost účasti na leteckých a taktických výcvicích</span>
            </li>
            <li style="display: flex; align-items: flex-start; gap: 12px;">
              <span style="color: var(--gold); font-size: 1.2rem;">✓</span>
              <span>Společenské uznání a prestiž</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Kroky k odznaku -->
    <section class="section" style="background: var(--bg-card);">
      <div class="container">
        <div class="section-header scroll-reveal">
          <p class="font-display text-sm font-bold uppercase tracking-[0.3em] text-[var(--gold-deep)] text-center mb-3">Náborový proces</p>
          <h2 class="section-title">Čtyři kroky k odznaku</h2>
        </div>
        <div style="display: grid; gap: 24px; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
          
          <div class="scroll-reveal" style="background: var(--bg-primary); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-color); text-align: center;">
            <div style="width: 50px; height: 50px; margin: 0 auto 16px auto; background: var(--gold); color: var(--navy-deep); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.5rem;">1</div>
            <h3 style="margin-bottom: 12px; font-weight: 700; text-transform: uppercase;">Přihláška</h3>
            <p style="color: var(--text-secondary); font-size: 0.95rem;">Vyplň registrační formulář s osobními údaji a motivací.</p>
          </div>

          <div class="scroll-reveal" style="background: var(--bg-primary); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-color); text-align: center; transition-delay: 0.1s;">
            <div style="width: 50px; height: 50px; margin: 0 auto 16px auto; background: var(--gold); color: var(--navy-deep); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.5rem;">2</div>
            <h3 style="margin-bottom: 12px; font-weight: 700; text-transform: uppercase;">Pohovor</h3>
            <p style="color: var(--text-secondary); font-size: 0.95rem;">Osobní pohovor s náborovým týmem a velením.</p>
          </div>

          <div class="scroll-reveal" style="background: var(--bg-primary); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-color); text-align: center; transition-delay: 0.2s;">
            <div style="width: 50px; height: 50px; margin: 0 auto 16px auto; background: var(--gold); color: var(--navy-deep); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.5rem;">3</div>
            <h3 style="margin-bottom: 12px; font-weight: 700; text-transform: uppercase;">Akademie</h3>
            <p style="color: var(--text-secondary); font-size: 0.95rem;">Training Division — základní výcvik a teorie.</p>
          </div>

          <div class="scroll-reveal" style="background: var(--bg-primary); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-color); text-align: center; transition-delay: 0.3s;">
            <div style="width: 50px; height: 50px; margin: 0 auto 16px auto; background: var(--gold); color: var(--navy-deep); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.5rem;">4</div>
            <h3 style="margin-bottom: 12px; font-weight: 700; text-transform: uppercase;">Field Training</h3>
            <p style="color: var(--text-secondary); font-size: 0.95rem;">FTO program v terénu po boku zkušeného policisty.</p>
          </div>

        </div>
      </div>
    </section>
  `;

  if (!currentUser) {
    return `
      <div class="page">
        <section class="page-header" style="background-image: url('${globalSettings.hero_images?.[0] || '/img/hero-bg.png'}');">
          <div class="page-header-overlay"></div>
          <div class="container relative z-10 text-center animate-fade-in-up">
            <h1 class="page-title">Nábor do LSPD</h1>
            <p class="page-subtitle">Přidejte se k nám a chraňte město Los Santos</p>
          </div>
        </section>

        ${infoSections}

        <section class="section">
          <div class="container">
            <div class="section-header scroll-reveal">
              <h2 class="section-title">Náborový Formulář</h2>
            </div>
            <div class="auth-required scroll-reveal">
              <div class="auth-required-icon">🔒</div>
              <h3>Přihlášení vyžadováno</h3>
              <p>Pro vyplnění a odeslání náborového formuláře se musíte nejprve přihlásit nebo zaregistrovat.</p>
              <button class="btn btn-gold" onclick="showLoginModal()">Přihlásit se</button>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  return `
    <div class="page">
      <section class="page-header" style="background-image: url('${globalSettings.hero_images?.[0] || '/img/hero-bg.png'}');">
        <div class="page-header-overlay"></div>
        <div class="container relative z-10 text-center animate-fade-in-up">
          <h1 class="page-title">Nábor do LSPD</h1>
          <p class="page-subtitle">Vyplňte přihlášku a přidejte se k našemu týmu</p>
        </div>
      </section>

      ${infoSections}

      <section class="section">
        <div class="container">
          <div class="section-header scroll-reveal">
            <h2 class="section-title">Náborový Formulář</h2>
          </div>
          <div id="recruitmentContent" class="scroll-reveal">
            <div class="loading"><div class="loading-spinner"></div></div>
          </div>
        </div>
      </section>
    </div>
  `;
}

async function initRecruitmentPage() {
  initScrollReveal();
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
