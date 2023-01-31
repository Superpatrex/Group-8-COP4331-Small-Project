<?php
    //Retrieves the JSON POST with PHP
    $inData = getRequestInfo();
    
    //Accessing the database
    $firstName = $inData["nfirstName"];
    $lastName = $inData["nlastName"];
    $phoneNumber = $inData["nphoneNumber"];
    $email = $inData["nemail"];
    $id = $inData["id"];
    
    //Connecting to the database and letting the user edit a conteact
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        // The command will look like UPDATE Contracts SET variable=? WHERE variable=?
        // leaving this blank for now as collaboration with team needs to happen to figure out how to do this
        $stmt = $conn->prepare("UPDATE contacts SET FirstName=?, LastName=?, Email=?, PhoneNumber=? WHERE ID=?");
        $stmt->bind_param("sssss", $firstName, $lastName, $email, $phoneNumber, $id);
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
