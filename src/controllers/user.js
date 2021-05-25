const controller = {};
const User = require("../models/user");
const Album = require("../models/album");
const Member = require("../models/member");
const Info = require("../models/info");
const joiSignup = require("../validators/signup");
const joiLogin = require("../validators/login");
const authJWT = require("../auth/jwt");

controller.signup = async (req, res) => {
  let joiData = joiSignup.validate(req.body);

  if (joiData.error) {
    const error = joiData.error.details;
    let errMessages = new Array();
    error.map((detail) => errMessages.push(detail.message));
    console.log(errMessages);
    res.status(400).send(errMessages);
    return;
  }

  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const artist_name = req.body.artist_name;
  const location = req.body.location;

  try {
    const existUsername = await User.findOne({ email: username });
    const existEmail = await User.findOne({ email: email });

    if (existUsername || existEmail) {
      res.status(401).send("Usuario ya existe");
      return;
    }
    const social = {
      youtube: "",
      spotify: "",
      facebook: "",
      instagram: "",
      twitch: "",
      web: "",
      soundcloud: "",
      twitter:""
    };

    const user = new User({
      artist_name: artist_name,
      username: username,
      email: email,
      password: password,
      location: location,
      social: social
    });
    await user.save();
    const data = await User.findOne({ username: username }).populate([
      {
        path: "info",
        model: "info",
        populate: {
          path: "members",
          model: "member",
        },
      },
      {
        path: "discography",
        model: "album",
      },
    ]);
    const dataToken = authJWT.createToken(user);
    res.send({ status: "ok", data: data, access_token:dataToken[0], expires_in: dataToken[1]});
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

controller.login = async (req, res) => {
  let joiData = joiLogin.validate(req.body);

  if (joiData.error) {
    const error = joiData.error.details;
    let errMessages = new Array();
    error.map((detail) => errMessages.push(detail.message));
    console.log(errMessages);
    res.status(400).send(errMessages);
    return;
  }

  const username = req.body.username;
  const password = req.body.password;

  try {
    const user = await User.findOne({ username: username }).populate([
      {
        path: "info",
        model: "info",
        populate: {
          path: "members",
          model: "member",
        },
      },
      {
        path: "discography",
        model: "album",
      },
    ]);

    if (!user) {
      res.status(401).send("Usuario no existe en la base de datos");
      return;
    }
    const validate = await user.isValidPassword(password);
    if (!validate) {
      res.status(401).send("Contraseña Incorrecta");
      return;
    }

    const dataToken = authJWT.createToken(user);

    return res.send({ status: "ok", data: user, access_token:dataToken[0], expires_in: dataToken[1]});
  } catch (err) {
    console.log(err);
    res.status(401).send("Error");
    return;
  }
};

controller.userDetail = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate([
      {
        path: "info",
        model: "info",
        populate: {
          path: "members",
          model: "member",
        },
      },
      {
        path: "discography",
        model: "album",
      },
    ]);

    res.send({ status: "ok", data: user });
  } catch (error) {
    res.status(500).send("Error");
  }
};

controller.getUsers = async (req, res) => {
  const location = req.query.location;
  const name = req.query.name;

  console.log(name);
  console.log(location);

  try {
    let query = { $or: [] };
    if (!name && !location) query = {};
    if (location) query.$or.push({ location: new RegExp(location, "i") });
    if (name) query.$or.push({ artist_name: new RegExp(name, "i") });

    console.log("query", query);

    const users = await User.find(query).populate([
      {
        path: "info",
        model: "info",
        populate: {
          path: "members",
          model: "member",
        },
      },
      {
        path: "discography",
        model: "album",
      },
    ]);
    console.log(users);
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send(err);
  }
};

controller.getUser = async (req, res) => {
  const username = req.params.username;

  console.log(username);

  if (!username) {
    res.status(400).send("No has colocado un usuario");
    return
  } 

  try {
    const user = await User.findOne({ username: username }).populate([
      {
        path: "info",
        model: "info",
        populate: {
          path: "members",
          model: "member",
        },
      },
      {
        path: "discography",
        model: "album",
      },
    ]);
   if(user) res.status(200).json(user);
   else res.status(401).send("Error");
    
  } catch (err) {
    res.status(500).send(err);
  }
};

controller.deleteUser = async (req, res) => {
  const username = req.params.username;

  if (username && username == req.user.username) {
    try {
      const user = await User.findById(req.user._id).populate([
        {
          path: "info",
          model: "info",
          populate: {
            path: "members",
            model: "member",
          },
        },
        {
          path: "discography",
          model: "album",
        },
      ]);

      if (user.discography) {
        user.discography.forEach(async (album) => {
          try {
            await Album.findByIdAndDelete(album._id);
          } catch (err) {
            res.status(500).send(err);
          }
        });
      }

      if (user.info && user.info.members) {
        user.info.members.forEach(async (member) => {
          try {
            await Member.findByIdAndDelete(member._id);
          } catch (err) {
            res.status(500).send(err);
          }
        });
      }

      if (user.info) {
        await Info.findByIdAndDelete(user.info._id);
      }

      await User.findByIdAndDelete(user._id);

      res.status(204).send("Se ha eliminado todo");
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  } else {
    res.status(400).send("Falta parámetro o no es igual al usuario logeado");
  }
};

module.exports = controller;
