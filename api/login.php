<?php 
session_start();
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
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
} else {
    error_log("[Erreur] Aucun formulaire soumis...");
    echo json_encode(['statut' => "erreur", 'message' => "Aucun formulaire reçu..."]);
    exit;
}

// TRAITEMENT
if (!empty($username) && !empty($password)) {
    try {
        // SELECTION DANS LA BASE DE DONNEES
        $sql = "SELECT id, username, password FROM admins WHERE username = :username";
        $stmt = $connexionDB->prepare($sql);
        $stmt->execute([
            ':username' => $username
        ]);

        $admin = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($admin && password_verify($password, $admin['password'])) {
            $_SESSION['admin_logged'] = true;
            $_SESSION['admin_id'] = $admin['id'];
            $_SESSION['admin_username'] = $admin['username'];
            echo json_encode(['statut' => "succes", 'message' => "Connexion réussie."]);
        } else {
            error_log("[LOGIN ADMIN] [Erreur] Tentative échouée pour : " . $username);
            echo json_encode(['statut' => "erreur", 'message' => "Identifiants incorrects."]);
        }
    } catch (PDOException $e) {
        error_log("[LOGIN ADMINI] [Erreur] Echec de la selection : " . $e->getMessage() . "...");
        echo json_encode(['statut' => "erreur", 'message' => "Echec lors de la recherche des données..."]);
    }
} else {
    error_log("[ADMIN] [Erreur] Tous les champs sont obligatoires...");
    echo json_encode(['statut' => "erreur", 'message' => "Tous les champs sont obligatoires..."]);
}

// DECONNEXION DE LA BASE DE DONNEES
$connexionDB = null;
?>