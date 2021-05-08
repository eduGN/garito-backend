const User = require("../models/user");
const Info = require("../models/info");
const joiInfo = require("../validators/info")

const controller = {};

controller.addInfo = async (req, res) => {

    const genres = req.body.genres
    const bio = req.body.bio
    const members = req.body.members
    const contact = req.body.contact

    let joiData = joiInfo.validate(req.body)

    if(joiData.error){

      const error = joiData.error.details
      let errMessages = new Array()
      error.map(detail => errMessages.push(detail.message))
      console.log(errMessages)
      res.status(400).send(errMessages) 
      return
   }
  

    try {
        const profile = await User.findById(req.user._id);
        if (profile) {
            if (!profile.info) {
                const info = new Info({
                    genres: genres,
                    members: members,
                    contact: contact,
                    bio: bio,
                  });
                  await info.save();
                  await User.findByIdAndUpdate(req.user._id, {
                    info:info
                   });
                  
            } else  {

                await Info.findByIdAndUpdate(req.user.info, {
                    genres: genres,
                    members: members,
                    contact: contact,
                    bio: bio,
                   });
            }


          const updatedProfile = await User.findById(req.user._id).populate([
            {
            path:'info',
            model:'info',
            populate: {
              path:'members',
              model:'member'
            }
          },
          {
           path:'discography',
           model:'album',
         }]);
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
