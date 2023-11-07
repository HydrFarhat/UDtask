<?php

use App\Models\ApiHelpers;

const INIT_LOADED = true;

require_once 'Models/ApiHelpers.php';
require_once 'Models/DBHelper.php';


$path = realpath(__DIR__ . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "config.json");
if (is_file($path)) {
    $config = ApiHelpers::fetchArray($path, true);
    if ($config === false) {
        die("Config File NOT FOUND!");
    }
} else {
    die("Config File NOT FOUND!");
}

$_DB_Helper = new \App\Models\DBHelper($config["db"]);
$_DB_Helper->init();

echo "Migration Succeeded\n";