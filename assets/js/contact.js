document.addEventListener('DOMContentLoaded', () => {
    const formulaire = document.getElementById('form-contact');
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    const popupIcon = document.getElementById('popup-icon');

    if (formulaire) {
        formulaire.addEventListener('submit', (evenement) => {
            evenement.preventDefault();
            const formData = new FormData(formulaire);
            fetch('api/contact.php', {
                method: 'POST',
                body: formData
            })
            .then(reponse => reponse.json())
            .then(data => {
                popupMessage.textContent = data.message;
                if (data.statut === "succes") {
                    popupIcon.className = "fi fi-br-check popup-icon icon-succes";
                    formulaire.reset();
                }
                if (data.statut === "erreur") {
                    popupIcon.className = "fi fi-br-cross popup-icon icon-erreur";
                }
                popup.classList.remove('popup-cache');
                popup.classList.add('popup-visible');
            })
            .catch(erreur => {
                console.error("Erreur serveur :", erreur);
                popupMessage.textContent = "Erreur de connexion au serveur.";
                popupIcon.className = "fi fi-br-cross popup-icon icon-erreur";
                popup.classList.remove('popup-cache');
                popup.classList.add('popup-visible');
                setTimeout(() => {
                    popup.classList.remove('popup-visible');
                    popup.classList.add('popup-cache');
                }, 4000);
            });
        })
    }

    document.addEventListener('click', (evenement) => {
        const popupEstVisible = popup.classList.contains('popup-visible');
        const clicEnDehors = !popup.contains(evenement.target);
        if (popupEstVisible && clicEnDehors) {
            popup.classList.remove('popup-visible');
            popup.classList.add('popup-cache');
        }
    })
})