const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const { registerValidation, loginValidation } = require('./validation');//validacija registracije
const { exist } = require('@hapi/joi');

//route koji postavlja na page stvari
router.get('/api/user', async (req, res) => {  // umjesto '/posts' smo stavili '/'
    //res.send('we are on the posts now')
    try {
        const listUser = await User.find();
        res.json(listUser);


    } catch (err) {
        res.json({ message: err });

    }
})


//router koji registrira user, post
router.post('/register', async (req, res) => {
    //res.send("Register");

    //Lets validate data before we a user
    //const {error} = schema.validate(req.body);
    const { error } = registerValidation(req.body);//validacija registracije
    if (error) return res.status(400).send(error.details[0].message);

    //Checking if the user is already in database
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('This email already exist');

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    try {
        const savedUser = await user.save();
        res.send({ user: user._id }) // respond


    } catch (err) {
        res.status(400).send(err)
    }

});

//login, router za log in, post
router.post('/login', async (req, res) => {

    //lets validate the data before we a user
    const { error } = loginValidation(req.body);//validacija registracije
    if (error) return res.status(400).send(error.details[0].message);
    //checking if the email exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email u entered is wrong');
    //checking if the password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Password u entered is wrong');



    //Create and assign token
    const secret = "asdaddsdaad"
    const token = jwt.sign({ _id: user._id }, secret);
    res.header('login-token', token).send(token);// ovo je resposne od login dijela

    //res.send("Logged in");

})




module.exports = router;
