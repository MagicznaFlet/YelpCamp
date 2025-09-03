const express = require('express')
const router = express.Router()
const passport = require('passport')

const { storeReturnTo } = require('../middleware');
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user')


router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async (req, res,next) => {
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
}))

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', storeReturnTo,passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back!')
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    res.redirect(redirectUrl)
})

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash('success', 'Successfully logged out!')
        res.redirect('/campgrounds')
    })

})

module.exports = router