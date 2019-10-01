const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname, '/../public');
const server = http.createServer(app);
const io = socketIO(server);
const {generateMessage, generateLocationMessage} = require('./utils/message');

const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

server.listen(port, (error) => {
    if (error) {
        console.error("Error connecting");
        process.exit(0);
    }
    console.log(`Server connected to ${port}`);
});

io.on('connection', (socket) => {
    console.log("New user connected");

    socket.on('disconnect', () => {
        console.log("User disconnected");
    });

    socket.emit('newMessage', generateMessage("Admin", "Welcome to the Chat App"));

    socket.broadcast.emit('newMessage', generateMessage("Admin", "New user has joined"));

    socket.on('createMessage', (message, callback) => {
        console.log("Create message", message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback("Server got it");
    });

    socket.on('createLocationMessage', (location) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', location.lat, location.lng));
    })
});
