const express = require('express')

const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')
const router = express.Router()
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')



router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}))

router.post('/',isLoggedIn,validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id
    await campground.save()
    req.flash('success', 'Successfully created a new Campground!')
    res.redirect(`campgrounds/${campground._id}`)
}))

router.get('/new', isLoggedIn, async (req, res) => {
    res.render('campgrounds/new')
})

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findOne({ _id: req.params.id })
    .populate({
        path:'reviews',
        populate:{path:'author'}
    })
    .populate('author')
    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}))

router.put('/:id',isLoggedIn,isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params
    const { campground } = req.body
    await Campground.findByIdAndUpdate(id, campground)
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:id',isLoggedIn,isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds')
}))

router.get('/:id/edit',isLoggedIn, isAuthor,catchAsync(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error','Cannot find that campground!')
        res.redirect(`campgrounds/${id}`)
    }
    
    res.render('campgrounds/edit', { campground })
}))

module.exports = router