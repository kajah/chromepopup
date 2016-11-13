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

/**
 * @param {string} searchTerm - Search term for Google Image search.
 * @param {function(string,number,number)} callback - Called when an image has
 *   been found. The callback gets the URL, width and height of the image.
 * @param {function(string)} errorCallback - Called when the image is not found.
 *   The callback gets a string that describes the failure reason.
 */
function getImageUrl(searchTerm, callback, errorCallback) {
  // Google image search - 100 searches per day.
  // https://developers.google.com/image-search/
  var searchUrl = 'https://ajax.googleapis.com/ajax/services/search/images' +
    '?v=1.0&q=' + encodeURIComponent(searchTerm);
  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  // The Google image search API responds with JSON, so let Chrome parse it.
  x.responseType = 'json';
  x.onload = function() {
    // Parse and process the response from Google Image Search.
    var response = x.response;
    if (!response || !response.responseData || !response.responseData.results ||
        response.responseData.results.length === 0) {
      errorCallback('No response from Google Image search!');
      return;
    }
    var firstResult = response.responseData.results[0];
    // Take the thumbnail instead of the full image to get an approximately
    // consistent image size.
    var imageUrl = firstResult.tbUrl;
    var width = parseInt(firstResult.tbWidth);
    var height = parseInt(firstResult.tbHeight);
    console.assert(
        typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
        'Unexpected respose from the Google Image Search API!');
    callback(imageUrl, width, height);
  };
  x.onerror = function() {
    errorCallback('Network error.');
  };
  x.send();
}

document.addEventListener('DOMContentLoaded', function(){ 
    var xmlhttp = new XMLHttpRequest();
    var url = "http://api.wunderground.com/api/0233c96d7f0837b9/conditions/q/CA/San_Francisco.json";
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            myFunction(myArr);
        } 
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    function myFunction(arr) {
        var out = "";
        console.log(arr['current_observation']["display_location"]["city"]);
        out += arr['current_observation']["display_location"]["city"];  
        out += "\n" 
        out += arr['current_observation']["weather"];  
        out += "\n";
        out += arr['current_observation']["temperature_string"];                                        
        document.getElementById("weather").innerHTML = out;
        document.getElementById("weatherIMG").src = arr["current_observation"]["icon_url"];
    }
});

document.addEventListener('DOMContentLoaded', function(){ 
    var xmlhttp = new XMLHttpRequest();
    var url = "https://newsapi.org/v1/articles?source=the-next-web&sortBy=latest&apiKey=f18591ef19a34f3eb023911fbebffa16";
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            myFunction(myArr);
        } 
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    function myFunction(arr) {
        var newsDiv = document.getElementById('news');
        var ol = newsDiv.appendChild(document.createElement('ol'));
        for (var i = 0; i < 3; i++) {
            var li = ol.appendChild(document.createElement('li'));
            var a = li.appendChild(document.createElement('a'));
            a.href = arr["articles"][i]["url"];
            a.appendChild(document.createTextNode(arr["articles"][i]["title"]));
            a.addEventListener('click', onAnchorClick);
        }
    }
});

document.addEventListener('DOMContentLoaded', function(){ 
    var xmlhttp = new XMLHttpRequest();
    var url = "http://ws.audioscrobbler.com/2.0/?method=chart.getTopTracks&api_key=155c1541197e6602512b44c9a17a3dd7&format=json"
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            myFunction(myArr);
            console.log(myArr);
        } 
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    function myFunction(arr) {
        var songsDiv = document.getElementById('songs');
        var ol = songsDiv.appendChild(document.createElement('ol'));
        for (var i = 0; i < 5; i++) {
            console.log(arr.tracks.track[i].name);
            var li = ol.appendChild(document.createElement('li'));
            var a = li.appendChild(document.createElement('a'));
            a.href = arr.tracks.track[i].url;
            a.appendChild(document.createTextNode(arr.tracks.track[i].name));
            a.addEventListener('click', onAnchorClick);
        }
    }
});


// f18591ef19a34f3eb023911fbebffa16
// Songs Key: 155c1541197e6602512b44c9a17a3dd7

