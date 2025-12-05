<?php
include 'config.php';

header('Content-Type: application/json');

try {
    $search = isset($_GET['search']) ? $_GET['search'] : '';
    $category = isset($_GET['category']) ? $_GET['category'] : '';
    $maxTime = isset($_GET['max_time']) ? $_GET['max_time'] : null;
    $difficulty = isset($_GET['difficulty']) ? $_GET['difficulty'] : '';
    
    $sql = "SELECT * FROM recipes WHERE 1=1";
    $params = [];
    
    if (!empty($search)) {
        $sql .= " AND (title LIKE :search OR description LIKE :search)";
        $params[':search'] = "%$search%";
    }
    
    if (!empty($category)) {
        $sql .= " AND category = :category";
        $params[':category'] = $category;
    }
    
    if (!empty($maxTime)) {
        $sql .= " AND time <= :max_time";
        $params[':max_time'] = $maxTime;
    }
    
    if (!empty($difficulty)) {
        $sql .= " AND difficulty = :difficulty";
        $params[':difficulty'] = $difficulty;
    }
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $recipes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($recipes);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>