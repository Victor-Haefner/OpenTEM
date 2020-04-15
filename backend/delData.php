<?php

ini_set('display_startup_errors', 'On');
ini_set('display_errors', 'On');
error_reporting(E_ALL);


if (empty($_POST['ID'])) exit();
$ID = $_POST['ID'];

include dirname(__FILE__).'/gitStore.php';
deleteBlock($ID);
?>
