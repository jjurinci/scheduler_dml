import connect from '../db.js'
import mongo from 'mongodb'

export const getAllFaculties = async (req, res) => {
    let db = await connect()
    let cursor = await db.collection("faculties").find()
    let results = await cursor.toArray()
    res.json(results)
}

export const postFaculty = async (req, res) => {
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
}

export const putFaculty =  async (req, res) => {
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
}

export const deleteInfoFaculty = async (req, res) => {
    try {
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
        for (let j = 0; j < subjects.length; j++) {
            let s = subjects[j]
            let subId = String(s._id)
            if (allSubjects.includes(s)) continue

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
            else {
                for (let j = s.semesterIds.length - 1; j >= 0; j--) {
                    let semId = s.semesterIds[j]
                    if (semSids.includes(semId)) s.semesterIds.splice(j, 1)
                }
                modifiedSubjects++
                let scheduleCount = await db.collection("schedules").find({ "body.subjectId": subId }).count()
                modifiedSchedules += scheduleCount
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

        let needsDeleteSemesters = semesters.length
        let needsDeleteSubjects = allSubjects.length
        let needsDeleteSchedules = allSchedules.length
        return res.status(200).json({
            "needsDeleteFaculties": 1,
            "needsDeleteSemesters": needsDeleteSemesters,
            "needsDeleteSubjects": needsDeleteSubjects,
            "needsDeleteSchedules": needsDeleteSchedules,
            "needsModifySubjects": modifiedSubjects,
            "needsModifySchedules": modifiedSchedules
        })
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error." })
    }
}

export const deleteFaculty = async (req, res) => {
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
    for (let j = 0; j < subjects.length; j++) {
        let s = subjects[j]
        let subId = String(s._id)
        if (allSubjects.includes(s)) continue
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
        else {
            for (let j = s.semesterIds.length - 1; j >= 0; j--) {
                let semId = s.semesterIds[j]
                if (semSids.includes(semId)) s.semesterIds.splice(j, 1)
            }

            let newSemArr = s.semesterIds
            let numStudents = 0
            for (let k = 0; k < newSemArr.length; k++) {
                let semid = newSemArr[k]
                numStudents += parseInt((await db.collection("semesters").findOne({ _id: mongo.ObjectId(semid) })).numStudents)
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
    for (let i = 0; i < semesters.length; i++) {
        let id = semesters[i]._id
        let result = await db.collection('semesters').deleteOne({ _id: mongo.ObjectId(id) })
        if (result.deletedCount == 1) deletedSemesters++
    }

    let deletedFaculties = 0
    let idd = result._id
    let resu = await db.collection('faculties').deleteOne({ _id: mongo.ObjectId(idd) })
    if (resu.deletedCount == 1) deletedFaculties++

    return res.status(200).json({
        "deletedFaculties": deletedFaculties,
        "deletedSemesters": deletedSemesters,
        "deletedSubjects": deletedSubjects,
        "deletedSchedules": deletedSchedules,
        "modifiedSubjects": modifiedSubjects,
        "modifiedSchedules": modifiedSchedules
    })
}