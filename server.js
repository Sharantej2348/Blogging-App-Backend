const express = require('express')
const app = express()
require('dotenv').config()
const mongoClient = require('mongodb').MongoClient;

app.use(express.json())


// Connect to database
mongoClient.connect(process.env.DB_URL)
.then(client => {
    // get db Object
    const blogdb = client.db('blogdb')
    // get collection object
    const userscollection = blogdb.collection('userscollection')
    const articlescollection = blogdb.collection('articlescollection')
    const authorscollection = blogdb.collection('authorscollection')
    // share collection object with express application
    app.set('userscollection', userscollection)
    app.set('articlescollection', articlescollection)
    app.set('authorscollection', authorscollection)
    // confirm db connection status
    console.log("DB Connection Successful")
})
.catch(err =>console.log("Error in DB connection", err))


const userApp = require('./APIs/user-api')
const authorApp = require('./APIs/author-api')
const adminApp = require('./APIs/admin-api')

app.use('/user-api', userApp)
app.use('/author-api', authorApp)
app.use('/admin-api', adminApp)



app.use((err, req, res, next) =>{
    res.send({message: "Error Occured", payload: err})
})


const port = process.env.PORT ||5000

app.listen(port, (req, res) =>{
    console.log(`Webserver is on port ${port}`)
})