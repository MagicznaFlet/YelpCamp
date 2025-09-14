const User = require('../models/user')

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.register = async (req, res,next) => {
    try {
        const { username, email, password } = req.body
        const newUser = new User({ email, username })
        const registratedUser = await User.register(newUser, password)
        req.login(registratedUser,err =>{
            if(err) return next(err)
            req.flash('success', 'Wellcome to Yelp Camp!')
            res.redirect('/campgrounds')
        })
        
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!')
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash('success', 'Successfully logged out!')
        res.redirect('/campgrounds')
    })

}