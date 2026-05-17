<?php
header('Content-Type: application/json; charset=utf-8');

// CONNEXION A LA BASE DE DONNEES
require_once 'config_portfolio.php'; //import $dsn, $user, $password
try {
    $connexionDB = new PDO($dsn, $user, $password);
    $connexionDB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    error_log("[Erreur] Echec de la connexion : " . $e->getMessage() . "...");
    echo json_encode(['statut' => "erreur", 'message' => "Echec de la connexion à la base de données..."]);
    exit;
}

// RECUPERATION DES DONNEES DU FORMULAIRE
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['user_name'] ?? '';
    $email = $_POST['user_email'] ?? '';
    $message = $_POST['user_message'] ?? '';
    $email = filter_var($email, FILTER_SANITIZE_EMAIL);
} else {
    error_log("[Erreur] Aucun formulaire soumis...");
    echo json_encode(['statut' => "erreur", 'message' => "Aucun formulaire reçu..."]);
    exit;
}

// TRAITEMENT
if (!empty($name) && !empty($email) && !empty($message)) {
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        try {
            $sql = "INSERT INTO contacts (name, email, message, sent) VALUES (:name, :email, :message, NOW())";
            $stmt = $connexionDB->prepare($sql);
            $stmt->execute([
                ':name' => $name,
                ':email' => $email,
                ':message' => $message
            ]);
            echo json_encode(['statut' => "succes", 'message' => "Merci ! Votre message a bien été reçu !"]);
        } catch (PDOException $e) {
            error_log("[$name - $email] [Erreur] Echec de l'insertion : " . $e->getMessage() . "...");
            echo json_encode(['statut' => "erreur", 'message' => "Echec lors de l'enregistrement des données..."]);
        }
    } else {
        error_log("[$name - $email] [Erreur] Adresse email invalide...");
        echo json_encode(['statut' => "erreur", 'message' => "Adresse email invalide..."]);
    }
} else {
    error_log("[$name - $email] [Erreur] Tous les champs sont obligatoires...");
    echo json_encode(['statut' => "erreur", 'message' => "Tous les champs sont obligatoires..."]);
}

// DECONNEXION DE LA BASE DE DONNEES
$connexionDB = null;
?>