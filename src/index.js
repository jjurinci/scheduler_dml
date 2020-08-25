import express from 'express'
import cors from 'cors'
import connect from './db.js'
import mongo from 'mongodb'
import jwt from 'jsonwebtoken'

var bodyParser = require('body-parser')
var bcrypt = require('bcryptjs');

const app = express() 
const port = process.env.PORT || 3000;
app.use(cors())
app.get('/', (req, res) => res.send('Hello World.'))
app.listen(port, () => console.log(`Slušam na portu ${port}!`))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//GET
app.get('/faculties', async (req, res) => {
    let db = await connect()
    let cursor = await db.collection("faculties").find()
    let results = await cursor.toArray()
    res.json(results)
})

app.get('/semesters', async (req, res) => {
    let db = await connect()
    let cursor = await db.collection("semesters").find()
    let results = await cursor.toArray()
    res.json(results)
})

app.get('/subjects', async (req, res) => {
    let db = await connect()
    let cursor = await db.collection("subjects").find()
    let results = await cursor.toArray()
    res.json(results)
})

app.get('/schedules', async (req, res) => {
    let db = await connect()
    let cursor = await db.collection("schedules").find()
    let results = await cursor.toArray()
    res.json(results)
})

app.get('/timetables', async (req, res) => {
    let db = await connect()
    let cursor = await db.collection("timetables").find()
    let results = await cursor.toArray()
    res.json(results)
})

app.get('/professors', async (req, res) => {
    let db = await connect()
    let cursor = await db.collection("professors").find()
    let results = await cursor.toArray()
    res.json(results)
})

app.get('/classrooms', async (req, res) => {
    let db = await connect()
    let cursor = await db.collection("classrooms").find()
    let results = await cursor.toArray()
    res.json(results)
})

//POST
app.post('/faculties', async (req, res) => {
    let db = await connect();
    let doc = req.body;
    let result = await db.collection('faculties').insertOne(doc);
    if (result.insertedCount == 1) {
        res.json({
            status: 'success',
            id: result.insertedId,
        });
    } else {
        res.json({
            status: 'fail',
        });
    }
});

app.post('/semesters', async (req, res) => {
    let db = await connect();
    let doc = req.body;
    let result = await db.collection('semesters').insertOne(doc);
    if (result.insertedCount == 1) {
        res.json({
            status: 'success',
            id: result.insertedId,
        });
    } else {
        res.json({
            status: 'fail',
        });
    }
});

app.post('/subjects', async (req, res) => {
    let db = await connect();
    let doc = req.body;
    let result = await db.collection('subjects').insertOne(doc);
    if (result.insertedCount == 1) {
        res.json({
            status: 'success',
            id: result.insertedId,
        });
    } else {
        res.json({
            status: 'fail',
        });
    }
});

app.post('/schedules', async (req, res) => {
    let db = await connect();
    let doc = req.body;
    let result = await db.collection('schedules').insertOne(doc);
    if (result.insertedCount == 1) {
        res.json({
            status: 'success',
            id: result.insertedId,
        });
    } else {
        res.json({
            status: 'fail',
        });
    }
});

app.post('/timetables', async (req, res) => {
    let db = await connect();
    let doc = req.body;
    if ('_id' in doc) doc._id = mongo.ObjectId(doc._id)
    let result = await db.collection('timetables').insertOne(doc);
    if (result.insertedCount == 1) {
        res.json({
            status: 'success',
            id: result.insertedId,
        });
    } else {
        res.json({
            status: 'fail',
        });
    }
});

app.post('/professors', async (req, res) => {
    let db = await connect();
    let doc = req.body;
    let result = await db.collection('professors').insertOne(doc);
    if (result.insertedCount == 1) {
        res.json({
            status: 'success',
            id: result.insertedId,
        });
    } else {
        res.json({
            status: 'fail',
        });
    }
});

app.post('/classrooms', async (req, res) => {
    let db = await connect();
    let doc = req.body;
    let result = await db.collection('classrooms').insertOne(doc);
    if (result.insertedCount == 1) {
        res.json({
            status: 'success',
            id: result.insertedId,
        });
    } else {
        res.json({
            status: 'fail',
        });
    }
});

//PUT
app.put('/faculties/:id', async (req, res) => {
    let doc = req.body;
    delete doc._id;
    let id = req.params.id;
    let db = await connect();
    let result = await db.collection('faculties').replaceOne({
        _id:
            mongo.ObjectId(id)
    }, doc);
    if (result.modifiedCount == 1) {
        res.json({
            status: 'success',
            id: result.insertedId,
        });
    } else {
        res.json({
            status: 'fail',
        });
    }
});

app.put('/semesters/:id', async (req, res) => {
    let doc = req.body;
    delete doc._id;
    let id = req.params.id;
    let db = await connect();
    let result = await db.collection('semesters').replaceOne({
        _id:
            mongo.ObjectId(id)
    }, doc);
    if (result.modifiedCount == 1) {
        res.json({
            status: 'success',
            id: result.insertedId,
        });
    } else {
        res.json({
            status: 'fail',
        });
    }
});

app.put('/subjects/:id', async (req, res) => {
    let doc = req.body;
    delete doc._id;
    let id = req.params.id;
    let db = await connect();
    let result = await db.collection('subjects').replaceOne({
        _id:
            mongo.ObjectId(id)
    }, doc);
    if (result.modifiedCount == 1) {
        res.json({
            status: 'success',
            id: result.InsertedId,
        });
    } else {
        res.json({
            status: 'fail',
        });
    }
});

app.patch('/schedules/:id', async (req, res) => {
    let doc = req.body;
    delete doc._id;
    let id = req.params.id;
    let db = await connect();
    
    let result = await db.collection('schedules').updateOne(
        {_id: mongo.ObjectId(id)},
        {$set: {
            'start' : doc.start,
            'end' : doc.end,
            'body.startHHmm' : doc.body.startHHmm,
            'body.endHHmm' : doc.body.endHHmm
        }}
    );
    if (result.modifiedCount == 1) {
        res.json({
            status: 'success',
            id: result.upsertedId,
        });
    } else {
        res.json({
            status: 'fail',
        });
    }
});

app.put('/schedules/:id', async (req, res) => {
    let doc = req.body;
    delete doc._id;
    let id = req.params.id;
    let db = await connect();
    let result = await db.collection('schedules').replaceOne({
        _id:
            mongo.ObjectId(id)
    }, doc);
    if (result.modifiedCount == 1) {
        res.json({
            status: 'success',
            id: result.upsertedId,
        });
    } else {
        res.json({
            status: 'fail',
        });
    }
});

app.put('/timetables/:id', async (req, res) => {
    let doc = req.body;
    //delete doc._id;
    let id = req.params.id;
    let db = await connect();
    let result = await db.collection('timetables').replaceOne({
        _id:
            mongo.ObjectId(id)
    }, doc);
    if (result.modifiedCount == 1) {
        return res.status(200).json({
            id: result.upsertedId,
        })
    } else {
        return res.status(404).json({
            "message": "Timetable not found."
        })
    }
});

app.put('/professors/:id', async (req, res) => {
    let doc = req.body;
    delete doc._id;
    let id = req.params.id;
    let db = await connect();
    let result = await db.collection('professors').replaceOne({
        _id:
            mongo.ObjectId(id)
    }, doc);
    if (result.modifiedCount == 1) {
        res.json({
            status: 'success',
            id: result.InsertedId ,
        });
    } else {
        res.json({
            status: 'fail',
        });
    }
});

app.put('/classrooms/:id', async (req, res) => {
    let doc = req.body;
    delete doc._id;
    let id = req.params.id;
    let db = await connect();
    let result = await db.collection('classrooms').replaceOne({
        _id:
            mongo.ObjectId(id)
    }, doc);
    if (result.modifiedCount == 1) {
        res.json({
            status: 'success',
            id: result.upsertedId,
        });
    } else {
        res.json({
            status: 'fail',
        });
    }
});

//Authentication
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

app.post('/register', async (req, res) => {
    try{
        if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password || !req.body.confirmPassword)
            return res.status(400).json({ message: "Please enter all fields." })
        
        if(!validateEmail(req.body.email))
            return res.status(400).json({ message: "Email is invalid." })

        if (req.body.password != req.body.confirmPassword)
            return res.status(400).json({ message: "Passwords don't match." })

        if (req.body.password.length < 6)
            return res.status(400).json({ message: "Password must be at least 6 characters long." })

        if (!(/^[a-zA-Z\u010C\u010D\u0106\u0107\u0110\u0111\u0160\u0161\u017D\u017E]+$/.test(req.body.firstName)))
            return res.status(400).json({ message: "First name must consist of letters only." })
        
        if (!(/^[a-zA-Z\u010C\u010D\u0106\u0107\u0110\u0111\u0160\u0161\u017D\u017E]+$/.test(req.body.lastName)))
            return res.status(400).json({message: "Last name must consist of letters only."})

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
        let userExists = await db.collection("users").findOne({email})
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
    catch(err){
        return res.status(500).json(err)
    }
})

app.post('/login', async (req, res) => {
    
    const {email, password} = req.body
    if(!email) return res.status(400).json({message: "Please enter email."})
    if(!password) return res.status(400).json({message: "Please enter password."})
    
    if (!validateEmail(req.body.email))
        return res.status(400).json({ message: "Email is invalid." })
    
    let db = await connect()
    let user = await db.collection("users").findOne({email})
    if(!user) return res.status(404).json({message: "User with that email doesn't exist."})
    
    if(!(await isCorrectPassword(password, user.password))) return res.status(403).json({message: "Password incorrect."})
    tokenCreation(user, 200, res)
})

function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}

const lastMondayDate = date => {
    let date_ = new Date(date.valueOf())
    let day = date_.getDay()
    if (day == 0) date_.setDate(date_.getDate()-6) 
    else date_.setDate(date_.getDate() - (day-1))
    return date_
}


//CASCADE DELETE
app.get('/faculties/deleteInfo/:id', async (req, res) => {
    try{
        let db = await connect();
        let id = req.params.id;
        let result = await db.collection('faculties').findOne({_id: mongo.ObjectId(id)})
        if(!result) return res.status(404).json({message: "Faculty not found."})

        let semesters = await (await db.collection('semesters').find({"facultyId" : id})).toArray()

        let allSubjects = []
        let semSids = semesters.map(el => String(el._id))
        let cursor = await db.collection('subjects').find()
        let subjects = await cursor.toArray()
        
        subjects = subjects.filter(el => {
            const found = el.semesterIds.some(r => semSids.indexOf(r) >= 0)
            if(found) return el
        })

        let modifiedSubjects = 0
        let modifiedSchedules = 0
        for (let j = 0; j < subjects.length; j++) {
            let s = subjects[j]
            let subId = String(s._id)
            if(allSubjects.includes(s)) continue

            if (s.semesterIds.length == 1) {
                allSubjects = allSubjects.concat(s)
                continue
            }
            let sidCount = 0
            for (let k = 0; k < s.semesterIds.length; k++) {
                let sid = s.semesterIds[k]
                if (semSids.includes(sid)) sidCount++
            }
            if (sidCount == s.semesterIds.length) allSubjects = allSubjects.concat(s)
            else{
                for (let j = s.semesterIds.length-1; j>=0; j--){
                    let semId = s.semesterIds[j]
                    if (semSids.includes(semId)) s.semesterIds.splice(j,1)
                }
                modifiedSubjects++
                let scheduleCount = await db.collection("schedules").find({"body.subjectId": subId}).count()
                modifiedSchedules += scheduleCount
            }
        }

        let allSchedules = []
        for(let i=0; i<allSubjects.length; i++){
            let subject = allSubjects[i]
            let subId = String(subject._id)
            let cursor = await db.collection("schedules").find({"body.subjectId": subId})
            let schedules = await cursor.toArray()
            allSchedules = allSchedules.concat(schedules)
        }

        let needsDeleteSemesters = semesters.length
        let needsDeleteSubjects = allSubjects.length
        let needsDeleteSchedules = allSchedules.length
        return res.status(200).json({
                                    "needsDeleteFaculties": 1,
                                    "needsDeleteSemesters": needsDeleteSemesters,
                                    "needsDeleteSubjects": needsDeleteSubjects,
                                    "needsDeleteSchedules": needsDeleteSchedules,
                                    "needsModifySubjects": modifiedSubjects,
                                    "needsModifySchedules": modifiedSchedules})
    }
    catch(err){
        return res.status(500).json({message: "Internal server error."})
    }
})

app.get('/semesters/deleteInfo/:id', async (req, res) => {
    let db = await connect()
    let id = req.params.id
    let semester = await db.collection('semesters').findOne({ _id: mongo.ObjectId(id) })
    if (!semester) return res.status(404).json({ message: "Semester not found." })
    
    let semSids = [String(semester._id)]
    
    let cursor = await db.collection('subjects').find()
    let subjects = await cursor.toArray()

    subjects = subjects.filter(el => {
        const found = el.semesterIds.some(r => semSids.indexOf(r) >= 0)
        if (found) return el
    })

    let needsModifySubjects = 0
    let needsModifySchedules = 0
    let allSubjects = []
    for (let j = 0; j < subjects.length; j++) {
        let s = subjects[j]
        let subId = String(s._id)
        if (allSubjects.includes(s)) continue

        if (s.semesterIds.length == 1) allSubjects = allSubjects.concat(s)
        else {            
            needsModifySubjects++
            let scheduleCount = await db.collection("schedules").find({ "body.subjectId": subId }).count()
            needsModifySchedules += scheduleCount
        }

    }

    let allSchedules = []
    for (let i = 0; i < allSubjects.length; i++) {
        let subject = allSubjects[i]
        let subId = String(subject._id)
        let cursor = await db.collection("schedules").find({ "body.subjectId": subId })
        let schedules = await cursor.toArray()
        allSchedules = allSchedules.concat(schedules)
    }

    let needsDeleteSubjects = allSubjects.length
    let needsDeleteSchedules = allSchedules.length
    return res.status(200).json({
        "needsDeleteSemesters": 1,
        "needsDeleteSubjects": needsDeleteSubjects,
        "needsDeleteSchedules": needsDeleteSchedules,
        "needsModifySubjects": needsModifySubjects,
        "needsModifySchedules": needsModifySchedules
    })
})

app.get('/subjects/deleteInfo/:id', async (req, res) => {
    let db = await connect()
    let id = req.params.id
    let subject = await db.collection('subjects').findOne({ _id: mongo.ObjectId(id) })
    if (!subject) return res.status(404).json({ message: "Subject not found." })
    
    let subId = String(subject._id)
    let cursor = await db.collection("schedules").find({ "body.subjectId": subId })
    let allSchedules = await cursor.toArray()

    let needsDeleteSchedules = allSchedules.length
    return res.status(200).json({
        "needsDeleteSubjects": 1,
        "needsDeleteSchedules": needsDeleteSchedules
    })
})

app.get('/classrooms/deleteInfo/:id', async (req, res) => {
    let db = await connect()
    let id = req.params.id
    let classroom = await db.collection('classrooms').findOne({ _id: mongo.ObjectId(id) })
    if (!classroom) return res.status(404).json({ message: "Classroom not found." })

    let clsId = String(classroom._id)
    let needsDeleteSchedules = await db.collection("schedules").find({ "body.classroomId": clsId }).count()

    return res.status(200).json({
        "needsDeleteClassrooms": 1,
        "needsDeleteSchedules": needsDeleteSchedules
    })
})

app.get('/professors/deleteInfo/:id', async (req, res) => {
    let db = await connect()
    let id = req.params.id
    let professor = await db.collection('professors').findOne({ _id: mongo.ObjectId(id) })
    if (!professor) return res.status(404).json({ message: "Professor not found." })

    let proId = String(professor._id)
    let subjects = await (await db.collection("subjects").find({
        $or: [
            { $and: [{ "theoryProfessorIds": { $size: 1 } }, { "theoryProfessorIds": { $in: [proId] } }] },
            { $and: [{ "practiceProfessorIds": { $size: 1 } }, { "practiceProfessorIds": { $in: [proId] } }] },
            { $and: [{ "seminarProfessorIds": { $size: 1 } }, { "seminarProfessorIds": { $in: [proId] } }] },
        ]
    })).toArray()

    let needsDeleteSubjects = subjects.length

    let needUpdateSubjects = await db.collection("subjects").find({
        $or: [
            { $and: [{ "theoryProfessorIds.1": { $exists: true } }, { "theoryProfessorIds": { $in: [proId] } }] },
            { $and: [{ "practiceProfessorIds.1": { $exists: true } }, { "practiceProfessorIds": { $in: [proId] } }] },
            { $and: [{ "seminarProfessorIds.1": { $exists: true } }, { "seminarProfessorIds": { $in: [proId] } }] },
        ]
    })

    let needsDeleteSchedules = 0
    for(let i=0; i<subjects.length; i++){
        let sid = String(subjects[i]._id)
        let needDel = await db.collection("schedules").find({"body.subjectId":sid}).count()
        needsDeleteSchedules += needDel
    }

    let needsModifySubjects = 0
    needUpdateSubjects = await needUpdateSubjects.toArray()
    for (let i = 0; i < needUpdateSubjects.length; i++) {
        let s = needUpdateSubjects[i]
        let flag = false
        if (s.theoryProfessorIds.length > 1 && s.theoryProfessorIds.includes(proId)) flag = true
        if (s.practiceProfessorIds.length > 1 && s.practiceProfessorIds.includes(proId)) flag = true
        if (s.seminarProfessorIds.length > 1 && s.seminarProfessorIds.includes(proId)) flag = true
        if (flag) needsModifySubjects++
    }

    return res.status(200).json({
        "needsDeleteProfessors": 1,
        "needsDeleteSubjects": needsDeleteSubjects,
        "needsDeleteSchedules": needsDeleteSchedules,
        "needsModifySubjects": needsModifySubjects
    })
})

app.get('/timetables/deleteInfo/:id', async (req, res) => {
    let db = await connect()
    let id = req.params.id
    let timetable = await db.collection('timetables').findOne({ _id: mongo.ObjectId(id) })
    if (!timetable) return res.status(404).json({ message: "Timetable not found." })

    let timId = String(timetable._id)
    let cursor = await db.collection("schedules").find({ "body.timetableId": timId })
    let allSchedules = await cursor.toArray()

    let needsDeleteSchedules = allSchedules.length
    return res.status(200).json({
        "needsDeleteTimetable": 1,
        "needsDeleteSchedules": needsDeleteSchedules
    })
})

app.delete('/faculties/:id', async (req, res) => {
    let db = await connect();
    let id = req.params.id;
    let result = await db.collection('faculties').findOne({ _id: mongo.ObjectId(id) })
    if (!result) return res.status(404).json({ message: "Faculty not found." })

    let semesters = await (await db.collection('semesters').find({ "facultyId": id })).toArray()

    let allSubjects = []
    let semSids = semesters.map(el => String(el._id))

    let cursor = await db.collection('subjects').find()
    let subjects = await cursor.toArray()
    subjects = subjects.filter(el => {
        const found = el.semesterIds.some(r => semSids.indexOf(r) >= 0)
        if (found) return el
    })
    
    let modifiedSubjects = 0
    let modifiedSchedules = 0
    for(let j = 0; j < subjects.length; j++){
        let s = subjects[j]
        let subId = String(s._id)
        if (allSubjects.includes(s)) continue
        if(s.semesterIds.length==1){
            allSubjects = allSubjects.concat(s)
            continue
        }
        let sidCount = 0
        for(let k = 0; k < s.semesterIds.length; k++){
            let sid = s.semesterIds[k]
            if(semSids.includes(sid)) sidCount++
        }
        if(sidCount == s.semesterIds.length) allSubjects = allSubjects.concat(s)
        else {
            for (let j = s.semesterIds.length-1; j >= 0; j--) {
                let semId = s.semesterIds[j]
                if (semSids.includes(semId)) s.semesterIds.splice(j, 1)
            }
            
            let newSemArr = s.semesterIds
            let numStudents = 0
            for(let k=0; k<newSemArr.length; k++){
                let semid = newSemArr[k]
                numStudents += parseInt((await db.collection("semesters").findOne({_id: mongo.ObjectId(semid)})).numStudents)
            }
            let schedules = await db.collection("schedules").updateMany({ "body.subjectId": subId }, { $set: { "body.semesterIds": newSemArr, "body.numStudents": numStudents } })
            let subject = await db.collection("subjects").updateOne({ _id: mongo.ObjectId(subId) }, { $set: { "semesterIds": newSemArr, "numStudents": numStudents } })
            modifiedSubjects += subject.modifiedCount
            modifiedSchedules += schedules.modifiedCount
        }
    }
    let allSchedules = []
    for (let i = 0; i < allSubjects.length; i++) {
        let subject = allSubjects[i]
        let subId = String(subject._id)
        let cursor = await db.collection("schedules").find({ "body.subjectId": subId })
        let schedules = await cursor.toArray()
        allSchedules = allSchedules.concat(schedules)
    }

    //Deleting children first
    let deletedSchedules = 0
    for(let i = 0; i < allSchedules.length; i++){
        let id = allSchedules[i]._id
        let result = await db.collection('schedules').deleteOne({ _id: mongo.ObjectId(id) })
        if (result.deletedCount == 1) deletedSchedules++
    }

    let deletedSubjects = 0
    for(let i = 0; i < allSubjects.length; i++){
        let id = allSubjects[i]._id
        let result = await db.collection('subjects').deleteOne({_id: mongo.ObjectId(id)})
        if(result.deletedCount == 1) deletedSubjects++
    }

    let deletedSemesters = 0
    for (let i = 0; i < semesters.length; i++) {
        let id = semesters[i]._id
        let result = await db.collection('semesters').deleteOne({ _id: mongo.ObjectId(id) })
        if (result.deletedCount == 1) deletedSemesters++
    }

    let deletedFaculties = 0
    let idd = result._id
    let resu = await db.collection('faculties').deleteOne({ _id: mongo.ObjectId(idd)})
    if (resu.deletedCount == 1) deletedFaculties++

    return res.status(200).json({
        "deletedFaculties": deletedFaculties,
        "deletedSemesters": deletedSemesters,
        "deletedSubjects": deletedSubjects,
        "deletedSchedules": deletedSchedules,
        "modifiedSubjects": modifiedSubjects,
        "modifiedSchedules": modifiedSchedules
    })
})

app.delete('/semesters/:id', async (req, res) => {
    let db = await connect()
    let id = req.params.id
    let semester = await db.collection('semesters').findOne({ _id: mongo.ObjectId(id) })
    if (!semester) return res.status(404).json({ message: "Semester not found." })

    let semSids = [String(semester._id)]
    let cursor = await db.collection('subjects').find()
    let subjects = await cursor.toArray()

    subjects = subjects.filter(el => {
        const found = el.semesterIds.some(r => semSids.indexOf(r) >= 0)
        if (found) return el
    })

    let modifiedSubjects = 0
    let modifiedSchedules = 0
    let allSubjects = []
    for (let j = 0; j < subjects.length; j++) {
        let s = subjects[j]
        let subId = String(s._id)
        if (allSubjects.includes(s)) continue

        if (s.semesterIds.length == 1) allSubjects = allSubjects.concat(s)
        else {
            for (let j = s.semesterIds.length - 1; j >= 0; j--) {
                let semId = s.semesterIds[j]
                if (semSids.includes(semId)) s.semesterIds.splice(j, 1)
            }

            let newSemArr = s.semesterIds
            let schedules = await db.collection("schedules").updateMany({ "body.subjectId": subId }, { $set: { "body.semesterIds": newSemArr } })
            let subject = await db.collection("subjects").updateOne({ _id: mongo.ObjectId(subId) }, { $set: { "semesterIds": newSemArr } })
            modifiedSubjects += subject.modifiedCount
            modifiedSchedules += schedules.modifiedCount
        }
    }

    let allSchedules = []
    for (let i = 0; i < allSubjects.length; i++) {
        let subject = allSubjects[i]
        let subId = String(subject._id)
        let cursor = await db.collection("schedules").find({ "body.subjectId": subId })
        let schedules = await cursor.toArray()
        allSchedules = allSchedules.concat(schedules)
    }

    let deletedSchedules = 0
    for(let i = 0; i < allSchedules.length; i++){
        let id = allSchedules[i]._id
        let result = await db.collection('schedules').deleteOne({ _id: mongo.ObjectId(id) })
        if (result.deletedCount == 1) deletedSchedules++
    }

    let deletedSubjects = 0
    for (let i = 0; i < allSubjects.length; i++) {
        let id = allSubjects[i]._id
        let result = await db.collection('subjects').deleteOne({ _id: mongo.ObjectId(id) })
        if (result.deletedCount == 1) deletedSubjects++
    }

    let deletedSemesters = 0
    let resu = await db.collection('semesters').deleteOne({ _id: mongo.ObjectId(id) })
    if (resu.deletedCount == 1) deletedSemesters++

    return res.status(200).json({
        "deletedSemesters": deletedSemesters,
        "deletedSubjects ": deletedSubjects,
        "deletedSchedules": deletedSchedules,
        "modifiedSubjects": modifiedSubjects,
        "modifiedSchedules": modifiedSchedules
    })
})

app.delete('/subjects/:id', async (req, res) => {
    let db = await connect()
    let id = req.params.id
    let subject = await db.collection('subjects').findOne({ _id: mongo.ObjectId(id) })
    if (!subject) return res.status(404).json({ message: "Subject not found." })

    let subId = String(subject._id)
    let cursor = await db.collection("schedules").find({ "body.subjectId": subId })
    let allSchedules = await cursor.toArray()

    let deletedSchedules = 0
    for(let i = 0; i<allSchedules.length; i++){
        let id = allSchedules[i]._id
        let result = await db.collection('schedules').deleteOne({ _id: mongo.ObjectId(id) })
        if (result.deletedCount == 1) deletedSchedules++
    }

    let deletedSubjects = 0
    let resu = await db.collection('subjects').deleteOne({_id: mongo.ObjectId(id)})
    if(resu.deletedCount == 1) deletedSubjects++

    return res.status(200).json({
        "deletedSubjects": deletedSubjects,
        "deletedSchedules": deletedSchedules
    })
})

app.delete('/classrooms/:id', async (req, res) => {
    let db = await connect()
    let id = req.params.id
    let classroom = await db.collection('classrooms').findOne({ _id: mongo.ObjectId(id) })
    if (!classroom) return res.status(404).json({ message: "Classroom not found." })

    let clsId = String(classroom._id)
    let cursor = await db.collection("schedules").find({ "body.classroomId": clsId })
    let allSchedules = await cursor.toArray()

    let deletedSchedules = 0
    for (let i = 0; i < allSchedules.length; i++) {
        let id = allSchedules[i]._id
        let result = await db.collection('schedules').deleteOne({ _id: mongo.ObjectId(id) })
        if (result.deletedCount == 1) deletedSchedules++
    }

    let deletedClassrooms = 0
    let resu = await db.collection('classrooms').deleteOne({ _id: mongo.ObjectId(id) })
    if (resu.deletedCount == 1) deletedClassrooms++

    return res.status(200).json({
        "deletedClassrooms": deletedClassrooms,
        "deletedSchedules": deletedSchedules
    })
})

app.delete('/professors/:id', async (req, res) => {
    let db = await connect()
    let id = req.params.id
    let professor = await db.collection('professors').findOne({ _id: mongo.ObjectId(id) })
    if (!professor) return res.status(404).json({ message: "Professor not found." })
    
    let proId = String(professor._id)
    let needDeleteSubjects = await db.collection("subjects").find({$or: [
        {$and: [{"theoryProfessorIds": {$size: 1}}, {"theoryProfessorIds": {$in: [proId]}}]},
        {$and: [{"practiceProfessorIds": { $size: 1 } }, { "practiceProfessorIds": { $in: [proId] } }] },
        {$and: [{"seminarProfessorIds": { $size: 1 } }, { "seminarProfessorIds": { $in: [proId] } }] },
    ]})
    needDeleteSubjects = await needDeleteSubjects.toArray()
    
    let needUpdateSubjects = await db.collection("subjects").find({
        $or: [
            { $and: [{ "theoryProfessorIds.1": { $exists: true } }, { "theoryProfessorIds": { $in: [proId] } }] },
            { $and: [{ "practiceProfessorIds.1": { $exists: true } }, { "practiceProfessorIds": { $in: [proId] } }] },
            { $and: [{ "seminarProfessorIds.1": { $exists: true } }, { "seminarProfessorIds": { $in: [proId] } }] },
        ]
    })

    let modifiedSubjects = 0
    let modifiedSchedules = 0
    needUpdateSubjects = await needUpdateSubjects.toArray()
    for(let i=0; i<needUpdateSubjects.length; i++){
        let s = needUpdateSubjects[i]
        let id = String(s._id)
        if(s.theoryProfessorIds.length > 1 && s.theoryProfessorIds.includes(proId)){
            let index = s.theoryProfessorIds.indexOf(proId)
            s.theoryProfessorIds.splice(index,1)
        }
        if(s.practiceProfessorIds.length > 1 && s.practiceProfessorIds.includes(proId)){
            let index = s.practiceProfessorIds.indexOf(proId)
            s.practiceProfessorIds.splice(index, 1)
        }
        if(s.seminarProfessorIds.length > 1 && s.seminarProfessorIds.includes(proId)) {
            let index = s.seminarProfessorIds.indexOf(proId)
            s.seminarProfessorIds.splice(index, 1)
        }
        let result = await db.collection("subjects").replaceOne({_id: mongo.ObjectId(id)}, s)
        let result2 = await db.collection("schedules").deleteMany({$and: [{"body.subjectId": id}, {"body.professorId":proId}]})
        if (result.modifiedCount == 1) modifiedSubjects++
        modifiedSchedules += result2.modifiedCount
    }
    
    let deletedSubjects = 0
    let deletedSchedules = 0
    for (let i = 0; i < needDeleteSubjects.length;i++){
        let subId = String(needDeleteSubjects[i]._id)
        let result = await db.collection('subjects').deleteOne({_id: mongo.ObjectId(subId)})
        let result2 = await db.collection("schedules").deleteMany({"body.subjectId": subId})
        if(result.deletedCount == 1) deletedSubjects++
        deletedSchedules += result2.deletedCount
    }

    let deletedProfessors = 0
    let resu = await db.collection('professors').deleteOne({ _id: mongo.ObjectId(id) })
    if (resu.deletedCount == 1) deletedProfessors++
    
    return res.status(200).json({
        "deletedProfessors": deletedProfessors,
        "deletedSubjects": deletedSubjects,
        "deletedSchedules": deletedSchedules,
        "modifiedSubjects": modifiedSubjects,
        "modifiedSchedules": modifiedSchedules
    })
})

app.delete('/schedules/:id', async (req, res) => {
    let db = await connect();
    let id = req.params.id;
    let result = await db.collection('schedules').deleteOne(
        { _id: mongo.ObjectId(id) }
    );
    if (result.deletedCount == 1) {
        res.statusCode = 201;
        res.json({ status: 'success' });
    } else {
        res.statusCode = 404;
        res.json({
            status: 'fail',
        });
    }
});

app.delete('/timetables/:id', async (req, res) => {
    let db = await connect()
    let id = req.params.id
    let timetable = await db.collection('timetables').findOne({ _id: mongo.ObjectId(id) })
    if (!timetable) return res.status(404).json({ message: "Timetable not found." })

    let timId = String(timetable._id)
    let cursor = await db.collection("schedules").find({ "body.timetableId": timId })
    let allSchedules = await cursor.toArray()

    let deletedSchedules = 0
    for (let i = 0; i < allSchedules.length; i++) {
        let id = allSchedules[i]._id
        let result = await db.collection('schedules').deleteOne({ _id: mongo.ObjectId(id) })
        if (result.deletedCount == 1) deletedSchedules++
    }

    let deletedTimetables = 0
    let resu = await db.collection('timetables').deleteOne({ _id: mongo.ObjectId(id) })
    if (resu.deletedCount == 1) deletedTimetables++

    return res.status(200).json({
        "deletedTimetables": deletedTimetables,
        "deletedSchedules": deletedSchedules
    }) 
})

app.get('/test', async (req, res) => {
    let db = await connect()
    let subjects = await db.collection("subjects").find({ "userId": "5f3e49af047dd12c94e861f8"})
    subjects = await subjects.toArray()
    let professors = await db.collection("professors").find({ "userId": "5f3e49af047dd12c94e861f8"})
    professors = await professors.toArray()

    let count = {}
    for(let i=0; i<professors.length; i++){
        let profname = professors[i].firstName + " " + professors[i].lastName
        let profid = String(professors[i]._id)
        count[profname] = 0
        for(let i=0; i<subjects.length; i++){
            let subject = subjects[i]
            if(subject.theoryProfessorIds.includes(profid) ||
               subject.practiceProfessorIds.includes(profid) ||
               subject.seminarProfessorIds.includes(profid)){
                count[profname]++
            }
        }
    }
    
    res.status(200).json(count)

})