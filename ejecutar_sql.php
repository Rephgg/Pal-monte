<?php
$host = 'mysql-dba318d-palmonte1.i.aivencloud.com';
$port = 25986;
$user = 'avnadmin';
$pass = '';
$db   = 'defaultdb';

$dsn = "mysql:host=$host;port=$port;dbname=$db;sslmode=required";

try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    echo "Conectado a Aiven OK\n";

    $pdo->exec("CREATE DATABASE IF NOT EXISTS palmonte CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "Base de datos 'palmonte' creada/verificada\n";

    $pdo->exec("USE palmonte");
    $pdo->exec("SET FOREIGN_KEY_CHECKS=0");

    $sql = file_get_contents('D:/PalMonte/database/palmonte_xampp.sql');
    $statements = array_filter(array_map('trim', explode(';', $sql)));

    $cont = 0;
    $errores = 0;
    foreach ($statements as $stmt) {
        if (empty($stmt)) continue;
        if (strpos($stmt, '/*!') === 0 || strpos($stmt, '--') === 0) continue;
        try {
            $pdo->exec($stmt);
            $cont++;
        } catch (PDOException $e) {
            $errores++;
            echo "Omitido: " . substr($stmt, 0, 60) . "... -> " . $e->getMessage() . "\n";
        }
    }

    $pdo->exec("SET FOREIGN_KEY_CHECKS=1");

    echo "Ejecutadas $cont sentencias con $errores errores (ignorados). Tablas creadas en palmonte.\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
