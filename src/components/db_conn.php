<?php
// db_conn.php
$sname = "localhost";
$uname = "root";
$password = "";
$db_name = "os_interface";
$port = 3307;

$conn = mysqli_connect($sname, $uname, $password, $db_name, $port);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
?>