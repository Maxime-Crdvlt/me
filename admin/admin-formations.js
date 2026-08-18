document.addEventListener('DOMContentLoaded', async () => {
    // RETRIEVING THE NECESSARY DATA AND CONSTANTS
    let reloadPage = false;
        // Display POPUP
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    const popupIcon = document.getElementById('popup-icon');
    const overlay = document.getElementById('popup-overlay');
    function showPopup() {
        popup.classList.remove('popup-cache');
        popup.classList.add('popup-visible');
        overlay.classList.remove('overlay-cache');
        overlay.classList.add('overlay-visible');
        document.body.classList.add('bloquer-scroll');
    }
    if (overlay) {
        overlay.addEventListener('click', () => {
            popup.classList.remove('popup-visible');
            popup.classList.add('popup-cache');
            overlay.classList.remove('overlay-visible');
            overlay.classList.add('overlay-cache');
            document.body.classList.remove('bloquer-scroll');
            if (reloadPage) {
                window.location.reload();
            }
        });
    }
    // Retrieving training courses
    const response = await fetch('../api/formations/getFormations.php');
    const formations = await response.json();
    const formationsContainer = document.getElementById('formations-container');

    // TREATMENT
    if (formations.length === 0) {
        const pVide = document.createElement('p');
        pVide.textContent = 'Aucune formation trouvée dans la base de données...';
        formationsContainer.append(pVide);
        return;
    } else {
        formations.forEach(formation => {
            // CREATING THE FORMATION FORM
            const formationFormulaire = document.createElement('form');
            formationFormulaire.classList.add('formation');
            formationFormulaire.id = `${formation.id}`;

            // DEGREE FIELD
            const degreeDiv = document.createElement('div');
            degreeDiv.classList.add('degree-div');
            const degreeLabel = document.createElement('label');
            degreeLabel.setAttribute('for', `degree-${formation.id}`);
            degreeLabel.textContent = 'Diplôme';
            const degreeInput = document.createElement('input');
            degreeInput.setAttribute('type', 'text');
            degreeInput.id = `degree-${formation.id}`;
            degreeInput.setAttribute('name', 'degree');
            degreeInput.setAttribute('value', formation.degree);
            degreeInput.required = true;
            degreeDiv.append(degreeLabel, degreeInput);

            // START FIELD
            const startDiv = document.createElement('div');
            startDiv.classList.add('start-div');
            const startLabel = document.createElement('label');
            startLabel.setAttribute('for', `start-${formation.id}`);
            startLabel.textContent = 'Année de début';
            const startInput = document.createElement('input');
            startInput.setAttribute('type', 'number');
            startInput.id = `start-${formation.id}`;
            startInput.setAttribute('name', 'start');
            startInput.setAttribute('value', formation.start);
            startInput.required = true;
            startDiv.append(startLabel, startInput);

            // END FIELD
            const endDiv = document.createElement('div');
            endDiv.classList.add('end-div');
            const endLabel = document.createElement('label');
            endLabel.setAttribute('for', `end-${formation.id}`);
            endLabel.textContent = 'Année de fin';
            const endInput = document.createElement('input');
            endInput.setAttribute('type', 'number');
            endInput.id = `end-${formation.id}`;
            endInput.setAttribute('name', 'end');
            endInput.setAttribute('value', formation.end);
            endInput.required = true;
            endDiv.append(endLabel, endInput);

            // START + END FIELD
            const datesDiv = document.createElement('div');
            datesDiv.classList.add('dates');
            datesDiv.append(startDiv, endDiv);

            // PLACE FIELD
            const placeDiv = document.createElement('div');
            placeDiv.classList.add('place-div');
            const placeLabel = document.createElement('label');
            placeLabel.setAttribute('for', `place-${formation.id}`);
            placeLabel.textContent = 'Lieu';
            const placeInput = document.createElement('input');
            placeInput.setAttribute('type', 'text');
            placeInput.id = `place-${formation.id}`;
            placeInput.setAttribute('name', 'place');
            placeInput.setAttribute('value', formation.place);
            placeInput.required = true;
            placeDiv.append(placeLabel, placeInput);

            // PLACE + DATES FIELD
            const infosDiv = document.createElement('div');
            infosDiv.classList.add('infos-supp-div');
            infosDiv.append(placeDiv, datesDiv);

            // DESCRIPTION FIELD
            const descriptionDiv = document.createElement('div');
            descriptionDiv.classList.add('description-div');
            const descriptionLabel = document.createElement('label');
            descriptionLabel.setAttribute('for', `description-${formation.id}`);
            descriptionLabel.textContent = 'Description';
            const descriptionInput = document.createElement('textarea');
            descriptionInput.id = `description-${formation.id}`;
            descriptionInput.setAttribute('name', 'description');
            descriptionInput.textContent = formation.description;
            descriptionInput.required = true;
            descriptionDiv.append(descriptionLabel, descriptionInput);

            // BUTTONS
            const saveButton = document.createElement('button');
            saveButton.classList.add('button-primary');
            saveButton.setAttribute('type', 'submit');
            saveButton.textContent = 'Enregistrer';

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('button-secondary');
            deleteButton.setAttribute('type', 'button');
            deleteButton.textContent = 'Supprimer';
            
            // FORM CONSTRUCTION
            formationFormulaire.append(degreeDiv);
            formationFormulaire.append(infosDiv);
            formationFormulaire.append(descriptionDiv);
            formationFormulaire.append(saveButton, deleteButton);

            // EVENT LISTENER SAVE
            formationFormulaire.addEventListener('submit', (event) => {
                event.preventDefault();
                const formData = new FormData(formationFormulaire);
                formData.append('id', formation.id);
                fetch('../api/formations/putFormation.php', {
                    method: 'POST',
                    body: formData
                })
                .then(reponse => reponse.json())
                .then(data => {
                    popupMessage.textContent = data.message;
                    if (data.status === "success") {
                        popupIcon.className = "fi fi-br-check popup-icon icon-succes";
                        reloadPage = true;
                    }
                    if (data.status === "error") {
                        popupIcon.className = "fi fi-br-cross popup-icon icon-erreur";
                    }
                    showPopup();
                })
                .catch(erreur => {
                    console.error("Erreur serveur :", erreur);
                    popupMessage.textContent = "Erreur de connexion au serveur.";
                    popupIcon.className = "fi fi-br-cross popup-icon icon-erreur";
                    showPopup();
                });
            })

            // EVENT LISTENER DELETE
            deleteButton.addEventListener('click', (event) => {
                event.preventDefault();
                const formData = new FormData(formationFormulaire);
                formData.append('id', formation.id);
                fetch('../api/formations/deleteFormation.php', {
                    method: 'POST',
                    body: formData
                })
                .then(reponse => reponse.json())
                .then(data => {
                    popupMessage.textContent = data.message;
                    if (data.status === "success") {
                        popupIcon.className = "fi fi-br-check popup-icon icon-succes";
                        reloadPage = true;
                    }
                    if (data.status === "error") {
                        popupIcon.className = "fi fi-br-cross popup-icon icon-erreur";
                    }
                    showPopup();
                })
                .catch(erreur => {
                    console.error("Erreur serveur :", erreur);
                    popupMessage.textContent = "Erreur de connexion au serveur.";
                    popupIcon.className = "fi fi-br-cross popup-icon icon-erreur";
                    showPopup();
                });
            })

            formationsContainer.append(formationFormulaire);

            // SEPARATEUR
            const separatorDiv = document.createElement('div');
            separatorDiv.classList.add('ou');
            const hr = document.createElement('hr');
            separatorDiv.append(hr);
            formationsContainer.append(separatorDiv);
        });
    }
    // ADDITION FORM  
    // EVENT LISTENER ADD
    const newFormationForm = document.getElementById('new-formation-form');
    newFormationForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(newFormationForm);
        fetch('../api/formations/postFormation.php', {
            method: 'POST',
            body: formData
        })
        .then(reponse => reponse.json())
        .then(data => {
            popupMessage.textContent = data.message;
            if (data.status === "success") {
                popupIcon.className = "fi fi-br-check popup-icon icon-succes";
                reloadPage = true;
            }
            if (data.status === "error") {
                popupIcon.className = "fi fi-br-cross popup-icon icon-erreur";
            }
            showPopup();
        })
        .catch(erreur => {
            console.error("Erreur serveur :", erreur);
            popupMessage.textContent = "Erreur de connexion au serveur.";
            popupIcon.className = "fi fi-br-cross popup-icon icon-erreur";
            showPopup();
        });
    })
})