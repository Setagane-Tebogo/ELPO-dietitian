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

function getContactPagePath() {
  const path = window.location.pathname;
  const base = path.includes('/pages/')
    ? path.substring(0, path.lastIndexOf('/') + 1)
    : path.substring(0, path.lastIndexOf('/') + 1) + 'pages/';
  return base + 'contact.html';
}

function setServiceSelectionLock(serviceSelect, formEl, lockedValue) {
  if (!serviceSelect) return;

  const hiddenServiceInput = formEl
    ? formEl.querySelector('input[type="hidden"][name="service"][data-locked-service]')
    : null;

  if (lockedValue) {
    serviceSelect.disabled = true;
    serviceSelect.setAttribute('aria-disabled', 'true');
    serviceSelect.classList.add('service-locked');
    serviceSelect.title = 'This service is fixed for your selected special package.';
    serviceSelect.removeAttribute('name');

    if (hiddenServiceInput) {
      hiddenServiceInput.value = lockedValue;
    } else {
      const hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.name = 'service';
      hiddenInput.value = lockedValue;
      hiddenInput.dataset.lockedService = 'true';
      formEl.appendChild(hiddenInput);
    }
  } else {
    serviceSelect.disabled = false;
    serviceSelect.removeAttribute('aria-disabled');
    serviceSelect.classList.remove('service-locked');
    serviceSelect.title = '';
    serviceSelect.setAttribute('name', 'service');

    if (hiddenServiceInput) {
      hiddenServiceInput.remove();
    }
  }
}

function fillBookingFormFromQuery() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  const url = new URL(window.location.href);
  const q = url.searchParams;
  const serviceSelect = form.querySelector('[name="service"]');
  const packageInput = document.getElementById('preferred-package');
  const messageInput = form.querySelector('[name="message"]');

  const desiredService = q.get('service') || q.get('category');
  const isSpecialBooking = (q.get('category') || '').toUpperCase().startsWith('SPECIALS');
  const packageName = q.get('package') || '';
  const packagePrice = q.get('price') || '';

  if (serviceSelect) {
    if (isSpecialBooking) {
      const specialValue = `SPECIAL SERVICE: ${packageName} - PRICE = ${packagePrice}`;
      let specialOption = Array.from(serviceSelect.options).find(o => o.value === specialValue);
      if (!specialOption) {
        specialOption = document.createElement('option');
        specialOption.value = specialValue;
        specialOption.textContent = specialValue;
        serviceSelect.prepend(specialOption);
      }
      serviceSelect.value = specialValue;
      setServiceSelectionLock(serviceSelect, form, specialValue);
    } else if (desiredService) {
      let option = Array.from(serviceSelect.options).find(o => o.value === desiredService || o.textContent.trim() === desiredService);
      if (!option) {
        option = document.createElement('option');
        option.value = desiredService;
        option.textContent = desiredService;
        option.selected = true;
        serviceSelect.prepend(option);
      }
      serviceSelect.value = option.value;
      setServiceSelectionLock(serviceSelect, form, null);
    } else {
      setServiceSelectionLock(serviceSelect, form, null);
    }
  }

  if (q.get('package') && packageInput) packageInput.value = q.get('package');
  if (q.get('price')) {
    const priceInput = document.getElementById('preferred-price');
    if (priceInput) priceInput.value = q.get('price');
  }

  if (q.get('message') && messageInput) messageInput.value = q.get('message');
}

function openBookingForm(opts = {}) {
  const params = new URLSearchParams();
  if (opts.category) params.set('category', opts.category);
  if (opts.service) params.set('service', opts.service);
  if (opts.package) params.set('package', opts.package);
  if (opts.price) params.set('price', opts.price);
  if (opts.message) params.set('message', opts.message);

  const contactPage = getContactPagePath();
  const query = params.toString();
  const target = contactPage + (query ? `?${query}` : '') + '#booking-form';

  if (window.location.pathname.endsWith('/contact.html') || window.location.pathname.includes('/pages/contact.html')) {
    if (query) {
      window.history.replaceState(null, '', target);
    }
    fillBookingFormFromQuery();
    const form = document.getElementById('booking-form');
    if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  window.location.href = target;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('/contact.html') || window.location.pathname.includes('/pages/contact.html')) {
      fillBookingFormFromQuery();
    }
  });
} else if (window.location.pathname.endsWith('/contact.html') || window.location.pathname.includes('/pages/contact.html')) {
  fillBookingFormFromQuery();
}

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

/* ── Contact Options Modal ───────────────────
   Shows two simple choices when user clicks "Contact Me":
   - Open email client (mailto:)
   - Open WhatsApp chat (wa.me)
──────────────────────────────────────────── */
function showContactOptions(opts = {}) {
  // opts: { email, phone, message }
  const email = (opts.email || 'elpodietitians@gmail.com').trim();
  const phone = (opts.phone || '+27786862287').replace(/\D/g,'');
  const message = encodeURIComponent(opts.message || 'Hello, I would like to enquire about your services.');

  // create overlay if missing
  let overlay = document.getElementById('contact-options-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'contact-options-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.45);z-index:1000;';
    overlay.innerHTML = `
      <div style="width:320px;max-width:94%;background:white;border-radius:12px;padding:18px;box-shadow:0 12px 40px rgba(0,0,0,0.25);">
        <h3 style="margin:0 0 8px;font-family:inherit">Contact options</h3>
        <p style="margin:0 0 12px;color:#333">Choose how you'd like to get in touch.</p>
        <div style="display:flex;gap:10px;flex-direction:column;">
          <a id="contact-email-btn" href="mailto:${email}?subject=Service%20Enquiry&body=${message}" style="text-decoration:none;" class="btn-primary">Send an email</a>
          <a id="contact-whatsapp-btn" href="https://wa.me/${phone}?text=${message}" target="_blank" rel="noopener" class="btn-secondary" style="text-align:center;">Contact on WhatsApp</a>
        </div>
        <button id="contact-options-close" style="margin-top:12px;background:transparent;border:none;color:#666;display:block;margin-left:auto;">Close</button>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeContactOptions();
    });
    document.getElementById('contact-options-close').addEventListener('click', closeContactOptions);
    document.addEventListener('keydown', function escHandler(e){ if (e.key==='Escape') closeContactOptions(); }, { once:false });
  } else {
    // update links
    const emailBtn = document.getElementById('contact-email-btn');
    const waBtn = document.getElementById('contact-whatsapp-btn');
    if (emailBtn) emailBtn.href = `mailto:${email}?subject=Service%20Enquiry&body=${message}`;
    if (waBtn) waBtn.href = `https://wa.me/${phone}?text=${message}`;
  }
  overlay.style.display = 'flex';
}

function closeContactOptions() {
  const overlay = document.getElementById('contact-options-overlay');
  if (overlay) overlay.style.display = 'none';
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

  if (document.getElementById('booking-form')) {
    fillBookingFormFromQuery();
  }
});
