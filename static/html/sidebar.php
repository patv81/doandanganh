<?php
// echo '<pre>';
// print_r($_SERVER);
// echo '<pre>';
// die("yoyo");
$php_self = $_SERVER['PHP_SELF'];
?>
<aside class="main-sidebar sidebar-dark-info elevation-4">
    <!-- Brand Logo -->
    <!-- Sidebar -->
    <div class="sidebar">
        <!-- Sidebar user panel (optional) -->
        <div class="user-panel mt-3 pb-3 mb-3 d-flex">

            <div class="info">
                <a href="#" class="d-block">Admin </a>
            </div>
        </div>

        <!-- Sidebar Menu -->
        <nav class="mt-2">
            <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                <li class="nav-item">
                    <a href="<?php echo BASE_URL . '/admin/users' ?>" class="nav-link <?php if (strpos($php_self, 'admin/user')) echo 'active';?>" data-active="dashboard">
                        <i class="nav-icon fas fa-users"></i>
                        <p>Manager User</p>
                    </a>
                </li>

                <li class="nav-item">
                    <a href="<?php echo BASE_URL . '/admin/product' ?>" class="nav-link <?php if (strpos($php_self, 'admin/product')) echo 'active'; ?>" data-active="index">
                        <i class="nav-icon fas fa-list-ul"></i>
                        <p>Manager Product</p>
                    </a>
                </li>

                <li class="nav-item">
                    <a href="<?php echo BASE_URL . '/admin/order' ?>" class="nav-link <?php if (strpos($php_self, 'admin/order')) echo 'active'; ?>" data-active="form">
                        <i class="nav-icon fas fa-edit"></i>
                        <p>Manager order</p>
                    </a>
                </li>

                <li class="nav-item">
                    <a href="<?php echo BASE_URL . '/admin/message' ?>" class="nav-link <?php if (strpos($php_self, 'admin/message')) echo 'active'; ?> " data-active="form">
                        <i class="nav-icon fa fa-users" aria-hidden="true"></i>
                        <p>Message</p>
                    </a>
                </li>
            </ul>
        </nav>
        <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->
</aside>