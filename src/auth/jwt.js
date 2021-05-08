const authJWT = {};

const JWT = require("jsonwebtoken");
const moment = require("moment");
const config = require("../config");

authJWT.createToken = (user) => {
  let exp_token = moment().add(7, "days").unix();
  console.log(config.secret)
  return [
    JWT.sign(
      {
        sub: user._id,
        iat: moment().unix(),
        exp: exp_token,
      },
      config.secret
    ),
    exp_token,
  ];
};

module.exports = authJWT;
