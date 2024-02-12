const router = require('express').Router();
const User = require('../models/Arm_model').User;
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose')


async function generateUID(stringx) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(stringx, salt);
  
    return hash;
  }
  
// chech if user is authenticated
router.get('/check-auth', (req, res) => {
    if (req.session.userId) {
      res.json({ authenticated: true, user: { id: req.session.userId } });
    } else {
      res.json({ authenticated: false });
    }
  });


// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const UID = await generateUID(email);
        // Check if user already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            UID,
            email,
            password: hashedPassword,
        });

        // Save the user and respond
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
        console.log(res)
    } catch (err) {
        
        res.status(500).json(err);
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('User not found');
        }

        // Check if password is correct
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send('Invalid password');
        }

        // Set the user session
        req.session.userId = user._id; // Store user id in session
        req.session.email = user.email; // Optionally store the email in the session

        res.status(200).json({ message: 'Logged in' });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Could not log out, please try again');
      }
      res.clearCookie('connect.sid'); // Clear the session cookie
      return res.status(200).send('Logged out');
    });
  } else {
    res.status(200).send('No session to clear');
  }
});

// Route to get a user by ObjectId
router.get('/:id', async (req, res) => {
    try {
      // Ensure the provided id is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send('Invalid ObjectId format');
      }
    // console.log(req.params.id)
      const user = await User.findById(req.params.id).exec();
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      
      const userResponse = {
        UID: user.UID,
        email: user.email,
        recordings: user.recordings,
      };
  
      res.status(200).json(userResponse);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while fetching the user details');
    }
  });

module.exports = router;