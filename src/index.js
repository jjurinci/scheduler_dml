import express from 'express';
import cors from 'cors'
import connect from './db.js'
import mongo from 'mongodb'

var bodyParser = require('body-parser')
const app = express() 
const port = process.env.PORT || 3000;
app.use(cors())
app.get('/', (req, res) => res.send('Hello World, ovaj puta preko browsera!'))
app.listen(port, () => console.log(`Slušam na portu ${port}!`))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/semesters', async (req, res) => {
    let db = await connect() 
    let cursor = await db.collection("semesters").find()
    //console.log(cursor)
    let results = await cursor.toArray()
    res.json(results)
})

app.get('/professors', async (req, res) => {
    let db = await connect()
    let cursor = await db.collection("professors").find()
    let results = await cursor.toArray()
    res.json(results)
})

app.get('/schedules', async (req, res) => {
    let db = await connect()
    let cursor = await db.collection("schedules").find()
    let results = await cursor.toArray()
    res.json(results)
})

app.get('/classrooms', async (req, res) => {
    let db = await connect()
    let cursor = await db.collection("classrooms").find()
    let results = await cursor.toArray()
    res.json(results)
})

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
            id: result.upsertedId ,
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

app.delete('/semesters/:id', async (req, res) => {
    let db = await connect();
    let id = req.params.id;
    let result = await db.collection('semesters').deleteOne(
        { _id: mongo.ObjectId(id) }
    );
    if (result.deletedCount == 1) {
        res.statusCode = 201;
        res.json({status: 'success'});
    } else {
        res.statusCode = 404;
        res.json({
            status: 'fail',
        });
    }
});

app.delete('/professors/:id', async (req, res) => {
    let db = await connect();
    let id = req.params.id;
    let result = await db.collection('professors').deleteOne(
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

app.delete('/classrooms/:id', async (req, res) => {
    let db = await connect();
    let id = req.params.id;
    let result = await db.collection('classrooms').deleteOne(
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

app.post('/login', async (req, res) => {
    let db = await connect()
    let cursor = await db.collection("users").find()
    let results = await cursor.toArray()
    res.json(results)
})

app.post('/register', async (req, res) => {
    let db = await connect()
    let cursor = await db.collection("users").find()
    let results = await cursor.toArray()
    res.json(results)
})