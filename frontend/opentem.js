
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
	var viewer = document.getElementById('viewer').children[0];
	viewer.ID = entry.ID;
	viewer.value = entry.data;
}

function addEntry(lbl, txt, ID) {
	var entries = document.getElementById('entries');
	var entry = document.createElement('button');
	entry.className = 'entry';
	entry.innerHTML = lbl;
	entry.data = txt;
	entry.ID = ID;
	entry.onclick = function() { selectEntry(entry); };
	entries.appendChild(entry);
}

function storeBlock(block) {
	console.log('storeBlock');

	if (block.ID == undefined) block.ID = uuidv4();
	var content = block.children[0].value;
	var bID = block.ID;

	addEntry(bID, content, bID);
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






