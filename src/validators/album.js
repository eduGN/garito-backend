
const Joi = require("joi");
const Joistring = Joi.string().trim() 

const schema = Joi.object({

  name : Joistring.min(1).required(),
  picture: Joistring,
  releaseDate : Joi.date(),
  songs : Joi.array().items(Joistring.min(1))

});


const validate = body => {

  return schema.validate({

  name : body.name,
  picture: body.picture,
  releaseDate : body.releaseDate,
  songs : body.songs

  } ,{ abortEarly: false });
}
module.exports = {validate};
