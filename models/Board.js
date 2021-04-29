const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const boardSchema = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    category: {
        type: String
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
