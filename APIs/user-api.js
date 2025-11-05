const express = require('express')
const userApp = express.Router();
const bcryptjs = require('../node_modules/bcryptjs/umd')
const expressAsyncHandler = require('express-async-handler')
const jsonwebtoken = require('jsonwebtoken')
const verifyToken = require('../Middlewares/verifyToken')
require('dotenv').config()

// get usercolelction object
let usercollection;
let articlescolelction;
userApp.use((req, res, next) => {
    usercollection = req.app.get('userscollection')
    articlescollection = req.app.get('articlescollection')
    next()
})


// *** User Registration/ creation ***
userApp.post('/user', expressAsyncHandler(
    async (req, res) => {
        // get user resource from client
        const newUser = req.body;

        // check for duplicate user based on username (unique)
        const dbuser = await usercollection.findOne({ username: newUser.username })

        // if user found in db
        if (dbuser !== null) {
            res.send({ message: "User already exists" })
        } else {
            // hash the password
            const hashedPassword = await bcryptjs.hash(newUser.password, 6)

            // replace the plain password with hashed password
            newUser.password = hashedPassword

            // create user
            await usercollection.insertOne(newUser)

            // Send the response
            res.send({ message: "User Created Successfully" })

        }
    }
))


// *** User Login ***
userApp.post('/login', expressAsyncHandler(
    async(req, res)=> {
        // get credential obj from client
        const userCred = req.body;

        // check for username
        const dbuser = await usercollection.findOne({username: userCred.username})
        if(dbuser === null){
            res.send({message: "Invalid Username"})
        }else{ // check for password
            const status = bcryptjs.compare(userCred.password, dbuser.password)
            if(status === false){
                res.send({message: "Invalid Password"})
            }else{ // create jwt token and encode it
                const signedToken = jsonwebtoken.sign({username: dbuser.username}, process.env.SECRET_KEY, {expiresIn:40})

                // send res
                res.send({message: "Login Successful", token: signedToken, user:dbuser})
            }
        }
        
        
        
    }
))


// GET articles of all users
userApp.get('/articles',verifyToken, expressAsyncHandler(
    async(req, res) => {
        // get the articles collection from express app
        const articlescollection = req.app.get('articlescollection')

        // get all articles
        let articlesList = await articlescollection.find({status: true}).toArray()

        // Send the response
        res.send({message: "Articles", payload: articlesList})

    }
))


// post comments for an article by userId
userApp.post('/comment',verifyToken, expressAsyncHandler(
    async(req, res) => {
        // get user comment object
        const userComment = req.body;

        // Insert user comment object to comment array of articlescollection by articleId
        let result = await articlescollection.updateOne({articleId: userComment.articleId}, {$addToSet:{comments: userComment}})
        console.log(result)
        // send the response
        res.send({message: "Comment Posted Successfully"})
    }
))


module.exports = userApp;