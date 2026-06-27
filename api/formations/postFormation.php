<?php
header('Content-Type: application/json; charset=utf-8');

// CONNEXION A LA BASE DE DONNEES
require_once '/api/config_portfolio.php'; //import $dsn, $user, $password
try {
    $connexionDB = new PDO($dsn, $user, $password);
    $connexionDB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    error_log("[ADMIN-FORMATIONS] Echec de la connexion : " . $e->getMessage() . "...");
    echo json_encode(['statut' => "erreur", 'message' => "Echec de la connexion à la base de données..."]);
    exit;
}

// RECUPERATION DES DONNEES DU FORMULAIRE
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $degree = $_POST['diplome'] ?? '';
    $start = $_POST['date-debut'] ?? '';
    $end = $_POST['date-fin'] ?? '';
    $place = $_POST['place'] ?? '';
    $description = $_POST['description'] ?? '';
} else {
    error_log("[ADMIN-FORMATIONS] Aucun formulaire soumis...");
    echo json_encode(['statut' => "erreur", 'message' => "Aucun formulaire reçu..."]);
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

        echo json_encode(['statut' => "succes", 'message' => "Formation ajoutée avec succès !"]);
    } catch (PDOException $e) {
        error_log("[ADMIN-FORMATIONS] Echec de l'insertion : " . $e->getMessage() . "...");
        echo json_encode(['statut' => "erreur", 'message' => "Echec lors de l'enregistrement des données..."]);
    }
} else {
    error_log("[ADMIN-FORMATIONS] Tous les champs sont obligatoires...");
    echo json_encode(['statut' => "erreur", 'message' => "Tous les champs sont obligatoires..."]);
}

// DECONNEXION DE LA BASE DE DONNEES
$connexionDB = null;
