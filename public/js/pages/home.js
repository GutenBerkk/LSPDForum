/* ============================================
   LSPD — Home Page
   ============================================ */

function renderHomePage() {
  const images = globalSettings.hero_images || ['/img/hero-bg.png'];
  const firstImage = images[0] || '/img/hero-bg.png';
  const aboutText = textToParagraphs(globalSettings.about_us_text || 'LSPD je hlavní policejní složkou...');

  return `
    <!-- Hero -->
    <section class="hero">
      <div class="hero-bg">
        <img src="${firstImage}" alt="LSPD Patrol" id="heroImage" data-images='${JSON.stringify(images).replace(/'/g, "&#39;")}'>
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
            <div id="aboutUsContent">
              ${aboutText}
            </div>
          </div>
          <div class="about-image scroll-reveal" style="transition-delay: 0.2s;">
            <img src="${firstImage}" alt="LSPD v akci">
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
            <p>Vespucci Police Station, Los Santos</p>
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

  // Parallax & Carousel
  const heroImg = document.getElementById('heroImage');
  if (heroImg) {
    heroImg.style.transition = 'opacity 0.5s ease';
    try {
      const images = JSON.parse(heroImg.dataset.images || '[]');
      if (images.length > 1) {
        let currentIdx = 0;
        // Set an interval for carousel
        window._heroCarouselInterval = setInterval(() => {
          if (!document.getElementById('heroImage')) {
            clearInterval(window._heroCarouselInterval);
            return;
          }
          heroImg.style.opacity = '0';
          setTimeout(() => {
            currentIdx = (currentIdx + 1) % images.length;
            heroImg.src = images[currentIdx];
            heroImg.style.opacity = '1';
          }, 500);
        }, 5000);
      }
    } catch (e) {
      console.error('Error parsing hero images', e);
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const el = document.getElementById('heroImage');
          if (el) el.style.transform = `translateY(${scrolled * 0.4}px)`;
          ticking = false;
        });
        ticking = true;
      }
    });
  }
}
