const logger = require('../logger');

module.exports = function(err,  req, res, next) {
    const status = err.statusCode || 500;
    const message = err.message;
    const data = err.data;
    logger.info(err);
    res.status(status).json({message: message, data: data});
}