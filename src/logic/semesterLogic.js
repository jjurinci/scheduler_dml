import connect from '../db.js'
import mongo from 'mongodb'

export const getAllSemesters = async (req, res) => {
    let db = await connect()
    let cursor = await db.collection("semesters").find()
    let results = await cursor.toArray()
    res.json(results)
}

export const postSemester = async (req, res) => {
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
}

export const putSemester = async (req, res) => {
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
}

export const deleteInfoSemester = async (req, res) => {
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
}

export const deleteSemester = async (req, res) => {
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
    for (let i = 0; i < allSchedules.length; i++) {
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
}