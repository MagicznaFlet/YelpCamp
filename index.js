const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send('HOME PATH')
})

app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000')
})