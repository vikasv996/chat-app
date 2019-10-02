const CONSTANT = require('./constants');

class Users {

    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        if (CONSTANT.DEBUG) console.log("AddUser", id, name, room);
        let user = {id, name, room};
        this.users.push(user);
        if (CONSTANT.DEBUG) console.log("AddUser UserArray", this.users);
        return user;
    };

    getUserList(room) {
        if (CONSTANT.DEBUG) console.log("getUserList", room);
        let users = this.users.filter((user) => user.room === room);
        if (CONSTANT.DEBUG) console.log("getUserList usersArray", this.users);
        return users.map((user) => user.name);
    };

    getUser(id) {
        if (CONSTANT.DEBUG) console.log("getUser", id);
        const userArray = this.users.filter((user) => user.id === id)[0];
        if (CONSTANT.DEBUG) console.log("getUser usersArray", this.users);
        return userArray;
    };

    checkUserValidity(room, name) {
        console.log("checkUserValidity", room, name);
        const user = this.users.filter((user) => user.room === room && user.name === name);
        console.log("checkUserValidity user", user);
        console.log("checkUserValidity this.users", this.users);
        return user.length === 0;
    };

    removeUser(id) {
        if (CONSTANT.DEBUG) console.log("removeUser", id);
        let user = this.getUser(id);
        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }
        if (CONSTANT.DEBUG) console.log("getUserList user", user);
        if (CONSTANT.DEBUG) console.log("getUserList usersArray", this.users);
        return user;
    };
}

module.exports = {Users};