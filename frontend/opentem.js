
function pressHandle(handle) {
	handle.parentNode.draggable = true;
}

function dragStart(ev) {
	ev.dataTransfer.setData("text/plain", ev.target.id);
	ev.dataTransfer.dropEffect = "move";
	//ev.target.style.display = 'none';
}

function dragEnd(ev) {
	//ev.target.style.display = 'flex';
	ev.target.draggable = false;
}

function dragover(ev) {
	ev.preventDefault();
	ev.dataTransfer.dropEffect = "move";
}

function drop(ev, target) {
	ev.preventDefault();
	var eID = ev.dataTransfer.getData("text/plain");
	var dragged = document.getElementById(eID);
	if (eID == 'viewer') {
		var block = addTextBlock('assembly');
		block.children[0].value = dragged.children[0].value;
		block.ID = dragged.ID;
		console.log(dragged);
		target.parentNode.insertBefore(block, target);
	} else {
		target.parentNode.insertBefore(dragged, target);
	}
}

var uniqueCounter = 0;

function remTextBlock(block) {
	block.parentNode.removeChild(block);
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function selectEntry(entry) {
	var viewer = document.getElementById('viewer');
	viewer.ID = entry.data[0];
	viewer.children[0].value = entry.data[1];

	var entryID = document.getElementById('entryID');
	entryID.innerHTML = entry.data[0];

	var entryTags = document.getElementById('entryTags');
	entryTags.innerHTML = entry.data[2];
}

function addEntry(ID, content, tags) {
	var lbl = content.substr(0,200);
	var entries = document.getElementById('entries');
	var entry = document.createElement('div');
	var link = document.createElement('button');
	var del = document.createElement('button');
	entry.appendChild(link);
	entry.appendChild(del);

	link.className = 'entry';
	link.innerHTML = lbl;
	link.data = [ ID, content, tags ];
	link.onclick = function() { selectEntry(link); };
	
	del.innerHTML = 'x';
	del.onclick = function() { deleteEntry(link.data[0]); };
	entries.appendChild(entry);
}

function showEntry(fileID, content) {
	if (fileID == "") return;
	getData("tags", fileID, function(tags) { addEntry(fileID, content, tags); } );
}

var getEntriesBusy = false; // avoid too many calls at once		
function showEntries(data) {
	if (data == "") return;
	var entries = data.split(/\n/);
	for (var i in entries) {
		var fileID = entries[i];
		(function( fileID ) {
			getData("content", fileID, function(content) { showEntry(fileID, content); } );
		})( fileID );
	}
	getEntriesBusy = false;
}

function updateEntries() {
	getEntriesBusy = true;
	var entries = document.getElementById('entries');
	entries.innerHTML = "";
	getData("entries", "", showEntries);
}

function onFilterChange(input) {
	if (getEntriesBusy && input.value != "") return;
	getEntriesBusy = true;

	var entries = document.getElementById('entries');
	entries.innerHTML = "";
	getData("entries", input.value, showEntries);
}

function addBlockButton(lbl, func) {
	var button = document.createElement('button');
	button.className = 'newBlockButton';
	button.innerHTML = lbl;
	button.onmousedown = func;
	return button;
}

function onFocusBlock(block) {
	if (block.parentNode.id != 'assembly') return;

	var buttonMinus = addBlockButton('-', function() { remTextBlock(block); });
	var buttonPlus  = addBlockButton('+', function() { addTextBlock('assembly'); });
	var buttonStar  = addBlockButton('*', function() { storeBlock(block); });

	var buttons = document.createElement('div');
	block.parentNode.insertBefore(buttons, block.nextSibling);

	if (block.parentNode.children.length > 1) buttons.appendChild(buttonMinus);
	buttons.appendChild(buttonPlus);
	buttons.appendChild(buttonStar);
}

function onUnfocusBlock(block) {
	if (block.parentNode.id != 'assembly') return;
	block.parentNode.removeChild(block.nextSibling);
}

function addTextBlock(panelName) {
	var panel = document.getElementById(panelName);
	var block = document.createElement('div');
	var handle = document.createElement('button');
	var field = document.createElement('textarea');

	block.className = 'block';
	handle.className = 'handle';
	field.className = 'field';
	field.onfocus = function() { onFocusBlock(this.parentNode); };
	field.onblur = function() { onUnfocusBlock(this.parentNode); };

	block.appendChild(field);
	block.appendChild(handle);
	panel.appendChild(block);

	handle.innerHTML = '\u2022<br>\u2022<br>\u2022';
	handle.onmousedown = function() { pressHandle(this); };

	block.id = 'block'+uniqueCounter; uniqueCounter += 1;
	block.ondragstart = dragStart;
	block.ondragend = dragEnd;
	block.ondragover = dragover;
	block.ondrop = function(event) { drop(event, this); };
	//panel.ondrop = function(event) { drop(event, this); };
	return block;
}

function compileBlocks() {
	var panel = document.getElementById('assembly');
	var txt = '';
	for (var i = 0; i<panel.children.length; i++) {
		var v = panel.children[i].children[0].value;
		if (v != "") txt += v + '<br>';
	}

	var w = window.open();
	w.document.write(txt);
	w.document.title = 'OpenTEM Assembly';
	w.document.close();
}




