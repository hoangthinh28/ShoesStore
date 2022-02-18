const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    console.log(req.session.isLoggedIn);
    res.render('auth/login', {
        path: '/login',
        docTitle: 'Login',
        isAuthenticated: false //check Authenticated login
    });
};

exports.postLogin = (req, res, next) => {
    User.findById("62020e859b0b1aeaab2ff3a3")
        .then((user) => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            res.redirect('/');
        })
        .catch((err) => console.log(err));
};