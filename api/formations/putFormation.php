<?php
header('Content-Type: application/json; charset=utf-8');

// CONNEXION A LA BASE DE DONNEES
require_once 'config_portfolio.php'; //import $dsn, $user, $password
try {
    $connexionDB = new PDO($dsn, $user, $password);
    $connexionDB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    error_log("[ADMIN-FORMATIONS] [Erreur] Echec de la connexion : " . $e->getMessage() . "...");
    echo json_encode(['statut' => "erreur", 'message' => "Echec de la connexion à la base de données..."]);
    exit;
}

// RECUPERATION DES DONNEES DU FORMULAIRE
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id = $_POST['id'] ?? '';
    $degree = $_POST['diplome'] ?? '';
    $start = $_POST['date-debut'] ?? '';
    $end = $_POST['date-fin'] ?? '';
    $place = $_POST['place'] ?? '';
    $description = $_POST['description'] ?? '';
} else {
    error_log("[ADMIN-FORMATIONS] [Erreur] Aucun formulaire soumis...");
    echo json_encode(['statut' => "erreur", 'message' => "Aucun formulaire reçu..."]);
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

        echo json_encode(['statut' => "succes", 'message' => "Formation modifiée avec succès !"]);
    } catch (PDOException $e) {
        error_log("[ADMIN-FORMATIONS] [Erreur] Echec de la modification : " . $e->getMessage() . "...");
        echo json_encode(['statut' => "erreur", 'message' => "Echec lors de la modification..."]);
    }
} else {
    error_log("[ADMIN-FORMATIONS] [Erreur] Tous les champs sont obligatoires...");
    echo json_encode(['statut' => "erreur", 'message' => "Tous les champs sont obligatoires..."]);
}

// DECONNEXION DE LA BASE DE DONNEES
$connexionDB = null;
