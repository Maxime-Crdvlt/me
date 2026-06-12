document.addEventListener('DOMContentLoaded', () => {
    const formulaire = document.getElementById('form-contact');
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    const popupIcon = document.getElementById('popup-icon');
    const overlay = document.getElementById('popup-overlay');

    if (formulaire) {
        formulaire.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(formulaire);
            fetch('api/login.php', {
                method: 'POST',
                body: formData
            })
            .then(reponse => reponse.json())
            .then(data => {
                popupMessage.textContent = data.message;
                if (data.statut === "succes") {
                    popupIcon.className = "fi fi-br-check popup-icon icon-succes";
                    formulaire.reset();
                    setTimeout(() => {
                        window.location.href = "admin.html";
                    }, 1200);
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
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            popup.classList.remove('popup-visible');
            popup.classList.add('popup-cache');
            overlay.classList.remove('overlay-visible');
            overlay.classList.add('overlay-cache');
            document.body.classList.remove('bloquer-scroll');
        });
    }
})