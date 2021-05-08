const controller = {};
const Profile = require("../models/profile");

controller.saveProfile = async (req, res) => {
  let name = req.body.name;
  let birthdate = req.body.birthdate;
  let photo = req.body.photo;
  let job = req.body.job;
  let bio = req.body.bio;

  if (name && photo && birthdate && job && bio) {
    try {
      const profile = new Profile({
        name: name,
        photo: photo,
        birthdate: birthdate,
        job: job,
        bio: bio,
      });

      await profile.save();
      res.status(200).send(profile.toJSON());
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.status(400).send();
  }
};

controller.getProfile = async (req, res) => {
  let id = req.params.id;

  if (id) {
    try {
      const profile = await Profile.findById(id);
      res.json(profile);
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.status(400).send();
  }
};

controller.getProfiles = async (req, res) => {
  const filter = req.query.search;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  try {
    let query = {
      $or: [{ birthdate: { $gte: startDate, $lte: endDate } }],
    };

    if (!filter && !startDate && !endDate) query = {};

    if (filter) {
      query.$or.push({ name: new RegExp(filter, "i") });
      query.$or.push({ job: new RegExp(filter, "i") });
    }

    const profiles = await Profile.find(query);
    /*   const Profiles = await Profile.find({name: new RegExp(filter,"i")}); */
    res.json(profiles);
  } catch (err) {
    res.status(500).send(err);
  }
};

controller.updateProfile = async (req, res) => {
  let name = req.body.name;
  let birthdate = req.body.birthdate;
  let photo = req.body.photo;
  let job = req.body.job;
  let bio = req.body.bio;
  const id = req.params.id;

  if (name || photo || birthdate || job || bio) {
    try {
      const profile = await Profile.findById(id);
      if (profile) {
        await Profile.findByIdAndUpdate(id, {

          name: name,
          photo: photo,
          birthdate: birthdate,
          job: job,
          bio: bio,
          updatedAt: Date.now(),

        });

        const updatedProfile = await Profile.findById(id);
        res.status(200).send(updatedProfile);
      } else {
        console.log("we");
        res.status(400).send();
      }
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.status(400).send("Tienes que rellenar todos los campos");
  }
};

controller.deleteProfile = async (req, res) => {
  const id = req.params.id;

  if (id) {
    try {
      await Profile.findByIdAndDelete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).send();
    }
  } else {
    res.status(404).send();
  }
};

module.exports = controller;
