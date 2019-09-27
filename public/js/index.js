const socket = io();

socket.on('connect', function () {
    console.log("Connected to server");
});

socket.on('disconnect', function () {
    console.log("Disconnected from server");
});

/*socket.emit('createMessage', {
    from: "Zack",
    text: "BRB!!"
});*/

socket.on('newMessage', function (message) {
    console.log("NewMessage", message);
});