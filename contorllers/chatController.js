const Joi = require('joi');
const connection = require('../db');
const moment = require('moment');
const im1 = require('../uploads/im1');
const im2 = require('../uploads/im2');
const im3 = require('../uploads/im3');

const schema = Joi.object({
    userId: Joi.number().required(),
    chatId: Joi.number().required(),
    time: Joi.string().required().min(1),
    date: Joi.string().required().min(1),
    message: Joi.string().required().min(1)
});

exports.chatList = (req, res, next) => {
    const userId = req.params.userId;
    connection.query(`SELECT chat.id AS chatId, concat(u1.userName, '<>', u1.id) as firstName, concat(u2.userName, '<>', u2.id) as secondName , u1.profile as link1, u2.profile as link2, messages.message AS lasMessage, messages.time AS time
                        FROM chat
                        INNER JOIN users u1 ON chat.user1 = u1.id
                        INNER JOIN users u2 ON chat.user2 = u2.id
                        LEFT JOIN (
                        SELECT chatId, MAX(id) AS max_id
                        FROM messages
                        GROUP BY chatId
                        ) max_id ON chat.id = max_id.chatId
                        LEFT JOIN messages ON max_id.chatId = messages.chatId AND max_id.max_id = messages.id
                        WHERE u1.id = ${userId}
                        or u2.id = ${userId}
                        ORDER BY time DESC;`,
        (err, rows, fields) => {
            if (err) {
                next(err);
                return;
            }
            result = [];
            rows.forEach(row => {
                const firstName = row.firstName.split('<>');
                const secondName = row.secondName.split('<>');
                let username = '';
                if(userId != firstName[1]) {
                    username = firstName[0];
                    let file;
                    if(row?.link1 === 'im1') {
                        file = im1;
                    } else if(row?.link1 === 'im2') {
                        file = im2;
                    } else if(row?.link1 === 'im3') {
                        file = im3;
                    }
                } else if(userId != secondName[1]){
                    username = secondName[0];
                    let file;
                    if(row?.link2 === 'im1') {
                        file = im1;
                    } else if(row?.link2 === 'im2') {
                        file = im2;
                    } else if(row?.link2 === 'im3') {
                        file = im3;
                    }
                }
                result.push({
                    chatId: row.chatId,
                    name: username,
                    link: file,
                    lastMessage: row.lasMessage,
                    time: row.time
                })
            });
            res.status(200).json(result);
        });
}

exports.getMessages = (req, res, next) => {
    const chatId = req.params.chatId;
    connection.query(`select userId, message, time from messages where chatId = ${chatId}`, (err, rows, fields) => {
        if (err) {
            next(err);
            return;
        }
        res.status(200).json(rows);
    })
}


/*  */
exports.addMessage = async (req, res, next) => {
    const chatId = req.params.chatId;
    const { userId, message } = req.body;
    const newMessage = {
        chatId: parseInt(chatId),
        userId: userId,
        message: message,
        time: moment().format('hh:mm'),
        date: moment().format('DD/MM/YYYY')
    }

    try {
        const valid = await schema.validateAsync(newMessage);
        if (valid) {
            connection.query(`INSERT INTO messages (message, userId, date, time, chatId) VALUES ('${newMessage.message}', '${newMessage.userId}', '${newMessage.date}', '${newMessage.time}', '${newMessage.chatId}');`,

                (err, rows, fields) => {
                    if (err) {
                        res.status(400).json({ message: 'error saving to db', err: err })
                    } else {
                        res.status(200).json(rows)
                    }
                })
        } else {
            res.status(400).json({ message: 'error message validation' })
        }
    } catch (error) {
        res.status(400).json({ message: 'something went wrong' })
    }
}