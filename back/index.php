<?php
const APP_LOADED = true;
header('Content-type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000"); // Replace * with the specific domain(s) you want to allow
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


use App\Models\ApiHelpers;
use App\Controllers\UsersController;


try {
    require_once 'lib/Models/ApiHelpers.php';
    require_once 'lib/Models/DBHelper.php';
    require_once 'lib/Controllers/UsersController.php';


    $config = ApiHelpers::fetchArray(__DIR__ . DIRECTORY_SEPARATOR . "config.json");

    $db_config = (array)($config->db);
    $db_config["database"] = "db" . DIRECTORY_SEPARATOR . $db_config["database"];

    $_Helper = new ApiHelpers($config);
    $user_controller = new UsersController($_Helper);

    switch (strtolower(substr($_SERVER['PATH_INFO'], 1))) {
        case "login":
            $res = $_Helper->validateRequest(false, false, "POST");
            $result = $user_controller->login();
            break;
        case "users/store":
            $res = $_Helper->validateRequest(false, false, "POST");
            $result = $user_controller->create();
            break;

        case "user/update":
            $res = $_Helper->validateRequest(false, true, "POST");
            $result = $user_controller->update();
            break;

        case "users/get":
            $_Helper->validateRequest(false, true);
            $result = $user_controller->get();
            break;
        case "users/current":
            $_Helper->validateRequest(false, true);
            $result = $_Helper->getLoggedInUser();
            if (!$result) {
                $result = $this->_Helper->returnResult(["error" => "Unauthenticated."], 401);
            }
            break;
        case "ping":
            $_Helper->validateRequest(false);
            $result = ["success" => ["ping" => "pong"], "message" => "pong"];
            break;
        default:
            http_response_code(404);
            die();
    }
    die(json_encode($result));
} catch (Throwable $e) {
    $_Helper = new ApiHelpers(__DIR__ . DIRECTORY_SEPARATOR . "config.json");
    $_Helper->logFile('Exception Thrown: ' . $e->getMessage() . " at " . $e->getFile() . ":" . $e->getLine(), json_encode($e), ApiHelpers::$CRITICAL_LOG);
    http_response_code(500);
    die(json_encode(['error' => "500 Internal Server Error"]));
}
