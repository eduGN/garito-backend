const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InfoSchema = new Schema({
  genres: [String],
  bio: String,
  members: [{ type: Schema.Types.ObjectId, ref: "member" }],
  contact: {
    phone: String,
    web: String,
    address: String, 
    message: String,
    email: String
  },
  savedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const InfoModels = mongoose.model("info", InfoSchema)
module.exports = InfoModels;
