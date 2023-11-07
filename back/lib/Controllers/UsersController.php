<?php

namespace App\Controllers;

if (!defined('APP_LOADED')) {
    http_response_code(404);
    die();
}

use App\Models\ApiHelpers;
use App\Models\DBHelper;
use DateTime;

class UsersController
{
    private ApiHelpers $_Helper;

    /**
     * @param ApiHelpers $_Helper
     */
    public function __construct(ApiHelpers $_Helper)
    {
        $this->_Helper = $_Helper;
    }

    public function login(): array
    {
        $email = $this->_Helper->getParam('email');
        $password = $this->_Helper->getParam('password');
        if (empty($password) || empty($email)) {
            return $this->_Helper->returnResult(["error" => "Invalid Credentials"], 422);
        }
        $db = new DBHelper((array)$this->_Helper->getConfig()->db);
        $users = $db->get('users', ['email' => $email]);
        $user = $users[0] ?? null;
        if (!$user || $user['password'] != md5($password)) {
            return $this->_Helper->returnResult(["error" => "Invalid Credentials"], 422);
        }
        return $this->_Helper->returnResult(["token" => $this->_Helper->login($user)]);
    }

    public function create()
    {
        $name = $this->_Helper->getParam('name');
        $email = $this->_Helper->getParam('email');
        $password = $this->_Helper->getParam('password');

        if (empty($name) || empty($password) || empty($email)) {
            return $this->_Helper->returnResult(["error" => "Invalid request parameters"], 422);
        }

        $name = trim($name);
        $email = trim($email);
        $password = trim($password);
        if (!preg_match("/^([a-zA-Z]+ ){1,2}[a-zA-Z]+$/", $name)) {
            return $this->_Helper->returnResult(["error" => "Please enter a full name. Only letters and white space allowed"], 422);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->_Helper->returnResult(["error" => "Invalid email format"], 422);
        }
        if (strlen($password) < 8) {
            return $this->_Helper->returnResult(["error" => "Password must be at least 8 characters."], 422);
        }

        $db = new DBHelper((array)$this->_Helper->getConfig()->db);
        $error = $db->get('users', ['email' => $email]);
        if (!empty($error)) {
            return $this->_Helper->returnResult(["error" => "Email already exists"], 422);
        }
        $row = $db->insert('users', [
            'email' => $email,
            'name' => $name,
            'password' => md5($password),
        ]);
        return $row;
        // return $this->_Helper->returnResult(["success" => "User Added Successfully.", 'result' => $row]);
    }

    public function get(): array
    {
        $page = $this->_Helper->getParam('page');
        $pagination = -1;
        if ($page && is_int($page)) {
            $page = intval($page);
            if ($page >= 0) {
                $pagination = $page;
            }
        }
        $db = new DBHelper((array)$this->_Helper->getConfig()->db);
        $users = $db->get('users', [], $pagination);
        foreach ($users as $user) {
            unset($user['password']);
        }
        return $users;
    }

    public function update()
    {

        $id = $this->_Helper->getLoggedInUser();
        if (!$id) {
            return $this->_Helper->returnResult(["error" => "Unauthorized"], 401);
        }
        $id = $id['id'];

        $name = $this->_Helper->getParam('name');
        $email = $this->_Helper->getParam('email');
        $password = $this->_Helper->getParam('password');
        if (intval($id) < 1 || (empty($name) && empty($password) && empty($email))) {
            return $this->_Helper->returnResult(["error" => "Invalid request parameters"], 422);
        }
        $name = trim($name);
        $email = trim($email);
        $password = trim($password);
        $data = [];
        if (!empty($name)) {
            if (!preg_match("/^([a-zA-Z]+ ){1,2}[a-zA-Z]+$/", $name)) {
                return $this->_Helper->returnResult(["error" => "Please enter a full name. Only letters and white space allowed"], 422);
            } else {
                $data['name'] = $name;
            }
        }
        if (!empty($email)) {
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                return $this->_Helper->returnResult(["error" => "Invalid email format"], 422);
            } else {
                $data['email'] = $email;
            }
        }
        if (!empty($password)) {
            if (strlen($password) < 8) {
                return $this->_Helper->returnResult(["error" => "Password must be at least 8 characters."], 422);
            } else {
                $password = md5($password);
                $data['password'] = $password;
            }
        }

        if (empty($data)) {
            return $this->_Helper->returnResult(["error" => "Invalid request parameters"], 422);
        }

        $db = new DBHelper((array)$this->_Helper->getConfig()->db);
        $error = $db->get('users', ['email' => $email]);
        if (!empty($error)) {
            if ($error[0]['id'] != $id) {
                return $this->_Helper->returnResult(["error" => "Email already exists"], 422);
            }
        }

        $row = $db->update('users', [
            'id' => $id
        ], $data);
        if (!$row) {
            return $this->_Helper->returnResult(["error" => "Invalid User Id."], 422);
        }
        $users = $db->get('users', ['id' => $id]);

        $user = $users[0] ?? null;
        if ($user) {
            unset($user['password']);
            unset($user['created_at']);
            unset($user['updated_at']);
        }

        return $this->_Helper->returnResult(["success" => "User Updated Successfully.", 'result' => $user]);
    }


}