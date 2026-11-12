// ============================================================
//  INSTÄLLNINGAR – ändra här
// ============================================================
const CONFIG = {
  // Dit bokningsförfrågningar skickas (öppnas i besökarens e-postprogram)
  email: "info@jotal.se",

  // Telefonnummer: visning och internationellt format för tel:-länken
  phoneDisplay: "070-000 00 00",
  phoneLink: "+46700000000",

  // Om du börjar använda ett bokningssystem (t.ex. Bokadirekt, Timma, Calendly),
  // klistra in länken här så visas en "Öppna bokningen"-knapp. Lämna tomt annars.
  externalBookingUrl: "",

  // Öppettider per veckodag (0 = söndag ... 6 = lördag). null = stängt.
  openingHours: {
    0: null,
    1: { from: "08:00", to: "18:00" },
    2: { from: "08:00", to: "18:00" },
    3: { from: "08:00", to: "18:00" },
    4: { from: "08:00", to: "18:00" },
    5: { from: "08:00", to: "16:00" },
    6: null,
  },

  // Längd på ett behandlingspass i minuter
  slotMinutes: 45,

  // Hur långt fram man kan önska tid (dagar)
  maxDaysAhead: 60,
};

// ============================================================

(function () {
  document.getElementById("year").textContent = new Date().getFullYear();

  // Kontaktuppgifter
  const emailLink = document.getElementById("contact-email");
  emailLink.href = "mailto:" + CONFIG.email;
  emailLink.textContent = CONFIG.email;
  const phoneLink = document.getElementById("contact-phone");
  phoneLink.href = "tel:" + CONFIG.phoneLink;
  phoneLink.textContent = CONFIG.phoneDisplay;

  // Externt bokningssystem
  if (CONFIG.externalBookingUrl) {
    document.getElementById("external-booking").hidden = false;
    document.getElementById("external-booking-link").href = CONFIG.externalBookingUrl;
  }

  const form = document.getElementById("booking-form");
  const dateInput = form.elements.date;
  const timeSelect = form.elements.time;
  const errorBox = document.getElementById("form-error");

  // Datumgränser: från i morgon, max N dagar fram
  const toIsoDate = (d) => {
    const z = (n) => String(n).padStart(2, "0");
    return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate());
  };
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const last = new Date();
  last.setDate(last.getDate() + CONFIG.maxDaysAhead);
  dateInput.min = toIsoDate(tomorrow);
  dateInput.max = toIsoDate(last);

  const toMinutes = (hhmm) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  };
  const fromMinutes = (min) =>
    String(Math.floor(min / 60)).padStart(2, "0") + ":" + String(min % 60).padStart(2, "0");

  function fillTimes() {
    timeSelect.innerHTML = "";
    const placeholder = new Option("Välj tid…", "");
    timeSelect.add(placeholder);

    if (!dateInput.value) return;
    const day = new Date(dateInput.value + "T12:00:00").getDay();
    const hours = CONFIG.openingHours[day];

    if (!hours) {
      placeholder.textContent = "Stängt denna dag";
      timeSelect.disabled = true;
      return;
    }
    timeSelect.disabled = false;
    const end = toMinutes(hours.to);
    for (let t = toMinutes(hours.from); t + CONFIG.slotMinutes <= end; t += CONFIG.slotMinutes) {
      const label = fromMinutes(t);
      timeSelect.add(new Option(label, label));
    }
  }
  dateInput.addEventListener("change", fillTimes);
  fillTimes();

  // Ta bort felmarkering när fältet rättats
  const clearInvalid = (e) => {
    if (e.target.getAttribute("aria-invalid") === "true" && e.target.checkValidity()) {
      e.target.setAttribute("aria-invalid", "false");
    }
  };
  form.addEventListener("input", clearInvalid);
  form.addEventListener("change", clearInvalid);

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.hidden = !msg;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    showError("");

    let firstInvalid = null;
    for (const el of form.elements) {
      if (!el.name) continue;
      const ok = el.checkValidity();
      el.setAttribute("aria-invalid", ok ? "false" : "true");
      if (!ok && !firstInvalid) firstInvalid = el;
    }
    if (timeSelect.disabled) {
      showError("Vi har stängt den dagen – välj ett annat datum.");
      dateInput.focus();
      return;
    }
    if (firstInvalid) {
      showError("Fyll i de markerade fälten.");
      firstInvalid.focus();
      return;
    }

    const f = form.elements;
    const subject = "Bokningsförfrågan: " + f.treatment.value + " " + f.date.value + " " + f.time.value;
    const body = [
      "Behandling: " + f.treatment.value,
      "Önskad tid: " + f.date.value + " kl. " + f.time.value,
      "",
      "Namn: " + f.name.value,
      "E-post: " + f.email.value,
      "Telefon: " + (f.phone.value || "-"),
      "",
      "Meddelande:",
      f.message.value || "-",
    ].join("\n");

    window.location.href =
      "mailto:" + CONFIG.email +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  });
})();
