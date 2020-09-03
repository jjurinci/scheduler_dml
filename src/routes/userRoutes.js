import express from 'express'

const userLogic = require('../logic/userLogic.js')
const router = express.Router()

router.route('/register')
      .post(userLogic.register)

router.route('/login')
      .post(userLogic.login)

module.exports = router