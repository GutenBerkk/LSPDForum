/* ============================================
   LSPD — Authentication Logic
   ============================================ */

let currentUser = null;

// Check auth state on load
async function checkAuth() {
  const token = localStorage.getItem('lspd_token');
  if (!token) {
    setLoggedOut();
    return;
  }

  try {
    const data = await api('/auth/me');
    currentUser = data.user;
    setLoggedIn(currentUser);
  } catch {
    localStorage.removeItem('lspd_token');
    currentUser = null;
    setLoggedOut();
  }
}

function setLoggedIn(user) {
  currentUser = user;
  document.getElementById('loginBtn')?.classList.add('hidden');
  document.getElementById('userDropdown')?.classList.remove('hidden');
  document.getElementById('usernameDisplay').textContent = user.username;

  // Show admin link if admin
  const adminLink = document.getElementById('adminLink');
  if (adminLink) {
    if (user.role === 'admin') {
      adminLink.classList.remove('hidden');
    } else {
      adminLink.classList.add('hidden');
    }
  }

  // Update mobile auth section
  const mobileAuth = document.getElementById('mobileAuthSection');
  if (mobileAuth) {
    mobileAuth.innerHTML = `
      <div style="padding: 8px 14px; color: var(--text-secondary); font-size: 0.85rem;">
        Přihlášen jako <strong style="color: var(--gold);">${escapeHtml(user.username)}</strong>
      </div>
      ${user.role === 'admin' ? '<a href="#/admin" class="nav-mobile-link" data-close-mobile>Admin Panel</a>' : ''}
      <button class="nav-mobile-link" onclick="logout()" style="color: var(--status-error);">Odhlásit se</button>
    `;
  }
}

function setLoggedOut() {
  currentUser = null;
  document.getElementById('loginBtn')?.classList.remove('hidden');
  document.getElementById('userDropdown')?.classList.add('hidden');
  document.getElementById('adminLink')?.classList.add('hidden');

  const mobileAuth = document.getElementById('mobileAuthSection');
  if (mobileAuth) {
    mobileAuth.innerHTML = `
      <button class="nav-mobile-link" onclick="showLoginModal()" style="color: var(--gold); font-weight: 600;">
        Přihlásit se
      </button>
    `;
  }
}

// Show/hide modals
function showLoginModal() {
  closeMobileNav();
  document.getElementById('loginModal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  document.getElementById('loginUsername')?.focus();
}

function closeLoginModal() {
  document.getElementById('loginModal').classList.add('hidden');
  document.body.style.overflow = '';
  document.getElementById('loginForm')?.reset();
  document.getElementById('loginError')?.classList.add('hidden');
}

function showRegisterModal() {
  document.getElementById('registerModal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  document.getElementById('regUsername')?.focus();
}

function closeRegisterModal() {
  document.getElementById('registerModal').classList.add('hidden');
  document.body.style.overflow = '';
  document.getElementById('registerForm')?.reset();
  document.getElementById('registerError')?.classList.add('hidden');
}

function switchToRegister() {
  closeLoginModal();
  setTimeout(showRegisterModal, 200);
}

function switchToLogin() {
  closeRegisterModal();
  setTimeout(showLoginModal, 200);
}

// Handle login
async function handleLogin(e) {
  e.preventDefault();
  const errorEl = document.getElementById('loginError');
  const btn = document.getElementById('loginSubmitBtn');
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;

  errorEl.classList.add('hidden');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Přihlašování...';

  try {
    const data = await api('/auth/login', {
      method: 'POST',
      body: { username, password },
    });

    localStorage.setItem('lspd_token', data.token);
    setLoggedIn(data.user);
    closeLoginModal();
    showNotification(`Vítejte, ${data.user.username}!`, 'success');

    // Refresh current page
    if (typeof refreshCurrentPage === 'function') {
      refreshCurrentPage();
    }
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Přihlásit se';
  }
}

// Handle register
async function handleRegister(e) {
  e.preventDefault();
  const errorEl = document.getElementById('registerError');
  const btn = document.getElementById('registerSubmitBtn');
  const username = document.getElementById('regUsername').value.trim();
  const password = document.getElementById('regPassword').value;
  const passwordConfirm = document.getElementById('regPasswordConfirm').value;

  errorEl.classList.add('hidden');

  if (password !== passwordConfirm) {
    errorEl.textContent = 'Hesla se neshodují.';
    errorEl.classList.remove('hidden');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Registrace...';

  try {
    const data = await api('/auth/register', {
      method: 'POST',
      body: { username, password },
    });

    localStorage.setItem('lspd_token', data.token);
    setLoggedIn(data.user);
    closeRegisterModal();
    showNotification('Účet byl úspěšně vytvořen!', 'success');

    if (typeof refreshCurrentPage === 'function') {
      refreshCurrentPage();
    }
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Zaregistrovat se';
  }
}

// Logout
function logout() {
  localStorage.removeItem('lspd_token');
  setLoggedOut();
  showNotification('Byli jste odhlášeni.', 'info');

  // Redirect to home if on admin page
  if (window.location.hash.startsWith('#/admin')) {
    window.location.hash = '#/';
  }

  if (typeof refreshCurrentPage === 'function') {
    refreshCurrentPage();
  }
}

// Close modals on backdrop click
document.addEventListener('click', (e) => {
  if (e.target.id === 'loginModal') closeLoginModal();
  if (e.target.id === 'registerModal') closeRegisterModal();
});

// Close modals on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLoginModal();
    closeRegisterModal();
  }
});
