/* ============================================
   LSPD — Home Page
   ============================================ */

function renderHomePage() {
  return `
    <!-- Hero -->
    <section class="hero">
      <div class="hero-bg">
        <img src="/img/hero-bg.png" alt="LSPD Patrol" id="heroImage">
        <div class="hero-bg-overlay"></div>
      </div>
      <img src="/img/logo.png" alt="" class="hero-logo-float">
      <div class="hero-content">
        <div class="hero-inner">
          <div class="hero-badge">
            <span class="hero-badge-dot"></span>
            LOS SANTOS POLICE DEPARTMENT
          </div>
          <h1 class="hero-title">
            TO PROTECT<br>AND TO <span>SERVE</span>
          </h1>
          <p class="hero-subtitle">
            Los Santos Police Department slouží a chrání občany Los Santos. 
            Jsme zde pro vaši bezpečnost — 24 hodin denně, 7 dní v týdnu.
          </p>
          <div class="hero-actions">
            <a href="#/press" class="btn btn-gold">Tiskové zprávy</a>
            <a href="#/recruitment" class="btn btn-outline">Přidej se k nám</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="stats-section">
      <div class="stats-grid">
        <div class="stat-item scroll-reveal">
          <div class="stat-value counter" data-target="72" data-suffix="+">0</div>
          <div class="stat-label">Aktivních příslušníků</div>
        </div>
        <div class="stat-item scroll-reveal" style="transition-delay: 0.1s;">
          <div class="stat-value counter" data-target="450" data-suffix="+">0</div>
          <div class="stat-label">Vyřešených případů</div>
        </div>
        <div class="stat-item scroll-reveal" style="transition-delay: 0.2s;">
          <div class="stat-value counter" data-target="24" data-suffix="/7">24/7</div>
          <div class="stat-label">Dostupnost</div>
        </div>
        <div class="stat-item scroll-reveal" style="transition-delay: 0.3s;">
          <div class="stat-value counter" data-target="98" data-suffix="%">98%</div>
          <div class="stat-label">Úspěšnost zásahů</div>
        </div>
      </div>
    </section>

    <!-- About -->
    <section class="section">
      <div class="container">
        <div class="about-grid">
          <div class="scroll-reveal">
            <h2>Los Santos Police Department</h2>
            <p>
              LSPD je hlavní policejní složkou města Los Santos. Naší misí je chránit 
              životy a majetek občanů, udržovat veřejný pořádek a prosazovat zákon 
              s integritou a profesionalitou.
            </p>
            <p>
              Od svého založení se LSPD řídí hodnotami cti, odvahy a oddanosti službě 
              veřejnosti. Naši příslušníci procházejí náročným výcvikem a jsou připraveni 
              reagovat na jakoukoliv situaci.
            </p>
            <ul class="about-list">
              <li><span class="about-list-dot"></span> Ochrana veřejného pořádku</li>
              <li><span class="about-list-dot"></span> Vyšetřování trestné činnosti</li>
              <li><span class="about-list-dot"></span> Dopravní bezpečnost</li>
              <li><span class="about-list-dot"></span> Služba komunitě</li>
            </ul>
          </div>
          <div class="about-image scroll-reveal" style="transition-delay: 0.2s;">
            <img src="/img/hero-bg.png" alt="LSPD v akci">
          </div>
        </div>
      </div>
    </section>

    <!-- Leadership preview -->
    <section class="section section-alt" id="homeLeadership">
      <div class="container">
        <div class="section-header scroll-reveal">
          <h2 class="section-title">Vedení sboru</h2>
          <p class="section-subtitle">Naše vedení se skládá z nejzkušenějších a nejdéle sloužících příslušníků</p>
        </div>
        <div class="leadership-grid" id="homeLeadershipGrid">
          <div class="loading"><div class="loading-spinner"></div></div>
        </div>
        <div class="text-center mt-4 scroll-reveal">
          <a href="#/leadership" class="btn btn-outline">Celé vedení</a>
        </div>
      </div>
    </section>

    <!-- Contact preview -->
    <section class="section">
      <div class="container">
        <div class="section-header scroll-reveal">
          <h2 class="section-title">Kontakt</h2>
        </div>
        <div class="contact-grid">
          <div class="contact-card scroll-reveal">
            <div class="contact-card-icon">📧</div>
            <h3>Email</h3>
            <p>info@lspd.gov</p>
          </div>
          <div class="contact-card scroll-reveal" style="transition-delay: 0.1s;">
            <div class="contact-card-icon">📱</div>
            <h3>Telefon</h3>
            <p>911</p>
          </div>
          <div class="contact-card scroll-reveal" style="transition-delay: 0.2s;">
            <div class="contact-card-icon">📍</div>
            <h3>Adresa</h3>
            <p>Mission Row Police Station, Los Santos</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

async function initHomePage() {
  // Load leadership preview
  try {
    const members = await api('/leadership');
    const grid = document.getElementById('homeLeadershipGrid');
    if (grid && members.length > 0) {
      const top3 = members.slice(0, 3);
      grid.innerHTML = top3.map((m, i) => `
        <div class="leader-card scroll-reveal" style="transition-delay: ${i * 0.1}s;">
          <img src="${m.photo || avatarUrl(m.name)}" alt="${escapeHtml(m.name)}" class="leader-photo"
               onerror="this.src='${avatarUrl(m.name)}'">
          <div class="leader-info">
            <h3 class="leader-name">${escapeHtml(m.name)}</h3>
            <p class="leader-rank">${escapeHtml(m.rank)}</p>
          </div>
        </div>
      `).join('');
    } else if (grid) {
      grid.innerHTML = '<p class="text-center" style="color: var(--text-tertiary); grid-column: 1/-1;">Zatím žádní členové vedení.</p>';
    }
  } catch {
    const grid = document.getElementById('homeLeadershipGrid');
    if (grid) grid.innerHTML = '';
  }

  // Init animations
  initScrollReveal();
  initCounters();

  // Parallax
  const heroImg = document.getElementById('heroImage');
  if (heroImg) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          if (heroImg) heroImg.style.transform = `translateY(${scrolled * 0.4}px)`;
          ticking = false;
        });
        ticking = true;
      }
    });
  }
}
