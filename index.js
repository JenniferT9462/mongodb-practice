// index.js
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

require('dotenv').config();
const atlasUrI = process.env.ATLAS_URI;
//Use jwt secret key
const secretKey = process.env.JWT_SECRET;
const secretKeyExpires = process.env.JWT_EXPIRES_IN;
console.log(secretKey)
//Import user model
const User = require('./models/User');

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose
.connect(atlasUrI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

//CRUD Operations Routes
//POST /register
app.post('/register', async (req, res) => {
    // Extract the request body containing the user data
    const data = req.body;
    // Create a new User instance with the provided data
    const user = new User({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role
    });

    try {
        // Save the user data to the database
        const savedUser = await user.save();
        console.log(savedUser);
        // Send the saved user data as a JSON response
        res.json(savedUser);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to save user" });
    }
})
//POST /login
//Login Route
app.post("/login", async (req, res) => {
    // Extract email and password from request body
    const { email, password } = req.body;

    try {
        // Step 1: Find the user by email
        const user = await User.findOne({ email });
        //If not user send error
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Step 2: Compare provided password with the hashed password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Step 3: Generate a JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            // Secret key for signing 
            secretKey, 
            // Token expiration
            { expiresIn: secretKeyExpires }
        );
        // Step 4: Send response with the token
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        // Log the error for debugging
        console.error(error);
        // Return a server error
        res.status(500).json({ error: "Server error" });
    }
});

//GET /users
app.get('/users', async (req, res) => {
    let allUsers = await User.find({});
    res.json(allUsers);
});

//PUT /users/:id
app.put('/users/:id', async (req, res) => {
    const query = { _id: req.params.id };
    const updates = req.body;
    let result = await User.updateOne(query, updates);
    res.json(result)
})

//DELETE /users/:id
app.delete('/users/:id', async (req, res) => {
    const query = { _id: req.params.id };
    let result = await User.deleteOne(query);
    res.json(result)
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

