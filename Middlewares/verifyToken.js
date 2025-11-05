const jsonwebtoken = require('jsonwebtoken')
require('dotenv').config()

function verifyToken(req, res, next){
    // get bearer token from headers of req
    const bearerToken = req.headers.authorization;

    // if bearer token not availabel 
    if(!bearerToken){
        res.send({message: "Unauthorized Access. Please Login to continue..."})
    }

    // extract  token from bearer token
    const token = bearerToken.split(' ')[1]
    try{
        jsonwebtoken.verify(token, process.env.SECRET_KEY)
    }catch(err){
        next(err)
    }
}

module.exports = verifyToken;