var socket = io();

submitUsername(prompt("Please enter a username:"));

//////////  Socket Events  \\\\\\\\\\
socket.on("username response", function(response) {
    if (!response.exists) {
        displayMainScreen();
    } else {
        submitUsername(prompt("Username already exists, please enter a different one:"));
    }
});

socket.on("global stats", function(stats) {
    displayGlobalStats(stats);
});

socket.on("user stats", function(stats) {
    displayUserStats(stats);
});

socket.on("enter match", function(usernames) {
    prepareForMatch(usernames);
});

socket.on("queue entered", function() {
    queueEntered();
});

socket.on("queue left", function() {
	queueLeft();
});

//////////  jQuery Events  \\\\\\\\\\
$("#queueButton").click(enterQueue);

$("#clearButton").click(clearLog);


//////////  Methods  \\\\\\\\\\
function submitUsername(desiredUsername) {
    socket.emit("username submit", desiredUsername);
}

function getStats() {
    socket.emit("get stats");
}

function displayGlobalStats(stats) {
    $("#playerListHeader").text(stats.onlinePlayers.length + " players online:");
    $("#playerList").empty();
    for (var i = 0; i < stats.onlinePlayers.length; i++) {
        $("#playerList").append("<li>" + stats.onlinePlayers[i] + "</li>");
    }
}

function displayUserStats(stats) {
    //Do something
}

function displayMainScreen() {
    $("#mainScreen").css("visibility", "visible");
}

function enterQueue() {
	socket.emit("enter queue");
	$("#queueButton").html("Leave Queue");
	$("#queueButton").off("click").on("click", leaveQueue);
}

function leaveQueue() {
	socket.emit("leave queue");
	$("#queueButton").html("Enter Queue");
	$("#queueButton").off("click").on("click", enterQueue);
}

function queueEntered() {
    $("#log").append("<li>" + "Entered the queue. Waiting for an opponent..." + "</li>");
}

function queueLeft() {
    $("#log").append("<li>" + "Left the queue." + "</li>");
}

function prepareForMatch(usernames) {
    $("#log").append("<li>" + "Match started " + usernames.join(" vs ") + "</li>");
    $("#matchScreen").css("visibility", "visible");
}

function clearLog() {
	$("#log").empty();
}