const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const SchemaMongo = mongoose.Schema;

const Schema = new SchemaMongo({
  artist_name: { type: String, require: true, unique: true },

  username: { type: String, require: true, unique: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },

  type: { type: String, default: "artist" },
  info: { type: SchemaMongo.Types.ObjectId, ref: "info" },
  discography: [{ type: SchemaMongo.Types.ObjectId, ref: "album" }],
  location: { type: String, require: true},
  social: {
    youtube: String,
    spotify: String,
    facebook: String,
    instagram: String,
    gmail : String,
    twitch: String,
    web:String
  },
  photos : [String],
  savedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

Schema.pre("save", async function (next) {
  try {
    const user = this;
    const hash = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
    user.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

Schema.methods.isValidPassword = async function (password) {
  const compare = await bcrypt.compare(password, this.password);
  return compare;
};

module.exports = mongoose.model("users", Schema);
