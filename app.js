const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 4444;
const { MONGOURI } = require('./config/keys')

mongoose.connect(MONGOURI);
mongoose.connection.on('connected', () => {
    console.log("Connected to MongoDB");
})
mongoose.connection.on('error', (err) => {
    console.log("Error in connection", err);
})

require('./models/user');
require('./models/post')

app.use(express.json());

app.use(require('./routes/auth'));
app.use(require('./routes/posts'));
app.use(require('./routes/user'));


const customMiddleware = (req, res, next) => {
    console.log("I am a middleware");
    next();
}

app.get('/', (req, res) => {
    console.log("Home");
    res.send("Hello Instagram");
});

app.get('/about', customMiddleware, (req, res) => {
    console.log("about");
    res.send("About Page");
});

if (process.env.NODE_ENV == "production") {
    app.use(express.static('client/build'))
    const path = require('path');
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});