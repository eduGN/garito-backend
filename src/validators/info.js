
const Joi = require("joi");
const Joistring = Joi.string().trim() 

const schema = Joi.object({

  genres : Joi.array().items(Joistring),
  bio: Joistring,
  members : Joi.array().items(Joistring.alphanum()),
  contact : {
      phone: Joi.number().integer().min(600000000).max(999999999),
      web: Joistring.pattern(/https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/i),
      address: Joistring.min(6)
  }

});


const validate = body => {

  return schema.validate({

    genres : body.genres,
    bio: body.bio,
    members : body.members,
    contact : body.contact

  } ,{ abortEarly: false });
}
module.exports = {validate};
