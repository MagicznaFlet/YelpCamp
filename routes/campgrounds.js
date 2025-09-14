const express = require('express')

const catchAsync = require('../utils/catchAsync')
const campgrounds = require('../controllers/campgrounds')
const router = express.Router()
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,validateCampground, catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,isAuthor, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor, catchAsync(campgrounds.deleteCampground))


router.get('/:id/edit',isLoggedIn, isAuthor,catchAsync(campgrounds.renderEditForm))

module.exports = router