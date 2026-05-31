/* ============================================
   LSPD — Contact Page
   ============================================ */

function renderContactPage() {
  return `
    <div class="page">
      <div class="page-header">
        <div class="container">
          <h1 class="page-title animate-fade-in-up">Kontakt</h1>
          <p class="page-subtitle animate-fade-in-up" style="animation-delay: 0.1s;">
            Potřebujete se s námi spojit? Neváhejte nás kontaktovat.
          </p>
        </div>
      </div>

      <section class="section">
        <div class="container">
          <div class="contact-grid">
            <div class="contact-card scroll-reveal">
              <div class="contact-card-icon">📧</div>
              <h3>Email</h3>
              <p>info@lspd.gov</p>
            </div>
            <div class="contact-card scroll-reveal" style="transition-delay: 0.1s;">
              <div class="contact-card-icon">📱</div>
              <h3>Tísňová linka</h3>
              <p>911</p>
            </div>
            <div class="contact-card scroll-reveal" style="transition-delay: 0.2s;">
              <div class="contact-card-icon">📍</div>
              <h3>Stanice</h3>
              <p>Vespucci Police Station, Los Santos</p>
            </div>
          </div>

          <div class="contact-form-container scroll-reveal">
            <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 20px; color: var(--text-primary);">
              Napište nám
            </h3>
            <form id="contactForm" onsubmit="handleContactSubmit(event)">
              <div class="grid-2">
                <div class="form-group">
                  <label class="form-label" for="contactName">Jméno</label>
                  <input class="form-input" type="text" id="contactName" placeholder="Vaše jméno" required>
                </div>
                <div class="form-group">
                  <label class="form-label" for="contactEmail">Email</label>
                  <input class="form-input" type="email" id="contactEmail" placeholder="vas@email.com" required>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="contactSubject">Předmět</label>
                <input class="form-input" type="text" id="contactSubject" placeholder="O čem chcete psát?" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="contactMessage">Zpráva</label>
                <textarea class="form-textarea" id="contactMessage" placeholder="Vaše zpráva..." required></textarea>
              </div>
              <button type="submit" class="btn btn-gold btn-full" id="contactSubmitBtn">Odeslat zprávu</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  `;
}

async function handleContactSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('contactSubmitBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Odesílání...';

  try {
    await api('/contact', {
      method: 'POST',
      body: {
        name: document.getElementById('contactName').value.trim(),
        email: document.getElementById('contactEmail').value.trim(),
        subject: document.getElementById('contactSubject').value.trim(),
        message: document.getElementById('contactMessage').value.trim(),
      },
    });

    showNotification('Zpráva byla úspěšně odeslána!', 'success');
    document.getElementById('contactForm').reset();
  } catch (err) {
    showNotification(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Odeslat zprávu';
  }
}

function initContactPage() {
  initScrollReveal();
}
