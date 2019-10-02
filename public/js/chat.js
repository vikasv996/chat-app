const socket = io();

function scrollIntoItems() {
    let messages = document.querySelector('#messages').lastElementChild;
    messages.scrollIntoView();
}

socket.on('connect', function () {
    console.log("Connected to server");
    let searchQuery = window.location.search.substring(1);
    let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/=/g, '":"').replace(/\+/g, ' ') + '"}');
    const template = document.querySelector('#chat-sidebar-display').innerHTML;
    console.log("Template", template);
    let h3 = document.createElement('h3');
    h3.innerText = `${params.room}`;
    document.querySelector('#chat-sidebar-display').appendChild(h3);
    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log("No errors found");
        }
    })
});

socket.on('disconnect', function () {
    console.log("Disconnected from server");
});

socket.on('updateUsersList', function (users) {
    console.log("UsersArray", users);
    let ol = document.createElement('ol');
    users.forEach(function (user) {
        let li = document.createElement('li');
        li.innerHTML = user;
        ol.appendChild(li);
    });
    let userList = document.querySelector('#users');
    userList.innerHTML = "";
    userList.appendChild(ol);
});

socket.on('newMessage', function (message) {
    console.log("NewMessage", message);
    const formattedTime = moment(message.createdAt).format('LT');
    const template = document.querySelector('#message-template').innerHTML;
    const html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: formattedTime
    });
    const div = document.createElement('div');
    div.innerHTML = html;
    document.querySelector('#messages').appendChild(div);
    scrollIntoItems();

    // const formattedTime = moment(message.createdAt).format('LT');
    // let li = document.createElement('li');
    // li.style.display = 'block';
    // li.innerText = `${message.from} ${formattedTime}: ${message.text}`;
    // document.querySelector('body').appendChild(li);
});

socket.on('newLocationMessage', function (message) {
    console.log("NewLocationMessage", message);
    const formattedTime = moment(message.createdAt).format('LT');
    const template = document.querySelector('#location-message-template').innerHTML;
    const html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });
    const div = document.createElement('div');
    div.innerHTML = html;
    document.querySelector('#messages').appendChild(div);
    // const formattedTime = moment(message.createdAt).format('LT');
    // let li = document.createElement('li');
    // let a = document.createElement('a');
    // li.style.display = 'block';
    // li.innerText = `${message.from} ${formattedTime}: `;
    // a.setAttribute('href', message.url);
    // a.setAttribute('target', '_blank');
    // a.innerText = `My current location`;
    // li.appendChild(a);
    // document.querySelector('body').appendChild(li);
});

/*socket.emit('createMessage', {
    from: "Brothers",
    text: "Winter is Coming!"
}, function (msg) {
    console.log(msg, "Client received it");
});*/

document.querySelector('#submit-btn').addEventListener('click', function (e) {
    e.preventDefault();

    const input = document.querySelector('input[name="message"]');
    if (input.value) {
        socket.emit('createMessage', {
            text: input.value
        }, function () {
            console.log("Acknowledged");
            document.querySelector('input[name="message"]').value = "";
        })
    }
});

document.querySelector('#send-location').addEventListener('click', function (e) {
    if (!navigator.geolocation) {
        alert("Your browser does not support location fetch");
    } else {
        navigator.geolocation.getCurrentPosition(function (position) {
            socket.emit('createLocationMessage', {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            })
        }, function (error) {
            console.error("Error", error);
        }, {
            enableHighAccuracy: true
        })
    }

});
