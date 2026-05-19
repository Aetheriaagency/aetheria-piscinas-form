/* ─────────────────────────────────────────────
   AETHERIA — Piscinas form · script.js
   Tabs · localStorage save · validation · submit
   ───────────────────────────────────────────── */

const POOLS = [
  { id: "lebrija", label: "Lebrija" },
  { id: "utera", label: "Utera" },
  { id: "sanmartin", label: "San Martín de Valdeiglesias" },
  { id: "jerez", label: "Jerez (DESBORDANTE)" },
  { id: "rota", label: "Rota" },
];

const STORAGE_KEY = "aetheria-piscinas-form-v1";

const $poolSections = document.getElementById("poolSections");
const $tabs = document.querySelectorAll(".pool-tab");
const $form = document.getElementById("poolForm");
const $saveBtn = document.getElementById("saveDraft");
const $autosaveStatus = document.getElementById("autosave-status");
const $template = document.getElementById("poolSectionTemplate");

// ─────────────────────────────────────────────
// 1. RENDER pool sections from template
// ─────────────────────────────────────────────
function renderPoolSections() {
  POOLS.forEach((pool, idx) => {
    const frag = $template.content.cloneNode(true);
    const section = frag.querySelector(".pool-section");
    section.dataset.pool = pool.id;
    if (idx === 0) section.classList.add("active");

    // Rename input names: POOL__field → lebrija__field
    section.querySelectorAll("[name]").forEach((el) => {
      el.name = el.name.replace(/^POOL__/, `${pool.id}__`);
    });
    // Rename ids
    section.querySelectorAll("[id]").forEach((el) => {
      const oldId = el.id;
      const newId = oldId.replace(/^POOL__/, `${pool.id}__`);
      el.id = newId;
      // Update related labels
      section.querySelectorAll(`label[for="${oldId}"]`).forEach((lbl) => {
        lbl.setAttribute("for", newId);
      });
    });
    // Inject pool-name header at top
    const head = document.createElement("div");
    head.className = "pool-name-banner";
    head.innerHTML = `
      <h2 style="
        font-size: 22px;
        background: var(--grad-brand);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0 0 var(--space-3);
        padding-bottom: var(--space-3);
        border-bottom: 1px solid var(--border);
      ">${pool.label}</h2>
    `;
    section.prepend(head);

    $poolSections.appendChild(section);
  });
}
renderPoolSections();

// ─────────────────────────────────────────────
// 2. TAB SWITCHING
// ─────────────────────────────────────────────
$tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const poolId = tab.dataset.pool;
    $tabs.forEach((t) => {
      t.classList.toggle("active", t === tab);
      t.setAttribute("aria-selected", t === tab ? "true" : "false");
    });
    document.querySelectorAll(".pool-section").forEach((s) => {
      s.classList.toggle("active", s.dataset.pool === poolId);
    });
    // Scroll to top of form
    document.querySelector(".pool-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ─────────────────────────────────────────────
// 3. LOCAL STORAGE — save / load
// ─────────────────────────────────────────────
function saveFormState() {
  const data = {};
  $form.querySelectorAll("input, textarea, select").forEach((el) => {
    if (el.type === "file") return; // can't store files
    if (el.type === "radio" || el.type === "checkbox") {
      if (el.checked) data[el.name] = el.value;
    } else {
      if (el.value) data[el.name] = el.value;
    }
  });
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, ts: Date.now() }));
    showAutosaveStatus("✓ Guardado automáticamente");
  } catch (err) {
    showAutosaveStatus("⚠️ Error al guardar local");
  }
  updateTabCompletion();
}
function loadFormState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const { data } = JSON.parse(raw);
    Object.entries(data).forEach(([name, value]) => {
      const el = $form.querySelector(`[name="${CSS.escape(name)}"]`);
      if (!el) {
        // For radios with same name, set the right one
        const radios = $form.querySelectorAll(`input[type="radio"][name="${CSS.escape(name)}"]`);
        radios.forEach((r) => { if (r.value === value) r.checked = true; });
        return;
      }
      if (el.type === "radio" || el.type === "checkbox") {
        el.checked = el.value === value;
      } else {
        el.value = value;
      }
    });
    showAutosaveStatus("✓ Borrador anterior cargado");
    updateTabCompletion();
  } catch (err) {
    console.warn("Could not load state:", err);
  }
}
function showAutosaveStatus(msg) {
  $autosaveStatus.textContent = msg;
  $autosaveStatus.style.transition = "opacity 0.3s ease";
  $autosaveStatus.style.opacity = "1";
  clearTimeout(showAutosaveStatus._t);
  showAutosaveStatus._t = setTimeout(() => {
    $autosaveStatus.textContent = "Guardado automático activado";
  }, 2500);
}

// ─────────────────────────────────────────────
// 4. UPDATE TAB COMPLETION (✓ visible)
// ─────────────────────────────────────────────
function updateTabCompletion() {
  POOLS.forEach((pool) => {
    const section = document.querySelector(`.pool-section[data-pool="${pool.id}"]`);
    if (!section) return;
    const inputs = section.querySelectorAll("input, textarea, select");
    let filled = 0, total = 0;
    inputs.forEach((el) => {
      if (el.type === "file" || el.type === "hidden") return;
      total++;
      if (el.type === "radio" || el.type === "checkbox") {
        if (el.checked) filled++;
      } else if (el.value && el.value.trim() !== "") {
        filled++;
      }
    });
    // For radios, count groups (deduplicate by name)
    const tab = document.querySelector(`.pool-tab[data-pool="${pool.id}"]`);
    if (!tab) return;
    let mark = tab.querySelector(".completion");
    if (!mark) {
      mark = document.createElement("span");
      mark.className = "completion";
      tab.appendChild(mark);
    }
    if (filled === 0) mark.textContent = "";
    else if (filled < total * 0.3) mark.textContent = "◔";
    else if (filled < total * 0.7) mark.textContent = "◑";
    else if (filled < total) mark.textContent = "◕";
    else mark.textContent = "✓";
  });
}

// ─────────────────────────────────────────────
// 5. AUTOSAVE on input
// ─────────────────────────────────────────────
let autosaveT;
$form.addEventListener("input", () => {
  clearTimeout(autosaveT);
  autosaveT = setTimeout(saveFormState, 400);
});
$form.addEventListener("change", () => {
  clearTimeout(autosaveT);
  autosaveT = setTimeout(saveFormState, 200);
});

// ─────────────────────────────────────────────
// 6. SAVE DRAFT button
// ─────────────────────────────────────────────
$saveBtn.addEventListener("click", () => {
  saveFormState();
  showAutosaveStatus("✓ Borrador guardado manualmente");
});

// ─────────────────────────────────────────────
// 7. SUBMIT — confirm before sending
// ─────────────────────────────────────────────
$form.addEventListener("submit", (e) => {
  const confirmed = confirm(
    "¿Enviar el cuestionario ahora?\n\n" +
    "Las respuestas se enviarán a info@aetheriaagency.es.\n" +
    "Podrás seguir editando aquí en este navegador si lo necesitas."
  );
  if (!confirmed) {
    e.preventDefault();
    return;
  }
  // Final save before submitting
  saveFormState();
});

// ─────────────────────────────────────────────
// 8. INIT — load saved state
// ─────────────────────────────────────────────
loadFormState();
updateTabCompletion();

console.log("%cAetheria · Piscinas form ready", "color:#8b3fbf; font-weight:bold; font-size:14px");
