<?php
header('Content-Type: application/json; charset=utf-8');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require __DIR__ . '/../vendor/autoload.php';

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

// RECUPERATION DES DONNEES DU FORMULAIRE
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $user_name = $_POST['user_name'] ?? '';
    $user_email = $_POST['user_email'] ?? '';
    $user_message = $_POST['user_message'] ?? '';
    $user_email = filter_var($user_email, FILTER_SANITIZE_EMAIL);
} else {
    error_log("[Erreur] Aucun formulaire soumis...");
    echo json_encode(['statut' => "erreur", 'message' => "Aucun formulaire reçu..."]);
    exit;
}

// TRAITEMENT
if (!empty($user_name) && !empty($user_email) && !empty($user_message)) {
    if (filter_var($user_email, FILTER_VALIDATE_EMAIL)) {
        try {
            // ENREGISTREMENT DANS LA BASE DE DONNEES
            $sql = "INSERT INTO contacts (name, email, message, sent) VALUES (:name, :email, :message, NOW())";
            $stmt = $connexionDB->prepare($sql);
            $stmt->execute([
                ':name' => $user_name,
                ':email' => $user_email,
                ':message' => $user_message
            ]);

            // ENVOIE DE L'EMAIL
            require_once 'config_mail.php'; //import $mail_user, $mail_password
            $mail = new PHPMailer(true);
            try {
                /// Configuration du serveur SMTP
                $mail->isSMTP();
                $mail->Host       = 'ssl0.ovh.net';
                $mail->SMTPAuth   = true;
                $mail->Username   = $mail_user;
                $mail->Password   = $mail_password;
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
                $mail->Port       = 465;
                // Destinataires
                $mail->setFrom($mail_user, 'Mon Portfolio');
                $mail->addAddress($mail_user);
                $mail->addReplyTo($user_email, $user_name);
                // Contenu de l'email
                $mail->isHTML(true);
                $mail->Subject = 'Nouveau message de ' . $user_name;
                $mail->Body    = "
                    <h2>Nouveau message depuis le portfolio</h2>
                    <p><strong>Nom :</strong> {$user_name}</p>
                    <p><strong>Email :</strong> {$user_email}</p>
                    <p><strong>Message :</strong><br>" . nl2br(htmlspecialchars($user_message)) . "</p>
                ";
                $mail->send();
            } catch (Exception $e) {
                error_log("[$user_name - $user_email] [Erreur] Le mail n'a pas pu etre envoye. Erreur Mailer: {$mail->ErrorInfo}" . "...");
            }
            echo json_encode(['statut' => "succes", 'message' => "Merci ! Votre message a bien été reçu !"]);
        } catch (PDOException $e) {
            error_log("[$user_name - $user_email] [Erreur] Echec de l'insertion : " . $e->getMessage() . "...");
            echo json_encode(['statut' => "erreur", 'message' => "Echec lors de l'enregistrement des données..."]);
        }
    } else {
        error_log("[$user_name - $user_email] [Erreur] Adresse email invalide...");
        echo json_encode(['statut' => "erreur", 'message' => "Adresse email invalide..."]);
    }
} else {
    error_log("[$user_name - $user_email] [Erreur] Tous les champs sont obligatoires...");
    echo json_encode(['statut' => "erreur", 'message' => "Tous les champs sont obligatoires..."]);
}

// DECONNEXION DE LA BASE DE DONNEES
$connexionDB = null;
