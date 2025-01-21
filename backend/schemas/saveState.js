const mongoose = require('mongoose');


const SaveStateSchema = new mongoose.Schema({
  template: String,
  changes: Object
});


const SaveState = mongoose.model('SaveState', SaveStateSchema);

module.exports = SaveState;