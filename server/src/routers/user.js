const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const userRouter = express.Router();


userRouter.get('/', authMiddleware, (req, res) => {
    try {
        res.send('User endpoint is working!');
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = userRouter;
