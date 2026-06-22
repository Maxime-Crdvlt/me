<?php 
session_start();
header('Content-Type: application/json; charset=utf-8');

// CONNEXION A LA BASE DE DONNEES
require_once 'config_portfolio.php'; //import $dsn, $user, $password
try {
    $connexionDB = new PDO($dsn, $user, $password);
    $connexionDB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    error_log("[Erreur] Echec de la connexion : " . $e->getMessage() . "...");
    echo json_encode(['statut' => "erreur", 'message' => "Echec de la connexion à la base de données..."]);
    exit;
}

try {
    // SELECTION DANS LA BASE DE DONNEES
    $sql = "SELECT `id`, `degree`, `start`, `end`, `place`, `description` FROM formations";
    $stmt = $connexionDB->prepare($sql);
    $stmt->execute();

    $formations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // ENVOIE DES DONNEES
    echo json_encode($formations);
} catch (PDOException $e) {
    error_log("[ADMIN] [Erreur] Echec de la selection : " . $e->getMessage() . "...");
    echo json_encode(['statut' => "erreur", 'message' => "Echec lors de la recherche des données..."]);
}

// DECONNEXION DE LA BASE DE DONNEES
$connexionDB = null;
?>