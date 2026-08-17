document.addEventListener('DOMContentLoaded', async () => {
    // RECUPERATION DES DONNEES ET CONSTANTES NECESSAIRES
    let reloadPage = false;
        // Affichage POPUP
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
    // Récupération des formations
    const response = await fetch('../api/experiences/getExperiences.php');
    const experiences = await response.json();
    const experiencesContainer = document.getElementById('experiences-container');

    // TREATMENT
    if (experiences.length === 0) {
        const pVide = document.createElement('p');
        pVide.textContent = 'Aucune expérience trouvée dans la base de données...';
        experiencesContainer.append(pVide);
        return;
    } else {
        experiences.forEach(experience => {
            // CREATING THE EXPERIENCE FORM
            const experienceFormulaire = document.createElement('form');
            experienceFormulaire.classList.add('experience');
            experienceFormulaire.id = `${experience.id}`;

            // TITLE FIELD
            const titleDiv = document.createElement('div');
            titleDiv.classList.add('title-div');
            const titleLabel = document.createElement('label');
            titleLabel.setAttribute('for', `title-${experience.id}`);
            titleLabel.textContent = 'Titre';
            const titleInput = document.createElement('input');
            titleInput.setAttribute('type', 'text');
            titleInput.id = `title-${experience.id}`;
            titleInput.setAttribute('name', 'title');
            titleInput.setAttribute('value', experience.title);
            titleInput.required = true;
            titleDiv.append(titleLabel, titleInput);

            // START FIELD
            const startDiv = document.createElement('div');
            startDiv.classList.add('start-div');
            const startLabel = document.createElement('label');
            startLabel.setAttribute('for', `start-${experience.id}`);
            startLabel.textContent = 'Date de début';
            const startInput = document.createElement('input');
            startInput.setAttribute('type', 'date');
            startInput.id = `start-${experience.id}`;
            startInput.setAttribute('name', 'start');
            startInput.setAttribute('value', experience.start);
            startInput.required = true;
            startDiv.append(startLabel, startInput);

            // END FIELD
            const endDiv = document.createElement('div');
            endDiv.classList.add('end-div');
            const endLabel = document.createElement('label');
            endLabel.setAttribute('for', `end-${experience.id}`);
            endLabel.textContent = 'Date de fin';
            const endInput = document.createElement('input');
            endInput.setAttribute('type', 'date');
            endInput.id = `end-${experience.id}`;
            endInput.setAttribute('name', 'end');
            endInput.setAttribute('value', experience.end);
            endInput.required = true;
            endDiv.append(endLabel, endInput);

            // END + START FIELD
            const datesDiv = document.createElement('div');
            datesDiv.classList.add('dates-div');
            datesDiv.append(startDiv, endDiv);

            // PLACE FIELD
            const placeDiv = document.createElement('div');
            placeDiv.classList.add('place-div');
            const placeLabel = document.createElement('label');
            placeLabel.setAttribute('for', `place-${experience.id}`);
            placeLabel.textContent = 'Lieu';
            const placeInput = document.createElement('input');
            placeInput.setAttribute('type', 'text');
            placeInput.id = `place-${experience.id}`;
            placeInput.setAttribute('name', 'place');
            placeInput.setAttribute('value', experience.place);
            placeInput.required = true;
            placeDiv.append(placeLabel, placeInput);

            // PLACE + END + START FIELD
            const infosDiv = document.createElement('div');
            infosDiv.classList.add('infos-supp-div');
            infosDiv.append(placeDiv, datesDiv);

            // DESCRIPTION FIELD
            const descriptionDiv = document.createElement('div');
            descriptionDiv.classList.add('description-div');
            const descriptionLabel = document.createElement('label');
            descriptionLabel.setAttribute('for', `description-${experience.id}`);
            descriptionLabel.textContent = 'Description';
            const descriptionInput = document.createElement('textarea');
            descriptionInput.id = `description-${experience.id}`;
            descriptionInput.setAttribute('name', 'description');
            descriptionInput.value = experience.description;
            descriptionInput.required = true;
            descriptionDiv.append(descriptionLabel, descriptionInput);

            // BOUTONS
            const saveButton = document.createElement('button');
            saveButton.classList.add('button-primary');
            saveButton.setAttribute('type', 'submit');
            saveButton.textContent = 'Enregistrer';

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('button-secondary');
            deleteButton.setAttribute('type', 'button');
            deleteButton.textContent = 'Supprimer';
            
            // CONSTRUCTION DU FORMULAIRE
            experienceFormulaire.append(titleDiv);
            experienceFormulaire.append(infosDiv);
            experienceFormulaire.append(descriptionDiv);
            experienceFormulaire.append(saveButton, deleteButton);

            // EVENT LISTENER SAVE
            experienceFormulaire.addEventListener('submit', (event) => {
                event.preventDefault();
                const formData = new FormData(experienceFormulaire);
                formData.append('id', experience.id);
                fetch('../api/experiences/putExperience.php', {
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
                const formData = new FormData(experienceFormulaire);
                formData.append('id', experience.id);
                fetch('../api/experiences/deleteExperience.php', {
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

            experiencesContainer.append(experienceFormulaire);

            // SEPARATEUR
            const separatorDiv = document.createElement('div');
            separatorDiv.classList.add('ou');
            const hr = document.createElement('hr');
            separatorDiv.append(hr);
            experiencesContainer.append(separatorDiv);
        });
    }
    // FORMULAIRE D'AJOUT   
    // EVENT LISTENER AJOUTER
    const newExperienceForm = document.getElementById('new-experience-form');
    newExperienceForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(newExperienceForm);
        fetch('../api/experiences/postExperience.php', {
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