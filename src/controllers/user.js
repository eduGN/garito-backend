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
    const existUsername = await User.findOne({ username: username });
    const existEmail = await User.findOne({ email: email });
    const existName = await User.findOne({ artist_name: artist_name });

    const errors = [];

    if (existName) {
      errors.push("artist name already exists");
    }
    if (existUsername) {
      errors.push("username already exists");
    }

    if (existEmail) {
      errors.push("email already exists");
    }

    if (errors.length > 0) {
      res.status(401).send(errors);
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
      twitter: "",
    };

    const user = new User({
      artist_name: artist_name,
      username: username,
      email: email,
      password: password,
      location: location,
      social: social,
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
    res.send({
      status: "ok",
      data: data,
      access_token: dataToken[0],
      expires_in: dataToken[1],
    });
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
      res.status(401).send("wrong username");
      return;
    }
    const validate = await user.isValidPassword(password);
    if (!validate) {
      res.status(401).send("wrong password");
      return;
    }

    const dataToken = authJWT.createToken(user);

    return res.send({
      status: "ok",
      data: user,
      access_token: dataToken[0],
      expires_in: dataToken[1],
    });
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

controller.updateProfilePic = async (req, res) => {
  const profilePic = req.body.profilePic;
  try {
    const profile = await User.findById(req.user._id);
    if (profile) {
      await User.findByIdAndUpdate(req.user._id, {
        profile_pic: profilePic,
      });

      const updatedProfile = await User.findById(req.user._id);
      res.status(200).send(updatedProfile);
    } else {
      console.log("we");
      res.status(400).send();
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

controller.getUsers = async (req, res) => {
  const location = req.query.location;
  const name = req.query.name;
  /* const genre = req.query.genre; */

  console.log(name);
  console.log(location);
  /* console.log(genre); */

  try {
    let query = { $and: [] };
    if (!name && !location) query = null;
    if (location && location=="all") query.$and.push({ location: new RegExp("", "i") });
    if (location && location!="all") query.$and.push({ location: new RegExp(location, "i") });
    if (name && name=="all") query.$and.push({ artist_name: new RegExp("", "i") });
    if (name && name!="all") query.$and.push({ artist_name: new RegExp(name, "i") });

    if(!query) {
      res.status(204).send("not users found")
      return
    }

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
    console.log(err)
    res.status(500).send(err);
  }
};

controller.getUser = async (req, res) => {
  const username = req.params.username;

  if (!username) {
    res.status(400).send("No has colocado un usuario");
    return;
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
    if (user) res.status(200).json(user);
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
      res.status(500).send(err);
    }
  } else {
    res.status(400).send("Falta parámetro o no es igual al usuario logeado");
  }
};

module.exports = controller;
