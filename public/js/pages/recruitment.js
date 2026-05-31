/* ============================================
   LSPD — Recruitment Page
   ============================================ */

function renderRecruitmentPage() {
  const infoSections = `
    <!-- Co nabízíme -->
    <section class="section" style="background: var(--bg-card);">
      <div class="container">
        <div class="section-header scroll-reveal">
          <h2 class="section-title">Co nabízíme</h2>
          <p class="section-subtitle">Výhody služby u Los Santos Police Department</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px;">
          <div class="contact-card scroll-reveal">
            <div class="contact-card-icon">💰</div>
            <h3>Stabilní plat</h3>
            <p>Nadstandardní finanční ohodnocení s pravidelnými bonusy a příplatky za riziko.</p>
          </div>
          <div class="contact-card scroll-reveal" style="transition-delay: 0.1s;">
            <div class="contact-card-icon">🎓</div>
            <h3>Kariérní růst</h3>
            <p>Možnost povýšení, přestupu do specializovaných divizí a průběžné vzdělávání.</p>
          </div>
          <div class="contact-card scroll-reveal" style="transition-delay: 0.2s;">
            <div class="contact-card-icon">🛡️</div>
            <h3>Špičkové vybavení</h3>
            <p>Nejmodernější zbraně, vozový park a taktická výstroj pro vaši bezpečnost.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Co očekáváme -->
    <section class="section">
      <div class="container">
        <div class="section-header scroll-reveal">
          <h2 class="section-title">Co očekáváme</h2>
          <p class="section-subtitle">Základní předpoklady pro přijetí</p>
        </div>
        <div style="max-width: 800px; margin: 0 auto; background: var(--bg-modal); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 32px;" class="scroll-reveal">
          <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 16px; display: flex; align-items: flex-start; gap: 12px;">
              <span style="color: var(--status-success); font-size: 1.2rem;">✓</span>
              <span><strong>Věk:</strong> Minimálně 18 let</span>
            </li>
            <li style="margin-bottom: 16px; display: flex; align-items: flex-start; gap: 12px;">
              <span style="color: var(--status-success); font-size: 1.2rem;">✓</span>
              <span><strong>Trestní rejstřík:</strong> Čistý trestní rejstřík (bez záznamů o felony nebo závažných misdemeanor přestupcích)</span>
            </li>
            <li style="margin-bottom: 16px; display: flex; align-items: flex-start; gap: 12px;">
              <span style="color: var(--status-success); font-size: 1.2rem;">✓</span>
              <span><strong>Kvalifikace:</strong> Dokončené středoškolské vzdělání nebo GED</span>
            </li>
            <li style="margin-bottom: 16px; display: flex; align-items: flex-start; gap: 12px;">
              <span style="color: var(--status-success); font-size: 1.2rem;">✓</span>
              <span><strong>Fyzická zdatnost:</strong> Výborná fyzická i psychická kondice</span>
            </li>
            <li style="display: flex; align-items: flex-start; gap: 12px;">
              <span style="color: var(--status-success); font-size: 1.2rem;">✓</span>
              <span><strong>Osobnost:</strong> Komunikativnost, schopnost pracovat v týmu a pod tlakem, loajalita a profesionalita</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Kroky k odznaku -->
    <section class="section" style="background: var(--bg-card);">
      <div class="container">
        <div class="section-header scroll-reveal">
          <h2 class="section-title">Kroky k odznaku</h2>
          <p class="section-subtitle">Jak probíhá přijímací řízení</p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 24px; max-width: 800px; margin: 0 auto;">
          
          <div class="scroll-reveal" style="display: flex; gap: 20px; align-items: flex-start; background: var(--bg-primary); padding: 24px; border-radius: var(--radius-md); border-left: 4px solid var(--gold);">
            <div style="width: 40px; height: 40px; background: var(--gold); color: var(--navy-deep); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 1.2rem;">1</div>
            <div>
              <h3 style="margin-bottom: 8px;">Odeslání elektronické přihlášky</h3>
              <p style="color: var(--text-secondary); font-size: 0.95rem;">Vyplňte pečlivě formulář níže. Vaše přihláška bude zařazena do systému a předána k prvotnímu posouzení.</p>
            </div>
          </div>

          <div class="scroll-reveal" style="display: flex; gap: 20px; align-items: flex-start; background: var(--bg-primary); padding: 24px; border-radius: var(--radius-md); border-left: 4px solid var(--gold); transition-delay: 0.1s;">
            <div style="width: 40px; height: 40px; background: var(--gold); color: var(--navy-deep); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 1.2rem;">2</div>
            <div>
              <h3 style="margin-bottom: 8px;">Pohovor (Interview)</h3>
              <p style="color: var(--text-secondary); font-size: 0.95rem;">Pokud projde vaše přihláška, budete pozváni na osobní pohovor, kde zhodnotíme vaše předpoklady, motivaci a znalosti.</p>
            </div>
          </div>

          <div class="scroll-reveal" style="display: flex; gap: 20px; align-items: flex-start; background: var(--bg-primary); padding: 24px; border-radius: var(--radius-md); border-left: 4px solid var(--gold); transition-delay: 0.2s;">
            <div style="width: 40px; height: 40px; background: var(--gold); color: var(--navy-deep); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 1.2rem;">3</div>
            <div>
              <h3 style="margin-bottom: 8px;">Akademie (Police Academy)</h3>
              <p style="color: var(--text-secondary); font-size: 0.95rem;">Po přijetí nastupujete do akademie jako Kadet. Čeká vás výcvik v zákonech, komunikaci, řízení vozidel, střelbě a taktických postupech.</p>
            </div>
          </div>

          <div class="scroll-reveal" style="display: flex; gap: 20px; align-items: flex-start; background: var(--bg-primary); padding: 24px; border-radius: var(--radius-md); border-left: 4px solid var(--gold); transition-delay: 0.3s;">
            <div style="width: 40px; height: 40px; background: var(--gold); color: var(--navy-deep); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 1.2rem;">4</div>
            <div>
              <h3 style="margin-bottom: 8px;">Fáze FTO (Field Training)</h3>
              <p style="color: var(--text-secondary); font-size: 0.95rem;">Jako Officer I jezdíte s FTO (Field Training Officer), který dohlíží na vaši práci v terénu, dokud nebudete schopni sloužit samostatně.</p>
            </div>
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
