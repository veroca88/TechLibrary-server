const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const boardSchema = new Schema({
    url: {
        type: String
    },
    urlTitle: {
        type: String
    },
    urlScreenshot: {
        data: Buffer,
        type: String
    },
    urlDescription: {
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
