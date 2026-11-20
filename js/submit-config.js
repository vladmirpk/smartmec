/**
 * Delivery channels for quotation requests (GitHub Pages compatible).
 * No custom server required. Enable one email channel when ready.
 *
 * Option A — Formspree (recommended for Gmail inbox):
 *   1. Sign up at https://formspree.io
 *   2. Create a form → copy the form ID
 *   3. Set provider: "formspree" and formId below
 *
 * Option B — EmailJS:
 *   1. https://www.emailjs.com → create service + template
 *   2. Set provider: "emailjs" and fill publicKey / serviceId / templateId
 *
 * WhatsApp + PDF download always work with zero signup.
 */
window.SMARTMEC_SUBMIT = {
  provider: "none", // "none" | "formspree" | "emailjs"
  toEmail: "smartmecmotors@gmail.com",
  formspree: {
    formId: "" // e.g. "xpwgkqyz"
  },
  emailjs: {
    publicKey: "",
    serviceId: "",
    templateId: ""
  }
};
