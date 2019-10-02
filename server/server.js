const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const socketIO = require('socket.io');
const CONSTANT = require('./utils/constants');
const {isRealString} = require("./utils/isRealString");
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '/../public');
const server = http.createServer(app);
const io = socketIO(server);
const {generateMessage, generateLocationMessage} = require('./utils/message');
let users = new Users();

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
        let user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left ${user.room} chat room`));
        }
    });

    // socket.broadcast.emit('newMessage', generateMessage("Admin", "New user has joined"));

    socket.on('createMessage', (message, callback) => {
        console.log("Create message", message);
        let user = users.getUser(socket.id);
        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        callback("Server got it");
    });

    socket.on('createLocationMessage', (location) => {
        let user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, location.lat, location.lng));
        }
    });

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback("Provide both name and room");
        }
        if (!users.checkUserValidity(params.room, params.name)) {
            return callback("Cannot add same users");
        }
        if (CONSTANT.DEBUG) console.log("Params", params);
        if (CONSTANT.DEBUG) console.log("Socket", socket);
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUsersList', users.getUserList(params.room));

        socket.emit('newMessage', generateMessage("Admin", "Welcome to " + params.room));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage("Admin", `${params.name} joined the chat`));
        callback();
    })
});
