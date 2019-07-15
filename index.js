const express = require ('express')
require('./src/db/mongoose')
const User = require('./src/models/user')
const Task = require('./src/models/task')

const app = express()
const port = process.env.PORT || 3000

// this allows express to automatically parse incoming data into a json format
app.use(express.json()) 

app.post('/users', async (req, res) => {
   const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }

})

app.get('/users', async (req,res) => {
    
    try{
        const users = await User.find({})
        res.send(users)
    } catch(e) {
        res.status(500).send(e)
    }
})

app.get('/users/:id',  async (req, res) => {
    const _id = req.params.id


    try{
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch(e){
        res.status(500).send(e)
    }
})

app.patch('/users/:id', async(req ,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

app.get('/tasks', async (req, res) => {
    try{
        const task = await Task.find({})
        res.send(task)
    } catch(e) {
        res.status(500).send()
    }

    // Task.find({})
    //     .then(task => res.send(task))
    //     .catch(e => res.status(500).send())
})

app.patch('/tasks/:id', async(req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((updates) => allowedUpdates.includes(updates))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'})
    }
    
    try{
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch(e) {
        res.status(400).send(e)
    }
})

app.get('/tasks/:id', async (req,res) => {

    try{
        const task = await Task.findById(req.params.id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch(e){
        res.status(500).send()
    }
})

app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).send()
        }
        
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

app.delete('/tasks/:id', async (req,res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)

        if(!task) {
            return res.status(404).send()
        }
    res.send(task)

    } catch (e) {
        res.status(500).send()
    }
})

app.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

    try{
        await task.save()
        res.status(201).send(task)
    } catch(e) {
        res.status(400).send(err)
    }

})

app.listen(port, () => {
    console.log(`Server is set up on port ${port}`)
})

