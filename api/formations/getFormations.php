<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

// CONNEXION A LA BASE DE DONNEES
require_once '../db_connection.php';

try {
    // SELECTION DANS LA BASE DE DONNEES
    $sql = "SELECT `id`, `degree`, `start`, `end`, `place`, `description` FROM formations";
    $stmt = $connexionDB->prepare($sql);
    $stmt->execute();
    $formations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // ENVOIE DES DONNEES
    echo json_encode($formations);
} catch (PDOException $e) {
    error_log("[FORMATIONS] Failed selection: " . $e->getMessage());
    echo json_encode(['status' => "error", 'message' => "Echec lors de la recherche des données"]);
}

// DECONNEXION DE LA BASE DE DONNEES
$connexionDB = null;
