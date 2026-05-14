<?php
// CONNEXION A LA BASE DE DONNEES
require_once 'config_portfolio.php';
$dsn = "mysql:host=$host;dbname=$name;charset=$charset";
$connexionDB = new PDO($dsn, $user, $password);

// RECUPERATION DES DONNEES DU FORMULAIRE
$name = $_POST['user_name'];
$email = $_POST['user_email'];
$message = $_POST['user_message'];

// TRAITEMENT
if (!empty($name) && !empty($email) && !empty($message)) {
        $sql = "INSERT INTO contacts (name, email, message, envoi) VALUES (:name, :email, :message, NOW())";
        $stmt = $connexionDB->prepare($sql);
        $stmt->execute([
            ':name' => $name,
            ':email' => $email,
            ':message' => $message
        ]);
        echo "Merci $name, votre message a bien été envoyé !";
    } else {
        echo "Erreur : Tous les champs sont obligatoires.";
    }
?>