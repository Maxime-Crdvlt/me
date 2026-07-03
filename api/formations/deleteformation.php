<?php
header('Content-Type: application/json; charset=utf-8');

// CONNEXION A LA BASE DE DONNEES
require_once '../db_connection.php';

// RECUPERATION DES DONNEES DU FORMULAIRE
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id = $_POST['id'] ?? '';
} else {
    error_log("[FORMATIONS] No forms received");
    echo json_encode(['status' => "error", 'message' => "Aucun formulaire reçu"]);
    exit;
}

// TRAITEMENT
if (!empty($id)) {
    try {
        // SUPPRESSION DE LA FORMATION DE LA BASE DE DONNEES
        $sql = "DELETE FROM formations WHERE id = :id";
        $stmt = $connexionDB->prepare($sql);
        $stmt->execute([
            ':id' => $id
        ]);

        echo json_encode(['status' => "success", 'message' => "Formation supprimée avec succès"]);
    } catch (PDOException $e) {
        error_log("[FORMATIONS] Failed update: " . $e->getMessage());
        echo json_encode(['status' => "error", 'message' => "Echec lors de la modification"]);
    }
} else {
    error_log("[FORMATIONS] Formation ID not received");
    echo json_encode(['status' => "error", 'message' => "Tous les champs sont obligatoires"]);
}

// DECONNEXION DE LA BASE DE DONNEES
$connexionDB = null;