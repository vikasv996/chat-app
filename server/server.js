const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname, '/../public');
const server = http.createServer(app);
const io = socketIO(server);
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
    })
});
