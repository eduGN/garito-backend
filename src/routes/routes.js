const express = require("express");
const router = express.Router();
const userController = require("../controllers/user")
const infoController = require("../controllers/info")
const memberController = require("../controllers/member")
const albumController = require("../controllers/album")
const socialController = require("../controllers/social")

/* const profileController = require("../controllers/profile") */
const passport = require("../auth/auth")

//Profile
/* router.post("/profile", profileController.saveProfile)
router.get("/profile", profileController.getProfiles)
router.get("/profile/:username", profileController.getProfile)
router.put("/profile/:id", profileController.updateProfile)
router.delete("/profile/:id", profileController.deleteProfile) */



//Users

router.get("/artist/:username", userController.getUser)
router.get("/artist", userController.getUsers)

// Auth
router.post("/signup", userController.signup)
router.post("/login", userController.login)
router.get("/", passport.auth, userController.userDetail)

// Info
 router.put("/:username/info", passport.auth, infoController.addInfo) 


// Member
 router.put("/:username/member", passport.auth, memberController.addMember) 


 // Discography
 router.put("/:username/album", passport.auth, albumController.addAlbum) 

 // Discography
 router.put("/:username/social", passport.auth, socialController.addSocial) 

 //Delete
 router.delete("/:username/delete", passport.auth, userController.deleteUser) 



module.exports = router; 

