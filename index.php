<?php
    $config = parse_ini_file('.env');
    $ws_host = $config['WS_HOST'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Insta-Conga!</title>
    <link rel="stylesheet" href="main.css">
    <script type="text/JavaScript">
    var INSTACONGA = {'host': <?php echo $ws_host; ?>};
    </script>
</head>
<body>

<script type="text/JavaScript" src="main.js"></script>
</body>
</html>
