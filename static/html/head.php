
<?php
if (!isset($_SESSION)) {
    session_start();
} 
if($_SESSION['user'] != 'admin'){
    header('location:'.BASE_URL);
    exit();
}
?>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>AdminLTE 3 | Dashboard</title>
<!-- Tell the browser to be responsive to screen width -->
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- Font Awesome -->

<link rel="stylesheet" href="<?php echo BASE_URL."/admin/theme_admin"?>/css/fontawesome-free/css/all.min.css">
<!-- Ionicons -->
<link rel="stylesheet" href="<?php echo BASE_URL."/admin/theme_admin/"?>css/ionicons/css/ionicons.min.css">
<!-- overlayScrollbars -->
<link rel="stylesheet" href="<?php echo BASE_URL."/admin/theme_admin/"?>css/overlayScrollbars/css/OverlayScrollbars.min.css">
<!-- Theme style -->
<link rel="stylesheet" href="<?php echo BASE_URL."/admin/theme_admin/"?>css/adminlte.min.css">
<link rel="stylesheet" href="<?php echo BASE_URL."/admin/theme_admin/"?>css/custom.css">