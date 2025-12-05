<?php
include 'config.php';

header('Content-Type: application/json');

try {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid recipe id']);
        exit;
    }

    // Fetch recipe
    $stmt = $pdo->prepare('SELECT * FROM recipes WHERE id = :id');
    $stmt->execute([':id' => $id]);
    $recipe = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$recipe) {
        http_response_code(404);
        echo json_encode(['error' => 'Recipe not found']);
        exit;
    }

    // Fetch ingredients
    $stmt = $pdo->prepare('SELECT ingredient FROM ingredients WHERE recipe_id = :id ORDER BY id ASC');
    $stmt->execute([':id' => $id]);
    $ingredients = array_map(function($row){ return $row['ingredient']; }, $stmt->fetchAll(PDO::FETCH_ASSOC));

    // Fetch instructions
    $stmt = $pdo->prepare('SELECT step_number, instruction FROM instructions WHERE recipe_id = :id ORDER BY step_number ASC');
    $stmt->execute([':id' => $id]);
    $instructions = array_map(function($row){ return $row['instruction']; }, $stmt->fetchAll(PDO::FETCH_ASSOC));

    echo json_encode([
        'recipe' => $recipe,
        'ingredients' => $ingredients,
        'instructions' => $instructions
    ]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>



