<?php
header('Content-Type: application/json; charset=utf-8');

// CONNECTING TO THE DATABASE
require_once '../db_connection.php';

// RETRIEVING DATA FROM THE FORM
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $skill = $_POST['skill'] ?? '';
    $type = $_POST['type'] ?? '';
    $category = $_POST['category'] ?? '';
} else {
    error_log("[SKILLS] No forms received");
    echo json_encode(['status' => "error", 'message' => "Aucun formulaire reçu"]);
    exit;
}

// TREATMENT
if (!empty($skill) && !empty($type) && !empty($category)) {
    try {
        // ENTRY INTO THE DATABASE
        $sql = "INSERT INTO technologies (name, category, libelle) VALUES (:name, :category, :libelle)";
        $stmt = $connexionDB->prepare($sql);
        $stmt->execute([
            ':name' => $skill,
            ':category' => $category,
            ':libelle' => $type
        ]);

        echo json_encode(['status' => "success", 'message' => "Compétence ajoutée avec succès"]);
    } catch (PDOException $e) {
        error_log("[SKILLS] Failed insertion: " . $e->getMessage());
        echo json_encode(['status' => "error", 'message' => "Echec lors de l'enregistrement des données"]);
    }
} else {
    // No error_log because this is an expected user error.
    echo json_encode(['status' => "error", 'message' => "Tous les champs sont obligatoires"]);
}

// DISCONNECTING FROM THE DATABASE
$connexionDB = null;