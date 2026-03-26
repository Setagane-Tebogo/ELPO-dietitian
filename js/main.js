/* =============================================
   NourishWell Nutrition — main.js
   =============================================
   All site interactivity lives here:
   - Page navigation
   - Booking modal open/close
   - Form submission handlers
   ============================================= */

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

/* ── Form Submissions ────────────────────────
   Replace these functions with real form
   submission logic (e.g. fetch to an API or
   a service like Formspree / Netlify Forms).
   ─────────────────────────────────────────── */

/* Modal booking form */
function submitModal() {
  document.getElementById('modal-form').style.display = 'none';
  document.getElementById('modal-success').style.display = 'block';

  /* TODO: Send form data to your backend or email service here.
     Example with Formspree:
     const data = new FormData(document.getElementById('modal-form'));
     fetch('https://formspree.io/f/YOUR_ID', { method: 'POST', body: data });
  */
}

/* Full contact page booking form */
function submitForm() {
  document.getElementById('booking-form').style.display = 'none';
  document.getElementById('success-msg').style.display = 'block';

  /* TODO: Send form data here. Same as above. */
}
