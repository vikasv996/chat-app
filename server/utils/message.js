const moment = require('moment');

module.exports.generateMessage = function (from, text) {
    return {
        from,
        text,
        createdAt: moment().valueOf()
    }
};

module.exports.generateLocationMessage = function (from, lat, lng) {
    return {
        from,
        url: `https://maps.google.com?q=${lat},${lng}`,
        createdAt: moment().valueOf()
    };
};