import jwt from 'jsonwebtoken'
import connect from '../db.js'
import mongo from 'mongodb'

var bcrypt = require('bcryptjs');

const tokenSignature = payload => {
    return jwt.sign(payload, "shhhhh", {
        expiresIn: "2 days"
    })
}

const tokenCreation = (user, statusCode, res) => {
    const token = tokenSignature(user)
    const cookieOptions = {
        expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    res.cookie('jwt', token, cookieOptions)
    user.password = undefined
    return res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

const isCorrectPassword = async (inputPassword, userPassword) => {
    return await bcrypt.compare(inputPassword, userPassword)
}
const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const register = async (req, res) => {
    try {
        if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password || !req.body.confirmPassword)
            return res.status(400).json({ message: "Please enter all fields." })

        if (!validateEmail(req.body.email))
            return res.status(400).json({ message: "Email is invalid." })

        if (req.body.password != req.body.confirmPassword)
            return res.status(400).json({ message: "Passwords don't match." })

        if (req.body.password.length < 6)
            return res.status(400).json({ message: "Password must be at least 6 characters long." })

        if (!(/^[a-zA-Z\u010C\u010D\u0106\u0107\u0110\u0111\u0160\u0161\u017D\u017E]+$/.test(req.body.firstName)))
            return res.status(400).json({ message: "First name must consist of letters only." })

        if (!(/^[a-zA-Z\u010C\u010D\u0106\u0107\u0110\u0111\u0160\u0161\u017D\u017E]+$/.test(req.body.lastName)))
            return res.status(400).json({ message: "Last name must consist of letters only." })

        if (req.body.firstName.length < 2 || req.body.lastName.length < 2)
            return res.status(400).json({ message: "First and last name name must be at least 2 letters long." })

        let user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 12)
        }
        let email = user.email
        let db = await connect();
        let userExists = await db.collection("users").findOne({ email })
        if (userExists) return res.status(400).json({ message: "User with that email already exist." })

        let result = await db.collection('users').insertOne(user);
        if (result.insertedCount == 1) {
            user.id = result.insertedId
            tokenCreation(user, 201, res)
        } else {
            return res.status(500).json({
                message: 'Failed to insert the user into the database.',
            });
        }
    }
    catch (err) {
        return res.status(500).json(err)
    }
}

export const login = async (req, res) => {

    const { email, password } = req.body
    if (!email) return res.status(400).json({ message: "Please enter email." })
    if (!password) return res.status(400).json({ message: "Please enter password." })

    if (!validateEmail(req.body.email))
        return res.status(400).json({ message: "Email is invalid." })

    let db = await connect()
    let user = await db.collection("users").findOne({ email })
    if (!user) return res.status(404).json({ message: "User with that email doesn't exist." })

    if (!(await isCorrectPassword(password, user.password))) return res.status(403).json({ message: "Password incorrect." })
    tokenCreation(user, 200, res)
}