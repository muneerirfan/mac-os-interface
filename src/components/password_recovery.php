<?php
// password_recovery.php
session_start();

// Database config
$db_host = 'localhost';
$db_username = 'root';
$db_password = '';
$db_name = 'os_interface';
$db_port = 3307;

$conn = new mysqli($db_host, $db_username, $db_password, $db_name, $db_port);

if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input_username = trim($_POST['username']);
    $input_email = trim($_POST['email']);
    
    // Validate inputs
    if (empty($input_username) || empty($input_email)) {
        show_error('Please fill in all fields');
    }

    // Check if user exists
    $stmt = $conn->prepare("SELECT id, name, email FROM users WHERE name = ? AND email = ?");
    $stmt->bind_param("ss", $input_username, $input_email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $user = $result->fetch_assoc();
        
        // Generate secure temporary password
        $temp_password = bin2hex(random_bytes(8)); // 16-character temp password
        $hashed_password = password_hash($temp_password, PASSWORD_DEFAULT);
        
        // Update password in database
        $update_stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
        $update_stmt->bind_param("si", $hashed_password, $user['id']);
        $update_stmt->execute();
        
        // Display temporary password (in real app, send via email)
        show_temp_password($user['name'], $temp_password);
    } else {
        show_error('No account found with that username and email combination.');
    }
    
    $stmt->close();
}

$conn->close();

function show_temp_password($username, $temp_password) {
    echo <<<HTML
    <!DOCTYPE html>
    <html>
    <head>
        <title>Password Reset</title>
        <link rel="stylesheet" href="/os_interface/resources/css/index_linker.css">
        <style>
            .password-box {
                background-color: rgba(0, 0, 0, 0.7);
                padding: 40px;
                border-radius: 15px;
                width: 400px;
                margin: 100px auto;
                text-align: center;
                backdrop-filter: blur(10px);
                color: white;
            }
            .password-display {
                background: rgba(255,255,255,0.1);
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }
            .warning {
                color: #ff6b6b;
                font-size: 0.9em;
                margin-top: 15px;
            }
        </style>
    </head>
    <body class="night" sysDesktopBackGround style="background-image: url('/os_interface/resources/css/mac.jpg');">
        <div class="password-box">
            <div class="user-container">
                <div class="user-name">
                    <p>Password Reset</p>
                </div>
            </div>
            
            <div class="password-display">
                <p><strong>Username:</strong> $username</p>
                <p><strong>Temporary Password:</strong> $temp_password</p>
            </div>
            
            <p class="warning">You must change this password after logging in!</p>
            
            <a href="/os_interface/public/login.html" style="color:#4a90e2;">Back to Login</a>
        </div>
    </body>
    </html>
    HTML;
}

function show_error($message) {
    echo <<<HTML
    <!DOCTYPE html>
    <html>
    <head>
        <title>Error</title>
        <link rel="stylesheet" href="/os_interface/resources/css/index_linker.css">
        <style>
            .error-box {
                background-color: rgba(0, 0, 0, 0.7);
                padding: 40px;
                border-radius: 15px;
                width: 400px;
                margin: 100px auto;
                text-align: center;
                backdrop-filter: blur(10px);
                color: white;
            }
        </style>
    </head>
    <body class="night" sysDesktopBackGround style="background-image: url('/os_interface/resources/css/mac.jpg');">
        <div class="error-box">
            <div class="user-container">
                <div class="user-name">
                    <p>Error</p>
                </div>
            </div>
            
            <p>$message</p>
            
            <div style="margin-top:20px;">
                <a href="/os_interface/public/forgot_password.html" style="color:#4a90e2;">Try Again</a> | 
                <a href="/os_interface/public/login.html" style="color:#4a90e2;">Back to Login</a>
            </div>
        </div>
    </body>
    </html>
    HTML;
}
?>