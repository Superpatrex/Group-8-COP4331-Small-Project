<?php
    $inData = getRequestInfo();

    $searchResults = "";
    $searchCount = 0;

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error);    
    }
    else
    {
        $stmt = $conn=>prepare("Select Name from Contact where Name like ? and UserID=?");
        $colorName = "%" . $inData["search"] . "%";
        $stmt->bind_param("ss", $firstName, $inData["userId"]);
        $stmt->execute();

        $result = $stmt->get_result();

        while($row = $result->fetch_assoc)
        {
            if ($searchCount > 0)
            {
                $searchResults .= ",";
            }
            $searchCount++;
            $searchResults .= '"' . $row["firstName"] . '"';
        }

        if ($searchCount == 0)
        {
            returnWithError("No Contacts found");
        }
        else
        {
            returnWithInfo($searchResults);
        }

        $stmt->close();
        $conn->close();
    }
?>