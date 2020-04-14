<?php

ini_set('display_startup_errors', 'On');
ini_set('display_errors', 'On');
error_reporting(E_ALL);


if (empty($_POST['query'])) exit();
$query = $_POST['query'];
$filter = $_POST['filter'];

include dirname(__FILE__).'/gitStore.php';
if ($query == 'entries') get_blocks($filter);
else if ($query == 'content') get_block($filter);
else if ($query == 'tags') get_tags($filter);
else echo "buhuhu";
?>
