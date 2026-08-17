<?php
header('Content-Type: application/json; charset=utf-8');

// CONNECTING TO THE DATABASE
require_once '../db_connection.php';

// RETRIEVING DATA FROM THE FORM
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id = $_POST['id'] ?? '';
} else {
    error_log("[EXPERIENCES] No forms received");
    echo json_encode(['status' => "error", 'message' => "Aucun formulaire reçu"]);
    exit;
}

// TREATMENT
if (!empty($id)) {
    try {
        // DELETION OF THE DATABASE CREATION
        $sql = "DELETE FROM experiences WHERE id = :id";
        $stmt = $connexionDB->prepare($sql);
        $stmt->execute([
            ':id' => $id
        ]);

        echo json_encode(['status' => "success", 'message' => "Expérience supprimée avec succès"]);
    } catch (PDOException $e) {
        error_log("[EXPERIENCES] Failed delete: " . $e->getMessage());
        echo json_encode(['status' => "error", 'message' => "Echec lors de la suppression"]);
    }
} else {
    error_log("[EXPERIENCES] Experience ID not received");
    echo json_encode(['status' => "error", 'message' => "Tous les champs sont obligatoires"]);
}

// DISCONNECTING FROM THE DATABASE
$connexionDB = null;