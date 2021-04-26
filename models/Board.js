const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const boardSchema = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    type: {
        enum: ['.Net', 'PHP', 'Python', 'Kotlin', 'Java', 'JavaScript', 'TypeScript', 'Go', 'Swift', 'C#', 'C++', 'Other']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},
    { timestamps: true }
)

const Board = model("Board", boardSchema);
module.exports = Board;
