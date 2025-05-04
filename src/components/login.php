<?php
// login.php - Place this in /U/os_interface/src/components/

// Start session to store user data
session_start();

// Database configuration
$servername = "localhost";
$username = "root"; // Change if different
$password = ""; // Change if you have a password
$dbname = "os_interface";
$port = 3307;

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Process form data when submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);
    
    // Basic validation
    if (empty($username) || empty($password)) {
        die("Please fill in all fields");
    }
    
    // Prepare SQL to prevent SQL injection
    $stmt = $conn->prepare("SELECT id, password FROM users WHERE name = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows == 1) {
        $user = $result->fetch_assoc();
        
        // Verify password (assuming passwords are hashed in database)
        if (password_verify($password, $user['password'])) {
            // Login successful - store user ID in session
            $_SESSION['user_id'] = $user['id'];
            
            // Redirect to desktop or home page
            header("Location: /os_interface/public/front_page.html");
            exit();
        } else {
            echo "<script>alert('Invalid password');</script>";
        }
    } else {
        echo "<script>alert('Invalid Username');</script>";
    }
    
    $stmt->close();
}

$conn->close();
?>