<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

// CONNECTING TO THE DATABASE
require_once '../db_connection.php';

try {
    // DATA RECOVERY
    $sql = "
    SELECT 
        t.id AS id,
        t.name AS competence,
        ty.libelle AS type,
        ty.id AS type_id,
        c.title AS categorie,
        c.id AS categorie_id
    FROM 
        technologies t
    INNER JOIN 
        categories c ON t.category = c.id
    INNER JOIN 
        types ty ON t.libelle = ty.id
    ORDER BY 
        c.id ASC, 
        ty.id ASC;
    ";
    $stmt = $connexionDB->prepare($sql);
    $stmt->execute();
    $skills = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // SEND DATA
    echo json_encode($skills);
} catch (PDOException $e) {
    error_log("[SKILLS] Failed selection: " . $e->getMessage());
    echo json_encode(['status' => "error", 'message' => "Echec lors de la recherche des données"]);
}

// DISCONNECTING FROM THE DATABASE
$connexionDB = null;