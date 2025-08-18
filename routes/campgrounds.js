const express = require('express')

const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const { campgroundSchema } = require('../schemas')
const router = express.Router()
const { isLoggenIn } = require('../middleware')


const validateCampground = (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}


router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}))

router.post('/',isLoggenIn,validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    req.flash('success', 'Successfully created a new Campground!')
    res.redirect(`campgrounds/${campground._id}`)
}))

router.get('/new', isLoggenIn, async (req, res) => {
    res.render('campgrounds/new')
})

router.get('/:id',isLoggenIn, catchAsync(async (req, res) => {
    const campground = await Campground.findOne({ _id: req.params.id }).populate('reviews')
    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}))

router.put('/:id',isLoggenIn, catchAsync(async (req, res) => {
    const { id } = req.params
    const { campground } = req.body
    await Campground.findByIdAndUpdate(id, campground)
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:id',isLoggenIn, catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds')
}))

router.get('/:id/edit',isLoggenIn, catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findOne({ _id: id })
    res.render('campgrounds/edit', { campground })
}))

module.exports = router