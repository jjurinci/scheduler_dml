import express from 'express'
import cors from 'cors'

var bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000;

app.use(cors())
app.get('/', (req, res) => res.send('Hello World.'))
app.listen(port, () => console.log(`Slušam na portu ${port}!`))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

import userRouter from './routes/userRoutes.js'
import facultyRouter from './routes/facultyRoutes.js'
import semesterRouter from './routes/semesterRoutes.js'
import subjectRouter from './routes/subjectRoutes.js'
import scheduleRouter from './routes/scheduleRoutes.js'
import timetableRouter from './routes/timetableRoutes.js'
import professorRouter from './routes/professorRoutes.js'
import classroomRouter from './routes/classroomRoutes.js'

app.use('/', userRouter)
app.use('/faculties', facultyRouter)
app.use('/semesters', semesterRouter)
app.use('/subjects', subjectRouter)
app.use('/schedules', scheduleRouter)
app.use('/timetables', timetableRouter)
app.use('/professors', professorRouter)
app.use('/classrooms', classroomRouter)