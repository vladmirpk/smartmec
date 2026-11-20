/**
 * SMARTMEC Service Motors — Quotation rates configuration
 * --------------------------------------------------------
 * Keep this file as the single source of approved pricing.
 * Leave rates empty / disabled until Smartmec supplies tariffs.
 *
 * When ready, set `enabled: true` and fill labourRates, fees, etc.
 * The quote engine will then produce an INDICATIVE estimate and still
 * mark it clearly as subject to inspection — never as a confirmed quote
 * unless `confirmedQuotes: true` is also set after business approval.
 */
window.SMARTMEC_RATES = {
  enabled: false,
  confirmedQuotes: false,
  currency: "USD",
  currencySymbol: "$",
  vatRate: 0.15,
  vatInclusive: false,
  validityDays: 14,
  labourRates: {
    /* Example structure — do not invent live prices:
    mechanicalHourly: null,
    panelBeatingHourly: null,
    sprayPaintingHourly: null,
    electricalHourly: null,
    hybridDiagnosticsHourly: null
    */
  },
  fees: {
    /* diagnosticFee: null, inspectionFee: null, towingBase: null */
  },
  serviceEstimates: {
    /* Optional indicative ranges keyed by service id, e.g.
    "mechanical-diagnostics": { labourHours: 1, label: "Diagnostics" },
    */
  },
  partsMarkupPercent: null,
  warrantyNotes: [
    "12-month workmanship guarantee on approved mechanical repairs (terms apply).",
    "Paintwork warranty period as confirmed on the final quotation (terms apply)."
  ],
  disclaimer:
    "Any figures shown are indicative only and subject to physical inspection, parts availability and final approval. This is not a confirmed SMARTMEC quotation until issued by the workshop."
};
