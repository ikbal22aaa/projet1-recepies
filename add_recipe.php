<?php
include 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Expecting JSON body
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON body']);
    exit;
}

// Basic validation
$required = ['title','category','time','servings','difficulty'];
foreach ($required as $field) {
    if (!isset($data[$field]) || $data[$field] === '') {
        http_response_code(400);
        echo json_encode(['error' => "Missing field: $field"]);
        exit;
    }
}

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare('INSERT INTO recipes (title, category, time, servings, difficulty, image, description) VALUES (:title, :category, :time, :servings, :difficulty, :image, :description)');
    $stmt->execute([
        ':title' => $data['title'],
        ':category' => $data['category'],
        ':time' => (int)$data['time'],
        ':servings' => (int)$data['servings'],
        ':difficulty' => $data['difficulty'],
        ':image' => isset($data['image']) ? $data['image'] : null,
        ':description' => isset($data['description']) ? $data['description'] : null,
    ]);
    $recipeId = (int)$pdo->lastInsertId();

    if (!empty($data['ingredients']) && is_array($data['ingredients'])) {
        $stmtIng = $pdo->prepare('INSERT INTO ingredients (recipe_id, ingredient) VALUES (:rid, :ing)');
        foreach ($data['ingredients'] as $ing) {
            if (trim($ing) === '') continue;
            $stmtIng->execute([':rid' => $recipeId, ':ing' => $ing]);
        }
    }

    if (!empty($data['instructions']) && is_array($data['instructions'])) {
        $stmtIns = $pdo->prepare('INSERT INTO instructions (recipe_id, step_number, instruction) VALUES (:rid, :step, :ins)');
        $step = 1;
        foreach ($data['instructions'] as $ins) {
            if (trim($ins) === '') continue;
            $stmtIns->execute([':rid' => $recipeId, ':step' => $step, ':ins' => $ins]);
            $step++;
        }
    }

    $pdo->commit();
    echo json_encode(['success' => true, 'id' => $recipeId]);
} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>



