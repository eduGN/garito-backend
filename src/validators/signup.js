
const Joi = require("joi");
const Joistring = Joi.string().trim() 

const schema = Joi.object({

  username : Joistring.min(4).required(),
  password: Joistring.min(6).max(300).required(),
  email : Joistring.email().required(),
  artist_name : Joistring.min(1).required(),
  location : Joistring.min(3).required()

});


const validate = body => {

  return schema.validate({

    username : body.username,
    password : body.password,
    email : body.email,
    artist_name : body.artist_name,
    location : body.location

  } ,{ abortEarly: false });
}
module.exports = {validate};
