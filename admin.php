<?php
session_start();

// Basic Security / Password Protection
$admin_password = "admin123pass"; // Apna Passcode Yahan Set Karein

if (isset($_POST['login'])) {
    if ($_POST['password'] === $admin_password) {
        $_SESSION['admin_logged'] = true;
    } else {
        $error = "Ghalat Password!";
    }
}

if (!isset($_SESSION['admin_logged'])) {
?>
    <!DOCTYPE html>
    <html>
    <head><title>Admin Login</title></head>
    <body style="font-family:sans-serif; text-align:center; padding-top:50px;">
        <h2>Admin Panel Login</h2>
        <?php if(isset($error)) echo "<p style='color:red;'>$error</p>"; ?>
        <form method="POST">
            <input type="password" name="password" placeholder="Enter Password" required><br><br>
            <button type="submit" name="login">Login</button>
        </form>
    </body>
    </html>
<?php
    exit;
}

// Data Update Handling
$configFile = 'config.json';
$configData = json_decode(file_get_contents($configFile), true);
$msg = "";

if (isset($_POST['update_settings'])) {
    $configData['className'] = $_POST['className'];
    $configData['classValue'] = $_POST['classValue'];
    $configData['facultyName'] = $_POST['facultyName'];
    $configData['facultyValue'] = $_POST['facultyValue'];

    // File Upload Handling (Gazette TXT File)
    if (isset($_FILES['gazette_file']) && $_FILES['gazette_file']['error'] == 0) {
        $fileName = time() . '_' . basename($_FILES['gazette_file']['name']);
        $targetPath = "uploads/" . $fileName;

        if(!is_dir('uploads')) {
            mkdir('uploads', 0777, true);
        }

        if (move_uploaded_file($_FILES['gazette_file']['tmp_name'], $targetPath)) {
            $configData['gazetteFile'] = $targetPath;
        }
    }

    file_put_contents($configFile, json_encode($configData, JSON_PRETTY_PRINT));
    $msg = "Settings aur File Safalta Se Update Ho Gaye!";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Gumnaam Results - Admin Panel</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f0f2f5; padding: 20px; }
        .admin-card { max-width: 500px; margin: auto; background: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .form-group { margin-bottom: 15px; }
        label { display: block; font-weight: bold; margin-bottom: 5px; }
        input[type="text"], input[type="file"] { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; }
        button { background: #0b2545; color: white; border: none; padding: 12px; width: 100%; border-radius: 5px; font-weight: bold; cursor: pointer; }
        .msg { background: #d4edda; color: #155724; padding: 10px; border-radius: 5px; margin-bottom: 15px; }
    </style>
</head>
<body>

<div class="admin-card">
    <h2>Result Portal Admin Panel</h2>
    <?php if($msg) echo "<div class='msg'>$msg</div>"; ?>

    <form method="POST" enctype="multipart/form-data">
        <div class="form-group">
            <label>Class Name Text</label>
            <input type="text" name="className" value="<?php echo $configData['className']; ?>" required>
        </div>

        <div class="form-group">
            <label>Class Value (Numeric / Short)</label>
            <input type="text" name="classValue" value="<?php echo $configData['classValue']; ?>" required>
        </div>

        <div class="form-group">
            <label>Faculty Name Text</label>
            <input type="text" name="facultyName" value="<?php echo $configData['facultyName']; ?>" required>
        </div>

        <div class="form-group">
            <label>Faculty Value</label>
            <input type="text" name="facultyValue" value="<?php echo $configData['facultyValue']; ?>" required>
        </div>

        <div class="form-group">
            <label>Upload New Gazette File (.txt)</label>
            <input type="file" name="gazette_file" accept=".txt">
            <small>Current File: <b><?php echo $configData['gazetteFile']; ?></b></small>
        </div>

        <button type="submit" name="update_settings">SAVE ALL CHANGES</button>
    </form>
</div>

</body>
</html>
