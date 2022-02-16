exports.getLogin = (req, res, next) => {
    const isLoggedIn = req
        .get('Cookie') //Cookie
        .trim()
        .split('=')[1]

    console.log(isLoggedIn)
    res.render('auth/login', {
        path: '/login',
        docTitle: 'Login',
        isAuthenticated: isLoggedIn //check Authenticated login
    });
};

exports.postLogin = (req, res, next) => {
    res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');
    res.redirect('/');
};