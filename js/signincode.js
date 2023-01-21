
const signInButton = document.getElementById('signIn');
const signUpButton = document.getElementById('signUp');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
	container.classList.remove('right-panel-active');
});

// ** NEEDS TO BE CHANGED (maybe) **
const urlBase = 'http://jackandrewscs.com/';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let flag = false;

function checkPassword()
{
	// Set variables
	let password = document.getElementById("new-password").value;
	let confirm = document.getElementById("confirm-password").value;
	let passwordStatus = document.getElementById("password-status");

	if (confirm.length == 0)
	{
		passwordStatus.innerText = "";
		passwordStatus.style.backgroundColor="white";
		flag = false;
	}

	// Check if passwords match
	else if (confirm == password)
	{
		passwordStatus.innerText = "Passwords match!";
		passwordStatus.style.backgroundColor="#3cb371";
		flag = true;
	}
	else
	{
		passwordStatus.innerText = "Your passwords don't match. Please try again."
		passwordStatus.style.backgroundColor="#ff6242";
		flag = false;
	}
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for (var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");

		if (tokens[0] == "firstName")
			firstName = tokens[1];
		else if( tokens[0] == "lastName")
			lastName = tokens[1];
		else if( tokens[0] == "userId")
			userId = parseInt(tokens[1].trim());
	}
	
	if (userId < 0)
		window.location.href = "login.html";

	else
	{
		// change "username" to ID of div in contacts
		document.getElementById("username").innerHTML = "Welcome back," + firstName + " " + lastName +" !";
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function validateLogIn(username, password)
{
	let userNameRestriction = /(?=.*[a-zA-Z])([a-zA-Z0-9-_]).{7,20}$/

	// Checks for valid username or empty password on login
	if (userNameRestriction.test(username) == false)
		return false;
	else if (password == "")
		return false;
}

function validateCredentials(first, last, pass, user)
{
	let userNameRestriction = /(?=.*[a-zA-Z])([a-zA-Z0-9-_]).{7,20}$/
	let passRestriction = /(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,32}$/
	let nameRestriction = /(?=.*[a-zA-Z])./
	let fName = document.getElementById("first-name").value;
    let lName = document.getElementById("last-name").value;

	if (userNameRestriction.test(user) == false)
		return false;
	else if (nameRestriction.test(last) == false || nameRestriction.test(first) == false)
		return false;
	else if (passRestriction.test(pass) == false)
		return false;
	return true;
}
function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("username").value;
	let password = document.getElementById("password").value;

	// Stops login process if no input
	if (validateLogIn(login, password) == false)
		return;

	let tmp = {login:login, password:password};

	let jsonPayload = JSON.stringify(tmp);
	
	let url = urlBase + 'login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			// Get request successful
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;
				
				// If no data found
				if( userId < 1 )
				{		
					document.getElementById("logInErrMessage").innerHTML = "Username or password incorrect.";
					document.getElementById("logInErrMessage").style.backgroundColor = "#ff6242";
					return;
				}
				
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
				
				// Changes site to contacts
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("logInErrMessage").innerHTML = err.message;
		document.getElementById("logInErrMessage").style.backgroundColor = "#ff6242";
	}
}

function showRequirements(text)
{
	if (text.validity.patternMismatch)
	{
		text.setCustomValidity("Your password must contain:\nAt least 1 uppercase/lowercase letter\nAt least 1 number\nAt least 1 special character (!@#$%^&*_=+-)\nAt least 8 characters, but no more than 32");
	}
}

// To create account 
function submitForm()
{	
	firstName = document.getElementById("first-name").value;
    lastName = document.getElementById("last-name").value;

    let username = document.getElementById("new-username").value;
    let password = document.getElementById("new-password").value;

    // Stops submission process if credentials aren't correct
    if (validateCredentials(firstName, lastName, password, username) == false || flag == false)
    	return;

    else
    {
	    let tmp = 
	    {
	        firstName: firstName,
	        lastName: lastName,
	        login: username,
	        password: password
	    };

	    let jsonPayload = JSON.stringify(tmp);

	    let url = urlBase + 'login.' + extension;
	    let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

		try
		{
	        xhr.onreadystatechange = function () 
	        {

	        	// For when the username already exists in database
	            if (this.readyState == 4 && this.status == 409)
	            {
	                document.getElementById("signUpErrMessage").innerHTML="User already exists.";
					document.getElementById("signUpErrMessage").style.backgroundColor="#ff6242";
	                return;
	            }

	            // When new user is added
	            if (this.readyState == 4 && this.status == 200)
	            {

	                let jsonObject = JSON.parse(xhr.responseText);
	                userId = jsonObject.id;
	                document.getElementById("signUpErrMessage").innerHTML="User created!";
	                document.getElementById("signUpErrMessage").style.backgroundColor="#3cb371";
	                firstName = jsonObject.firstName;
	                lastName = jsonObject.lastName;
	                saveCookie();
	            }
	        };
	        xhr.send(jsonPayload);
	    }
	    // Displays any other error
	    catch (err) 
	    {
	        document.getElementById("signUpErrMessage").innerHTML = err.message;
	        document.getElementById("signUpErrMessage").style.backgroundColor="#ff6242";
	    }
	}
    
}
