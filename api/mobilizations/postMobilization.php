<?php
header('Content-Type: application/json; charset=utf-8');

// CONNECTING TO THE DATABASE
require_once '../db_connection.php';

// RETRIEVING DATA FROM THE FORM
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $project = $_POST['project'] ?? '';
    $technology = $_POST['skill'] ?? '';
} else {
    error_log("[MOBILIZATIONS] No forms received");
    echo json_encode(['status' => "error", 'message' => "Aucun formulaire reçu"]);
    exit;
}

// TREATMENT
if (!empty($project) && !empty($skill)) {
    try {
        // ENTRY INTO THE DATABASE
        $sql = "INSERT INTO mobilizations (project, technology) VALUES (:project, :technology)";
        $stmt = $connexionDB->prepare($sql);
        $stmt->execute([
            ':project' => $project,
            ':technology' => $technology
        ]);

        echo json_encode(['status' => "success", 'message' => "Mobilisation ajoutée avec succès"]);
    } catch (PDOException $e) {
        error_log("[MOBILIZATIONS] Failed insertion: " . $e->getMessage());
        echo json_encode(['status' => "error", 'message' => "Echec lors de l'enregistrement des données"]);
    }
} else {
    // No error_log because this is an expected user error.
    echo json_encode(['status' => "error", 'message' => "Tous les champs sont obligatoires"]);
}

// DISCONNECTING FROM THE DATABASE
$connexionDB = null;