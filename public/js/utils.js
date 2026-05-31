/* ============================================
   LSPD — Utility Functions
   ============================================ */

const API_BASE = '/api';

let globalSettings = {};

async function fetchSettings() {
  try {
    globalSettings = await api('/settings');
    applySettings();
  } catch (e) {
    console.error('Error fetching settings', e);
  }
}

function applySettings() {
  if (globalSettings.primary_color) {
    document.documentElement.style.setProperty('--primary', globalSettings.primary_color);
    document.documentElement.style.setProperty('--gold', globalSettings.primary_color); // If they use --gold
  }
  
  if (globalSettings.logo_url) {
    document.querySelectorAll('img[src="/img/logo.png"]').forEach(img => {
      img.src = globalSettings.logo_url;
    });
  }
}

// API helper
async function api(endpoint, options = {}) {
  const token = localStorage.getItem('lspd_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Remove Content-Type for FormData
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      body: options.body instanceof FormData ? options.body : (options.body ? JSON.stringify(options.body) : undefined),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Něco se pokazilo.');
    }

    return data;
  } catch (err) {
    if (err.message === 'Failed to fetch') {
      throw new Error('Nepodařilo se spojit se serverem.');
    }
    throw err;
  }
}

// Upload file helper
async function uploadFile(file) {
  const token = localStorage.getItem('lspd_token');
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Chyba při nahrávání.');
  return data;
}

// Notifications
function showNotification(message, type = 'info') {
  const container = document.getElementById('notifications');
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  notification.innerHTML = `
    <span class="notification-icon">${icons[type] || icons.info}</span>
    <span>${message}</span>
    <button class="notification-close" onclick="this.parentElement.remove()">✕</button>
  `;

  container.appendChild(notification);

  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.transition = 'all 0.3s ease';
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(120%)';
      setTimeout(() => notification.remove(), 300);
    }
  }, 4000);
}

// Date formatter
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatDateTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Scroll reveal observer
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el));
}

// Counter animation
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(start);
    }
  }, 16);
}

function initCounters() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          const target = parseInt(entry.target.dataset.target);
          const suffix = entry.target.dataset.suffix || '';

          if (suffix === '/7') {
            entry.target.textContent = target + suffix;
          } else {
            animateCounter(entry.target, target);
            const interval = setInterval(() => {
              if (parseInt(entry.target.textContent) === target) {
                entry.target.textContent = target + suffix;
                clearInterval(interval);
              }
            }, 16);
          }
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.counter').forEach((el) => observer.observe(el));
}

// Simple HTML escaping
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Text to paragraphs
function textToParagraphs(text) {
  if (!text) return '';
  return text
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join('');
}

// Generate avatar URL placeholder
function avatarUrl(name) {
  const colors = ['C9A84C', '1a2a4a', '243b5e'];
  const bg = colors[Math.floor(Math.random() * colors.length)];
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=300&background=${bg}&color=ffffff&bold=true`;
}
