
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
	target.parentNode.insertBefore(dragged, target);
}

var uniqueCounter = 0;

function remTextBlock(block) {
	block.parentNode.removeChild(block);
}

function onFocusBlock(block) {
	if (block.parentNode.id != 'assembly') return;

	var buttonMinus = document.createElement('button');
	buttonMinus.className = 'newBlockButton';
	buttonMinus.innerHTML = '-';
	buttonMinus.onmousedown = function() { remTextBlock(block); };

	var buttonPlus = document.createElement('button');
	buttonPlus.className = 'newBlockButton';
	buttonPlus.innerHTML = '+';
	buttonPlus.onmousedown = function() { addTextBlock('assembly'); };

	var buttons = document.createElement('div');
	if (block.parentNode.children.length > 1) {
		buttons.appendChild(buttonMinus);
	}
	buttons.appendChild(buttonPlus);
	block.parentNode.insertBefore(buttons, block.nextSibling);
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
	//block.draggable = "true";
	block.ondragstart = dragStart;
	block.ondragend = dragEnd;
	block.ondragover = dragover;
	block.ondrop = function(event) { drop(event, this); };
	//panel.ondrop = function(event) { drop(event, this); };
}
