

const extension = 'php';
const signInButton = document.getElementById('signIn');
const signUpButton = document.getElementById('signUp');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
	container.classList.remove('right-panel-active');
});

let flag = true;

function checkPassword()
{
	// Set variables
	let password = document.getElementById("password").value;
	let confirm = document.getElementById("confirm-password").value;
	let passwordStatus = document.getElementById("password-status");

	if (confirm.length == 0)
	{
		passwordStatus.innerText = "";
		passwordStatus.style.backgroundColor="white";
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
	return true;
}

function showRequirements(text)
{
	if (text.validity.patternMismatch)
	{
		text.setCustomValidity("Your password must contain:\nAt least 1 uppercase/lowercase letter\nAt least 1 number\nAt least 1 special character (!@#$%^&*_=+-)\nAt least 8 characters, but no more than 32");
	}
	else
		text.setCustomValidity("");
}

// create account still needs to be written
function submitForm()
{	
	// for when username already exists in database
	if (true)
	{
		let errMessage = document.getElementById("errMessage");
		errMessage.innerText = "Requested username already exists.";
		errMessage.style.color= "black";
		errMessage.style.backgroundColor= "#ff6242";
	}
}
