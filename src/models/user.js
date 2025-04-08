const mongoose = require("mongoose");
const validator = require("validator")

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: [4, "First name must be at least 4 characters long."],
            maxLength: [50, "First name must be at most 50 characters long."],
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
        },
        emailId: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
              validator: (value) => validator.isEmail(value),
              message: (props) => `Invalid email address: ${props.value}`,
            },
          },
        password: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            min: [18, "You must be at least 18 years old."],
        },
        gender: {
            type: String,
            validate(value) {
                if (!["male", "female", "others"].includes(value.toLowerCase())) {
                    throw new Error("Invalid gender. Choose from 'male', 'female', or 'others'.");
                }
            },
        },
        photoUrl: {
            type: String,
            default: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1743584728~exp=1743588328~hmac=19d333d5cb3ef5b661f52d845bc3e452ab35d5d74fd66214fab8cf422ea456f5&w=826",
        },
        about: {
            type: String,
            default: "This is the default bio for all users.",
        },
        skills: {
            type: [String],
            
        },
    },
    { timestamps: true } // ✅ Correct placement
);

module.exports = mongoose.model("User", userSchema);
