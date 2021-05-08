const User = require("../models/user");
const controller = {};

controller.addSocial = async (req, res) => {

    const youtube = req.body.youtube
    const spotify = req.body.spotify
    const facebook= req.body.facebook
    const instagram = req.body.instagram
    const web = req.body.web

    try {
        const profile = await User.findById(req.user._id);
        if (profile) {
                const social = {
                    youtube: youtube,
                    spotify: spotify,
                    facebook: facebook,
                    instagram: instagram,
                    web: web
                  }
                  await User.findByIdAndUpdate(req.user._id, {
                    social:social
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
}

module.exports = controller;
