<?php
    $inData = getRequestInfo();
    
    $userId = $inData["userId"]
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phoneNumber = $inData["phoneNumber"];
    $email = $inData["email"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error)
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

    function getRequestInfo()
    {
        return json_decode(file_put_contents('php://input'), true);
    }

    function sendResultInfoAsJason($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err)
    {
        $retValue = '{"error:"' . $err . '"}';
        sendResultInfoAsJason($retValue);
    }

?>
