
const Member = require("../models/member");
const Info = require("../models/info");
const User = require("../models/user");
const joiMember = require("../validators/member")

const controller = {};

controller.addMember = async (req, res) => {

   

    let joiData = joiMember.validate(req.body)

    if(joiData.error){
  
      const error = joiData.error.details
      let errMessages = new Array()
      error.map(detail => errMessages.push(detail.message))
      console.log(errMessages)
      res.status(400).send(errMessages) 
      return
   }

   const name = req.body.name
   const picture = req.body.picture
   const role = req.body.role

   
        try {
            
            const member = await Member.find({name:name})
            console.log(member)
            const info = await Info.findById(req.user.info);
            console.log(info)
            if (info && !member[0]) {
                  
                const member = new Member({
                    name: name,
                    picture: picture,
                    role: role
                  });
            
                  await member.save();

              let members = info.members
              members.push(member)    
    
              await Info.findByIdAndUpdate(req.user.info, {
                members: members
              });
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
             }])
              res.status(200).send(updatedProfile);
      
            } if (info && member[0]){

               await Member.findByIdAndUpdate(member[0]._id, {
                name: name,
                picture: picture,
                role: role
              });
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
             }])
              res.status(200).send(updatedProfile);

            }else {
              console.log("we");
              res.status(400).send("Añade primero información");
            }
          } catch (err) {
            res.status(500).send(err);
          }
    
}

module.exports = controller;
