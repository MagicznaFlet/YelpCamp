const express = require('express')

const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const { campgroundSchema } = require('../schemas')
const router = express.Router()


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

router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`campgrounds/${campground._id}`)
}))

router.get('/new', async (req, res) => {
    res.render('campgrounds/new')
})

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findOne({ _id: req.params.id }).populate('reviews')
    res.render('campgrounds/show', { campground })
}))

router.put('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const { campground } = req.body
    await Campground.findByIdAndUpdate(id, campground)
    res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findOne({ _id: id })
    res.render('campgrounds/edit', { campground })
}))

module.exports = router