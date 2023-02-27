const express = require('express');
const router = express.Router();
const userController = require('../contorllers/userController');

router.get('/all', userController.getAll);

module.exports = router;