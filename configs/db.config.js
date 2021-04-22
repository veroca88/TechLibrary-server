require("dotenv").config();
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI

// Connected to Cluster Atlas MongoDB
mongoose
    .connect(MONGODB_URI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(x => {
        console.log(
            `Connected to Mongo! Database name: "${x.connections[0].name}"`
        );
    })
    .catch(err => {
        console.error("Error connecting to mongo", err);
    });

