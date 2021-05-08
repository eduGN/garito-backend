
const Joi = require("joi");
const Joistring = Joi.string().trim() 

const schema = Joi.object({

  username : Joistring.min(4).required(),
  password : Joistring.min(6).max(30).required()

});


const validate = body => {

  return schema.validate({

    username : body.username,
    password : body.password

  } ,{ abortEarly: false });
}
module.exports = {validate};
