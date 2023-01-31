<?php
    //Retrieves the JSON POST with PHP
    $inData = getRequestInfo();
    
    //Accessing the database`
    $userId = $inData["userId"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phoneNumber = $inData["phoneNumber"];
    $email = $inData["email"];

    //Connecting to the database
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("INSERT INTO contacts (UserId, FirstName, LastName, PhoneNumber, Email) VALUES(?,?,?,?,?)");
        $stmt->bind_param("sssss", $userId, $firstName, $lastName, $phoneNumber, $email);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        returnWithError("");
    }
    
    //Receives JSON data as a string and decodes it
    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    //Sends the result info as JSON
    function sendResultInfoAsJason($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    //Error handling
    function returnWithError($err)
    {
        $retValue = '{"error:"' . $err . '"}';
        sendResultInfoAsJason($retValue);
    }

?>
