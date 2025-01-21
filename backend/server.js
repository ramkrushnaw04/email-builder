const express = require('express')
const path = require('path')
const cors = require('cors')
const mongoose = require('mongoose');
const {convert} = require('./templateConverter')
require('dotenv').config();
convert('template1.html', {})

app = express()
app.use(express.json());
app.use(cors({
    origin: '*'
}))


const SaveState = require('./schemas/saveState')

mongoose.connect(process.env.DB_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Connection error:', error));


app.get('/getEmailLayput', (req, res) => {
    res.sendFile(path.join(__dirname) + `/templates/${req.query.template}.html`)
})


app.post('/renderAndDownloadTemplate', (req, res) => {
    const changes = req.body.changes
    const template = req.body.template

    const updatedTemplateText = convert(template, changes)
    res.send(updatedTemplateText)
})


app.post('/uploadEmailConfig', async (req, res) => {
    const changes = req.body.changes
    const template = req.body.template

    await SaveState.findOneAndUpdate(
        {template},
        {changes},
        { new: false, upsert: true }
    )
    res.status(201)

})


app.get('/getSavedChanges', async (req, res) => {
    const template = req.query.template
    const saveState = await SaveState.findOne({template})
    const response = {
        changes: saveState.changes
    }
    res.json(response)
})


app.get('/loadTemplateWithChanges', async (req, res) => {
    const template = req.query.template
    const saveState = await SaveState.findOne({template})

    const updatedTemplateText = convert(template, saveState.changes)
    res.json({
        updatedTemplateText,
        changes: saveState.changes
    })
})






app.listen((process.env.PORT || 3000), () => {
    console.log('running...')
})