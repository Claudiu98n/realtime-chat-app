const express = require("express");
const router = express.Router();
const passport = require("passport");

const { getMessages } = require("../controllers/message.controller");

router.get("/messages", passport.authenticate("jwt", { session: false }), getMessages);

module.exports = router;
