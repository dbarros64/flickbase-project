const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const users = require('./routes/api/users');
const articles = require('./routes/api/articles');
const { checkToken } = require('./middlewares/auth');




app.use(express.json());
app.use(cors());

app.use(checkToken);
app.use("/api/users", users);
app.use("/api/articles", articles);

app.use(express.static('client/build'));

if (process.env.NODE_ENV === 'production') {
    const path = require('path');

    app.get('/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'build', 'index/html'))
    })
}

const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}?retryWrites=true&w=majority`


mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(() => {
    console.log('Database has connected successfully.')
})
.catch((err) => {
    console.log('Error connecting', err)
});


const port = process.env.PORT || 3080;

app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
});

