import express from 'express'

const classroomLogic = require('../logic/classroomLogic.js')
const router = express.Router()

router.route('/')
    .get(classroomLogic.getAllClassrooms)
    .post(classroomLogic.postClassroom)

router.route('/:id')
    .put(classroomLogic.putClassroom)
    .delete(classroomLogic.deleteClassroom)

router.route('/deleteInfo/:id')
    .get(classroomLogic.deleteInfoClassroom)

module.exports = router