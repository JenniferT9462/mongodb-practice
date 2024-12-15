// index.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

require('dotenv').config();
const atlasUrI = process.env.ATLAS_URI;
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
//GET /users
//PUT /users/:id
//DELETE /users/:id

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

