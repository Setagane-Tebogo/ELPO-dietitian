# NourishWell Nutrition — Website Files

## 📁 File Structure

```
nourishwell/
│
├── index.html              ← Main file — open this in a browser
│
├── css/
│   ├── styles.css          ← Global styles: colours, fonts, nav, footer, modal, forms
│   ├── home.css            ← Home page sections only (hero, services strip, steps, testimonials)
│   └── pages.css           ← About, Services, Blog, Resources & Contact page styles
│
├── js/
│   └── main.js             ← All interactivity: page switching, booking modal, form handling
│
└── pages/
    ├── _shared.html        ← Reference snippets: nav, footer, modal (for copy-paste reference)
    ├── home.html           ← Home page content reference
    ├── about.html          ← About page content reference
    ├── services.html       ← Services & pricing content reference
    ├── blog.html           ← Blog articles content reference
    ├── resources.html      ← Resources & downloads content reference
    └── contact.html        ← Contact form content reference
```

> **Note:** The `pages/` folder contains reference copies of each page's content with
> helpful comments. The actual live content is inside `index.html`. When you want to
> update a page, edit it inside `index.html` using the pages/ files as a guide.

---

## ✏️ How to Update Common Things

### Change the business name
Search for `NourishWell` in `index.html` and replace with your name.

### Change brand colours
Open `css/styles.css` and edit the `:root` variables at the top of the file.
```css
:root {
  --green-deep: #1a3a2a;   /* ← Change this to your primary colour */
  --accent:     #c8a96e;   /* ← Change this to your accent colour */
}
```

### Add your photo
Replace the placeholder `<div>` blocks with:
```html
<img src="images/your-photo.jpg" style="width:100%;height:100%;object-fit:cover">
```
Create an `images/` folder and put your photo there.

### Update contact details
Search for `hello@nourishwell.co.za` and `+27 00 000 0000` in `index.html`.

### Update prices
Search for `R850`, `R550`, `R3500`, `R2100` in `index.html` and replace.

### Add/edit testimonials
Find the `testimonials-section` in `index.html` and edit the `.testimonial-card` blocks.

### Add a blog post
Copy one of the `.blog-card` blocks in the blog section of `index.html` and fill in your new article details.

### Connect the booking form
Open `js/main.js` and follow the TODO comments to connect to Formspree, Netlify Forms,
or your own backend.

### Change fonts
1. Update the Google Fonts `<link>` in the `<head>` of `index.html`
2. Update `font-family` values in `css/styles.css`

---

## 🚀 Going Live

To publish this website:
1. Upload all files to a web host (Netlify, Vercel, or any shared hosting)
2. Make sure the folder structure is preserved
3. Your domain should point to `index.html`

Free hosting options: **Netlify** (drag & drop the folder) or **GitHub Pages**.
