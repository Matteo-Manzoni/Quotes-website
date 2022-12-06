
console.log("hello from external app.js");

function generate() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var response =  JSON.parse(xhttp.response)
        document.getElementById("quote").innerHTML = response["quote"]
      }
  };
  xhttp.open("GET", "/generate", true);
  xhttp.send();
}


//journal event handlers

document.getElementById("listEntries").addEventListener('click', populateEntry);

document.getElementById("buttonDelete").addEventListener('click', deleteEntry);
document.getElementById("buttonAdd").addEventListener('click', addEntry);

document.getElementById("buttonUpdate").addEventListener('click', uploadJournal);

// initialise journal list
document.addEventListener("DOMContentLoaded", function(){
    console.log("calling getJournal")
    getQuotes();
});

//utility functions - DO NOT EDIT OR DELETE
function getUniqueKey(){
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
};




function getQuotes(){
  //console.log("getting journal entries");
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    //console.log("xhttp ready state recieved")
    if (this.readyState == 4 && this.status == 200) { 
      //console.log("ready and OK");
      let quoteResult = JSON.parse(this.responseText);
      //console.log(journalResult);
      
      let quoteList = "";
      for (let item of quoteResult.quotes) {
        quoteList = quoteList + "<li date='" + String(item.date) +  "' quote='" + String(item.quote) + "' author='" + String(item.author) + "' id='Quote_" + quoteResult.quotes.indexOf(item) + "'>" + String(item.quote) + "</li>";}
     
    document.getElementById("listEntries").innerHTML = quoteList;
    
    }
    else{
      console.log("xhttp request problem occurred")
    }
  }
  xhttp.open("GET", "api/quote", true);
  xhttp.send();
}
/**
 * Dont forget to call the function that will retrieve the list entries when the page loads
 */

/**
 * clearEntry()
 *
 * Write a function that will
 * * clear the selected entry inputs
 *
 */
function clearEntry(){
    document.getElementById("quoteId").value = "";
    document.getElementById("dateQuote").value = "";
    document.getElementById("quoteQ").value = "";
    document.getElementById("authorQ").value = "";
}

/**
 * populateEntry(item)
 *
 * Write a function that will
 * * get the data for a single journal entry from item parameter
 * * extract the individual pieces of data from the entry
 * * and put each piece of information into the text fields on the html page
 * @param item
 */
function populateEntry(e){
    //clear old entry
    clearEntry()
    //console.log("item: " + e.target);
    let itemIndex = e.target.id
    let itemDate = e.target.getAttribute("date");
    let itemName = e.target.getAttribute("quote");
    let itemNote = e.target.getAttribute("author");
    document.getElementById("quoteId").value = itemIndex;
    document.getElementById("dateQuote").value = itemDate;
    document.getElementById("quoteQ").value = itemName;
    document.getElementById("authorQ").value = itemNote;
}

/**
 * addEntry() - add a journal entry
 *
 * Write a function that will
 * * create a new node list item element
 * * create a new text node element for the new list item and attach it to the new list item
 * * set other values of the list item - date, class, id, notes, student
 * * append the new node to the list of entries
 */
function addEntry(){
  let uid = getUniqueKey();
  console.log("uid: " + uid)
  let newDate = document.getElementById("dateAdd").value;
  let newName = document.getElementById("nameAdd").value;
  let newNote = document.getElementById("txtAdd").value;
  if(newName == "" || newNote == "" || newDate ==""){
    alert("Please enter values in the name and the notes inputs.")
  }else{
    //create new li item
    let newEntry = document.createElement('li');
    newEntry.id = uid;
    newEntry.setAttribute("date", newDate)
    newEntry.setAttribute("quote", newName);
    newEntry.setAttribute("author", newNote);
    newEntry.innerText = newDate;
    document.getElementById("listEntries").appendChild(newEntry)
    alert("Journal entry added to clientsdide list. Upload to save the list.")
  }
}

/**
 * deleteEntry()
 *
 * Write a function that will
 * * delete a journal entry (list item) from the html page
 */
function deleteEntry(){
  let idToDelete = document.getElementById("quoteId").value; 
  if(idToDelete != ""){
    document.getElementById(idToDelete).remove(); 
    //remove deleted details from selected entry boxes
    clearEntry()
    alert("Journal entry deleted on clientside. Upload to save changes.")
  } else {
    alert("Please select an entry to delete.")
  }
 

}

/**
 * uploadJournal()
 *
 * Write a function that will
 * * get the data from the list entries on the html page
 * * put the entries from the list into a collection
 * * convert the collection into a JSON object
 * * send JSON object to the url in the flask api
 * * and handle the response
 */
function uploadJournal(){
  //get list 
  let uploadList = document.getElementById("listEntries");
  var entriesList = uploadList.getElementsByTagName("li")
  //console.log("entries no. " + entriesList.length)
  // make object to convert to JSON
  let uploadObject = {};
  uploadObject.quotes = [];
  //list items and put into an array of objects
  //console.log(entriesList)
  for (let i = 0; i < entriesList.length ; i++){
    //console.log("upload entry " + entriesList[i].innerHTML);
    let objEntry = {}
    objEntry.date = entriesList[i].getAttribute("date");
    objEntry.quote = entriesList[i].getAttribute("quote");
    objEntry.author = entriesList[i].getAttribute("author");
    uploadObject.quotes.push(objEntry);
  }
  //console.log("upload Object:" + JSON.stringify(uploadObject));
  //console.log(uploadObject.journals[0])

  //convert object to JSON and put to api
  let xhttp = new XMLHttpRequest();
  let url = "/api/quote"
  
    xhttp.onreadystatechange = function() {
      let strResponse = "Error: no response";
      if (this.readyState == 4 && this.status == 200) {
        strResponse = JSON.parse(this.responseText);
        alert(strResponse.message)
      }
      //document.getElementById(elResponse).setAttribute("value",  strResponse.result);
      
    };
    xhttp.open("PUT", url, true);
    // Converting JSON data to string
    var data = JSON.stringify(uploadObject)
    // Set the request header i.e. which type of content you are sending
    xhttp.setRequestHeader("Content-Type", "application/json");
    //send it
    xhttp.send(data);

}

