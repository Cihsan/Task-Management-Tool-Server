import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import express, { urlencoded, json } from 'express';
import cors from 'cors'; //support diffrent port
const port = process.env.PORT || 5000
const app = express()
// const { query } = require('express');
app.use(urlencoded({ extended: true }))

app.use(cors()) //
app.use(json()) //for parse
//task
//8IndB2m6lfSc1Dbq

app.get('/', (req, res) => {
    res.send('Welcome To Task Management Tool Server')
})

const uri = `mongodb+srv://task:8IndB2m6lfSc1Dbq@cluster0.tdenfti.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect()

        const allTodos = client.db("dbToDo").collection("dbToDoCollection");
        const doneTodos = client.db("dbToDo").collection("doneTodosCollection");

        // localhost:5000/to-do/id
        app.get('/to-do/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await allTodos.findOne(query)
            res.send(result)
        })
        
        app.post('/to-do', async (req, res) => {
            const body = req.body
            const result = await allTodos.insertOne(body);
            res.send({ result: 'added' })
        })
        app.get('/to-dos', async (req, res) => {
            const {name,address} = req.query
            console.log(name, address)
            res.send({ result: 'to-dos' })
        })
        //projects

        app.get('/to-do', async (req, res) => {
            const query = {}
            console.log(query)
            const cursor = allTodos.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        
        app.delete('/to-do/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await allTodos.deleteOne(query)
            res.send(result)
        })
        
        //status update from green
        app.put('/to-dos/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true }
            const updateDoc = {
                $set: { status: 'done' },
            };
            const result = await allTodos.updateOne(filter, updateDoc, options);
            res.send(result);
        })
        
        //update task
        app.put('/to-do/:id', async (req, res) => {
            const id = req.params.id;
            const task = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    taskName: task.taskName,
                }
            };
            const result = await allTodos.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        // get updated status
        app.get('/to-do-done', async (req, res) => {
            const status = req.query.status;
            const query = { status: done };
            const result = await doneTodos.find(query).toArray()
            res.send(result);
        })
    }
    finally {
        //await client.close()
    }
}
run().catch(console.dir);
// run().catch(console.dir);

app.listen(port, () => {
    console.log(`Show Here ${port}`)
})

