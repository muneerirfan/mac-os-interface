<?php
// change_password.php

// Configuration
$db_host = 'localhost';
$db_username = 'root';
$db_password = '';
$db_name = 'os_interface';
$db_port = 3307;

// Create connection
$conn = new mysqli($db_host, $db_username, $db_password, $db_name, $db_port);

// Check connection
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input_username = trim(filter_var($_POST['username'], FILTER_SANITIZE_STRING));
    $input_email = trim(filter_var($_POST['email'], FILTER_SANITIZE_EMAIL));
    $new_password = trim(filter_var($_POST['new_password'], FILTER_SANITIZE_STRING));

    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);


    // Basic validation
    if (empty($input_username) || empty($input_email) || empty($new_password)) {
        $error = 'Please fill in all fields';
    } else {
        // Verify user exists
        $stmt = $conn->prepare("SELECT name, email FROM users WHERE name = ? AND email = ?");
        $stmt->bind_param("ss", $input_username, $input_email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows == 1) {
            // Update password in plain text
            $stmt = $conn->prepare("UPDATE users SET password = ? WHERE name = ? AND email = ?");
            $stmt->bind_param("sss", $hashed_password, $input_username, $input_email);
            $stmt->execute();

            // Success message
            $message = 'Password changed successfully! Your new password is: ' . htmlspecialchars($new_password);
        } else {
            $error = 'No account found with that username and email combination.';
        }
        $stmt->close();
    }

    // Display result
    echo '<!DOCTYPE html>
    <html>
    <head>
        <title>Password Change Result</title>
        <link rel="stylesheet" href="/os_interface/resources/css/index_linker.css">
        <style>
            body {
                background-image: url(\'/os_interface/resources/css/mac.jpg\');
                background-size: cover;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0;
                font-family: Arial, sans-serif;
            }
            .result-box {
                background-color: rgba(0, 0, 0, 0.7);
                padding: 40px;
                border-radius: 15px;
                width: 400px;
                text-align: center;
                backdrop-filter: blur(10px);
                color: white;
            }
            .result-box p {
                margin: 10px 0;
            }
            .success {
                color: #4dff4d;
            }
            .error {
                color: #ff4d4d;
            }
            .back-to-login {
                margin-top: 20px;
            }
            .back-to-login a {
                color: #4a90e2;
                text-decoration: none;
            }
        </style>
    </head>
    <body class="night" sysDesktopBackGround>
    <div class="background">
    <img src="/os_interface/images/mac.jpg" alt="Background Image" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: -1;">
    </div>
        <div class="result-box">
            <div class="user-container">
                <div class="user-name">
                    <p>Password Change</p>
                </div>
            </div>';

    if (isset($message)) {
        echo '<p class="success">' . htmlspecialchars($message) . '</p>';
    } elseif (isset($error)) {
        echo '<p class="error">' . htmlspecialchars($error) . '</p>';
    }

    echo '<div class="back-to-login">
            <a href="/os_interface/public/login.html">Back to Login</a> | 
            <a href="/os_interface/public/change_pass.html">Change Again</a>
          </div>
        </div>
    </body>
    </html>';
}

$conn->close();
?>