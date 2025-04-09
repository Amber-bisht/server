const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const validator = require("validator");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validatorSignupData, validateSignupData } = require("./utils/validation");
const jwt = require("jsonwebtoken")
const app = express();
const {userAuth} = require("./middleware/auth")

// Connect to DB
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

// SIGNUP
app.post("/signup", async (req, res) => {
    try {
        validateSignupData(req); // Your custom validation logic

        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });
        await user.save();
        res.status(201).send("User registered successfully.");
    } catch (err) {
        console.error(err);
        res.status(400).send("ERROR: " + err.message);
    }
});

// LOGIN
app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error("Email ID is not registered.");
        }
        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            throw new Error("Incorrect password.");
        }
        const token = await user.getJWT();
    
        res.cookie("token", token,{
            expires:new Data(Date.now() + 8*120000),
        });
        res.send("Login successful, cookie sent.");
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

// PROFILE
app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json(user); // Send the authenticated user
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

app.post("/setConnectionRequest",userAuth,async (req,res)=>{
    const user = req.user;
    res.send("hello from api")
})


// Start server
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});

