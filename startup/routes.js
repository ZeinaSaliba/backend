const express = require('express');
const user = require('../routes/user');
const chat = require('../routes/chat');
const error = require('../middleware/error');


module.exports = function(app) {
    app.use(express.json());
    app.use('/api/user', user);
    app.use('/api/chat', chat);
    // for error handling
    app.use(error);
};