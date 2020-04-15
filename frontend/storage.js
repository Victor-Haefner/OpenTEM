
function sendData(data) {
	var xhr = new XMLHttpRequest();
	xhr.open( 'post', 'backend/storeBlock.php', true );
	xhr.send(data);
}

function storeBlock(block) {
	console.log('storeBlock');

	if (block.ID == undefined) block.ID = uuidv4();
	var content = block.children[0].value;
	var bID = block.ID;

	tags = "key:value";

	var data = new FormData();
	data.append("name" , bID);
	data.append("data" , content);
	data.append("tags" , tags);

	sendData(data);
	setTimeout('updateEntries();', 500);
}

function getData(query, filter, handler) {
	var data = new FormData();
	data.append("query" , query);
	data.append("filter" , filter);
	var xhr = new XMLHttpRequest();
	xhr.open( 'post', 'backend/getData.php', true );
	xhr.send(data);

    	xhr.onreadystatechange = function() {
        	if (xhr.readyState== 4 && xhr.status == 200) {
			handler(xhr.responseText);
		}
        };
}

function deleteEntry(entryID) {
	console.log(entryID);
	var data = new FormData();
	data.append("ID" , entryID);
	var xhr = new XMLHttpRequest();
	xhr.open( 'post', 'backend/delData.php', true );
	xhr.send(data);
	setTimeout('updateEntries();', 500);
}
