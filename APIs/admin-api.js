const express = require('express')
const adminApp = express.Router();

adminApp.get('/test-admin', (req, res) => {
    res.send({message: "This is from Admin App"})
})

module.exports = adminApp;