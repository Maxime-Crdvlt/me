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
    // Retrieving Skills, Types and Categories
    const responseSkills = await fetch('../api/skills/getSkills.php');
    const skills = await responseSkills.json();
    const responseTypes = await fetch('../api/types/getTypes.php');
    const types = await responseTypes.json();
    const responseCategories = await fetch('../api/categories/getCategories.php');
    const categories = await responseCategories.json();

    const skillsContainer = document.getElementById('skills-container');
    const selectCategories = document.getElementById('category');
    const selectTypes = document.getElementById('type');

    // TREATMENT
    if (skills.length === 0 || skills.status === 'error') {
        const pVide = document.createElement('p');
        pVide.textContent = 'Aucune compétence trouvée dans la base de données...';
        skillsContainer.append(pVide);
    } else {
        let currentCategoryId = null;
        let currentTypeId = null;
        skills.forEach(skill => {
            if (skill.categorie_id !== currentCategoryId) {
                const categoryTitle = document.createElement('h2');
                categoryTitle.textContent = skill.categorie;
                categoryTitle.classList.add('text-center');
                skillsContainer.append(categoryTitle);
                currentCategoryId = skill.categorie_id;
                currentTypeId = null;
            }
            if (skill.type_id !== currentTypeId) {
                const typeTitle = document.createElement('h3');
                typeTitle.textContent = skill.type;
                skillsContainer.append(typeTitle);
                currentTypeId = skill.type_id;
            }

            // CREATING THE SKILL FORM
            const skillFormulaire = document.createElement('form');
            skillFormulaire.id = `skill-${skill.id}`;

            // CATEGORY FIELD (Select)
            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('field');
            const categoryLabel = document.createElement('label');
            categoryLabel.setAttribute('for', `category-${skill.id}`);
            categoryLabel.textContent = 'Catégorie';
            const categorySelect = document.createElement('select');
            categorySelect.id = `category-${skill.id}`;
            categorySelect.setAttribute('name', 'category');
            categorySelect.required = true;
            if (!categories.status) {
                categories.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat.id;
                    option.textContent = cat.title;
                    if (cat.id == skill.categorie_id) option.selected = true; // Pré-sélection
                    categorySelect.appendChild(option);
                });
            }
            categoryDiv.append(categoryLabel, categorySelect);

            // TYPE FIELD (Select)
            const typeDiv = document.createElement('div');
            typeDiv.classList.add('field');
            const typeLabel = document.createElement('label');
            typeLabel.setAttribute('for', `type-${skill.id}`);
            typeLabel.textContent = 'Type';
            const typeSelect = document.createElement('select');
            typeSelect.id = `type-${skill.id}`;
            typeSelect.setAttribute('name', 'type');
            typeSelect.required = true;

            if (!types.status) {
                types.forEach(typ => {
                    const option = document.createElement('option');
                    option.value = typ.id;
                    option.textContent = typ.libelle;
                    if (typ.id == skill.type_id) option.selected = true; // Pré-sélection
                    typeSelect.appendChild(option);
                });
            }
            typeDiv.append(typeLabel, typeSelect);

            // SKILL NAME FIELD
            const nameDiv = document.createElement('div');
            nameDiv.classList.add('field');
            const nameLabel = document.createElement('label');
            nameLabel.setAttribute('for', `name-${skill.id}`);
            nameLabel.textContent = 'Compétence';
            const nameInput = document.createElement('input');
            nameInput.setAttribute('type', 'text');
            nameInput.id = `name-${skill.id}`;
            nameInput.setAttribute('name', 'skill');
            nameInput.setAttribute('value', skill.competence);
            nameInput.required = true;
            nameDiv.append(nameLabel, nameInput);

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

            // REGROUPEMENT SUR UNE LIGNE
            const lineDiv = document.createElement('div');
            lineDiv.classList.add('line');
            lineDiv.append(categoryDiv, typeDiv, nameDiv, buttonsDiv);

            // FORM CONSTRUCTION
            skillFormulaire.append(lineDiv);
            skillsContainer.append(skillFormulaire);

            // SEPARATEUR
            const separatorDiv = document.createElement('div');
            separatorDiv.classList.add('ou');
            const hr = document.createElement('hr');
            separatorDiv.append(hr);
            skillsContainer.append(separatorDiv);

            // EVENT LISTENER SAVE (MODIFICATION)
            skillFormulaire.addEventListener('submit', (event) => {
                event.preventDefault();
                const formData = new FormData(skillFormulaire);
                formData.append('id', skill.id); // On ajoute l'ID pour le putSkill.php
                
                fetch('../api/skills/putSkill.php', {
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
            });

            // EVENT LISTENER DELETE (SUPPRESSION)
            deleteButton.addEventListener('click', (event) => {
                event.preventDefault();
                const formData = new FormData();
                formData.append('id', skill.id); // On n'a besoin que de l'ID pour supprimer
                
                fetch('../api/skills/deleteSkill.php', {
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
            });
        })
    }
    
    // ADDITION FORM  
    // ADD OPTIONS FOR SELECTS
    if (!categories.status) {
        categories.forEach(categorie => {
            const option = document.createElement('option');
            option.value = categorie.id;
            option.textContent = categorie.title;
            selectCategories.appendChild(option);
        });
    }
    if (!types.status) {
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type.id;
            option.textContent = type.libelle;
            selectTypes.appendChild(option);
        });
    } 
    // EVENT LISTENER ADD
    const newSkillForm = document.getElementById('new-skill-form');
    newSkillForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(newSkillForm);
        fetch('../api/skills/postSkill.php', {
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