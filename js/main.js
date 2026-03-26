/* =============================================
   NourishWell Nutrition — main.js
   =============================================
   All site interactivity lives here:
   - Page navigation
   - Booking modal open/close
   - Form submission handlers
   ============================================= */

/* ── Mobile Navigation ───────────────────────
   Hamburger menu toggle for small screens.
   ─────────────────────────────────────────── */
function toggleMobileNav() {
  const links = document.getElementById('nav-links');
  const btn = document.getElementById('nav-hamburger');
  links.classList.toggle('mobile-open');
  btn.classList.toggle('open');
}

function closeMobileNav() {
  const links = document.getElementById('nav-links');
  const btn = document.getElementById('nav-hamburger');
  links.classList.remove('mobile-open');
  btn.classList.remove('open');
}

/* ── Page Navigation ─────────────────────────
   Call showPage('home'), showPage('about') etc.
   to switch between pages.
   ─────────────────────────────────────────── */
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  window.scrollTo(0, 0);
}

/* ── Booking Modal ───────────────────────────
   Opens/closes the floating booking popup.
   ─────────────────────────────────────────── */
function openBooking() {
  document.getElementById('modal-overlay').classList.add('open');
  document.getElementById('modal-form').style.display = 'block';
  document.getElementById('modal-success').style.display = 'none';
}

function closeBooking() {
  document.getElementById('modal-overlay').classList.remove('open');
}

/* Close modal when clicking outside the modal box */
function closeBookingIfOutside(e) {
  if (e.target === document.getElementById('modal-overlay')) {
    closeBooking();
  }
}

/* ── Formspree Configuration ─────────────────
   Sign up at https://formspree.io, create a
   new form, and paste your form ID below.
   It looks like: xyzabcde (8 characters).
   ─────────────────────────────────────────── */
const FORMSPREE_ID = 'xojpvebz'; // ← Replace this

/* ── Shared Formspree submit helper ──────────
   Collects all named inputs from a container,
   posts to Formspree, then shows success or
   an error message if something goes wrong.
   ─────────────────────────────────────────── */
async function sendToFormspree(formEl, submitBtn, onSuccess) {
  const data = new FormData();
  formEl.querySelectorAll('[name]').forEach(el => {
    if (el.value.trim()) data.append(el.name, el.value.trim());
  });

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  try {
    const res = await fetch('https://formspree.io/f/' + FORMSPREE_ID, {
      method: 'POST',
      body: data,
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

/* ── Modal booking form ───────────────────── */
function submitModal() {
  const formEl = document.getElementById('modal-form');
  const btn = formEl.querySelector('.form-submit');
  btn.dataset.label = btn.textContent;

  sendToFormspree(formEl, btn, () => {
    formEl.style.display = 'none';
    document.getElementById('modal-success').style.display = 'block';
  });
}

/* ── Contact page booking form ───────────── */
function submitForm() {
  const formEl = document.getElementById('booking-form');
  const btn = formEl.querySelector('.form-submit');
  btn.dataset.label = btn.textContent;

  sendToFormspree(formEl, btn, () => {
    formEl.style.display = 'none';
    document.getElementById('success-msg').style.display = 'block';
  });
}
