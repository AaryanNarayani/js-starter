require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
require('../src/middlewares/googleMiddleware');
const authRouter = require('./routers/auth');
const userRouter = require('./routers/user');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET; 
app.use(express.json());
app.use(cors());

app.use(session({
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: true,
}));


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (_req, res) => {
    try{
        res.send('Hello World from the server!');
    }catch (error) {
        console.error('Error handling request:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});