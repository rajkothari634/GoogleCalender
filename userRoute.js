const express = require("express");
// const userController = require("./../controllers/userController");
const authController = require("./authController");
const router = express.Router();

router.get("/sendLink", authController.sendLink);
//router.post("/signup", authController.signUp);

//router.post('/login', authController.login);

// router
//   .route("/")
//   .get(userController.getAllUsers)
//   .post(userController.createUser);
// router
//   .route("/:id")
//   .get(userController.getUser)
//   .patch(userController.updateUser);

module.exports = router;
