<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

// CONNECTING TO THE DATABASE
require_once '../db_connection.php';

try {
    // DATA RECOVERY
    $sql = "SELECT `id`, `title`, `start`, `end`, `place`, `description` FROM experiences ORDER BY `start` ASC";
    $stmt = $connexionDB->prepare($sql);
    $stmt->execute();
    $formations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // SEND DATA
    echo json_encode($formations);
} catch (PDOException $e) {
    error_log("[EXPERIENCES] Failed selection: " . $e->getMessage());
    echo json_encode(['status' => "error", 'message' => "Echec lors de la recherche des données"]);
}

// DISCONNECTING FROM THE DATABASE
$connexionDB = null;