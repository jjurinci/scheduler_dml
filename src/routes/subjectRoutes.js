import express from 'express'

const subjectLogic = require('../logic/subjectLogic.js')
const router = express.Router()

router.route('/')
    .get(subjectLogic.getAllSubjects)
    .post(subjectLogic.postSubject)

router.route('/:id')
    .put(subjectLogic.putSubject)
    .delete(subjectLogic.deleteSubject)

router.route('/deleteInfo/:id')
    .get(subjectLogic.deleteInfoSubject)

module.exports = router