import connect from '../db.js'
import mongo from 'mongodb'

export const getAllTimetables = async (req, res) => {
    let db = await connect()
    let cursor = await db.collection("timetables").find()
    let results = await cursor.toArray()
    res.json(results)
}

export const postTimetable = async (req, res) => {
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
}

export const putTimetable = async (req, res) => {
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
}

export const deleteInfoTimetable = async (req, res) => {
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
}

export const deleteTimetable = async (req, res) => {
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
}