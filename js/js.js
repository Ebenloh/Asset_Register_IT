// =========================================================
// CONFIG SERVEUR
// =========================================================
const SERVER_URL =
  "https://script.google.com/macros/s/AKfycbzGSZJhBNKvlQ6lo4jzhubyCXylYBm7l2qLGwtJgKX9r3k2QHAs-KTC3T9N91X3hcQ2HQ/exec";

// =========================================================
// MODE ACTUEL
// =========================================================
let mode = "add";

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
document.getElementById(
  "dateAttribution"
).valueAsDate = new Date();

// =========================================================
// CHANGER MODE
// =========================================================
function changerMode(newMode, e) {
  mode = newMode;

  document
    .querySelectorAll(".tab-btn")
    .forEach(btn =>
      btn.classList.remove("active")
    );

  e.target.classList.add("active");

  const pcIdGroup =
    document.getElementById(
      "pc-id-group"
    );

  if (mode === "add") {
    pcIdGroup.classList.add("hidden");
    btnText.textContent =
      "Enregistrer le PC";
  }

  if (mode === "edit") {
    pcIdGroup.classList.remove(
      "hidden"
    );
    btnText.textContent =
      "Modifier le PC";
  }

  if (mode === "delete") {
    pcIdGroup.classList.remove(
      "hidden"
    );
    btnText.textContent =
      "Supprimer le PC";
  }
}

// =========================================================
// SUBMIT FORM
// =========================================================
form.addEventListener(
  "submit",
  async function (e) {
    e.preventDefault();

    const typeMachine =
      document.querySelector(
        'input[name="typeMachine"]:checked'
      )?.value;

    const payload = {
      action: mode,

      pcId:
        document
          .getElementById("pcId")
          ?.value.trim(),

      typeMachine,

      nom:
        document
          .getElementById("nom")
          .value.trim(),

      department:
        document
          .getElementById(
            "department"
          )
          .value.trim(),

      modele:
        document
          .getElementById(
            "modele"
          )
          .value.trim(),

      dateAttribution:
        document
          .getElementById(
            "dateAttribution"
          ).value,

      numeroSerie:
        document
          .getElementById(
            "numeroSerie"
          )
          .value.trim()
          .toUpperCase(),

      macAdress:
        document
          .getElementById(
            "macAdress"
          )
          .value.trim(),
    };

    // =========================
    // VALIDATION
    // =========================
    if (
      mode !== "add" &&
      !payload.pcId
    ) {
      afficherErreur(
        "Entre le nom du PC."
      );
      return;
    }

    if (
      mode !== "delete" &&
      !typeMachine
    ) {
      afficherErreur(
        "Sélectionne un type de machine."
      );
      return;
    }

    if (
      mode !== "delete" &&
      !payload.nom
    ) {
      afficherErreur(
        "Le nom est obligatoire."
      );
      return;
    }

    setLoading(true);
    cacherBanner();

    // =========================
    // ENVOI
    // =========================
    try {
      await fetch(
        SERVER_URL,
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            payload
          ),
        }
      );

      afficherSucces(
        payload.pcId ||
          "Envoyé",
        "Données envoyées avec succès."
      );

      form.reset();

      document.getElementById(
        "dateAttribution"
      ).valueAsDate =
        new Date();

    } catch (err) {
      console.error(err);

      afficherErreur(
        "Impossible de joindre le serveur."
      );
    } finally {
      setLoading(false);
    }
  }
);

// =========================================================
// LOADING
// =========================================================
function setLoading(state) {
  btnSub.disabled = state;

  btnText.textContent = state
    ? "Traitement..."
    : mode === "add"
    ? "Enregistrer le PC"
    : mode === "edit"
    ? "Modifier le PC"
    : "Supprimer le PC";
}

// =========================================================
// CACHER BANNIERE
// =========================================================
function cacherBanner() {
  banner.style.display =
    "none";

  document.getElementById(
    "pc-name-block"
  ).style.display =
    "none";
}

// =========================================================
// SUCCES
// =========================================================
function afficherSucces(
  nomPC,
  message
) {
  banner.className = "";
  banner.classList.add(
    "success"
  );
  banner.style.display =
    "block";

  document.getElementById(
    "banner-title"
  ).textContent =
    "Succès";

  document.getElementById(
    "banner-message"
  ).textContent =
    message;

  document.getElementById(
    "pc-name-value"
  ).textContent =
    nomPC;

  document.getElementById(
    "pc-name-block"
  ).style.display =
    "block";

  banner.scrollIntoView({
    behavior: "smooth",
  });
}

// =========================================================
// ERREUR
// =========================================================
function afficherErreur(
  message
) {
  banner.className = "";
  banner.classList.add(
    "error"
  );
  banner.style.display =
    "block";

  document.getElementById(
    "banner-title"
  ).textContent =
    "Erreur";

  document.getElementById(
    "banner-message"
  ).textContent =
    message;

  document.getElementById(
    "pc-name-block"
  ).style.display =
    "none";
}

// =========================================================
// COPIER
// =========================================================
function copyNomPC() {
  const val =
    document.getElementById(
      "pc-name-value"
    ).textContent;

  navigator.clipboard
    .writeText(val)
    .then(() => {
      const btn =
        document.getElementById(
          "btn-copy"
        );

      btn.textContent =
        "✓ Copié";

      setTimeout(() => {
        btn.textContent =
          "Copier";
      }, 2000);
    });
}

async function rechercherPC(){

  const pcId =
    document.getElementById("pcId")
    .value
    .trim();

  if(!pcId){
    afficherErreur(
      "Entre le nom du PC."
    );
    return;
  }

  try{

    const response =
      await fetch(
        SERVER_URL + "?pcId=" + encodeURIComponent(pcId)
      );

    const result =
      await response.json();

    if(!result.success){
      afficherErreur(
        result.error
      );
      return;
    }

    const pc =
      result.data;

    document.getElementById("nom").value =
      pc.nom;

    document.getElementById("department").value =
      pc.department;

    document.getElementById("modele").value =
      pc.modele;

    document.getElementById("dateAttribution").value =
      pc.dateAttribution;

    document.getElementById("numeroSerie").value =
      pc.numeroSerie;

    document.getElementById("macAdress").value =
      pc.macAdress;

    if(pc.nomPC.includes("LTOP")){
      document.getElementById(
        "type-laptop"
      ).checked = true;
    }else{
      document.getElementById(
        "type-desktop"
      ).checked = true;
    }

    afficherSucces(
      pc.nomPC,
      "PC trouvé. Modifie les champs puis clique sur Modifier."
    );

  }catch(err){

    afficherErreur(
      "Impossible de rechercher."
    );
  }
}
