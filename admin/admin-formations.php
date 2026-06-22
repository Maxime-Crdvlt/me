<?php
    require_once 'check-admin.php';
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>Panel Administrateur - Maxime Courdavault</title>
    <link rel="icon" href="/assets/images/favicon.svg" type="image/svg+xml">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/assets/css/style.css">
    <link rel='stylesheet'
        href='https://cdn-uicons.flaticon.com/4.0.0/uicons-solid-rounded/css/uicons-solid-rounded.css'>
    <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/4.0.0/uicons-brands/css/uicons-brands.css'>
    <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/4.0.0/uicons-bold-rounded/css/uicons-bold-rounded.css'>
</head>

<body>
    <header>
        <div class="container">
            <a href="/index.html">
                <h1>Maxime Courdavault</h1>
            </a>
            <button id="button-nav" aria-label="Ouvrir le menu">
                <i class="fi fi-br-menu-burger" id="icon-button-nav"></i>
            </button>
            <nav id="nav" class="nav-hidden">
                <ul class="actions">
                    <li><a href="admin.php">Dashboard</a></li>
                    <li><a href="admin-formations.php" class="current-page">Mes formations</a></li>
                    <li><a href="admin-experiences.php">Mes expériences</a></li>
                    <li><a href="admin-projets.php">Mes projets</a></li>
                    <li><a href="https://mail.ovh.net/roundcube/?_task=mail&_mbox=INBOX" target="_blank" rel="nofollow noopener">Ma boîte mail</a></li>
                </ul>
            </nav>
        </div>
        <script src="/assets/js/nav.js" defer></script>
    </header>

    <main class="container">
        <h2>Mes formations</h2>
        <div id="formations-container"></div>
        
    </main>

    <footer>
        <div class="container">
            <div>
                <h2>Maxime Courdavault</h2>
                <p>&copy; 2026 Maxime Courdavault. Tous droits réservés.</p>
                <a href="/mentions.html">Mentions légales</a>
            </div>
            <div>
                <h3>Portfolio</h3>
                <ul>
                    <li>
                        <a href="/index.html">Accueil</a>
                    </li>
                    <li>
                        <a href="/about.html">A propos de moi</a>
                    </li>
                    <li>
                        <a href="/projects.html">Mes projets</a>
                    </li>
                    <li>
                        <a href="/contact.html">Contact</a>
                    </li>
                </ul>
            </div>
            <div>
                <h3>Liens externes</h3>
                <ul>
                    <li>
                        <a href="https://github.com/Maxime-Crdvlt" target="_blank" rel="nofollow noopener" class="text-icon">
                            <i class="fi fi-brands-github"></i> Mon GitHub</a>
                    </li>
                    <li>
                        <a href="https://www.linkedin.com/in/maxime-crdvlt" target="_blank" rel="nofollow noopener" class="text-icon"><i
                                class="fi fi-brands-linkedin"></i> Mon LinkedIn</a>
                    </li>
                    <li>
                        <a href="/assets/documents/MaximeCOURDAVAULT-CV.pdf" target="_blank" rel="noopener" class="text-icon"><i
                                class="fi fi-sr-resume"></i> Mon Curriculum Vitae</a>
                    </li>
                </ul>
            </div>
        </div>
    </footer>
</body>

</html>