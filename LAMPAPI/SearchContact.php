<?php
	//Retrieves the JSON POST with PHP
	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	//Connecting to the database and searches for contact
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("SELECT * FROM contacts where (FirstName LIKE ? OR LastName LIKE ? OR PhoneNumber LIKE ? OR Email LIKE ?) AND UserID=?");
		$searchData = "%" . $inData["search"] . "%";
		$stmt->bind_param("sssss", $searchData, $searchData, $searchData, $searchData, $inData["userId"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '"' . '"' . $row["FirstName"] . '"' . '"' . $row["LastName"] . '"' . '"' . $row["PhoneNumber"] . '"'. '"' . $row["Email"] . '"' . "'";
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}
		
		$stmt->close();
		$conn->close();
	}

	//Receives JSON data as a string and decodes it
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	//Sends the result info as JSON
	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	//Error handling
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	//Returns search results as a object
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
