<?php
header('Content-Type: application/json; charset=utf-8');

// CONNECTING TO THE DATABASE
require_once '../db_connection.php';

// RETRIEVING DATA FROM THE FORM
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id = $_POST['id'] ?? '';
    $title = $_POST['title'] ?? '';
    $start = $_POST['start'] ?? '';
    $end = $_POST['end'] ?? '';
    $place = $_POST['place'] ?? '';
    $description = $_POST['description'] ?? '';
} else {
    error_log("[EXPERIENCES] No forms received");
    echo json_encode(['status' => "error", 'message' => "Aucun formulaire reçu"]);
    exit;
}

// TREATMENT
if (!empty($id) && !empty($title) && !empty($start) && !empty($end) && !empty($place) && !empty($description)) {
    try {
        // ENTRY INTO THE DATABASE
        $sql = "UPDATE experiences SET title = :title, start = :start, end = :end, place = :place, description = :description WHERE id = :id";
        $stmt = $connexionDB->prepare($sql);
        $stmt->execute([
            ':title' => $title,
            ':start' => $start,
            ':end' => $end,
            ':place' => $place,
            ':description' => $description,
            ':id' => $id
        ]);

        echo json_encode(['status' => "success", 'message' => "Expérience modifiée avec succès"]);
    } catch (PDOException $e) {
        error_log("[EXPERIENCES] Failed update: " . $e->getMessage());
        echo json_encode(['status' => "error", 'message' => "Echec lors de la modification"]);
    }
} else {
    // No error_log because this is an expected user error.
    echo json_encode(['status' => "error", 'message' => "Tous les champs sont obligatoires"]);
}

// DISCONNECTING FROM THE DATABASE
$connexionDB = null;