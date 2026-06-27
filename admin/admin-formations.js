document.addEventListener('DOMContentLoaded', async () => {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    const popupIcon = document.getElementById('popup-icon');
    const overlay = document.getElementById('popup-overlay');
    // RECUPERATION DES DONNEES
    const response = await fetch('/api/getFormations.php');
    const formations = await response.json();
    const formationsContainer = document.getElementById('formations-container');

    //TRAITEMENT
    if (formations.length === 0) {
        const pVide = document.createElement('p');
        pVide.textContent = 'Aucune formation trouvée dans la base de données...';
        formationsContainer.append(pVide);
        return;
    } else {
        formations.forEach(formation => {
            // CREATION DU FORMULAIRE
            const formationFormulaire = document.createElement('form');
            formationFormulaire.classList.add('formation');
            formationFormulaire.id = `formation-${formation.id}`;

            // CHAMP DIPLOME
            const divDiplome = document.createElement('div');
            divDiplome.classList.add('diplome-div');

            const labelDiplome = document.createElement('label');
            labelDiplome.setAttribute('for', `diplome-${formation.id}`);
            labelDiplome.textContent = 'Diplôme';

            const inputDiplome = document.createElement('input');
            inputDiplome.setAttribute('type', 'text');
            inputDiplome.id = `diplome-${formation.id}`;
            inputDiplome.setAttribute('name', 'diplome');
            inputDiplome.setAttribute('value', formation.degree);
            inputDiplome.required = true;

            divDiplome.append(labelDiplome, inputDiplome);

            // CHAMP DATE DEBUT
            const divDateDebut = document.createElement('div');
            divDateDebut.classList.add('date-debut-div');

            const labelDateDebut = document.createElement('label');
            labelDateDebut.setAttribute('for', `date-debut-${formation.id}`);
            labelDateDebut.textContent = 'Année de début';

            const inputDateDebut = document.createElement('input');
            inputDateDebut.setAttribute('type', 'number');
            inputDateDebut.id = `date-debut-${formation.id}`;
            inputDateDebut.setAttribute('name', 'date-debut');
            inputDateDebut.setAttribute('value', formation.start);
            inputDateDebut.required = true;

            divDateDebut.append(labelDateDebut, inputDateDebut);

            // CHAMP DATE FIN
            const divDateFin = document.createElement('div');
            divDateFin.classList.add('date-fin-div');

            const labelDateFin = document.createElement('label');
            labelDateFin.setAttribute('for', `date-fin-${formation.id}`);
            labelDateFin.textContent = 'Année de fin';

            const inputDateFin = document.createElement('input');
            inputDateFin.setAttribute('type', 'number');
            inputDateFin.id = `date-fin-${formation.id}`;
            inputDateFin.setAttribute('name', 'date-fin');
            inputDateFin.setAttribute('value', formation.end);
            inputDateFin.required = true;

            divDateFin.append(labelDateFin, inputDateFin);

            // CHAMP DATE DEBUT + CHAMP DATE FIN
            const divDates = document.createElement('div');
            divDates.classList.add('dates');

            divDates.append(divDateDebut, divDateFin);

            // CHAMP PLACE
            const divPlace = document.createElement('div');
            divPlace.classList.add('place-div');

            const labelPlace = document.createElement('label');
            labelPlace.setAttribute('for', `place-${formation.id}`);
            labelPlace.textContent = 'Lieu';

            const inputPlace = document.createElement('input');
            inputPlace.setAttribute('type', 'text');
            inputPlace.id = `place-${formation.id}`;
            inputPlace.setAttribute('name', 'place');
            inputPlace.setAttribute('value', formation.place);
            inputPlace.required = true;

            divPlace.append(labelPlace, inputPlace);

            // CHAMP DATE DEBUT + CHAMP DATE FIN + PLACE
            const divInfosSupp = document.createElement('div');
            divInfosSupp.classList.add('infos-supp');

            divInfosSupp.append(divPlace, divDates);

            // CHAMP DESCRIPTION
            const divDescription = document.createElement('div');
            divDescription.classList.add('description-div');

            const labelDescription = document.createElement('label');
            labelDescription.setAttribute('for', `description-${formation.id}`);
            labelDescription.textContent = 'Description';

            const inputDescription = document.createElement('textarea');
            inputDescription.id = `description-${formation.id}`;
            inputDescription.setAttribute('name', 'description');
            inputDescription.textContent = formation.description;
            inputDescription.required = true;

            divDescription.append(labelDescription, inputDescription);

            // BOUTONS
            const buttonSave = document.createElement('button');
            buttonSave.classList.add('button-primary');
            buttonSave.setAttribute('type', 'submit');
            buttonSave.textContent = 'Enregistrer';

            const buttonDelete = document.createElement('button');
            buttonDelete.classList.add('button-secondary');
            buttonDelete.setAttribute('type', 'button');
            buttonDelete.textContent = 'Supprimer';
            
            // CONSTRUCTION DU FORMULAIRE
            formationFormulaire.append(divDiplome);
            formationFormulaire.append(divInfosSupp);
            formationFormulaire.append(divDescription);
            formationFormulaire.append(buttonSave, buttonDelete);

            formationFormulaire.addEventListener('submit', (event) => {
                event.preventDefault();
                const formData = new FormData(formationFormulaire);
                formData.append('id', formation.id);
                fetch('/api/putFormation.php', {
                    method: 'POST',
                    body: formData
                })
                .then(reponse => reponse.json())
                .then(data => {
                    popupMessage.textContent = data.message;
                    if (data.statut === "succes") {
                        popupIcon.className = "fi fi-br-check popup-icon icon-succes";
                    }
                    if (data.statut === "erreur") {
                        popupIcon.className = "fi fi-br-cross popup-icon icon-erreur";
                    }
                    popup.classList.remove('popup-cache');
                    popup.classList.add('popup-visible');
                    overlay.classList.remove('overlay-cache');
                    overlay.classList.add('overlay-visible');
                    document.body.classList.add('bloquer-scroll');
                })
                .catch(erreur => {
                    console.error("Erreur serveur :", erreur);
                    popupMessage.textContent = "Erreur de connexion au serveur.";
                    popupIcon.className = "fi fi-br-cross popup-icon icon-erreur";
                    
                    popup.classList.remove('popup-cache');
                    popup.classList.add('popup-visible');
                    overlay.classList.remove('overlay-cache');
                    overlay.classList.add('overlay-visible');
                    document.body.classList.add('bloquer-scroll');
                });
            })

            if (overlay) {
                overlay.addEventListener('click', () => {
                    popup.classList.remove('popup-visible');
                    popup.classList.add('popup-cache');
                    overlay.classList.remove('overlay-visible');
                    overlay.classList.add('overlay-cache');
                    document.body.classList.remove('bloquer-scroll');
                });
            }

            formationsContainer.append(formationFormulaire);

            // SEPARATEUR
            const divSeparateur = document.createElement('div');
            divSeparateur.classList.add('ou');
            const hr = document.createElement('hr');
            divSeparateur.append(hr);
            
            formationsContainer.append(divSeparateur);
        });
    }
})