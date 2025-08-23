<?php
header("Access-Control-Allow-Origin: *"); // Adjust as needed
header("Content-Type: application/json");

$counterFile = 'counter.txt';
$ipFile = 'ips.json'; // Soubor pro uložení IP adres

// Načtení seznamu IP adres
$votedIps = file_exists($ipFile) ? json_decode(file_get_contents($ipFile), true) : [];

// Zjištění IP adresy uživatele
$userIp = $_SERVER['REMOTE_ADDR'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Zkontrolujte, zda uživatel již hlasoval
    if (in_array($userIp, $votedIps)) {
        http_response_code(400);
        echo json_encode(['error' => 'Už jste hlasovali.']);
        exit;
    }

    // Načtení aktuálního stavu počítadla
    $counter = file_exists($counterFile) ? (int)file_get_contents($counterFile) : 0;

    // Inkrementace počítadla
    $counter++;
    file_put_contents($counterFile, $counter);

    // Uložení IP adresy
    $votedIps[] = $userIp;
    file_put_contents($ipFile, json_encode($votedIps));

    // Odpověď s novým stavem počítadla
    echo json_encode(['counter' => $counter]);

} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Načtení aktuálního stavu počítadla
    $counter = file_exists($counterFile) ? (int)file_get_contents($counterFile) : 0;
    echo json_encode(['counter' => $counter]);

} else {
    // Nepodporovaná metoda
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Method Not Allowed']);
}
?>
