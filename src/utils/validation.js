const validator = require("validator");
const bannedWords = ["fuck", "shit", "bitch"]; // optional, edit/remove
const validateSignupData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("Both first name and last name are required.");
    }
    if (!emailId || !validator.isEmail(emailId)) {
        throw new Error("Please provide a valid email address.");
    }
    // Optional: filter offensive email content
    const lowerEmail = emailId.toLowerCase();
    if (bannedWords.some(word => lowerEmail.includes(word))) {
        throw new Error("Email contains inappropriate words.");
    }
    if (!password) {
        throw new Error("Password is required.");
    }
    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })) {
        throw new Error("Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.");
    }
};
module.exports = {
    validateSignupData,
}