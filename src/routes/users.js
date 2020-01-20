const router = require('express').Router();
const passport = require('passport');
const User = require('../models/User');

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
    const {name, email, password, confirm_password} = req.body;
    const errors = [];
    if(name.length == 0){errors.push({text: 'Please insert your name.'});}
    if(email.length == 0){errors.push({text: 'Please insert your email.'});}
    if(password.length == 0){errors.push({text: 'Please insert your password.'});}
    if(password!=confirm_password){errors.push({text: 'Passwords do not match'});}
    if(password.length<4){errors.push({text: 'Paswords must be least 4 characters'})}
    if(errors.length>0){res.render('users/signup', {errors, name, email, password, confirm_password});
    }else{
        const userEmail = await User.findOne({email: email});
        if(userEmail){
            req.flash('error_msg', 'The email is aready exists');
            res.redirect('/users/signup');
        }
        const newUser = new User({name, email, password});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'Your are registered');
        res.redirect('/users/signin');
    }
});

router.get('/users/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

module.exports = router;