const mongoose = require('mongoose');


const ImageSchema = new mongoose.Schema({
  template: String,
  image: String
});


const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;