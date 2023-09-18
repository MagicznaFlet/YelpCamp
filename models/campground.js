const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CampGroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String,
})

mogule.exports = mongoose.model('Campground', CampGroundSchema)