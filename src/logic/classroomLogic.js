import connect from '../db.js'
import mongo from 'mongodb'

export const getAllClassrooms = async (req, res) => {
    let db = await connect()
    let cursor = await db.collection("classrooms").find()
    let results = await cursor.toArray()
    res.json(results)
}

export const postClassroom = async (req, res) => {
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
}

export const putClassroom = async (req, res) => {
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
}

export const deleteInfoClassroom = async (req, res) => {
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
}

export const deleteClassroom = async (req, res) => {
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
}