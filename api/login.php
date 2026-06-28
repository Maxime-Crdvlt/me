<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

// CONNEXION A LA BASE DE DONNEES
require_once '/api/db_connection.php';

// RECUPERATION DES DONNEES DU FORMULAIRE
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
} else {
    error_log("[LOGIN] No forms received");
    echo json_encode(['status' => "error", 'message' => "Aucun formulaire reçu"]);
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
            echo json_encode(['status' => "success", 'message' => "Connexion réussie"]);
        } else {
            // Pas de error_log car c'est une erreur utilisateur attendue.
            echo json_encode(['status' => "error", 'message' => "Identifiants incorrects"]);
        }
    } catch (PDOException $e) {
        error_log("[LOGIN] Failed selection: " . $e->getMessage());
        echo json_encode(['status' => "error", 'message' => "Echec lors de la recherche des données"]);
    }
} else {
    // Pas de error_log car c'est une erreur utilisateur attendue.
    echo json_encode(['status' => "error", 'message' => "Tous les champs sont obligatoires"]);
}

// DECONNEXION DE LA BASE DE DONNEES
$connexionDB = null;
