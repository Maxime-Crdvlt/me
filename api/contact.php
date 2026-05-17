<?php
// RECUPERATION DES DONNEES DU FORMULAIRE
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['user_name'] ?? '';
    $email = $_POST['user_email'] ?? '';
    $message = $_POST['user_message'] ?? '';
    $email = filter_var($email, FILTER_SANITIZE_EMAIL);
} else {
    error_log("[Erreur] Aucun formulaire soumis...");
    exit;
}

// CONNEXION A LA BASE DE DONNEES
require_once 'config_portfolio.php'; //import $dsn, $user, $password
try {
    $connexionDB = new PDO($dsn, $user, $password);
    $connexionDB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    error_log("[$name - $email] [Succès] Connexion à la base de donnée réussie !");
} catch (PDOException $e) {
    error_log("[$name - $email] [Erreur] Echec de la connexion : " . $e->getMessage() . "...");
    exit;
}

// TRAITEMENT
if (!empty($name) && !empty($email) && !empty($message)) {
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        try {
            $sql = "INSERT INTO contacts (name, email, message, envoi) VALUES (:name, :email, :message, NOW())";
            $stmt = $connexionDB->prepare($sql);
            $stmt->execute([
                ':name' => $name,
                ':email' => $email,
                ':message' => $message
            ]);
            error_log("[$name - $email] [Succès] Votre message a bien été envoyé !");
        } catch (PDOException $e) {
            error_log("[$name - $email] [Erreur] Echec de l'insertion : " . $e->getMessage() . "...");
        }
    } else {
        error_log("[$name - $email] [Erreur] Adresse email invalide...");
    }
} else {
    error_log("[$name - $email] [Erreur] Tous les champs sont obligatoires...");
}

// DECONNEXION DE LA BASE DE DONNEES
$connexionDB = null;
?>