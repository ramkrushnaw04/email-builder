const fs = require('fs')
const path = require('path')
const { JSDOM } = require('jsdom');

function convert(template, changes) {
    const templatePath = path.join(__dirname, 'templates/'+template)
    const data = fs.readFileSync(templatePath, 'utf8');

    const dom = new JSDOM(data);
    const document = dom.window.document;


    const ids = Object.keys(changes)

    for (const id of ids) {
        const element = document.getElementById(id)
        if(!element) continue
        const properties = changes[id]
        const keys = Object.keys(properties)

        for (const property of keys) {

            if (property === 'innerText') {
                element.textContent = String(properties[property]);
            } else {
                element[property] = String(properties[property]);
            }

        }
    }

    const updatedHtml = dom.serialize();
    return updatedHtml
}

module.exports = {convert}