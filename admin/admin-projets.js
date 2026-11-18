document.addEventListener('DOMContentLoaded', async () => {
    // RETRIEVING THE NECESSARY DATA AND CONSTANTS
    let reloadPage = false;
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
    // Retrieving Projects
    const responseProjects = await fetch('../api/projects/getProjects.php');
    const projects = await responseProjects.json();
    const projectsContainer = document.getElementById('projects-container');

    // TREATMENT
    if (projects.length === 0 || projects.status === 'error') {
        const pVide = document.createElement('p');
        pVide.textContent = 'Aucun projet trouvé dans la base de données...';
        projectsContainer.append(pVide);
    } else {
        for (const project of projects) {
            const formData = new FormData();
            formData.append('project', project.id);
            const responseMobilizations = await fetch('../api/mobilizations/getMobilizations.php', {
                method: 'POST',
                body: formData
            });
            const mobilizations = await responseMobilizations.json();

            const projectFormulaire = document.createElement('form');
            projectFormulaire.id = `${project.id}`;

            // NAME FIELD
            const nameDiv = document.createElement('div');
            nameDiv.classList.add('field');
            const nameLabel = document.createElement('label');
            nameLabel.setAttribute('for', `name-${project.id}`);
            nameLabel.textContent = 'Titre du projet';
            const nameInput = document.createElement('input');
            nameInput.setAttribute('type', 'text');
            nameInput.id = `name-${project.id}`;
            nameInput.setAttribute('name', 'name');
            nameInput.setAttribute('value', project.name);
            nameInput.required = true;
            nameDiv.append(nameLabel, nameInput);

            // DESCRIPTION FIELD
            const descriptionDiv = document.createElement('div');
            descriptionDiv.classList.add('field');
            const descriptionLabel = document.createElement('label');
            descriptionLabel.setAttribute('for', `description-${project.id}`);
            descriptionLabel.textContent = 'Description';
            const descriptionInput = document.createElement('textarea');
            descriptionInput.id = `description-${project.id}`;
            descriptionInput.setAttribute('name', 'description');
            descriptionInput.textContent = project.description;
            descriptionInput.required = true;
            descriptionDiv.append(descriptionLabel, descriptionInput);

            // LINK FIELD
            const linkDiv = document.createElement('div');
            linkDiv.classList.add('field');
            const linkLabel = document.createElement('label');
            linkLabel.setAttribute('for', `link-${project.id}`);
            linkLabel.textContent = 'Lien GitHub du projet';
            const linkInput = document.createElement('input');
            linkInput.setAttribute('type', 'text');
            linkInput.id = `link-${project.id}`;
            linkInput.setAttribute('name', 'link');
            linkInput.setAttribute('value', project.link);
            linkInput.required = true;
            linkDiv.append(linkLabel, linkInput);

            // BUTTONS
            const buttonsDiv = document.createElement('div');
            buttonsDiv.classList.add('line');

            const saveButton = document.createElement('button');
            saveButton.classList.add('button-primary');
            saveButton.setAttribute('type', 'submit');
            saveButton.textContent = 'Enregistrer';

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('button-secondary');
            deleteButton.setAttribute('type', 'button');
            deleteButton.textContent = 'Supprimer';

            buttonsDiv.append(saveButton, deleteButton);
            
            // FORM CONSTRUCTION
            projectFormulaire.append(degreeDiv);
            projectFormulaire.append(infosDiv);
            projectFormulaire.append(descriptionDiv);
            projectFormulaire.append(buttonsDiv);

            // EVENT LISTENER SAVE
            projectFormulaire.addEventListener('submit', (event) => {
                event.preventDefault();
                const formData = new FormData(projectFormulaire);
                formData.append('id', project.id);
                fetch('../api/projects/putProject.php', {
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
                const formData = new FormData(projectFormulaire);
                formData.append('id', project.id);
                fetch('../api/projects/deleteProject.php', {
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

            projectsContainer.append(projectFormulaire);

            // SEPARATEUR
            const separatorDiv = document.createElement('div');
            separatorDiv.classList.add('ou');
            const hr = document.createElement('hr');
            separatorDiv.append(hr);
            projectsContainer.append(separatorDiv);
        }
    }
})