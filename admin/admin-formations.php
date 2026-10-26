<?php
require_once 'check-admin.php';
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>Panel Administrateur - Maxime Courdavault</title>
    <link rel="icon" href="../assets/images/favicon.svg" type="image/svg+xml">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../assets/css/style.css">
</head>

<body>
    <header>
        <div class="container">
            <a href="admin.php">
                <h1>Maxime Courdavault</h1>
            </a>
            <button id="button-nav" aria-label="Ouvrir le menu">
                <img src="assets/images/menu-burger.svg" alt="" id="icon-button-nav">
            </button>
            <nav id="nav" class="nav-hidden">
                <ul class="actions">
                    <li><a href="admin-formations.php" class="current-page">Mes formations</a></li>
                    <li><a href="admin-experiences.php">Mes expériences</a></li>
                    <li><a href="admin-skills.php">Mes compétences</a></li>
                    <li><a href="admin-projets.php">Mes projets</a></li>
                    <li><a href="https://mail.ovh.net/roundcube/?_task=mail&_mbox=INBOX" target="_blank" rel="nofollow noopener">Ma boîte mail</a></li>
                </ul>
            </nav>
        </div>
        <script src="../assets/js/nav.js" defer></script>
    </header>

    <main class="container">
        <div id="formations-container">
        </div>
        
        <h2 class="text-center">Ajouter une formation</h2>
        <form id="new-formation-form" action="../api/formations/postFormation.php" method="POST">
            <div class="field">
                <label for="degree">Diplôme</label>
                <input type="text" id="degree" name="degree" placeholder="BUT Informatique" required />
            </div>
            <div class="line">
                <div class="field">
                    <label for="place">Lieu</label>
                    <input type="text" id="place" name="place" placeholder="Saint-Nicolas, Paris 6ème" required />
                </div>
                <div class="line">
                    <div class="field">
                        <label for="start">Année de début</label>
                        <input type="number" id="start" name="start" placeholder="2021" required />
                    </div>
                    <div class="field">
                        <label for="end">Année de fin</label>
                        <input type="number" id="end" name="end" placeholder="2027" required />
                    </div>
                </div>
            </div>
            <div class="field">
                <label for="description">Description</label>
                <textarea id="description" name="description" placeholder="Diplôme obtenu, apports, etc..." required></textarea>
            </div>
            <div class="line">
            <button type="submit" class="button-primary">Ajouter une formation</button>
            </div>
        </form>
    </main>

    <footer>
        <div class="container">
            <div>
                <h2>Maxime Courdavault</h2>
                <p>&copy; 2026 Maxime Courdavault. Tous droits réservés.</p>
                <a href="../mentions.html">Mentions légales</a>
            </div>
            <div>
                <h3>Portfolio</h3>
                <ul>
                    <li>
                        <a href="../index.html">Accueil</a>
                    </li>
                    <li>
                        <a href="../about.html">A propos de moi</a>
                    </li>
                    <li>
                        <a href="../projects.html">Mes projets</a>
                    </li>
                    <li>
                        <a href="../contact.html">Contact</a>
                    </li>
                </ul>
            </div>
            <div>
                <h3>Liens externes</h3>
                <ul>
                    <li>
                        <a href="https://github.com/Maxime-Crdvlt" target="_blank" rel="nofollow noopener" class="text-icon">
                            <img src="/assets/images/github.svg" alt=""> Mon GitHub</a>
                    </li>
                    <li>
                        <a href="https://www.linkedin.com/in/maxime-crdvlt" target="_blank" rel="nofollow noopener" class="text-icon"><img src="/assets/images/linkedin.svg" alt=""> Mon LinkedIn</a>
                    </li>
                    <li>
                        <a href="../assets/documents/MaximeCOURDAVAULT-CV.pdf" target="_blank" rel="noopener" class="text-icon"><img src="/assets/images/cv.svg" alt=""> Mon Curriculum Vitae</a>
                    </li>
                </ul>
            </div>
        </div>
    </footer>
    <div id="popup-overlay" class="overlay-cache"></div>
    <div id="popup" class="popup popup-cache">
        <div class="text-icon">
            <i id="popup-icon" class="fi fi-br-check popup-icon icon-succes"></i>
            <p id="popup-message" class="popup-message"></p>
        </div>
    </div>
    <script src="admin-formations.js" defer></script>
</body>
</html>