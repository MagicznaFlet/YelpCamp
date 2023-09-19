const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('./models/campground')


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected")
})

const app = express()


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


app.get('/', (req, res) => {
    res.render('home', { name: 'YELPCAMP' })
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
})


app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findOne({ _id: id })
    res.render('campgrounds/show', { campground })
})

app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000')
})