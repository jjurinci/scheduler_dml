import express from 'express'

const timetableLogic = require('../logic/timetableLogic.js')
const router = express.Router()

router.route('/')
    .get(timetableLogic.getAllTimetables)
    .post(timetableLogic.postTimetable)

router.route('/:id')
    .put(timetableLogic.putTimetable)
    .delete(timetableLogic.deleteTimetable)

router.route('/deleteInfo/:id')
    .get(timetableLogic.deleteInfoTimetable)

module.exports = router