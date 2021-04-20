const mongoose = require("mongoose")
const { Schema, model } = mongoose

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: [true, 'Name is required.']
        },
        lastName: {
            type: String,
            required: [true, 'Lastname is required.']
        },
        username: {
            type: String,
            required: [true, 'Username is required.'],
            unique: true
        },
        email: {
            type: String,
            required: [true, 'Email is required.'],
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: [true, 'Password is required.']
        },
        userPosts: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Board"
                }
            ]
        },
        followingPosts: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Board"
                }
            ]
        },
    },
    { timestamps: true }
)

const User = model("User", userSchema);
module.exports = User;