var objectArray = [];
//Asks server  from data and creates a list from results
function getData() {
  var request;
  var pages = 3;
  var page_size = 90;
  var initial_url = "http://api.github.com/gists/public";
  var tempArray = [];
  var i;

  for (i = 1; i <= pages; i++) {
    request = new XMLHttpRequest;
    if (!request) {
      alert('Unable to create http request');
    }
    var url = initial_url + "?page=" + i + "&per_page=" + page_size;	
    request.open('GET',url);
    request.send();
    request.onreadystatechange = function() {
      if (request.readyState === 4)
        {
          if (request.status === 200) {
                var response = JSON.parse(this.responseText);
                buildArray(response);
          }
        }
    };
  }
  tempArray = languageFilter(objectArray);
  objectArray = [];
  buildTableGist(document.getElementById('show-query'),tempArray);
}

//adds objects to array
function buildArray(obArray) {
  for(i = 0;i < obArray.length;i++)
  {
    objectArray.push(obArray[i]);
  }
}

//Produces array of queries
function buildTableGist(ul,queryArray) {	
	//resets lists
  reset(ul);
  var pageNum = document.getElementById('itemperpage');
  var pageNumValue = pageNum.value;
  var pageSize = 30;
  var toDisplay = pageSize*pageNumValue;
  var saveButton;
  if (queryArray.length < toDisplay)
  {
    toDisplay = queryArray.length;
  }
  for (var j = 0; j < toDisplay ;j++)
  {
    var item = document.createElement('li');
    if (queryArray[j].hasOwnProperty.call(queryArray[j],'description') ===  false)
    {
      item.innerHTML = '<a href='+queryArray[j].url + '>' + "Description empty" + '</a>';
    }
    else if (queryArray[j].description === "" )
    {
      item.innerHTML = '<a href='+queryArray[j].url + '>'+"Description empty"+'</a>' + '</a>';
    }
    else
    {
      item.innerHTML = '<a href='+queryArray[j].url+'>'+queryArray[j].description+'</a>';
    }
    ul.appendChild(item);
    saveButton = createButton('Save',queryArray,j,queryArray[j].id);
    item.appendChild(saveButton);
  }
}

//builds array of those selected by user
function languageFilter(obArray) {
  var tempArray = [];
	//variables to track what boxes are checked
  var jsoCheck = document.getElementById('JSON').checked;
  var sqlCheck = document.getElementById('SQL').checked;
  var pythCheck = document.getElementById('Python').checked;
  var jsCheck = document.getElementById('Javascript').checked;
  var languageCheck;
  var nestedobj;
  var nestedobj2;
	
  for (i = 0; i < obArray.length;i++)
  {
    nestedobj = obArray[i].files;
    for(key in nestedobj)
    {
      nestedobj2 = nestedobj[key];
      for(key_2 in nestedobj2)
      {
        if (nestedobj2.hasOwnProperty('language'))
        {
          languageCheck = nestedobj2.language;
        }			
      }
    }
		//adds objects to array based on what is checked
    if (pythCheck == false && jsoCheck == false && jsCheck == false && sqlCheck == false)
    {
      tempArray.push(obArray[i]);
    }
    else
    {
      if (languageCheck == 'Python' && pythCheck == true)
      {
        tempArray.push(obArray[i]);
      }
						
      if (languageCheck == 'JSON' && jsoCheck == true)
      {
        tempArray.push(obArray[i]);
        console.log(jsoCheck);
      }
						
      if (languageCheck == 'JavaScript' && jsCheck == true)
      {
      tempArray.push(obArray[i]);
      }
						
      if ((languageCheck == 'SQL' || languageCheck == 'sql') && sqlCheck == true)
      {
        tempArray.push(obArray[i]);
      }
    }
  }	
  return tempArray;
}

//displays favorites
function showFav(listName) {
  reset(listName);
	
  var remove_Button;
  var objectId;
  var storeStr;
  var storeObj;
  var entry;
	
  for(var i = 0; i < localStorage.length;i++)
  {
    entry = document.createElement('li');
    storeStr = localStorage.getItem(localStorage.key(i));
    storeObj = JSON.parse(storeStr);
    if (storeObj.hasOwnProperty.call(storeObj,'description') ===  false)
    {
      entry.innerHTML = '<a href='+storeObj.url + '>' + "Description empty" + '</a>';
    }
    else if (storeObj.description === "" )
    {
      entry.innerHTML = '<a href='+storeObj.url + '>'+"Description empty"+'</a>' + '</a>';
    }
    else
    {
      entry.innerHTML = '<a href='+storeObj.url+'>'+storeObj.description+'</a>';
    }
    listName.appendChild(entry);
    objectId = storeObj.id;
    remove_Button = deleteButton('Remove',objectId);
    entry.appendChild(remove_Button);
  }
}

//creates a button to add items to local storage
function createButton(text,array,index,id) {
  var temp = document.createElement('input');
  var i = index;
	
  temp.type = 'button';
  temp.value = text;
  temp.name = text;
  temp.id = id;
  temp.onclick = function() {
    localStorage['Saved'+id] = JSON.stringify(array[i]);
    array.splice(i,1);
    buildTableGist(document.getElementById('show-query'),array);
    showFav(document.getElementById('show-favorite'));
    };
    return temp;
}

//removes items from local storage
function deleteButton(text,id) {
  var temp = document.createElement('input');
  temp.type = 'button';
  temp.value = text;
  temp.name = text;
  temp.id = id;
  temp.onclick = function() {
    delete window.localStorage["Saved"+id];
    showFav(document.getElementById('show-favorite'));
  };
  return temp;
}

//resets table
function reset(ul) {
  for (var i = ul.childNodes.length-1; i>=0; i--)
  {
    ul.removeChild(ul.childNodes[i]);
  }
}

//displays favorites on page load
window.onload = function() {
  showFav(document.getElementById('show-favorite'));
}
