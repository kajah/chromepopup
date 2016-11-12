// TopSites stuff
function onAnchorClick(event) {
  chrome.tabs.create({ url: event.srcElement.href });
  return false;
}

chrome.topSites.get(function(mostVisitedURLs) {
	var popupDiv = document.getElementById('mostVisited_div');
	var ol = popupDiv.appendChild(document.createElement('ol'));
	var numURLs = Math.min(mostVisitedURLs.length, 3);

	for (var i = 0; i < numURLs; i++) {
	    var li = ol.appendChild(document.createElement('li'));
	    var a = li.appendChild(document.createElement('a'));
	    a.href = mostVisitedURLs[i].url;
	    a.appendChild(document.createTextNode(mostVisitedURLs[i].title));
	    a.addEventListener('click', onAnchorClick);
	}
});
// end TopSites stuff


// Todo List Stuff

// Storing Tasks in Local DB
function get_todos() {
    var todos = new Array;
    var todos_str = localStorage.getItem('todo');
    if (todos_str !== null) {
        todos = JSON.parse(todos_str); 
    }
    return todos;
}

document.addEventListener('DOMContentLoaded', function() {
  show_todos();
  document.getElementById("newTask").addEventListener("click", newElement);

  // Add a "checked" symbol when clicking on a list item
  var list = document.querySelector('ul');
  list.addEventListener('click', function(ev) {
  	if (ev.target.tagName === 'LI') {
  		ev.target.classList.toggle('checked');
  	}
  }, false);
});

var close = document.getElementsByClassName("close");

function find_index(task) {
	var todos = get_todos();
	var i;
	for (i = 0; i < todos.length; i++) {
		if(todos[i] === task) {
			return i;
		}
	}
	return -1;
}

function close_helper(li) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);
  var todos = get_todos();

  for (j = 0; j < close.length; j++) {
    close[j].onclick = function() {
	    var div = this.parentElement;
	    var id = find_index(div.textContent.slice(0,div.textContent.length - 1));
	    todos.splice(id, 1);
	    localStorage.setItem('todo', JSON.stringify(todos));
	    div.style.display = "none";
    }
  }
}

function show_todos() {
	todos = get_todos();
	for (i = 0; i < todos.length; i++) {
		var li = document.createElement("li");
		li.id = i;
		var inputValue = todos[i];
		var t = document.createTextNode(inputValue);
		li.appendChild(t);
		document.getElementById("myUL").appendChild(li);
		close_helper(li);
	}
}

//Create a new list item when clicking on the "Add" button
function newElement() {
  var li = document.createElement("li");
  var inputValue = document.getElementById("myInput").value;

  var todos = get_todos();
  todo_id = todos.length;
  todos.push(inputValue);
  localStorage.setItem('todo', JSON.stringify(todos));

  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  li.id = todo_id;
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    document.getElementById("myUL").appendChild(li);
  }
  document.getElementById("myInput").value = "";

  close_helper(li);
}
// end Todo List Stuff
