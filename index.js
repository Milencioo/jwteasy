const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')
app.use(cors());
app.use(express.json());
const dotenv = require('dotenv');
dotenv.config();

//const dotenv = require('dotenv')
//const checkRoute = require('./routes/verifytoken');




//Import routes
const registerRoute = require('./routes/register');
//dotenv.config();
//Connect to db
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true },
    () => {
        console.log("connected to db")
    }
)

//Functions
app.use(express.json());
//Routes functions
app.use('/api/user', registerRoute); // idemo u api/user/register

//app.use('/api/user', checkRoute)



app.get('/api/user', registerRoute)






app.listen(process.env.PORT || 3000, () => console.log("server is up and running"))