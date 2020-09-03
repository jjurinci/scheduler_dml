import express from 'express'

const facultyLogic = require('../logic/facultyLogic.js')
const router = express.Router()

router.route('/')
      .get(facultyLogic.getAllFaculties)
      .post(facultyLogic.postFaculty)

router.route('/:id')
      .put(facultyLogic.putFaculty)
      .delete(facultyLogic.deleteFaculty)
      
router.route('/deleteInfo/:id')
      .get(facultyLogic.deleteInfoFaculty)

module.exports = router