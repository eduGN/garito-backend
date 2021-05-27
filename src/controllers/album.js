const User = require("../models/user");
const Album = require("../models/album");
const joiAlbum = require("../validators/album");

const controller = {};

controller.addAlbum = async (req, res) => {
  let joiData = joiAlbum.validate(req.body);

  if (joiData.error) {
    const error = joiData.error.details;
    let errMessages = new Array();
    error.map((detail) => errMessages.push(detail.message));
    console.log(errMessages);
    res.status(400).send(errMessages);
    return;
  }

  const name = req.body.name;
  const picture = req.body.picture;
  const releaseDate = req.body.releaseDate;
  const songs = req.body.songs;

  try {
    const user = await User.findById(req.user._id);
    const albumToFind = await Album.findOne({
      name: name,
      releaseDate: releaseDate,
    });
    let discography = user.discography;
    const newAlbum = new Album({
      name: name,
      picture: picture,
      releaseDate: releaseDate,
      songs: songs,
    });

    console.log(user.discography);

    if (albumToFind) {
      await Album.findByIdAndUpdate(albumToFind._id, {
        picture: picture,
        songs: songs,
      });
    } else {
      await newAlbum.save();
      discography.push(newAlbum);
      await User.findByIdAndUpdate(req.user._id, {
        discography: discography,
      });
    }
    const updatedProfile = await User.findById(req.user._id).populate([
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
    res.status(200).send(updatedProfile);
  } catch (err) {
    res.status(500).send(err);
  }
};

controller.deleteAlbum = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(401).send("id not send");
    return;
  }

  try {
    const album = await Album.findById(id);
    if (!album) {
      res.status(401).send("album does not exists");
      return;
    }

    await Album.findByIdAndDelete(id);
    const updatedProfile = await User.findById(req.user._id).populate([
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
    res.status(200).send(updatedProfile);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = controller;
