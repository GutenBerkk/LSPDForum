/* ============================================
   LSPD — Complaints
   ============================================ */

function renderComplaintsPage() {
  return `
    <div class="page">
      <section class="page-header" style="background-image: url('${globalSettings.hero_images?.[0] || '/img/hero-bg.png'}');">
        <div class="page-header-overlay"></div>
        <div class="container relative z-10 text-center animate-fade-in-up">
          <h1 class="page-title">Podání stížnosti</h1>
          <p class="page-subtitle">Zde můžete podat formální stížnost na postup nebo chování příslušníka LSPD.</p>
        </div>
      </section>

      <section class="section animate-fade-in" style="animation-delay: 0.2s;">
        <div class="container" style="max-width: 800px;">
          <div style="background: var(--bg-card); padding: 32px; border-radius: var(--radius-lg); border: 1px solid var(--border-color); box-shadow: var(--shadow-md);">
            <p style="margin-bottom: 24px; color: var(--text-secondary);">
              Všechny stížnosti jsou brány velmi vážně a jsou interně vyšetřovány vedením sboru. 
              Prosíme o co nejpřesnější a nejdetailnější popis situace.
            </p>

            <form id="complaintForm" onsubmit="handleComplaintSubmit(event)">
              <div class="form-group">
                <label class="form-label" for="complaintName">Vaše Jméno a Příjmení *</label>
                <input type="text" id="complaintName" class="form-input" required placeholder="John Doe">
              </div>

              <div class="form-group">
                <label class="form-label" for="complaintEmail">Váš Email</label>
                <input type="email" id="complaintEmail" class="form-input" placeholder="john.doe@example.com (volitelné, pro odpověď)">
              </div>

              <div class="form-group">
                <label class="form-label" for="complaintSubject">Předmět stížnosti *</label>
                <input type="text" id="complaintSubject" class="form-input" required placeholder="Např. Nepřiměřený zásah, Chování policisty...">
              </div>

              <div class="form-group">
                <label class="form-label" for="complaintMessage">Detailní popis události *</label>
                <textarea id="complaintMessage" class="form-textarea" required placeholder="Popište přesně co se stalo, kdy se to stalo a kdo byl přítomen..."></textarea>
                <p class="form-hint">Uveďte prosím datum, čas, místo a případná čísla odznaků nebo jména policistů, pokud je znáte.</p>
              </div>

              <div style="margin-top: 32px;">
                <button type="submit" class="btn btn-gold btn-full" id="submitComplaintBtn">Odeslat stížnost</button>
              </div>
            </form>
            
            <div id="complaintSuccess" class="hidden" style="text-align: center; padding: 40px 20px;">
              <div style="font-size: 3rem; margin-bottom: 16px;">✅</div>
              <h3 style="font-size: 1.5rem; margin-bottom: 8px;">Stížnost byla úspěšně odeslána</h3>
              <p style="color: var(--text-secondary); margin-bottom: 24px;">
                Děkujeme za vaše podání. Vaší stížností se bude zabývat vedení LSPD.
              </p>
              <button class="btn btn-outline" onclick="resetComplaintForm()">Podat další stížnost</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

async function handleComplaintSubmit(e) {
  e.preventDefault();
  
  const btn = document.getElementById('submitComplaintBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Odesílání...';

  const data = {
    name: document.getElementById('complaintName').value.trim(),
    email: document.getElementById('complaintEmail').value.trim(),
    subject: document.getElementById('complaintSubject').value.trim(),
    message: document.getElementById('complaintMessage').value.trim()
  };

  try {
    await api('/complaints', {
      method: 'POST',
      body: data
    });

    document.getElementById('complaintForm').classList.add('hidden');
    document.getElementById('complaintSuccess').classList.remove('hidden');
  } catch (err) {
    showNotification(err.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Odeslat stížnost';
  }
}

function resetComplaintForm() {
  document.getElementById('complaintForm').reset();
  document.getElementById('complaintForm').classList.remove('hidden');
  document.getElementById('complaintSuccess').classList.add('hidden');
  const btn = document.getElementById('submitComplaintBtn');
  btn.disabled = false;
  btn.textContent = 'Odeslat stížnost';
}
