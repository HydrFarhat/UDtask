<?php

namespace App\Models;

if (!defined('APP_LOADED') && !defined('INIT_LOADED')) {
    http_response_code(404);
    die();
}

class ApiHelpers
{

    private ?string $user_email = null;
    private array $_LOGS = [
        "path" => "",
        1 => "critical.log",
        2 => "error.log",
        3 => "warning.log",
        4 => "debug.log",
        5 => "info.log",
    ];
    public static int $CRITICAL_LOG = 1;
    public static int $ERROR_LOG = 2;
    public static int $WARNING_LOG = 3;
    public static int $DEBUG_LOG = 4;
    public static int $INFO_LOG = 5;

    private $_CONFIG = null;


    private function encrypt($payload): ?array
    {
        $payload_string = json_encode($payload);
        $private_key = openssl_pkey_get_private(file_get_contents($this->_CONFIG->keys->path_priv));
        if (!$private_key) {
            return null;
        }
        $encrypted = "";
        $result = openssl_private_encrypt($payload_string, $encrypted, $private_key);
        if (!$result) {
            return null;
        }
        return [$encrypted, $payload_string];
    }

    public function login(array $user): ?string
    {
        $time = microtime();
        $payload = [
            "user" => $user['name'],
            "email" => $user['email'],
            "iat" => $time,
        ];
        list($encrypted, $payload_string) = $this->encrypt($payload);
        return base64_encode($payload_string) . "." . base64_encode($encrypted);
    }

    public function checkLogin(string $token): ?string
    {
        $token = explode('.', $token);
        if (count($token) != 2) {
            return null;
        }
        $payload = json_decode(base64_decode($token[0]), true);
        if (!is_array($payload)) {
            return null;
        }
        list($encrypted) = $this->encrypt($payload);
        $email = base64_encode($encrypted) == $token[1] ? $payload['email'] : null;
        if ($email) {
            $this->user_email = $email;
            if (!$this->getLoggedInUser()) {
                return null;
            }
        }
        return $email;
    }

    public function __construct($config_file)
    {
        if (is_array($config_file) || is_object($config_file)) {
            $this->_CONFIG = $config_file;
        } else if (is_string($config_file)) {
            $this->_CONFIG = self::fetchArray($config_file);
        } else {
            $this->returnResult(["error" => "Fatal Error Initializing."], 500);
        }
        if (!$this->_CONFIG) {
            $this->logFile("Couldn't initialize config file!\n", "", self::$CRITICAL_LOG);
            $this->returnResult(["error" => "Fatal Error Initializing."], 500);
        }
        if (isset($this->_CONFIG->logs)) {
            if (isset($this->_CONFIG->logs->path)) {
                if (trim($this->_CONFIG->logs->path) == "") {
                    $this->_CONFIG->logs->path = $_SERVER["DOCUMENT_ROOT"];
                }
                $this->_LOGS["path"] = $this->_CONFIG->logs->path;
            }
            if (isset($this->_CONFIG->logs->critical)) {
                $this->_LOGS[1] = $this->_CONFIG->logs->critical;
            }
            if (isset($this->_CONFIG->logs->error)) {
                $this->_LOGS[2] = $this->_CONFIG->logs->error;
            }
            if (isset($this->_CONFIG->logs->warning)) {
                $this->_LOGS[3] = $this->_CONFIG->logs->warning;
            }
            if (isset($this->_CONFIG->logs->debug)) {
                $this->_LOGS[4] = $this->_CONFIG->logs->debug;
            }
            if (isset($this->_CONFIG->logs->info)) {
                $this->_LOGS[5] = $this->_CONFIG->logs->info;
            }
        }
    }

    function getConfig()
    {
        return $this->_CONFIG;
    }

    function validateRequest($return = true, bool $auth = false, string $method = "GET"): array
    {
        if ($_SERVER['REQUEST_METHOD'] == "OPTIONS") {
            die();
        }
        if ($_SERVER['REQUEST_METHOD'] != strtoupper($method)) {
            if ($return) {
                return ["error" => "Method Not Allowed.", "status" => 405];
            }
            die(json_encode($this->returnResult(["error" => "Method Not Allowed."], 405)));
        }

        if (!$this->_CONFIG) {
            if ($return) {
                return ["error" => "Server Fatal Error..", "status" => 500];
            }
            die(json_encode($this->returnResult(["error" => "Server Fatal Error."], 500)));
        }
        if ($auth) {
            $token = $this->getBearerToken();
            if (!$token) {
                $token = $this->getParam("api_key");
            }
            if (!$token) {
                if ($return) {
                    return ["error" => "Unauthenticated.", "status" => 401];
                }
                die(json_encode($this->returnResult(["error" => "Unauthenticated."], 401)));
            }
            $logged_in = $this->checkLogin($token);
            if (!$logged_in) {
                if ($return) {
                    return ["error" => "Unauthenticated.", "status" => 401];
                }
                die(json_encode($this->returnResult(["error" => "Unauthenticated."], 401)));
            }
        }
        return ["success" => "Authorized"];
    }

    function getLoggedInUser()
    {
        if (!$this->user_email) {
            return null;
        }
        $db = new DBHelper((array)$this->getConfig()->db);
        $users = $db->get('users', ['email' => $this->user_email]);
        $user = $users[0] ?? null;
        if ($user) {
            unset($user['password']);
            unset($user['updated_at']);
        }
        return $user;
    }

    function getAuthorizationHeader(): ?string
    {
        $headers = null;
        if (isset($_SERVER['Authorization'])) {
            $headers = trim($_SERVER["Authorization"]);
        } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) { //Nginx or fast CGI
            $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
        } elseif (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            // Server-side fix for bug in old Android versions (a nice side effect of this fix means we don't care about capitalization for Authorization)
            $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
            //print_r($requestHeaders);
            if (isset($requestHeaders['Authorization'])) {
                $headers = trim($requestHeaders['Authorization']);
            }
        }
        return $headers;
    }

    function getBearerToken(): ?string
    {
        $headers = self::getAuthorizationHeader();
        // HEADER: Get the access token from the header
        if (!empty($headers)) {
            if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
                return $matches[1];
            }
        }
        return null;
    }

    function getParam($name, $default = null, $only_post = false)
    {
        if (isset($_POST[$name])) {
            return $_POST[$name];
        } elseif (!$only_post && isset($_GET[$name])) {
            return $_GET[$name];
        }
        return $default;
    }

    static function fetchArray($in, $assoc = false)
    {
        if (is_file($in)) {
            $config = json_decode(file_get_contents($in), $assoc);
            if (!$config) {
                return $config;
            }
            if ($assoc) {
                $config["config_path"] = $in;
            } else {
                $config->config_path = $in;
            }
            return $config;
        }
        return false;
    }

    function isValidMd5($md5 = ''): bool
    {
        return preg_match('/^[a-fA-F0-9]{32}$/', $md5) === 1;
    }

    private function getLogFile($log): string
    {
        $main_path = $this->_LOGS['path'];
        if (!str_ends_with($main_path, '/') && !str_ends_with($main_path, '\\')) {
            $main_path = $main_path . DIRECTORY_SEPARATOR;
        }
        return $main_path . ((isset($this->_LOGS[$log]) && !empty($this->_LOGS[$log])) ? $this->_LOGS[$log] : ($log . ".log"));
    }

    function logFile($result, $logData = "", $log_file = null): void
    {
        if (!$log_file) {
            $log_file = self::$DEBUG_LOG;
        }
        $log_file = $this->getLogFile($log_file);
        if (is_file($log_file)) {
            file_put_contents(
                $log_file,
                "\n************************************************\n" .
                date('[Y-m-d H:i:s] ') . json_encode($result) .
                "\n[LOG DATA]\n" .
                $logData .
                "\n************************************************\n",
                FILE_APPEND);
        } else {
            file_put_contents(
                $log_file,
                "\n************************************************\n" .
                date('[Y-m-d H:i:s] ') . json_encode($result) .
                "\n[LOG DATA]\n" .
                $logData .
                "\n************************************************\n");
        }
    }

    function returnResult($result, $code = 200, $log_result = false, $logData = "", $log_file = null)
    {
        if ($log_result) {
            if (!$log_file) {
                $log_file = self::$DEBUG_LOG;
            }
            self::logFile($result, $logData, $log_file);
        }
        http_response_code($code);
        return $result;
    }

}