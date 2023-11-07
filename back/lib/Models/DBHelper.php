<?php

namespace App\Models;

if (!defined('APP_LOADED') && !defined('INIT_LOADED')) {
    http_response_code(404);
    die();
}

class DBHelper
{
    private ?\mysqli $connection = null;
    private array $db;

    public function __construct(array $db)
    {
        $this->db = $db;
    }

    public function getConnection(): \mysqli
    {
        if (!$this->connection) {
            try {
                $db = new \mysqli($this->db['host'], $this->db['user'], $this->db['password'], $this->db['database']);
                if ($db->connect_errno) {
                    http_response_code(500);
                    echo "Failed to connect to MySQL: " . $db->connect_error;
                    die();
                }
                $this->connection = $db;
            } catch (\Throwable $e) {
                die($e->getMessage());
            }
        }
        return $this->connection;
    }

    public function init(): array
    {
        try {
            $db = $this->getConnection();
            $result = $db->query(
                "create table if not exists users " .
                "( " .
                "id       bigint unsigned auto_increment primary key, " .
                "name     varchar(255) not null, " .
                "email    varchar(255) not null, " .
                "password varchar(512) not null, " .
                "created_at timestamp default CURRENT_TIMESTAMP not null," .
                "updated_at timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP," .
                "constraint id_UNIQUE unique (id), " .
                "constraint email_UNIQUE unique (email) " .
                ");"
            );
            if (!$result) {
                return ["error" => "Cannot create users table"];
            }
            $result = $db->query("create index users_email_idx on users (email); ");
            if (!$result) {
                return ["error" => "Cannot create users email index"];
            }
        } catch (\Throwable $e) {
            return ["error" => $e->getMessage()];
        }
        return ["success" => "Connected to the SQLite database successfully!"];
    }

    public function get(string $table, array $data = [], $page = -1): array
    {
        $skip = 0;
        $limit = 0;
        if ($page >= 0) {
            $limit = 10;
            $skip = $page * 10;
        }

        $db = $this->getConnection();
        $sql = "SELECT * FROM $table";
        $where = "";
        $binding = [];
        $binding_types = "";
        foreach ($data as $key => $value) {
            if (!empty($where)) {
                $where = $where . ' AND ';
            }
            $where = $where . " " . $key . ' = ?';
            $binding_types = $binding_types . "s";
            $binding[] = $value;
        }
        if (!empty($where)) {
            $sql = $sql . " where " . $where;
        }

        if ($limit) {
            $sql = $sql . ' ORDER BY ID DESC LIMIT ' . $limit . ' OFFSET ' . $skip;
        }

        $stmt = $db->prepare($sql);
        if (!empty($binding)) {
            $stmt->bind_param($binding_types, ...$binding);
        }
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function insert(string $table, array $data): bool
    {
        $db = $this->getConnection();
        $columns = array_keys($data);
        $columns = implode(',', $columns);

        $values = array_values($data);
        $binding = "";
        $binding_type = "";
        for ($i = 0; $i < count($values); $i++) {
            if ($i == 0) {
                $binding = "?";
            } else {
                $binding = $binding . ",?";
            }
            $binding_type = $binding_type . "s";
        }

        $stmt = $db->prepare("INSERT INTO $table($columns) VALUES($binding)");
        $stmt->bind_param($binding_type, ...$values);

        $result = $stmt->execute();
        $stmt->close();
        return $result;
    }

    public function update(string $table, array $conditions, array $data): bool
    {
        $db = $this->getConnection();
        $sql = "UPDATE $table ";

        $updated = "";
        $where = "";
        $binding = [];
        $binding_types = "";
        foreach ($data as $key => $value) {
            if (empty($updated)) {
                $updated = "SET $key=?";
            } else {
                $updated = $updated . ",$key=?";
            }
            $binding_types = $binding_types . "s";
            $binding[] = $value;
        }

        if (!empty($updated)) {
            $sql = $sql . $updated;
        } else {
            return 1;
        }

        foreach ($conditions as $key => $value) {
            if (!empty($where)) {
                $where = $where . ' AND ';
            }
            $where = $where . " " . $key . ' = ?';
            $binding_types = $binding_types . "s";
            $binding[] = $value;
        }

        if (!empty($where)) {
            $sql = $sql . " WHERE " . $where;
        }

        $stmt = $db->prepare($sql);
        if (!empty($binding)) {
            $stmt->bind_param($binding_types, ...$binding);
        }

        $result = $stmt->execute();
        $stmt->close();
        return $result;
    }
}