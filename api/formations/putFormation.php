<?php
header('Content-Type: application/json; charset=utf-8');

// CONNEXION A LA BASE DE DONNEES
require_once '../db_connection.php';

// RECUPERATION DES DONNEES DU FORMULAIRE
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id = $_POST['id'] ?? '';
    $degree = $_POST['diplome'] ?? '';
    $start = $_POST['date-debut'] ?? '';
    $end = $_POST['date-fin'] ?? '';
    $place = $_POST['place'] ?? '';
    $description = $_POST['description'] ?? '';
} else {
    error_log("[FORMATIONS] No forms received");
    echo json_encode(['status' => "error", 'message' => "Aucun formulaire reçu"]);
    exit;
}

// TRAITEMENT
if (!empty($id) && !empty($degree) && !empty($start) && !empty($end) && !empty($place) && !empty($description)) {
    try {
        // ENREGISTREMENT DANS LA BASE DE DONNEES
        $sql = "UPDATE formations SET degree = :degree, start = :start, end = :end, place = :place, description = :description WHERE id = :id";
        $stmt = $connexionDB->prepare($sql);
        $stmt->execute([
            ':degree' => $degree,
            ':start' => $start,
            ':end' => $end,
            ':place' => $place,
            ':description' => $description,
            ':id' => $id
        ]);

        echo json_encode(['status' => "success", 'message' => "Formation modifiée avec succès"]);
    } catch (PDOException $e) {
        error_log("[FORMATIONS] Failed update: " . $e->getMessage());
        echo json_encode(['status' => "error", 'message' => "Echec lors de la modification"]);
    }
} else {
    // Pas de error_log car c'est une erreur utilisateur attendue.
    echo json_encode(['status' => "error", 'message' => "Tous les champs sont obligatoires"]);
}

// DECONNEXION DE LA BASE DE DONNEES
$connexionDB = null;
