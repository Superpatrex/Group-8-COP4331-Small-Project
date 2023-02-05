
// For animations
const signInButton = document.getElementById('signIn');
const signUpButton = document.getElementById('signUp');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => 
{
	container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => 
{
	container.classList.remove('right-panel-active');
});

// For eye icon
document.querySelectorAll(".eye").forEach(eyeIcon =>
{
	eyeIcon.addEventListener("click", () =>
	{
		let passwordField = document.getElementById("new-password");
    let confirmField = document.getElementById("confirm-password");
		{
			if (passwordField.type === "password")
			{
				passwordField.type = "text";
        confirmField.type = "text";
				eyeIcon.classList.replace("bx-hide", "bx-show");
				return;
			}
      
      confirmField.type = "password";
			passwordField.type = "password";
			eyeIcon.classList.replace("bx-show", "bx-hide");
		}
	});
});

// ** NEEDS TO BE CHANGED (maybe) **
const urlBase = 'http://cop4331group.com/LAMPAPI';
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
		passwordStatus.style.backgroundColor="#4caf50";
		flag = true;
	}
	else
	{
		passwordStatus.innerText = "Your passwords don't match!"
		passwordStatus.style.backgroundColor="#f44336";
		flag = false;
	}
}

// Saves cookie 
function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function validateLogIn(username, password)
{
	let userNameRestriction = /(?=.*[a-zA-Z])([a-zA-Z0-9-_]).{6,20}$/

	// Checks for valid username or empty password on login
	if (userNameRestriction.test(username) == false)
		return false;
	else if (password == "")
		return false;
}

// For validating a sign-up form
function validateCredentials(first, last, pass, user)
{
	let userNameRestriction = /(?=.*[a-zA-Z])([a-zA-Z0-9-_]).{6,20}$/
	let passRestriction = /(?=.*\d)(?=.*[A-Za-z])(?=.*[?!@#$%^&*]).{8,32}$/
	let nameRestriction = /(?=.*[a-zA-Z])./
	
	if (nameRestriction.test(last) == false || nameRestriction.test(first) == false)
	{
		document.getElementById("signUpErrMessage").innerHTML="Your First/Last name must include:<br>- At least one alphabetical character";
    	document.getElementById("signUpErrMessage").style.backgroundColor="#f44336";
    	document.getElementById("signUpErrMessage").style.height="65px";
		return false;
	}

	else if (userNameRestriction.test(user) == false)
	{
		document.getElementById("signUpErrMessage").innerHTML="Your username must:<br>- Include at least one letter<br>- Be between 7-20 characters";
    	document.getElementById("signUpErrMessage").style.backgroundColor="#f44336";
    	document.getElementById("signUpErrMessage").style.height="75px";
		return false;
	}

	else if (passRestriction.test(pass) == false)
	{
		document.getElementById("signUpErrMessage").innerHTML="Your password must contain:<br>- At least 1 uppercase/lowercase letter<br>- At least 1 number<br>- At least 1 special character (?!@#$%^&*_=+-)<br>- At least 8 characters, but no more than 32";
    	document.getElementById("signUpErrMessage").style.backgroundColor="#f44336";
    	document.getElementById("signUpErrMessage").style.height="109px";
    	document.getElementById("signUpErrMessage").style.width="360px";
		return false;
	}

	return true;
}

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	let login = document.getElementById("username").value;
	let password = document.getElementById("password").value;
  let hash = md5(password);
  
	// Stops login process if no input
	if (validateLogIn(login, password) == false)
 {
    document.getElementById("logInErrMessage").innerHTML = "Username or password incorrect.";
	  document.getElementById("logInErrMessage").style.backgroundColor = "#f44336";
   return;
 }
		

	let tmp = {login:login, password:hash};

	let jsonPayload = JSON.stringify(tmp);
	
	let url = urlBase + '/Login.' + extension;
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
					document.getElementById("logInErrMessage").style.backgroundColor = "#f44336";
					return;
				}
				
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
				
				// Changes site to contacts
        window.location.href = "contactPage.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("logInErrMessage").innerHTML = err.message;
		document.getElementById("logInErrMessage").style.backgroundColor = "#f44336";
	}
}

// To create account 
function submitForm()
{	
		firstName = document.getElementById("first-name").value;
   	lastName = document.getElementById("last-name").value;

    let username = document.getElementById("new-username").value;
    let password = document.getElementById("new-password").value;
    let hash = md5(password);
    
    // Stops submission process if credentials aren't correct
    if (validateCredentials(firstName, lastName, password, username) == false || flag == false)
      return;
      
    else
    {
		  let tmp = {userId: userId, firstName: firstName, lastName: lastName, login: username, password: hash};
	         
		  let jsonPayload = JSON.stringify(tmp);
	      
		  let url = urlBase + '/AddUser.' + extension;
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
				        document.getElementById("signUpErrMessage").style.backgroundColor="#f44336";
		            document.getElementById("signUpErrMessage").style.height="35px";
		            return;
		        }

		        // When new user is added
		        if (this.readyState == 4 && this.status == 200)
		        {
		            let jsonObject = JSON.parse(jsonPayload);
		            document.getElementById("signUpErrMessage").innerHTML="User created!";
		            document.getElementById("signUpErrMessage").style.backgroundColor="#4caf50";
		            document.getElementById("signUpErrMessage").style.height="35px";
		            userId = jsonObject.id;
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
	    	document.getElementById("signUpErrMessage").style.backgroundColor="#f44336";
			}
	}
}
