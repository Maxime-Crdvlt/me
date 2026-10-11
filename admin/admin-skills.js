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
    // Retrieving Types and Categories
    const responseCategories = await fetch('../api/types/getCategories.php');
    const categories = await responseCategories.json();
    const responseTypes = await fetch('../api/types/getTypes.php');
    const types = await responseTypes.json();
    const skillsContainer = document.getElementById('skills-container');
    const selectCategories = document.getElementById('categorie');
    const selectTypes = document.getElementById('type');

    // TREATMENT
    
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
            option.textContent = type.libelle; //[cite: 1]
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