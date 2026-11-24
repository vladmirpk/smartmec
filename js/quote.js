/**
 * SMARTMEC quotation engine — runs entirely in the browser on GitHub Pages.
 * Calculator + PDF + drafts + WhatsApp/Formspree/EmailJS delivery. No custom server.
 */
(function () {
  const SERVICES = [
    { id: "mechanical-diagnostics", label: "Mechanical repairs & diagnostics", group: "Mechanical", hint: "Engine, transmission, scanning" },
    { id: "servicing", label: "Vehicle servicing & maintenance", group: "Mechanical", hint: "Scheduled service" },
    { id: "auto-electrical", label: "Auto electrical", group: "Mechanical", hint: "Wiring, batteries, starters" },
    { id: "hybrid", label: "Hybrid vehicle diagnostics", group: "Mechanical", hint: "Hybrid systems" },
    { id: "panel-beating", label: "Panel beating", group: "Autobody", hint: "Body repairs & welding" },
    { id: "chassis", label: "Chassis straightening", group: "Autobody", hint: "Frame alignment" },
    { id: "spray-painting", label: "Spray painting", group: "Autobody", hint: "Refinishing" },
    { id: "suspension-brakes", label: "Suspension, steering & brakes", group: "Additional", hint: "Handling & safety" },
    { id: "polishing", label: "Polishing & appearance", group: "Additional", hint: "Finish restoration" },
    { id: "windscreen", label: "Windscreens & auto trimming", group: "Additional", hint: "Glass & upholstery" },
    { id: "towing", label: "24/7 Towing", group: "Additional", hint: "Recovery assistance" },
    { id: "insurance-claim", label: "Insurance claim assistance", group: "Insurance", hint: "Claims support" }
  ];

  const DRAFT_KEY = "smartmec_quote_draft_v1";

  const state = {
    step: 1,
    data: {},
    ref: "",
    lastText: ""
  };

  const rates = () => window.SMARTMEC_RATES || { enabled: false };

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $all(sel, root) {
    return [...(root || document).querySelectorAll(sel)];
  }

  function newRef() {
    return "SMQ-" + Date.now().toString(36).toUpperCase() + "-" + Math.floor(Math.random() * 900 + 100);
  }

  function readForm() {
    const form = $("#quoteWizard");
    const fd = new FormData(form);
    const get = (k) => (fd.get(k) || "").toString().trim();
    const services = fd.getAll("services").map(String);
    return {
      name: get("name"),
      phone: get("phone"),
      email: get("email"),
      company: get("company"),
      make: get("make"),
      model: get("model"),
      year: get("year"),
      registration: get("registration"),
      vehicleType: get("vehicleType"),
      services,
      serviceLabels: SERVICES.filter((s) => services.includes(s.id)).map((s) => s.label),
      description: get("description"),
      damage: get("damage"),
      contactMethod: get("contactMethod"),
      urgency: get("urgency")
    };
  }

  function validateStep(step) {
    const d = readForm();
    const errors = [];
    if (step === 1) {
      if (!d.name) errors.push("Full name is required.");
      if (!d.phone) errors.push("Telephone number is required.");
      if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) errors.push("Enter a valid email address.");
    }
    if (step === 2) {
      if (!d.make) errors.push("Vehicle make is required.");
      if (!d.model) errors.push("Vehicle model is required.");
      if (!d.vehicleType) errors.push("Select a vehicle type.");
    }
    if (step === 3 && !d.services.length) errors.push("Select at least one service.");
    if (step === 4 && (!d.description || d.description.length < 10)) {
      errors.push("Please describe the problem in a little more detail.");
    }
    return errors;
  }

  function showErrors(errors) {
    const box = $("#stepErrors");
    if (!errors.length) {
      box.hidden = true;
      box.innerHTML = "";
      return;
    }
    box.hidden = false;
    box.innerHTML = `<strong>Please check:</strong><ul>${errors.map((e) => `<li>${e}</li>`).join("")}</ul>`;
  }

  function saveDraft() {
    try {
      const data = readForm();
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ step: state.step, data, savedAt: Date.now() }));
    } catch (_) {
      /* private mode */
    }
  }

  function restoreDraft() {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (!draft || !draft.data) return;
      const form = $("#quoteWizard");
      Object.entries(draft.data).forEach(([key, val]) => {
        if (key === "services" || key === "serviceLabels") return;
        const field = form.elements.namedItem(key);
        if (!field) return;
        if (field instanceof RadioNodeList || (field.length && field[0] && field[0].type === "radio")) {
          form.querySelectorAll(`input[name="${key}"]`).forEach((r) => {
            r.checked = r.value === val;
          });
          return;
        }
        if ("value" in field) field.value = val || "";
      });
      (draft.data.services || []).forEach((id) => {
        const input = form.querySelector(`input[name="services"][value="${id}"]`);
        if (input) input.checked = true;
      });
      if (draft.step) goTo(Math.min(5, Number(draft.step) || 1));
    } catch (_) {
      /* ignore */
    }
  }

  function goTo(step) {
    state.step = step;
    $all(".quote-step-pane").forEach((p) => p.classList.toggle("active", Number(p.dataset.step) === step));
    $all(".quote-steps li").forEach((li) => {
      const n = Number(li.dataset.step);
      li.classList.toggle("active", n === step);
      li.classList.toggle("done", n < step);
    });
    const bar = $("#quoteProgressBar");
    if (bar) bar.style.width = `${(step / 5) * 100}%`;
    const prev = $("#btnPrev");
    const next = $("#btnNext");
    if (prev) prev.style.visibility = step === 1 ? "hidden" : "visible";
    if (next) next.hidden = step === 5;
    showErrors([]);
    if (step === 5) prepareStepFive();
    saveDraft();
    const panel = $(".quote-panel");
    if (panel) window.scrollTo({ top: panel.offsetTop - 90, behavior: "smooth" });
  }

  function setActionStatus(msg) {
    const el = $("#actionStatus");
    if (!el) return;
    if (!msg) {
      el.hidden = true;
      el.textContent = "";
      return;
    }
    el.hidden = false;
    el.textContent = msg;
  }

  function prepareStepFive() {
    if (!state.ref) state.ref = newRef();
    renderSummary();
    const text = buildPlainSummary();
    state.lastText = text;
    const wa = $("#btnWhatsApp");
    if (wa) {
      wa.href = `https://wa.me/${window.SMARTMEC.WHATSAPP}?text=${encodeURIComponent(text)}`;
    }
    const mail = $("#btnEmail");
    if (mail) {
      const subject = encodeURIComponent(`Quotation request ${state.ref} — ${state.data.make} ${state.data.model}`);
      mail.href = `mailto:${window.SMARTMEC.EMAIL}?subject=${subject}&body=${encodeURIComponent(text)}`;
    }
    setActionStatus("");
  }

  function buildEstimate(data) {
    const cfg = rates();
    if (!cfg.enabled) {
      return {
        mode: "request",
        title: "Quotation request — pending inspection",
        lines: [],
        note: "Approved labour rates and tariffs have not been configured. This submission is a request for assessment, not a priced quotation."
      };
    }

    const lines = [];
    let subtotal = 0;
    const estimates = cfg.serviceEstimates || {};
    const labour = cfg.labourRates || {};

    data.services.forEach((id) => {
      const meta = SERVICES.find((s) => s.id === id);
      const est = estimates[id];
      if (!est) {
        lines.push({ item: meta ? meta.label : id, detail: "Subject to inspection", amount: null });
        return;
      }
      let amount = null;
      if (typeof est.fixed === "number") amount = est.fixed;
      else if (typeof est.labourHours === "number" && typeof labour[est.rateKey] === "number") {
        amount = est.labourHours * labour[est.rateKey];
      }
      if (amount != null) subtotal += amount;
      lines.push({
        item: est.label || (meta ? meta.label : id),
        detail: est.detail || (amount != null ? "Indicative labour" : "Subject to inspection"),
        amount
      });
    });

    const fees = cfg.fees || {};
    if (typeof fees.inspectionFee === "number") {
      lines.push({
        item: "Inspection / assessment fee",
        detail: "May be waived against approved work",
        amount: fees.inspectionFee
      });
      subtotal += fees.inspectionFee;
    }

    const vat = cfg.vatInclusive ? 0 : subtotal * (cfg.vatRate || 0);
    return {
      mode: cfg.confirmedQuotes ? "confirmed" : "indicative",
      title: cfg.confirmedQuotes ? "Confirmed quotation" : "Indicative estimate — subject to inspection",
      lines,
      subtotal,
      vat,
      total: subtotal + vat,
      currency: cfg.currencySymbol || "$",
      validityDays: cfg.validityDays || 14,
      note: cfg.disclaimer || "Indicative only. Final pricing confirmed after inspection.",
      warrantyNotes: cfg.warrantyNotes || []
    };
  }

  function formatMoney(amount, symbol) {
    if (amount == null || Number.isNaN(amount)) return "TBA";
    return `${symbol}${Number(amount).toFixed(2)}`;
  }

  function renderSummary() {
    const data = readForm();
    state.data = data;
    if (!state.ref) state.ref = newRef();
    const estimate = buildEstimate(data);
    const cfg = rates();
    const banner = $("#rateBanner");
    banner.className = "rate-banner" + (cfg.enabled ? " ready" : "");
    banner.innerHTML = cfg.enabled
      ? `<strong>Indicative pricing enabled.</strong> Figures use configured rates and remain subject to inspection unless confirmed by SMARTMEC.`
      : `<strong>No approved price list configured.</strong> This is a quotation <em>request</em>. SMARTMEC confirms price after inspection.`;

    const esc = window.SMARTMEC.escapeHtml;
    let estimateHtml = "";
    if (estimate.mode === "request") {
      estimateHtml = `<p class="status-pill pending">Pending inspection</p>
        <p style="margin-top:12px;color:var(--ink-soft)">${esc(estimate.note)}</p>`;
    } else {
      const rows = estimate.lines
        .map(
          (l) =>
            `<tr><td>${esc(l.item)}<br><small style="color:var(--muted)">${esc(l.detail)}</small></td><td style="text-align:right;font-weight:700">${formatMoney(l.amount, estimate.currency)}</td></tr>`
        )
        .join("");
      estimateHtml = `<p class="status-pill">${esc(estimate.title)}</p>
        <table class="estimate-table"><thead><tr><th>Item</th><th style="text-align:right">Amount</th></tr></thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr><td>Subtotal</td><td style="text-align:right;font-weight:700">${formatMoney(estimate.subtotal, estimate.currency)}</td></tr>
          <tr><td>VAT${!cfg.vatInclusive ? ` (${Math.round((cfg.vatRate || 0) * 100)}%)` : " (included)"}</td><td style="text-align:right">${cfg.vatInclusive ? "Included" : formatMoney(estimate.vat, estimate.currency)}</td></tr>
          <tr><td><strong>Estimated total</strong></td><td style="text-align:right;font-weight:800;color:var(--purple-700)">${formatMoney(estimate.total, estimate.currency)}</td></tr>
        </tfoot></table>
        <p style="font-size:12px;color:var(--muted)">Indication ~${estimate.validityDays} days. ${esc(estimate.note)}</p>`;
    }

    $("#summaryBox").innerHTML = `
      <p style="margin:0 0 14px"><span class="status-pill">${esc(state.ref)}</span></p>
      <h4>Customer</h4>
      <dl>
        <dt>Name</dt><dd>${esc(data.name)}</dd>
        <dt>Telephone</dt><dd>${esc(data.phone)}</dd>
        <dt>Email</dt><dd>${esc(data.email || "—")}</dd>
        <dt>Company</dt><dd>${esc(data.company || "—")}</dd>
        <dt>Preferred contact</dt><dd>${esc(data.contactMethod)}</dd>
      </dl>
      <h4>Vehicle</h4>
      <dl>
        <dt>Make / Model</dt><dd>${esc(data.make)} ${esc(data.model)}</dd>
        <dt>Year</dt><dd>${esc(data.year || "—")}</dd>
        <dt>Registration</dt><dd>${esc(data.registration || "—")}</dd>
        <dt>Type</dt><dd>${esc(data.vehicleType)}</dd>
      </dl>
      <h4>Services requested</h4>
      <p style="margin:0 0 14px;font-weight:600">${esc(data.serviceLabels.join(", ") || "—")}</p>
      <h4>Problem / damage</h4>
      <p style="margin:0 0 8px">${esc(data.description)}</p>
      ${data.damage ? `<p style="margin:0 0 18px;color:var(--ink-soft)">${esc(data.damage)}</p>` : `<p style="margin:0 0 18px"></p>`}
      <h4>Quotation status</h4>
      ${estimateHtml}
    `;
  }

  function buildPlainSummary() {
    const data = state.data.name ? state.data : readForm();
    const estimate = buildEstimate(data);
    const cfg = rates();
    const ref = state.ref || newRef();
    state.ref = ref;

    let priceBlock = "STATUS: Quotation request pending workshop inspection. No price confirmed.\n";
    if (estimate.mode !== "request") {
      priceBlock =
        `STATUS: ${estimate.title}\n` +
        estimate.lines
          .map((l) => `  - ${l.item}: ${formatMoney(l.amount, estimate.currency)} (${l.detail})`)
          .join("\n") +
        `\nSubtotal: ${formatMoney(estimate.subtotal, estimate.currency)}\n` +
        `VAT: ${cfg.vatInclusive ? "Included" : formatMoney(estimate.vat, estimate.currency)}\n` +
        `Estimated total: ${formatMoney(estimate.total, estimate.currency)}\n` +
        `Note: ${estimate.note}\n`;
    }

    return `SMARTMEC SERVICE MOTORS — ${estimate.mode === "request" ? "QUOTATION REQUEST" : "INDICATIVE ESTIMATE"}
Reference: ${ref}
Date: ${new Date().toLocaleString()}

CUSTOMER
Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email || "Not provided"}
Company: ${data.company || "Not provided"}
Preferred contact: ${data.contactMethod}
Urgency: ${data.urgency || "Normal"}

VEHICLE
Make: ${data.make}
Model: ${data.model}
Year: ${data.year || "Not provided"}
Registration: ${data.registration || "Not provided"}
Type: ${data.vehicleType}

SERVICES
${data.serviceLabels.map((s) => `- ${s}`).join("\n")}

PROBLEM / DAMAGE
${data.description}
${data.damage ? `\nAdditional damage notes:\n${data.damage}` : ""}

${priceBlock}
Address: ${window.SMARTMEC.ADDRESS}
Phone: ${window.SMARTMEC.PHONE_DISPLAY}
Email: ${window.SMARTMEC.EMAIL}
`;
  }

  function downloadPdf() {
    const JsPDF = window.jspdf && window.jspdf.jsPDF;
    if (!JsPDF) {
      printSummary();
      return;
    }
    const data = state.data.name ? state.data : readForm();
    const estimate = buildEstimate(data);
    const cfg = rates();
    const doc = new JsPDF({ unit: "mm", format: "a4" });
    const purple = [75, 20, 105];
    let y = 18;

    doc.setFillColor(...purple);
    doc.rect(0, 0, 210, 28, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("SMARTMEC SERVICE MOTORS", 14, 14);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Where precision meets passion", 14, 21);

    y = 38;
    doc.setTextColor(23, 21, 34);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(estimate.mode === "request" ? "Quotation Request" : "Indicative Estimate", 14, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    doc.text(`Reference: ${state.ref || "—"}   ·   ${new Date().toLocaleString()}`, 14, y);
    y += 10;

    function block(title, lines) {
      doc.setTextColor(...purple);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(title, 14, y);
      y += 6;
      doc.setTextColor(40, 40, 40);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      lines.forEach((line) => {
        const wrapped = doc.splitTextToSize(line, 180);
        doc.text(wrapped, 14, y);
        y += wrapped.length * 5;
        if (y > 275) {
          doc.addPage();
          y = 20;
        }
      });
      y += 4;
    }

    block("Customer", [
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      `Email: ${data.email || "—"}`,
      `Company: ${data.company || "—"}`,
      `Preferred contact: ${data.contactMethod}`
    ]);
    block("Vehicle", [
      `${data.make} ${data.model}`,
      `Year: ${data.year || "—"}  ·  Reg: ${data.registration || "—"}`,
      `Type: ${data.vehicleType}`
    ]);
    block("Services", data.serviceLabels.map((s) => `• ${s}`));
    block("Problem / damage", [data.description, data.damage || ""].filter(Boolean));

    if (estimate.mode !== "request") {
      block(
        "Indicative pricing",
        estimate.lines
          .map((l) => `${l.item}: ${formatMoney(l.amount, estimate.currency)} (${l.detail})`)
          .concat([
            `Subtotal: ${formatMoney(estimate.subtotal, estimate.currency)}`,
            `VAT: ${cfg.vatInclusive ? "Included" : formatMoney(estimate.vat, estimate.currency)}`,
            `Estimated total: ${formatMoney(estimate.total, estimate.currency)}`
          ])
      );
    } else {
      block("Status", ["Pending workshop inspection — no price confirmed."]);
    }

    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    const foot = doc.splitTextToSize(
      (estimate.note || "") +
        "  |  " +
        window.SMARTMEC.ADDRESS +
        "  |  " +
        window.SMARTMEC.PHONE_DISPLAY,
      180
    );
    doc.text(foot, 14, 285);

    doc.save(`SMARTMEC-${state.ref || "quote"}.pdf`);
  }

  function printSummary() {
    const text = state.lastText || buildPlainSummary();
    const esc = window.SMARTMEC.escapeHtml;
    const w = window.open("", "_blank");
    if (!w) {
      alert("Please allow pop-ups to print the summary.");
      return;
    }
    w.document.write(`<!DOCTYPE html><html><head><title>SMARTMEC ${esc(state.ref || "Request")}</title>
      <style>
        body{font:14px/1.5 "DM Sans",Arial,sans-serif;color:#171522;padding:40px;max-width:720px;margin:auto}
        h1{font:600 28px Oswald,sans-serif;color:#4b1469;margin:0 0 4px}
        .sub{color:#5e5965;font-size:12px;margin-bottom:24px}
        pre{white-space:pre-wrap;background:#f7f4f9;padding:20px;border-left:4px solid #70269b;font:13px/1.5 Consolas,monospace}
      </style></head><body>
      <h1>SMARTMEC SERVICE MOTORS</h1>
      <div class="sub">Preliminary summary · Not a confirmed invoice · ${esc(state.ref || "")}</div>
      <pre>${esc(text)}</pre>
      <script>window.onload=()=>window.print()<\/script>
      </body></html>`);
    w.document.close();
  }

  function bindActionButtons() {
    const pdfBtn = $("#btnPdf");
    if (pdfBtn) {
      pdfBtn.addEventListener("click", (e) => {
        e.preventDefault();
        try {
          if (!state.lastText) prepareStepFive();
          downloadPdf();
          setActionStatus("PDF downloaded.");
        } catch (err) {
          console.error(err);
          printSummary();
        }
      });
    }

    const printBtn = $("#btnPrint");
    if (printBtn) {
      printBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (!state.lastText) prepareStepFive();
        printSummary();
      });
    }

    const copyBtn = $("#btnCopy");
    if (copyBtn) {
      copyBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        if (!state.lastText) prepareStepFive();
        const text = state.lastText || buildPlainSummary();
        try {
          await navigator.clipboard.writeText(text);
          copyBtn.textContent = "Copied!";
          setActionStatus("Summary copied.");
          setTimeout(() => {
            copyBtn.textContent = "Copy summary";
          }, 1600);
        } catch {
          setActionStatus("Copy not available in this browser — use WhatsApp or PDF instead.");
        }
      });
    }

    const wa = $("#btnWhatsApp");
    if (wa) {
      wa.addEventListener("click", () => {
        if (!state.lastText) prepareStepFive();
        else {
          wa.href = `https://wa.me/${window.SMARTMEC.WHATSAPP}?text=${encodeURIComponent(state.lastText)}`;
        }
      });
    }

    const mail = $("#btnEmail");
    if (mail) {
      mail.addEventListener("click", () => {
        if (!state.lastText) prepareStepFive();
      });
    }
  }

  function renderServiceChecks() {
    const wrap = $("#serviceChecks");
    wrap.innerHTML = SERVICES.map(
      (s) => `<label class="service-check">
        <input type="checkbox" name="services" value="${s.id}">
        <span><b>${s.label}</b><span>${s.group} · ${s.hint}</span></span>
      </label>`
    ).join("");

    const params = new URLSearchParams(location.search);
    const pre = params.get("service");
    if (pre) {
      const match = SERVICES.find((s) => s.id === pre || s.label.toLowerCase() === pre.toLowerCase());
      if (match) {
        const input = wrap.querySelector(`input[value="${match.id}"]`);
        if (input) input.checked = true;
      }
    }
  }

  function init() {
    if (!$("#quoteWizard")) return;
    renderServiceChecks();
    bindActionButtons();
    goTo(1);
    restoreDraft();

    $("#quoteWizard").addEventListener("submit", (e) => e.preventDefault());
    $("#quoteWizard").addEventListener("change", saveDraft);
    $("#quoteWizard").addEventListener("input", () => {
      clearTimeout(init._t);
      init._t = setTimeout(saveDraft, 400);
    });

    $("#btnNext").addEventListener("click", () => {
      const errors = validateStep(state.step);
      if (errors.length) {
        showErrors(errors);
        return;
      }
      goTo(Math.min(5, state.step + 1));
    });

    $("#btnPrev").addEventListener("click", () => goTo(Math.max(1, state.step - 1)));

    $all(".quote-steps li").forEach((li) => {
      li.style.cursor = "pointer";
      li.addEventListener("click", () => {
        const target = Number(li.dataset.step);
        if (target < state.step) goTo(target);
        else {
          for (let s = state.step; s < target; s++) {
            const errs = validateStep(s);
            if (errs.length) {
              showErrors(errs);
              goTo(s);
              return;
            }
          }
          goTo(target);
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
