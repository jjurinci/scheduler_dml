import connect from '../db.js'
import mongo from 'mongodb'

export const getAllSchedules = async (req, res) => {
    let db = await connect()
    let cursor = await db.collection("schedules").find()
    let results = await cursor.toArray()
    res.json(results)
}

export const postSchedule = async (req, res) => {
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
}

export const patchSchedule = async (req, res) => {
    let doc = req.body;
    delete doc._id;
    let id = req.params.id;
    let db = await connect();

    let result = await db.collection('schedules').updateOne(
        { _id: mongo.ObjectId(id) },
        {
            $set: {
                'start': doc.start,
                'end': doc.end,
                'body.startHHmm': doc.body.startHHmm,
                'body.endHHmm': doc.body.endHHmm
            }
        }
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
}

export const putSchedule = async (req, res) => {
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
}

export const deleteSchedule = async (req, res) => {
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
}