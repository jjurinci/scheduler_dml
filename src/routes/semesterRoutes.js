import express from 'express'

const semesterLogic = require('../logic/semesterLogic.js')
const router = express.Router()

router.route('/')
    .get(semesterLogic.getAllSemesters)
    .post(semesterLogic.postSemester)

router.route('/:id')
    .put(semesterLogic.putSemester)
    .delete(semesterLogic.deleteSemester)

router.route('/deleteInfo/:id')
    .get(semesterLogic.deleteInfoSemester)

module.exports = router