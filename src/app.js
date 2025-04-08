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
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Incorrect password.");
        }
        const token = await jwt.sign({_id:user._id},"amberiscoll@uicu")
        console.log(token)
        res.cookie("token", token);
        res.send("Login successful, cookie sent.");
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

// PROFILE
app.get("/profile", async(req, res) => {
    try{
    const cookies = req.cookies;
    const {token} = cookies
    if(!token){
        throw new Error("invalid token I guess")
    }

    const decodedMessage = jwt.verify(token,"amberiscoll@uicu")
    const {_id} = decodedMessage;
    
    const user = await User.findById(_id)
    if(!user){
        throw new Error("user is not Eist")
    }
    res.send(user);
    }catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

// GET single user by emailId
app.get("/user", async (req, res) => {
    const { emailId } = req.body;
    try {
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(404).send("User not found.");
        }
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error.");
    }
});

// GET all users
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong.");
    }
});

// UPDATE user
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skill"];
        const isUpdateAllowed = Object.keys(data).every(k => ALLOWED_UPDATES.includes(k));

        if (!isUpdateAllowed) {
            return res.status(400).send("Update is not allowed.");
        }

        if (data?.skill && data.skill.length > 10) {
            return res.status(400).send("Skill array should not exceed 10 items.");
        }

        if (data?.emailId && !validator.isEmail(data.emailId)) {
            return res.status(400).send("Invalid email format.");
        }

        const user = await User.findByIdAndUpdate(userId, data, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).send("User not found.");
        }

        res.status(200).json({ message: "User updated successfully", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong.", details: err.message });
    }
});

// DELETE user
app.delete("/user", async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) return res.status(404).send("User not found.");
        res.status(200).send("User deleted successfully.");
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong.");
    }
});

// Start server
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});

