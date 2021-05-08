const mongoose = require("mongoose")
require("dotenv").config()

const uri = process.env.DB_URL

module.exports = mongoose.connect(uri,
{   useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify : false,
    useCreateIndex: true
})