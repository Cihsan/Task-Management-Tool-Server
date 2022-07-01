const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const express = require('express')
const cors = require('cors') //support diffrent port
require('dotenv').config()// for envirment variable
const port = process.env.PORT || 5000
const app = express()
const jwt = require('jsonwebtoken');
const { query } = require('express');
app.use(cors()) //
app.use(express.json()) //for parse
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
        const doneTodos = client.db("dbdoneTodos").collection("doneTodosCollection");

        app.post('/to-do', async (req, res) => {
            const body = req.body
            const result = await allTodos.insertOne(body);
            res.send({ result: 'added' })
        })
        //projects
        app.get('/to-do', async (req, res) => {
            const query = {}
            const cursor = allTodos.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.delete('/to-do/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await allTodos.deleteOne(query)
            res.send(result)
        })
        app.get('/to-do/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await allTodos.findOne(query)
            res.send(result)
        })


        // edit
        /* app.put('/to-do/:id', async (req, res) => {
            const id = req.params.id
            const edited = req.body
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    title: edited.title,
                }
            }
            const result = await allTodos.updateOne(filter, updateDoc, options)
            res.send(result)
        }) */
//status update
        app.put('/to-do/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true }
            const updateDoc = {
                $set: { status: 'done' },
            };
            const result = await allTodos.updateOne(filter, updateDoc, options);
            const result1 = await doneTodos.updateOne(filter, updateDoc, options);
            res.send(result);
        })
        app.get('/to-do-done', async (req, res) => {
            const query = {}
            const cursor = doneTodos.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        //query complete task
        /* app.get('/to-do', async (req, res) => {
            const status = req.query.status;
            const query = { status: status };
            const result = await allTodos.find(query).toArray()
            res.send(result);
        }); */
        /* 
        
        http://localhost:5000/to-do?status=${status}


        
        */
    }
    finally {
        //await client.close()
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Show Here ${port}`)
})

