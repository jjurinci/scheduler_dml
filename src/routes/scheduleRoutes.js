import express from 'express'

const scheduleLogic = require('../logic/scheduleLogic.js')
const router = express.Router()

router.route('/')
    .get(scheduleLogic.getAllSchedules)
    .post(scheduleLogic.postSchedule)

router.route('/:id')
    .put(scheduleLogic.putSchedule)
    .patch(scheduleLogic.patchSchedule)
    .delete(scheduleLogic.deleteSchedule)

module.exports = router