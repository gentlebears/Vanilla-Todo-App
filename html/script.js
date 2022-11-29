let items = localStorage.getItem('todoList');
// let items = localStorage.getItem('todoList') != null ? localStorage.getItem('todoList') : {};

if (items) {
	items = JSON.parse(items);
} else {
	localStorage.setItem('todoList', JSON.stringify({}));
	items = {};
}

let list = document.querySelector('#myList');

let alertBot = false;

Object.keys(items).forEach(function (uuid) {
	CreateItem(items[uuid], uuid);
});

// const box = document.querySelector('.list-group-item');
// document.addEventListener('click', (e) => {
// 	if (e.composedPath().includes(box)) {
// 		console.log('Tıklandı!');
// 	} else {
// 		console.log('Tıklanılmadı!');
// 	}
// });

// //////////////////////////////////////////////////////
list.addEventListener('click', function (item) {
	// if (item.target.tagName == 'SPAN') {
	// 	// console.log('Span Click');
	// 	item.target.classList.toggle('checked');
	// 	console.log(item.target.querySelector('.list-group-item'));
	// } else {
	// 	// console.log('IDK Click');
	// }

	if (item.target.tagName == 'LI') {
		item.target.classList.toggle('checked');
		ToggleDeleteButton();
		// item.target.firstElementChild //İlk span'a ulaşmamız lazım DEBUG - İlk span bir üstü LI -
	}

	// if (item.currentTarget.tagName == 'SPAN') {
	// 	item.target.classList.toggle('checked');
	// }
});

document.querySelector('#deleteAll').onclick = function () {
	var elements = document.querySelectorAll('.checked');

	elements.forEach(function (item) {
		item.style.display = 'none';
		document.querySelector('#deleteAll').classList.add('d-none');
		delete items[item.id];
		item.remove();
	});
	localStorage.setItem('todoList', JSON.stringify(items));
};

function ToggleDeleteButton() {
	let checkList = document.querySelectorAll('.list-group-item.checked');
	if (checkList.length > 0) {
		document.querySelector('#deleteAll').classList.remove('d-none');
	} else {
		document.querySelector('#deleteAll').classList.add('d-none');
	}
}

document.querySelector('#btnCreate').onclick = function () {
	let todoText = document.querySelector('#txtItem').value;
	if (todoText === '') {
		alert('Null value!');
		return;
	}
	let uuid = uuidv4();
	items[uuid] = todoText;
	CreateItem(todoText, uuid);
	localStorage.setItem('todoList', JSON.stringify(items));
};

function CreateItem(job, uuid, cb) {
	var li = document.createElement('li');
	var t = document.createTextNode(job);
	var span = document.createElement('span');
	span.appendChild(t);
	li.className = 'list-group-item';
	li.setAttribute('id', uuid);
	li.appendChild(span);
	list.appendChild(li);

	//Ekleme++
	var spanEdit = document.createElement('span');
	var text = document.createTextNode('\uD83D\uDD89');
	spanEdit.className = 'edit';
	spanEdit.appendChild(text);
	li.appendChild(spanEdit);

	// ++

	var span = document.createElement('span');
	var text = document.createTextNode('\u00D7');
	span.className = 'close';
	span.appendChild(text);
	li.appendChild(span);

	span.onclick = function () {
		let li = this.parentElement;
		li.classList.remove('checked');
		ToggleDeleteButton();
		delete items[li.id];
		localStorage.setItem('todoList', JSON.stringify(items));
		li.remove();
	};

	spanEdit.onclick = function () {
		if (alertBot) {
			alert('You are already doing an edit');
		} else {
			let li = this.parentElement;
			document.getElementById('txtEdit').value = items[li.id];
			let editElement = document.getElementById('txtEdit');
			editElement.setAttribute('data-uuid', li.id);
			alertBot = true;
			document.querySelector('#cardShow').style.display = 'block';
			li.style.display = 'none';
		}
	};
}

document.querySelector('#btnEdit').onclick = function () {
	let element = document.getElementById('txtEdit');
	let todoEdit = element.value;
	let todoEditUUID = element.getAttribute('data-uuid');
	alertBot = false;
	if (todoEdit === '') {
		alert('Null value!');
		return;
	}

	items[todoEditUUID] = todoEdit;
	let lastElement = document.getElementById(todoEditUUID);
	lastElement.firstElementChild.innerText = todoEdit;
	lastElement.style.display = 'block';
	localStorage.setItem('todoList', JSON.stringify(items));
	document.querySelector('#cardShow').style.display = 'none';
};

function uuidv4() {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));
}
