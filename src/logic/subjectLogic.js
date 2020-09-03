import connect from '../db.js'
import mongo from 'mongodb'

export const getAllSubjects = async (req, res) => {
    let db = await connect()
    let cursor = await db.collection("subjects").find()
    let results = await cursor.toArray()
    res.json(results)
}

export const postSubject = async (req, res) => {
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
}

export const putSubject = async (req, res) => {
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
}

export const deleteInfoSubject = async (req, res) => {
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
}

export const deleteSubject = async (req, res) => {
    let db = await connect()
    let id = req.params.id
    let subject = await db.collection('subjects').findOne({ _id: mongo.ObjectId(id) })
    if (!subject) return res.status(404).json({ message: "Subject not found." })

    let subId = String(subject._id)
    let cursor = await db.collection("schedules").find({ "body.subjectId": subId })
    let allSchedules = await cursor.toArray()

    let deletedSchedules = 0
    for (let i = 0; i < allSchedules.length; i++) {
        let id = allSchedules[i]._id
        let result = await db.collection('schedules').deleteOne({ _id: mongo.ObjectId(id) })
        if (result.deletedCount == 1) deletedSchedules++
    }

    let deletedSubjects = 0
    let resu = await db.collection('subjects').deleteOne({ _id: mongo.ObjectId(id) })
    if (resu.deletedCount == 1) deletedSubjects++

    return res.status(200).json({
        "deletedSubjects": deletedSubjects,
        "deletedSchedules": deletedSchedules
    })
}