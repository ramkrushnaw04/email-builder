const express = require('express')
const path = require('path')
const cors = require('cors')
const mongoose = require('mongoose');
const fs = require('fs')
const {convert} = require('./templateConverter')
require('dotenv').config();

app = express()
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL
}))

const port = process.env.PORT || 3000;


const SaveState = require('./schemas/saveState')
const Image = require('./schemas/image')

mongoose.connect(process.env.DB_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Connection error:', error));


app.get('/getEmailLayput', (req, res) => {
    res.sendFile(path.join(__dirname) + `/templates/${req.query.template}`)
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
    res.status(201).send()

})


app.get('/getSavedChanges', async (req, res) => {
    const template = req.query.template
    const saveState = await SaveState.findOne({template})
    const response = {
        changes: saveState?.changes
    }
    res.json(response)
})


app.get('/loadTemplateWithChanges', async (req, res) => {
    const template = req.query.template
    const saveState = await SaveState.findOne({template})

    const updatedTemplateText = convert(template, saveState?.changes)
    res.json({
        updatedTemplateText,
        changes: saveState.changes
    })
})




app.get('/getTemplates', async (req, res) => {
    const directoryPath = path.join(__dirname) + `/templates/`
    
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            res.send([])
        }
        res.send(files)
      });
})


app.post('/uploadImage', async (req, res) => {
    // const template = req.body.template
    // const image = req.body.image 

    const img = new Image(req.body)
    await img.save();
    res.status(400)
})


app.get('/getImagesOfTemplate', async (req, res) => {
    const template = req.query.template
    let images = await Image.find({template})
    images = images.map(item => item.image)
    res.send(images)
})

app.post('/deleteImage', async (req, res) => {
    const image = req.body.image
    await Image.deleteOne({
        image
    })
    res.status(204).send()
})


app.get('/test', (req, res) => {
    setTimeout(() => {
        res.send('MailCraft Server is running...')
        
    }, 2000);
})

app.listen(port, () => {
    console.log('running...')
})