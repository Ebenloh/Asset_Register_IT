// =========================================================
      // CONFIG SERVEUR
      // =========================================================

      const SERVER_URL = "https://script.google.com/macros/s/AKfycbzGSZJhBNKvlQ6lo4jzhubyCXylYBm7l2qLGwtJgKX9r3k2QHAs-KTC3T9N91X3hcQ2HQ/exec";

      // =========================================================
      // ELEMENTS DOM
      // =========================================================

      const form    = document.getElementById('pc-form');
      const btnSub  = document.getElementById('btn-submit');
      const btnText = document.getElementById('btn-text');
      const banner  = document.getElementById('result-banner');

      // =========================================================
      // DATE AUTO = AUJOURD'HUI
      // =========================================================

      document.getElementById(
        'dateAttribution'
      ).valueAsDate = new Date();

      // =========================================================
      // SUBMIT FORM
      // =========================================================

      form.addEventListener('submit', async (e) => {

        e.preventDefault();

        // =======================================================
        // RECUPERATION DES VALEURS
        // =======================================================

        const typeMachine =
          document.querySelector(
            'input[name="typeMachine"]:checked'
          )?.value;

        const payload = {

          typeMachine,

          nom:
            document.getElementById('nom')
            .value
            .trim(),

          department:
            document.getElementById('department')
            .value
            .trim(),

          dateAttribution:
            document.getElementById('dateAttribution')
            .value,

          modele:
            document.getElementById('modele')
            .value
            .trim(),

          numeroSerie:
            document.getElementById('numeroSerie')
            .value
            .trim()
            .toUpperCase()
            .replace(/\s+/g, ''),
          
          macAdress:
            document.getElementById('macAdress')
            .value
            .trim()
            
        };

        // =======================================================
        // VALIDATION
        // =======================================================

        if (!typeMachine) {

          afficherErreur(
            'Sélectionne un type de machine.'
          );

          return;
        }

        if (!payload.nom) {

          afficherErreur(
            'Le nom est obligatoire.'
          );

          return;
        }

        if (!payload.department) {

          afficherErreur(
            'Le département est obligatoire.'
          );

          return;
        }

        if (!payload.dateAttribution) {

          afficherErreur(
            'La date est obligatoire.'
          );

          return;
        }

        if (!payload.modele) {

          afficherErreur(
            'Le modèle est obligatoire.'
          );

          return;
        }

        if (!payload.numeroSerie) {

          afficherErreur(
            'Le numéro de série est obligatoire.'
          );

          return;
        }

        if (!payload.macAdress) {

          afficherErreur(
            'Adress Mac est obligatoire.'
          );

          return;
        }

        // =======================================================
        // UI LOADING
        // =======================================================

        setLoading(true);

        cacherBanner();

        // =======================================================
        // ENVOI API
        // =======================================================

        try {

          const response = await fetch(
            SERVER_URL,
            {
              method: 'POST',

              headers: {
                'Content-Type': 'application/json'
              },

              body: JSON.stringify(payload)
            }
          );

          // =====================================================
          // ERREUR HTTP
          // =====================================================

          if (!response.ok) {

            throw new Error(
              `Erreur serveur (${response.status})`
            );
          }

          // =====================================================
          // JSON BACKEND
          // =====================================================

          const result = await response.json();

          // =====================================================
          // SUCCES
          // =====================================================

          if (result.success) {

            afficherSucces(

              result.nomPC ||

              (
                payload.typeMachine === 'Laptop'
                  ? 'ITY-LTOP-5001'
                  : 'ITY-DSK-2001'
              ),

              result.message ||
              'PC enregistré avec succès.'
            );

            form.reset();

            // ===================================================
            // REMETTRE LA DATE DU JOUR
            // ===================================================

            document.getElementById(
              'dateAttribution'
            ).valueAsDate = new Date();

          } else {

            afficherErreur(

              result.error ||

              'Erreur serveur.'
            );
          }

        } catch (err) {

          console.error(err);

          afficherErreur(

            err.message ||

            'Impossible de joindre le serveur.'
          );

        } finally {

          setLoading(false);
        }

      });

      // =========================================================
      // UI HELPERS
      // =========================================================

      function setLoading(state) {

        btnSub.disabled = state;

        btnText.textContent = state
          ? 'Enregistrement…'
          : 'Enregistrer le PC';

        const existingSpinner =
          document.getElementById('spinner');

        // =======================================================
        // AJOUT SPINNER
        // =======================================================

        if (state && !existingSpinner) {

          const spinner =
            document.createElement('div');

          spinner.className = 'spinner';
          spinner.id = 'spinner';

          btnSub.insertBefore(
            spinner,
            btnText
          );

        }

        // =======================================================
        // SUPPRESSION SPINNER
        // =======================================================

        else if (!state && existingSpinner) {

          existingSpinner.remove();
        }
      }

      // =========================================================
      // CACHER BANNIERE
      // =========================================================

      function cacherBanner() {

        banner.style.display = 'none';

        document.getElementById(
          'pc-name-block'
        ).style.display = 'none';
      }

      // =========================================================
      // BANNIERE SUCCES
      // =========================================================

      function afficherSucces(nomPC, message) {

        banner.className = '';

        banner.classList.add('success');

        banner.style.display = 'block';

        document.getElementById(
          'banner-title'
        ).textContent =
          'Enregistrement réussi';

        document.getElementById(
          'banner-message'
        ).textContent =
          message;

        document.getElementById(
          'pc-name-value'
        ).textContent =
          nomPC;

        document.getElementById(
          'pc-name-block'
        ).style.display =
          'block';

        banner.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }

      // =========================================================
      // BANNIERE ERREUR
      // =========================================================

      function afficherErreur(message) {

        banner.className = '';

        banner.classList.add('error');

        banner.style.display = 'block';

        document.getElementById(
          'banner-title'
        ).textContent =
          'Erreur';

        document.getElementById(
          'banner-message'
        ).textContent =
          message;

        document.getElementById(
          'pc-name-block'
        ).style.display =
          'none';

        banner.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }

      // =========================================================
      // COPIER NOM PC
      // =========================================================

      function copyNomPC() {

        const val =
          document.getElementById(
            'pc-name-value'
          ).textContent;

        // =======================================================
        // CLIPBOARD NON SUPPORTE
        // =======================================================

        if (!navigator.clipboard) {

          alert('Copie non supportée.');

          return;
        }

        // =======================================================
        // COPIE
        // =======================================================

        navigator.clipboard.writeText(val)

          .then(() => {

            const btn =
              document.getElementById(
                'btn-copy'
              );

            btn.textContent =
              '✓ Copié';

            setTimeout(() => {

              btn.textContent =
                'Copier';

            }, 2000);

          })

          .catch(() => {

            afficherErreur(
              'Erreur lors de la copie.'
            );
          });
      }

      // =========================================================
      // EVENT COPY BUTTON
      // =========================================================

      document
        .getElementById('btn-copy')
        .addEventListener(
          'click',
          copyNomPC
        );