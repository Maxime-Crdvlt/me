<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

// CONNECTING TO THE DATABASE
require_once '../db_connection.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $project = $_POST['project'] ?? '';
} else {
    error_log("[MOBILIZATIONS] No forms received");
    echo json_encode(['status' => "error", 'message' => "Aucun formulaire reçu"]);
    exit;
}

if (!empty($project)) {
    try {
        // DATA RECOVERY
        $sql = "SELECT `id`, `project`, `technology` FROM mobilization WHERE project = :project";
        $stmt = $connexionDB->prepare($sql);
        $stmt->execute([
            ':project' => $project
        ]);
        $mobilizations = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // SEND DATA
        echo json_encode($mobilizations);
    } catch (PDOException $e) {
        error_log("[MOBILIZATIONS] Failed selection: " . $e->getMessage());
        echo json_encode(['status' => "error", 'message' => "Echec lors de la recherche des données"]);
    }
} else {
    // No error_log because this is an expected user error.
    echo json_encode(['status' => "error", 'message' => "Tous les champs sont obligatoires"]);
}

// DISCONNECTING FROM THE DATABASE
$connexionDB = null;