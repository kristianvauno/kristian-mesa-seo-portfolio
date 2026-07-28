<?php
// Perplexity API Integration for PHP / cPanel / WordPress Hosting
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$websiteUrl = isset($input['websiteUrl']) ? trim($input['websiteUrl']) : '';
$targetLocation = isset($input['targetLocation']) ? trim($input['targetLocation']) : '';

if (empty($websiteUrl) || empty($targetLocation)) {
    http_response_code(400);
    echo json_encode(['error' => 'Website URL and Target Location are required.']);
    exit;
}

$apiKey = getenv('PERPLEXITY_API_KEY') ?: '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';

$prompt = "Perform a concise, real-time SEO & Local Search diagnostic audit for the domain \"$websiteUrl\" targeting potential customers in \"$targetLocation\". Return ONLY a valid JSON object with keys: score (number 60-95), onPageStatus, speedStatus, geoStatus, techStatus, recommendation (HTML bullet points for Kristian Mesa).";

$ch = curl_init('https://api.perplexity.ai/chat/completions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey,
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'model' => 'sonar',
    'messages' => [
        ['role' => 'system', 'content' => 'You are an expert Local SEO audit assistant. Output ONLY valid JSON.'],
        ['role' => 'user', 'content' => $prompt]
    ],
    'temperature' => 0.2
]));

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    http_response_code(500);
    echo json_encode(['error' => 'Perplexity API request failed.']);
    exit;
}

$data = json_decode($response, true);
$contentStr = $data['choices'][0]['message']['content'] ?? '{}';
$cleanJsonStr = preg_replace('/```json|```/', '', $contentStr);

echo $cleanJsonStr;
?>
