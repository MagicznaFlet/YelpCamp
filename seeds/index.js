const mongoose = require('mongoose')
const cities = require('./cities')
const Campground = require('../models/campground')
const { places, descriptors } = require('./seedHelpers')


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected")
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 20; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            author: '68b211a7cced2196ee28d8ed',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            images: [
            {
                url: 'https://res.cloudinary.com/di3zhjvib/image/upload/v1758563048/YelpCamp/afg82tjdktxs5hp5a6ci.jpg',
                filename: 'YelpCamp/afg82tjdktxs5hp5a6ci',
            },
            {
                url: 'https://res.cloudinary.com/di3zhjvib/image/upload/v1758563048/YelpCamp/klt5m9aghnrl80z1pcen.jpg',
                filename: 'YelpCamp/klt5m9aghnrl80z1pcen',
            }
            ],
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
            price
        })
        await camp.save()
    }

}

seedDB().then(() => {
    mongoose.connection.close()
})
