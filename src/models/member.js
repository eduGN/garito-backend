const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MemberSchema = new Schema({

  name: { type: String, require: true },
  picture: String,
  role: String,
  savedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  
});

const MemberModels = mongoose.model("member", MemberSchema);

module.exports = MemberModels;
