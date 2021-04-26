const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const boardSchema = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    type: {
        enum: ['.Net', 'PHP', 'Python', 'Kotlin', 'Java', 'JavaScript', 'TypeScript', 'Go', 'Swift', 'C#', 'C++', 'Other']
    },
    messages: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: "Message"
            }
        ]
    },

    // second step
    followers: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    }
},
    { timestamps: true }
)

const Board = model("Board", boardSchema);
module.exports = Board;
