/* =============================================
   ELPO Dietitian — main.js
   =============================================
   All site interactivity lives here:
   - Page navigation (SPA routing)
   - Active nav link state
   - Booking modal open/close
   - Form submission handlers
   ============================================= */

/* ── Mobile Navigation ─────────────────────── */
function toggleMobileNav() {
  document.getElementById('nav-links').classList.toggle('mobile-open');
  document.getElementById('nav-hamburger').classList.toggle('open');
}

function closeMobileNav() {
  document.getElementById('nav-links').classList.remove('mobile-open');
  document.getElementById('nav-hamburger').classList.remove('open');
}

/* ── Page Navigation ─────────────────────────
   Switches visible page, updates active nav
   link, updates document title.
   ─────────────────────────────────────────── */
const PAGE_TITLES = {
  home:      'ELPO Dietitian | Registered Dietitian',
  about:     'About | ELPO Dietitian',
  services:  'Services | ELPO Dietitian',
  blog:      'Blog | ELPO Dietitian',
  resources: 'Resources | ELPO Dietitian',
  contact:   'Book a Consult | ELPO Dietitian',
};

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + name);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('nav-active'));
  const activeLink = document.querySelector(`.nav-links a[data-page="${name}"]`);
  if (activeLink) activeLink.classList.add('nav-active');

  if (PAGE_TITLES[name]) document.title = PAGE_TITLES[name];
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Booking Modal ───────────────────────────── */
function openBooking() {
  document.getElementById('modal-overlay').classList.add('open');
  document.getElementById('modal-form').style.display = 'block';
  document.getElementById('modal-success').style.display = 'none';
  document.body.style.overflow = 'hidden';
}

function closeBooking() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function closeBookingIfOutside(e) {
  if (e.target === document.getElementById('modal-overlay')) closeBooking();
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeBooking(); });

/* ── Formspree Configuration ─────────────────
   Replace with your Formspree form ID.
   Sign up free at https://formspree.io
   ─────────────────────────────────────────── */
const FORMSPREE_ID = 'xojpvebz';

async function sendToFormspree(formEl, submitBtn, onSuccess) {
  const data = new FormData();
  formEl.querySelectorAll('[name]').forEach(el => {
    if (el.value.trim()) data.append(el.name, el.value.trim());
  });

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  try {
    const res = await fetch('https://formspree.io/f/' + FORMSPREE_ID, {
      method: 'POST', body: data,
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      onSuccess();
    } else {
      const json = await res.json();
      const msg = json.errors ? json.errors.map(e => e.message).join(', ') : 'Submission failed.';
      alert('Sorry, something went wrong: ' + msg);
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtn.dataset.label;
    }
  } catch {
    alert('Network error — please check your connection and try again.');
    submitBtn.disabled = false;
    submitBtn.textContent = submitBtn.dataset.label;
  }
}

function submitModal() {
  const formEl = document.getElementById('modal-form');
  const btn = formEl.querySelector('.form-submit');
  btn.dataset.label = btn.textContent;
  sendToFormspree(formEl, btn, () => {
    formEl.style.display = 'none';
    document.getElementById('modal-success').style.display = 'block';
  });
}

function submitForm() {
  const formEl = document.getElementById('booking-form');
  const btn = formEl.querySelector('.form-submit');
  btn.dataset.label = btn.textContent;
  sendToFormspree(formEl, btn, () => {
    formEl.style.display = 'none';
    document.getElementById('success-msg').style.display = 'block';
  });
}

/* ── Init ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  const navPageMap = {
    'Home': 'home', 'About': 'about', 'Services': 'services',
    'Blog': 'blog', 'Resources': 'resources', 'Book a Consult': 'contact',
  };
  document.querySelectorAll('.nav-links a').forEach(a => {
    const label = a.textContent.trim();
    if (navPageMap[label]) a.setAttribute('data-page', navPageMap[label]);
  });
  const homeLink = document.querySelector('.nav-links a[data-page="home"]');
  if (homeLink) homeLink.classList.add('nav-active');
});
