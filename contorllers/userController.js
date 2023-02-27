const connection = require('../db');


exports.getAll = (req, res, next) => {
    connection.query(`select * from users`, (err, rows,fields) => {
        if(err) {
            next(err);
            return;
        }
        res.status(200).json(rows);
    });
}