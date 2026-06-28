<?php
header('Content-Type: application/json; charset=utf-8');

// CONNEXION A LA BASE DE DONNEES
require_once '../db_connection.php';

// RECUPERATION DES DONNEES DU FORMULAIRE
if ($_SERVER["REQUEST_METHOD"] === "POST") {
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
if (!empty($degree) && !empty($start) && !empty($end) && !empty($place) && !empty($description)) {
    try {
        // ENREGISTREMENT DANS LA BASE DE DONNEES
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
    // Pas de error_log car c'est une erreur utilisateur attendue.
    echo json_encode(['status' => "error", 'message' => "Tous les champs sont obligatoires"]);
}

// DECONNEXION DE LA BASE DE DONNEES
$connexionDB = null;
