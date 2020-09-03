import connect from '../db.js'
import mongo from 'mongodb'

export const getAllProfessors = async (req, res) => {
    let db = await connect()
    let cursor = await db.collection("professors").find()
    let results = await cursor.toArray()
    res.json(results)
}

export const postProfessor = async (req, res) => {
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
}

export const putProfessor = async (req, res) => {
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
            id: result.InsertedId,
        });
    } else {
        res.json({
            status: 'fail',
        });
    }
}

export const deleteInfoProfessor = async (req, res) => {
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
    for (let i = 0; i < subjects.length; i++) {
        let sid = String(subjects[i]._id)
        let needDel = await db.collection("schedules").find({ "body.subjectId": sid }).count()
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
}

export const deleteProfessor = async (req, res) => {
    let db = await connect()
    let id = req.params.id
    let professor = await db.collection('professors').findOne({ _id: mongo.ObjectId(id) })
    if (!professor) return res.status(404).json({ message: "Professor not found." })

    let proId = String(professor._id)
    let needDeleteSubjects = await db.collection("subjects").find({
        $or: [
            { $and: [{ "theoryProfessorIds": { $size: 1 } }, { "theoryProfessorIds": { $in: [proId] } }] },
            { $and: [{ "practiceProfessorIds": { $size: 1 } }, { "practiceProfessorIds": { $in: [proId] } }] },
            { $and: [{ "seminarProfessorIds": { $size: 1 } }, { "seminarProfessorIds": { $in: [proId] } }] },
        ]
    })
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
    for (let i = 0; i < needUpdateSubjects.length; i++) {
        let s = needUpdateSubjects[i]
        let id = String(s._id)
        if (s.theoryProfessorIds.length > 1 && s.theoryProfessorIds.includes(proId)) {
            let index = s.theoryProfessorIds.indexOf(proId)
            s.theoryProfessorIds.splice(index, 1)
        }
        if (s.practiceProfessorIds.length > 1 && s.practiceProfessorIds.includes(proId)) {
            let index = s.practiceProfessorIds.indexOf(proId)
            s.practiceProfessorIds.splice(index, 1)
        }
        if (s.seminarProfessorIds.length > 1 && s.seminarProfessorIds.includes(proId)) {
            let index = s.seminarProfessorIds.indexOf(proId)
            s.seminarProfessorIds.splice(index, 1)
        }
        let result = await db.collection("subjects").replaceOne({ _id: mongo.ObjectId(id) }, s)
        let result2 = await db.collection("schedules").deleteMany({ $and: [{ "body.subjectId": id }, { "body.professorId": proId }] })
        if (result.modifiedCount == 1) modifiedSubjects++
        modifiedSchedules += result2.modifiedCount
    }

    let deletedSubjects = 0
    let deletedSchedules = 0
    for (let i = 0; i < needDeleteSubjects.length; i++) {
        let subId = String(needDeleteSubjects[i]._id)
        let result = await db.collection('subjects').deleteOne({ _id: mongo.ObjectId(subId) })
        let result2 = await db.collection("schedules").deleteMany({ "body.subjectId": subId })
        if (result.deletedCount == 1) deletedSubjects++
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
}