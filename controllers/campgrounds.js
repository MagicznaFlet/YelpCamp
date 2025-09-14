const Campground = require('../models/campground')

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = async (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id
    await campground.save()
    req.flash('success', 'Successfully created a new Campground!')
    res.redirect(`campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {
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
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params
    const { campground } = req.body
    await Campground.findByIdAndUpdate(id, campground)
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds')
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error','Cannot find that campground!')
        res.redirect(`campgrounds/${id}`)
    }
    
    res.render('campgrounds/edit', { campground })
}