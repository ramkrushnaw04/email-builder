express = require('express')
path = require('path')
cors = require('cors')
const {convert} = require('./templateConverter')

convert('template1.html', {})

app = express()
app.use(express.json());

app.use(cors())

app.get('/getEmailLayput', (req, res) => {
    res.sendFile(path.join(__dirname) + `/templates/${req.query.template}.html`)
})


app.post('/renderAndDownloadTemplate', (req, res) => {
    // console.log(req.body)
    const updatedTemplateText = convert(req.body.template, req.body.changes)
    res.send(updatedTemplateText)
})




app.listen(3000, () => {
    console.log('running...')
})