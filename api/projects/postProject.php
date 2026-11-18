<?php
header('Content-Type: application/json; charset=utf-8');

// CONNECTING TO THE DATABASE
require_once '../db_connection.php';

// RETRIEVING DATA FROM THE FORM
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = $_POST['name'] ?? '';
    $description = $_POST['description'] ?? '';
    $link = $_POST['link'] ?? '';
    $realization = $_POST['realization'] ?? '';
} else {
    error_log("[PROJECTS] No forms received");
    echo json_encode(['status' => "error", 'message' => "Aucun formulaire reçu"]);
    exit;
}

// TREATMENT
if (!empty($name) && !empty($description) && !empty($link) && !empty($realization)) {
    try {
        // ENTRY INTO THE DATABASE
        $sql = "INSERT INTO projects (name, description, link, realization) VALUES (:name, :description, :link, :realization)";
        $stmt = $connexionDB->prepare($sql);
        $stmt->execute([
            ':name' => $name,
            ':description' => $description,
            ':link' => $link,
            ':realization' => $realization
        ]);

        echo json_encode(['status' => "success", 'message' => "Projet ajoutée avec succès"]);
    } catch (PDOException $e) {
        error_log("[PROJECTS] Failed insertion: " . $e->getMessage());
        echo json_encode(['status' => "error", 'message' => "Echec lors de l'enregistrement des données"]);
    }
} else {
    // No error_log because this is an expected user error.
    echo json_encode(['status' => "error", 'message' => "Tous les champs sont obligatoires"]);
}

// DISCONNECTING FROM THE DATABASE
$connexionDB = null;