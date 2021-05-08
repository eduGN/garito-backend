const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlbumSchema = new Schema({

  name: { type: String, require: true },
  picture: String,
  releaseDate: Date,
  songs: [String] ,
  savedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const AlbumModels =  mongoose.model("album", AlbumSchema)
module.exports = AlbumModels;