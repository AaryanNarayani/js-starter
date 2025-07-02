const express = require('express');
const authRouter = express.Router();
const passport = require('passport');

authRouter.get('/', (req, res) => {
    try {
        res.send('Auth endpoint is working!');
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).send('Internal Server Error');
    }
});

authRouter.get("/google", passport.authenticate("google", { 
  scope: ["profile", "email"] 
}));

authRouter.get("/google/callback",
  passport.authenticate("google", { 
      failureRedirect: `${process.env.CLIENT_URL}/signup`,
      session: false 
  }),
  (req, res) => {
      const { token } = req.user;
      res.redirect(`${process.env.CLIENT_URL}/google/redirect?token=${token}`);
  }
);

authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Implement login logic here
        if(!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const token = jwt.sign(
            { email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '3h' }
        );
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

authRouter.get('/register', (req, res) => {
    try {
        const { email, password } = req.body;

       if(!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const token = jwt.sign(
            { email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '3h' }
        );
        res.status(200).json({ message: 'Registration successful', token });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = authRouter;