
const Joi = require("joi");
const Joistring = Joi.string().trim() 

const schema = Joi.object({

  name : Joistring.min(3).required(),
  picture : Joistring,
  role : Joistring.min(4)

});


const validate = body => {

  return schema.validate({
  name : body.name,
  picture : body.picture,
  role : body.role

  } ,{ abortEarly: false });
}
module.exports = {validate};
