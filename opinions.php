<?php
// Set CORS headers
//header("Access-Control-Allow-Origin: https://www.miroslavzeleny.cz"); // Adjust to your frontend URL
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allow methods needed
header("Access-Control-Allow-Headers: Content-Type"); // Allow headers needed

// Content-Type header for POST request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Allow preflight requests response
    http_response_code(204);
    exit();
}

// Simulated opinions data (replace with actual logic)
/*$opinions = [
    ['author' => 'John Doe', 'text' => 'Great service!'],
    ['author' => 'Jane Smith', 'text' => 'Love the product!']
];*/

function debuglog($txt){
    $fd=fopen("debug.txt","a");
    fwrite($fd,$txt);
    fclose($fd);
}
$opinions = json_decode(file_get_contents("opinions.json"), true);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    echo json_encode($opinions);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $newdata=file_get_contents('php://input');
    debuglog($newdata);
    $newdata=json_decode($newdata,true);
    $opinions[] = ['author' => $newdata['author'], 'text' => $newdata['text']];
    debuglog(json_encode($opinions));
    echo json_encode(['success' => true]);
    $f=fopen("opinions.json","w");
    fwrite($f,json_encode($opinions));
    fclose($f);
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Method Not Allowed']);
}
?>
