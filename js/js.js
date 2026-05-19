// =========================================================
// CONFIG SERVEUR
// =========================================================
const SERVER_URL =
  "https://script.google.com/macros/s/AKfycbzGSZJhBNKvlQ6lo4jzhubyCXylYBm7l2qLGwtJgKX9r3k2QHAs-KTC3T9N91X3hcQ2HQ/exec";

// =========================================================
// ELEMENTS DOM
// =========================================================
const form = document.getElementById("pc-form");
const btnSub = document.getElementById("btn-submit");
const btnText = document.getElementById("btn-text");
const banner = document.getElementById("result-banner");

// =========================================================
// DATE AUTO
// =========================================================
document.getElementById("dateAttribution").valueAsDate = new Date();

// =========================================================
// SUBMIT FORM
// =========================================================
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // récupérer type machine
  const typeMachine = document.querySelector(
    'input[name="typeMachine"]:checked'
  )?.value;

  // validation
  if (!typeMachine) {
    afficherErreur("Sélectionne un type de machine.");
    return;
  }

  const payload = {
    typeMachine,
    nom: document.getElementById("nom").value.trim(),
    department: document.getElementById("department").value.trim(),
    modele: document.getElementById("modele").value.trim(),
    dateAttribution: document.getElementById("dateAttribution").value,
    numeroSerie: document
      .getElementById("numeroSerie")
      .value.trim()
      .toUpperCase(),
    macAdress: document.getElementById("macAdress").value.trim(),
  };

  setLoading(true);
  cacherBanner();

  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      mode: "no-cors", // évite Failed to fetch
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // no-cors = on ne peut pas lire response.json()
    afficherSucces(
      typeMachine === "Laptop"
        ? "ITY-LTOP-5001"
        : "ITY-DSK-2001",
      "PC enregistré avec succès."
    );

    form.reset();
    document.getElementById("dateAttribution").valueAsDate = new Date();
  } catch (error) {
    console.error(error);
    afficherErreur("Impossible de joindre le serveur.");
  } finally {
    setLoading(false);
  }
});

// =========================================================
// UI
// =========================================================
function setLoading(state) {
  btnSub.disabled = state;
  btnText.textContent = state
    ? "Enregistrement..."
    : "Enregistrer le PC";
}

function cacherBanner() {
  banner.style.display = "none";
}

function afficherSucces(nomPC, message) {
  banner.className = "success";
  banner.style.display = "block";

  document.getElementById("banner-title").textContent =
    "Enregistrement réussi";

  document.getElementById("banner-message").textContent =
    message;

  document.getElementById("pc-name-value").textContent =
    nomPC;

  document.getElementById("pc-name-block").style.display =
    "block";
}

function afficherErreur(message) {
  banner.className = "error";
  banner.style.display = "block";

  document.getElementById("banner-title").textContent =
    "Erreur";

  document.getElementById("banner-message").textContent =
    message;

  document.getElementById("pc-name-block").style.display =
    "none";
}

// =========================================================
// COPIER NOM PC
// =========================================================
function copyNomPC() {
  const text =
    document.getElementById("pc-name-value").textContent;

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById("btn-copy");
    btn.textContent = "✓ Copié";

    setTimeout(() => {
      btn.textContent = "Copier";
    }, 2000);
  });
}
