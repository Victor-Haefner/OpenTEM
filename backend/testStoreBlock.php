<?php

ini_set('display_startup_errors', 'On');
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$filter = "";

include dirname(__FILE__).'/gitStore.php';
//git_store($fileName, $content, $tags);
get_blocks($filter);

?>
