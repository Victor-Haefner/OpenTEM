<?php

ini_set('display_startup_errors', 'On');
ini_set('display_errors', 'On');
error_reporting(E_ALL);

if (empty($_POST['name'])) exit();
if (empty($_POST['data'])) exit();
if (empty($_POST['tags'])) exit();

$fileName = $_POST['name'];
$content = $_POST['data'];
$tags = $_POST['tags'];

include dirname(__FILE__).'/gitStore.php';
git_store($fileName, $content, $tags);

?>
