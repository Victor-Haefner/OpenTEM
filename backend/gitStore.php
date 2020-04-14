<?php

require dirname(__FILE__)."/Git.php";

function git_store($fileName, $content, $tags) {
	// prepare paths
	$repoPath = dirname(__FILE__)."/../data";
	$blocksPath = $repoPath."/blocks";
	$tagsPath = $repoPath."/tags";
	$filePath = $blocksPath."/".$fileName;
	$tagFilePath = $tagsPath."/".$fileName;
	
	if (!file_exists($repoPath)) mkdir ($repoPath, 0744);
	if (!file_exists($blocksPath)) mkdir ($blocksPath, 0744);
	if (!file_exists($tagsPath)) mkdir ($tagsPath, 0744);

	// open repo
	if (!file_exists($repoPath."/.git/config")) {
		echo "no repo found at $repoPath! ..creating new";
		$repo = Git::create($repoPath);
		$repo->run('config user.email "blocks@opentem.com"');
		$repo->run('config user.name "storage"');
	} else {
		$repo = Git::open($repoPath);
		$repo->run("checkout -f master");
	}

	// write new data
	file_put_contents($filePath, $content);
	file_put_contents($tagFilePath, $tags);

	// commit data
	$repo->add('.');
	$repo->commit("store block ".$fileName);
}

function get_blocks($filter) {
	$blocksPath = dirname(__FILE__)."/../data/blocks";
	if ($handle = opendir($blocksPath)) {
		while (false !== ($entry = readdir($handle))) {
			if ($entry != "." && $entry != "..") {
				echo "$entry\n";
			}
		}
		closedir($handle);
	}
}

function get_block($fileName) {
	$filePath = dirname(__FILE__)."/../data/blocks/".$fileName;
	echo file_get_contents($filePath);
}

function get_tags($fileName) {
	$tagFilePath = dirname(__FILE__)."/../data/tags/".$fileName;
	echo file_get_contents($tagFilePath);
}

// git structure:
//  every block is a file and

//  new block:
//   create file, filename is block ID
//   write content to file
//   git add filename
//   git commit -am"new block"

//  search texts
//   git-grep --count     # only list files matching the search
//    combine filters with --and --or --not
//    --threads N
//    -r      # recursive

?>
