const express = require('express')
const authorApp = express.Router();
const expressAsyncHandler = require('express-async-handler')
const bcryptjs = require('../node_modules/bcryptjs/umd')
const jsonwebtoken = require('jsonwebtoken')
const verifyToken = require('../Middlewares/verifyToken')
require('dotenv').config()

// get the authors collection object
let authorscollection;
let articlescollection;
authorApp.use((req, res, next) => {
    authorcollection = req.app.get('authorscollection')
    articlescollection = req.app.get('articlescollection')
    next()
})


// *** Auhtor Registration ***
authorApp.post('/author', expressAsyncHandler(
    async(req, res) => {
        // Get the auhtor resource from the client
        const newAuthor = req.body

        // Check for the duplicate author based on the username
        const dbauthor = await authorcollection.findOne({username: newAuthor.username})

        // if user found in the db
        if(dbauthor !== null){
            res.send({message: "Author already exist"})
        }else{ 
            // has the password
            const hashedPassword = await bcryptjs.hash(newAuthor.password, 6)

            // replace the current password withe the hashed password
            newAuthor.password = hashedPassword

            // create user
            await authorcollection.insertOne(newAuthor)

            // Send the response
            res.send({messgae: "Author created successfully"})
        }
    }
))


// *** Author Login ***
authorApp.post('/login', expressAsyncHandler(
    async(req, res) => {
        // get the credeential object from the client
        const authroCred = req.body

        // check for the user
        const dbauthor = await authorcollection.findOne({username: authroCred.username})
        if(dbauthor === null){
            res.send({message: "Invalid Username"})
        }else{
            // check for the password
            const status = bcryptjs.compare(authroCred.password, dbauthor.password)
            if(status === false){
                res.send({message: "Invalid Password"})
            }else{
                // create a jwt token and encode it
                const signedToken = jsonwebtoken.sign({username: dbauthor.username}, process.env.SECRET_KEY, {expiresIn:40})

                res.send({message: "Login Successful", token: signedToken, user: dbauthor})
            }
        }

    }
))


// adding new article by author
authorApp.post('/article',verifyToken, expressAsyncHandler(
    async(req, res) => {
        // get new article from client
        const newArticle = req.body;
        console.log(newArticle)

        // psot to articles collection
        await articlescollection.insertOne(newArticle)

        // send resposne to client
        res.send({message: "Article added successfully"})

    }
))


// Modifying the article by author
authorApp.put('/article',verifyToken, expressAsyncHandler(
    async(req, res) => {
        // get modified article from the client
        const modifiedArticle = req.body
        console.log(modifiedArticle)

        // Update by article id
        let result = await articlescollection.updateOne({articleId: modifiedArticle.articleId}, {$set: {...modifiedArticle}})

        res.send({message: "Article modified successfully"})
    }
))


// Soft Delete the articles by author id
authorApp.put('/article/:articleId',verifyToken, expressAsyncHandler(
    async(req, res) => {
        const articleIdFromUrl = req.params.articleId
        const articleToDelete = req.body

        await articlescollection.updateOne({articleId: articleIdFromUrl}, {$set: {...articleToDelete, status:false}})

        res.send({message: "Article Removed Successfully"})
    }
))


// View/read articles of that particular author
authorApp.get('/articles/:username',verifyToken, expressAsyncHandler(
    async(req, res) => {
        // get author's username from the url
        const authorName = req.params.username

        // get articles whose status is true
        const articlesList = await articlescollection.find({status: true, username: authorName}).toArray()

        // Send the Resposne
        res.send({message: "List of Articles", payload: articlesList})


    }
))


module.exports = authorApp;