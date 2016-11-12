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

function get_checked() {
	var checked = new Array;
	var checked_str = localStorage.getItem('checked');
	if (checked_str != null) {
		checked = JSON.parse(checked_str);
	}
	return checked;
}

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

document.addEventListener('DOMContentLoaded', function() {
  show_todos();
  document.getElementById("newTask").addEventListener("click", newElement);
  var checked = get_checked();
  // Add a "checked" symbol when clicking on a list item
  var list = document.querySelector('ul');
  list.addEventListener('click', function(ev) {
  	if (ev.target.tagName === 'LI') {
  		var div = ev.target;
  		var index = find_index(div.textContent.slice(0,div.textContent.length - 1));
  		checked[index] = ! checked[index];
  		localStorage.setItem('checked', JSON.stringify(checked));
  		div.classList.toggle('checked');
  	}
  }, false);
});

var close = document.getElementsByClassName("close");

function close_helper(li) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);
  var todos = get_todos();
  var checked = get_checked();
  for (j = 0; j < close.length; j++) {
    close[j].onclick = function() {
	    var div = this.parentElement;
	    var id = find_index(div.textContent.slice(0,div.textContent.length - 1));
	    todos.splice(id, 1);
	    checked.splice(id, 1);
	    localStorage.setItem('todo', JSON.stringify(todos));
	    localStorage.setItem('checked', JSON.stringify(checked));
	    div.style.display = "none";
    }
  }
}

function show_todos() {
	var todos = get_todos();
	var checked = get_checked();
	for (i = 0; i < todos.length; i++) {
		var li = document.createElement("li");
		li.id = i;
		var inputValue = todos[i];
		var t = document.createTextNode(inputValue);
		li.appendChild(t);
		if (checked[i] == true) {
			li.classList.toggle('checked');
		}
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

function renderStatus(statusText) {
  // document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  //getWeather()
  var url = "google.com"
  getImageUrl(url, function(imageUrl, width, height) {
    renderStatus('Search term: ' + url + '\n' +
          'Google image search result: ' + imageUrl);
    var imageResult = document.getElementById('image-result');
      // Explicitly set the width/height to minimize the number of reflows. For
      // a single image, this does not matter, but if you're going to embed
      // multiple external images in your page, then the absence of width/height
      // attributes causes the popup to resize multiple times.
    imageResult.width = width;
    imageResult.height = height;
    imageResult.src = imageUrl;
    imageResult.hidden = false;
  }, function(errorMessage) {
      console.log("message")
    renderStatus('Cannot display image. ' + errorMessage);
  });
});

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
            // console.log(myArr);
            myFunction(myArr);
        } 
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    function myFunction(arr) {
        var i;
        for (i = 0; i < 3; i++) {
            var a = document.createElement('a');
            var br = document.createElement("br");
            var linkText = document.createTextNode(arr["articles"][i]["title"]);
            a.appendChild(linkText);
            a.appendChild(br);
            a.title = arr["articles"][i]["title"];
            a.href = arr["articles"][i]["url"];
            document.body.appendChild(a);   
        }
        // document.getElementById("newsIMG").src = arr["articles"][i]["urlToImage"];
    }
});

document.querySelector('#go-to-options').addEventListener(function() {
  if (chrome.runtime.openOptionsPage) {
    // New way to open options pages, if supported (Chrome 42+).
    chrome.runtime.openOptionsPage();
  } else {
    // Reasonable fallback.
    window.open(chrome.runtime.getURL('options.html'));
  }
});

// f18591ef19a34f3eb023911fbebffa16


