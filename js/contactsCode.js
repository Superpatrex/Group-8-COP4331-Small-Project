let userId = 0;
const urlBase = 'http://cop4331group.com/LAMPAPI';
const extension = 'php';
let objId = [];

// Reads window cookie
function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");

	for (var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");

		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt(tokens[1].trim());
		}
	}
	
	// Checks if cookie doesn't exist
	if( userId < 0 )
	{
		window.location.href = "login.html";
	}

	else
	{
		document.getElementById("userFirstName").innerHTML = "Hello, " + firstName + "!";
	}
}

function searchContacts()
{
	let searchString = document.getElementById("search-bar").value;
	let data = {search: searchString, userId: userId};
	let jsonPayload = JSON.stringify(data);
	let url = urlBase + '/SearchContact.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
    	let table = document.getElementById("table-body");
    	xhr.onreadystatechange = function ()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);

				// No contacts with search
				if (jsonObject.error)
				{
          			table.innerHTML="";
          			document.querySelector(".content").style.display="none";
          			document.querySelector(".error").style.display="block";
					      return;
				}
        
        		document.querySelector(".content").style.display="block";
        		document.querySelector(".error").style.display="none";
		        let newText = "";
        
        // Creates table for contacts
				for (let i = 0; i < jsonObject.results.length; i++)
				{	
					newText +="<tr id='row"+i+"'>";
  			  newText +="<td><i class='bx bxs-edit-alt editIcon' onclick='editContact("+i+")' title='Edit Contact'></i><i class='bx bxs-trash-alt deleteIcon' onclick = 'deleteContact("+i+")' title='Delete Contact'></i></td>";
					newText +="<td id='fname"+i+"'>"+jsonObject.results[i].FirstName+"</td>";
					newText +="<td id='lname"+i+"'>"+jsonObject.results[i].LastName+"</td>";
					newText +="<td id='email"+i+"'>"+jsonObject.results[i].Email+"</td>";
					newText +="<td id='phone"+i+"'>"+jsonObject.results[i].PhoneNumber+"</td>";
					newText +="</tr>";
				}
				table.innerHTML = newText;
			}
		}
		xhr.send(jsonPayload);			
	}

	catch(err)
	{
		return;
	}
}

function loadContacts()
{
	let data = {search: "", userId: userId};
    let jsonPayload = JSON.stringify(data);
    let url = urlBase + '/SearchContact.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try 
    {
		xhr.onreadystatechange = function ()
		{
			let table = document.getElementById("table-body");

			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);

				if (jsonObject.error)
				{
					table.innerHTML="";
  			  document.querySelector(".content").style.display="none";
  			  document.querySelector(".error").style.display="block";
					return;
				}

				table.innerHTML="";
				let newText= "";
        document.querySelector(".content").style.display="block";
				for (let i = 0; i < jsonObject.results.length; i++)
				{	
 			    objId[i] = jsonObject.results[i].ID;
					newText +="<tr id='row"+i+"'>";
  			  newText +="<td><i class='bx bxs-edit-alt editIcon' onclick='editContact("+i+")' title='Edit Contact'></i><i class='bx bxs-trash-alt deleteIcon' onclick = 'deleteContact("+i+")' title='Delete Contact'></i></td>";
					newText +="<td id='fname"+i+"'>"+jsonObject.results[i].FirstName+"</td>";
					newText +="<td id='lname"+i+"'>"+jsonObject.results[i].LastName+"</td>";
					newText +="<td id='email"+i+"'>"+jsonObject.results[i].Email+"</td>";
					newText +="<td id='phone"+i+"'>"+jsonObject.results[i].PhoneNumber+"</td>";
					newText +="</tr>";
				}

				table.innerHTML = newText;
			}
		}
		xhr.send(jsonPayload);
	}

	catch (err)
	{
		return;
    }
}

function doLogout()
{
	userId = 0;
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

// Validation for contact
function validateInfo(firstName, lastName, email, phone)
{
	let nameRestriction = /(?=.*[a-zA-Z])./
	let emailRestriction = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
	let phoneRestriction = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
	let retVal = 0;

	if (nameRestriction.test(firstName) == false)
	{
		document.getElementById("form-err-message").innerHTML="First name empty or invalid.";
		document.getElementById("form-err-message").style.padding="1.25em 1em 1.25em 1em"
		document.getElementById("first-name").style.border=".125em solid red";
		retVal = 1;
	}

	else if (nameRestriction.test(lastName) == false)
	{
		document.getElementById("form-err-message").innerHTML="Last name empty or invalid.";
		document.getElementById("form-err-message").style.padding="1.25em 1em 1.25em 1em"
		document.getElementById("last-name").style.border=".125em solid red";
		retVal = 2;
	}

	else if (emailRestriction.test(email) == false)
	{
		document.getElementById("form-err-message").innerHTML="Email is empty or invalid.";
		document.getElementById("form-err-message").style.padding="1.25em 1em 1.25em 1em"
		document.getElementById("email").style.border=".125em solid red";
		retVal = 3;
	}

	else if (phoneRestriction.test(phone) == false)
	{
		document.getElementById("form-err-message").innerHTML="Phone number is empty or invalid.";
		document.getElementById("form-err-message").style.padding="1.25em 1em 1.25em 1em"
		document.getElementById("phone").style.border=".125em solid red";
		retVal = 4;
	}

	switch(retVal)
	{
		case 1: 
		{
			document.getElementById("last-name").style.border="none";
			document.getElementById("email").style.border="none";
			document.getElementById("phone").style.border="none";
			break;
		}
		case 2:
		{
			document.getElementById("first-name").style.border="none";
			document.getElementById("email").style.border="none";
			document.getElementById("phone").style.border="none";
			break;
		}
		case 3:
		{
			document.getElementById("first-name").style.border="none";
			document.getElementById("last-name").style.border="none";
			document.getElementById("phone").style.border="none";
			break;
		}
		case 4:
		{
			document.getElementById("first-name").style.border="none";
			document.getElementById("last-name").style.border="none";
			document.getElementById("email").style.border="none";
			break;
		}
	}
	
	if (retVal != 0)
		return false;
	else
	{
		document.getElementById("form-err-message").innerHTML="";
		document.getElementById("form-err-message").style.padding="0";
		document.getElementById("first-name").style.border="none";
		document.getElementById("last-name").style.border="none";
		document.getElementById("email").style.border="none";
		document.getElementById("phone").style.border="none";
		return true;
	}
}

// Validate for edit contact field
function validateInfoEdit(firstName, lastName, email, phone)
{
	let nameRestriction = /(?=.*[a-zA-Z])./
	let emailRestriction = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
	let phoneRestriction = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
	let retVal = 0;

	if (nameRestriction.test(firstName) == false)
	{
		document.getElementById("form-err-message-edit").innerHTML="First name empty or invalid.";
		document.getElementById("form-err-message-edit").style.padding="1.25em 1em 1.25em 1em"
		document.getElementById("first-name-edit").style.border=".125em solid red";
		retVal = 1;
	}

	else if (nameRestriction.test(lastName) == false)
	{
		document.getElementById("form-err-message-edit").innerHTML="Last name empty or invalid.";
		document.getElementById("form-err-message-edit").style.padding="1.25em 1em 1.25em 1em"
		document.getElementById("last-name-edit").style.border=".125em solid red";
		retVal = 2;
	}

	else if (emailRestriction.test(email) == false)
	{
		document.getElementById("form-err-message-edit").innerHTML="Email is empty or invalid.";
		document.getElementById("form-err-message-edit").style.padding="1.25em 1em 1.25em 1em"
		document.getElementById("email-edit").style.border=".125em solid red";
		retVal = 3;
	}

	else if (phoneRestriction.test(phone) == false)
	{
		document.getElementById("form-err-message-edit").innerHTML="Phone number is empty or invalid.";
		document.getElementById("form-err-message-edit").style.padding="1.25em 1em 1.25em 1em"
		document.getElementById("phone-edit").style.border=".125em solid red";
		retVal = 4;
	}

	switch(retVal)
	{
		case 1: 
		{
			document.getElementById("last-name-edit").style.border="none";
			document.getElementById("email-edit").style.border="none";
			document.getElementById("phone-edit").style.border="none";
			break;
		}
		case 2:
		{
			document.getElementById("first-name-edit").style.border="none";
			document.getElementById("email-edit").style.border="none";
			document.getElementById("phone-edit").style.border="none";
			break;
		}
		case 3:
		{
			document.getElementById("first-name-edit").style.border="none";
			document.getElementById("last-name-edit").style.border="none";
			document.getElementById("phone-edit").style.border="none";
			break;
		}
		case 4:
		{
			document.getElementById("first-name-edit").style.border="none";
			document.getElementById("last-name-edit").style.border="none";
			document.getElementById("email-edit").style.border="none";
			break;
		}
	}
	
	if (retVal != 0)
		return false;
	else
	{
		document.getElementById("form-err-message-edit").innerHTML="";
		document.getElementById("form-err-message-edit").style.padding="0";
		document.getElementById("first-name-edit").style.border="none";
		document.getElementById("last-name-edit").style.border="none";
		document.getElementById("email-edit").style.border="none";
		document.getElementById("phone-edit").style.border="none";
		return true;
	}
}

// To toggle divs
let formFlag = false;
function showForm()
{
	if (formFlag == false)
	{
		if (document.querySelector(".error").style.display === 'block')
		{
			document.querySelector(".error").style.display="none";
		}
		document.getElementById("search-bar").value = "";
		document.querySelector(".content").style.display="none";
		document.querySelector(".add-contact-div").style.display="block";
		document.getElementById("search-bar").style.display="none";
		document.querySelector(".addIcon").classList.replace("bxs-user-plus", "bx-x");
		document.querySelector(".col").style.background="#f44336";
		formFlag = true;
	}

	else
	{
		loadContacts();
		document.getElementById("search-bar").style.display="flex";
		document.querySelector(".add-contact-div").style.display="none";
		document.querySelector(".edit").style.display="none";
		document.querySelector(".addIcon").classList.replace("bx-x", "bxs-user-plus");
		document.querySelector(".col").style.background="#009688";
    	document.getElementById("form-err-message").innerHTML="";
		document.getElementById("form-err-message").style.padding="0";
		document.getElementById("first-name").style.border="none";
		document.getElementById("last-name").style.border="none";
		document.getElementById("email").style.border="none";
		document.getElementById("phone").style.border="none";
		document.getElementById("form-err-message-edit").innerHTML="";
		document.getElementById("form-err-message-edit").style.padding="0";
		document.getElementById("first-name-edit").style.border="none";
		document.getElementById("last-name-edit").style.border="none";
		document.getElementById("email-edit").style.border="none";
		document.getElementById("phone-edit").style.border="none";
		formFlag = false;
	}
}

function clearForm()
{
	document.getElementById("add-contact-form").reset();
}

function addContact()
{
	let first = document.getElementById("first-name").value;
	let last = document.getElementById("last-name").value;
	let phone = document.getElementById("phone").value;
	let email = document.getElementById("email").value;

	if (validateInfo(first, last, email, phone) == false)
		return;

	let tmp = {userId: userId, firstName: first, lastName: last, phoneNumber: phone, email: email};
	 
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + '/AddContact.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function () 
		{
		    // Request OK
		    if (this.readyState == 4 && this.status == 200)
		    {	
		    	// Clears contact form
		    	clearForm();

		    	// Loads contacts
		    	loadContacts();

		    	// Swaps back to form to show new contact
          showForm();
		    }
		};
	xhr.send(jsonPayload);
	}

	catch (err)
	{
		clearForm();
		showForm();
		return;
	}
}

let workNumber = 0;

function deleteContact(num)
{

	// Show page here and hide other stuff
	document.querySelector(".content").style.display="none";
	document.getElementById("search-bar").value = "";
	document.getElementById("search-bar").style.display = "none";
	document.querySelector(".col").style.display="none";
	document.querySelector(".del").style.display="block";
	workNumber = num;
}

function editContact(num)
{
	workNumber = num;
	document.querySelector(".content").style.display="none";
	document.getElementById("search-bar").value = "";
	document.getElementById("search-bar").style.display = "none";
	document.querySelector(".addIcon").classList.replace("bxs-user-plus", "bx-x");
	document.querySelector(".col").style.background="#f44336";
	document.querySelector(".edit").style.display = "block";
	formFlag = true;

	// Sets input fields
	let first = document.getElementById("fname" + workNumber).innerText;
  let last = document.getElementById("lname" + workNumber).innerText;
  let mail = document.getElementById("email" + workNumber).innerText;
  let phone = document.getElementById("phone" + workNumber).innerText;

	document.getElementById("first-name-edit").value = first;
	document.getElementById("last-name-edit").value = last;
	document.getElementById("email-edit").value = mail;
	document.getElementById("phone-edit").value = phone;
}

function reallyEditContact()
{
	let firstEdit = document.getElementById("first-name-edit").value;
	let lastEdit = document.getElementById("last-name-edit").value;
	let mailEdit = document.getElementById("email-edit").value;
	let phoneEdit = document.getElementById("phone-edit").value;
 
	if (validateInfoEdit(firstEdit, lastEdit, mailEdit, phoneEdit) == false)
	{
		return;
	}
    
    // Grab object ID to use in JSON object
    let id = objId[workNumber];
    let data = {nfirstName: firstEdit, nlastName: lastEdit, nemail: mailEdit, nphoneNumber: phoneEdit, id: id};
    let jsonPayload = JSON.stringify(data);

    let url = urlBase + '/EditContact.' + extension;
    
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function ()
        {
            // Request OK
            if (this.readyState == 4 && this.status == 200)
            {
                showForm();
                loadContacts();
            }
        };
        xhr.send(jsonPayload);
    }
    // This shouldn't trigger.
    catch (err)
    {
        return;
    }
}

// Closes GUIs and loads contacts
function cancelAndLoad()
{
	document.querySelector(".del").style.display="none";
	document.querySelector(".col").style.display="inline-block";
	document.getElementById("search-bar").style.display = "flex";
	loadContacts();
}

function reallyDeleteContact()
{
    let first = document.getElementById("fname" + workNumber).innerText;
    let last = document.getElementById("lname" + workNumber).innerText;
    let mail = document.getElementById("email" + workNumber).innerText;
    let phone = document.getElementById("phone" + workNumber).innerText;
    
    document.getElementById("row" + workNumber+ "").outerHTML = "";
    
    let data = 
    {
        userId: userId,
        firstName: first,
        lastName: last,
        email: mail,
        phoneNumber: phone
    };
    
    let jsonPayload = JSON.stringify(data);
    let url = urlBase + '/DeleteContact.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {  
        // Request OK
        xhr.onreadystatechange = function () 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
                // Close GUIs and load new contacts data
                cancelAndLoad();
            }
        };
     xhr.send(jsonPayload);   
    }
    catch (err)
    {
        return;
    }
};
