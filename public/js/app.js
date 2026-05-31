/* ============================================
   LSPD — SPA Router & App Initialization
   ============================================ */

// ---- Theme Management ----
function initTheme() {
  const saved = localStorage.getItem('lspd_theme');
  const theme = saved || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('lspd_theme', next);
}

// ---- Mobile Nav ----
function closeMobileNav() {
  document.getElementById('mobileNav')?.classList.add('hidden');
}

function initMobileNav() {
  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('mobileNav');

  btn?.addEventListener('click', () => {
    nav?.classList.toggle('hidden');
  });

  // Close mobile nav on link click
  document.querySelectorAll('[data-close-mobile]').forEach(el => {
    el.addEventListener('click', closeMobileNav);
  });

  // Mobile submenu toggle
  document.querySelectorAll('.nav-mobile-group-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const submenu = trigger.nextElementSibling;
      submenu?.classList.toggle('hidden');
    });
  });
}

// ---- SPA Router ----
const routes = {
  '/': { render: renderHomePage, init: initHomePage, title: 'LSPD — Los Santos Police Department' },
  '/history': { render: renderHistoryPage, init: initHistoryPage, title: 'Historie — LSPD' },
  '/leadership': { render: renderLeadershipPage, init: initLeadershipPage, title: 'Vedení sboru — LSPD' },
  '/press': { render: renderPressPage, init: initPressPage, title: 'Tiskové zprávy — LSPD' },
  '/contact': { render: renderContactPage, init: initContactPage, title: 'Kontakt — LSPD' },
  '/recruitment': { render: renderRecruitmentPage, init: initRecruitmentPage, title: 'Nábor — LSPD' },
  '/complaints': { render: renderComplaintsPage, init: null, title: 'Stížnosti — LSPD' },
  '/divisions': { render: renderDivisionsPage, init: initDivisionsPage, title: 'Divize — LSPD' },
  '/admin': { render: renderAdminPage, init: initAdminPage, title: 'Admin Panel — LSPD' },
};

let currentRoute = null;

function getRoute() {
  const hash = window.location.hash.slice(1) || '/';

  // Handle post detail: /press/:id
  const pressMatch = hash.match(/^\/press\/(\d+)$/);
  if (pressMatch) {
    return { type: 'press-detail', id: pressMatch[1] };
  }

  return { type: 'page', path: hash };
}

async function navigate() {
  const route = getRoute();
  const appEl = document.getElementById('app');

  if (!appEl) return;

  // Scroll to top
  window.scrollTo(0, 0);

  if (route.type === 'press-detail') {
    document.title = 'Tisková zpráva — LSPD';
    appEl.innerHTML = renderPostDetailPage(route.id);
    await initPostDetailPage(route.id);
    updateActiveNav('/press');
    return;
  }

  const routeConfig = routes[route.path] || routes['/'];
  currentRoute = route.path;

  document.title = routeConfig.title;
  appEl.innerHTML = routeConfig.render();

  if (routeConfig.init) {
    await routeConfig.init();
  }

  updateActiveNav(route.path);
}

function updateActiveNav(path) {
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      link.classList.toggle('active', href === `#${path}`);
    }
  });
}

function refreshCurrentPage() {
  navigate();
}

// ---- Header scroll effect ----
function initHeaderScroll() {
  const header = document.getElementById('mainHeader');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.style.borderBottomColor = 'var(--border-color)';
    } else {
      header.style.borderBottomColor = 'transparent';
    }

    lastScroll = currentScroll;
  });
}

// ---- Initialize App ----
async function initApp() {
  // Theme
  initTheme();
  document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

  // Fetch settings from DB
  await fetchSettings();

  // Mobile nav
  initMobileNav();

  // Header scroll
  initHeaderScroll();

  // Auth
  await checkAuth();

  // Initial route
  await navigate();

  // Listen for hash changes
  window.addEventListener('hashchange', navigate);
}

// Start the app
document.addEventListener('DOMContentLoaded', initApp);
