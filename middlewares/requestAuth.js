const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

const isLoggedIn = (req, res, next) => {
    try {
        const { jwtoken } = req.headers
        const loggedInUser = jwt.verify(jwtoken, process.env.JWT_SECRET)
        req.user = loggedInUser.email
        next()
    } catch (error) {
        res.status(401).json({
            message: "You're not logged in."
        })
    }
}

module.exports = isLoggedIn