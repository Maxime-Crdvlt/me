<?php
header('Content-Type: application/json; charset=utf-8');

// CONNECTING TO THE DATABASE
require_once '../db_connection.php';

// RETRIEVING DATA FROM THE FORM
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $degree = $_POST['degree'] ?? '';
    $start = $_POST['start'] ?? '';
    $end = $_POST['end'] ?? '';
    $place = $_POST['place'] ?? '';
    $description = $_POST['description'] ?? '';
} else {
    error_log("[FORMATIONS] No forms received");
    echo json_encode(['status' => "error", 'message' => "Aucun formulaire reçu"]);
    exit;
}

// TREATMENT
if (!empty($degree) && !empty($start) && !empty($end) && !empty($place) && !empty($description)) {
    try {
        // ENTRY INTO THE DATABASE
        $sql = "INSERT INTO formations (degree, start, end, place, description) VALUES (:degree, :start, :end, :place, :description)";
        $stmt = $connexionDB->prepare($sql);
        $stmt->execute([
            ':degree' => $degree,
            ':start' => $start,
            ':end' => $end,
            ':place' => $place,
            ':description' => $description
        ]);

        echo json_encode(['status' => "success", 'message' => "Formation ajoutée avec succès"]);
    } catch (PDOException $e) {
        error_log("[FORMATIONS] Failed insertion: " . $e->getMessage());
        echo json_encode(['status' => "error", 'message' => "Echec lors de l'enregistrement des données"]);
    }
} else {
    // No error_log because this is an expected user error.
    echo json_encode(['status' => "error", 'message' => "Tous les champs sont obligatoires"]);
}

// DISCONNECTING FROM THE DATABASE
$connexionDB = null;