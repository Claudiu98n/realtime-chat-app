const express = require("express");
const router = express.Router();
const passport = require("passport");

const { login, register, getUsers } = require("../controllers/user.controller");

router.post("/public/signin", login);
router.post("/public/signup", register);

router.get("/private/users", passport.authenticate("jwt", { session: false }), getUsers);

module.exports = router;
