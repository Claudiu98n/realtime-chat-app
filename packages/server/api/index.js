const express = require("express");

const userApi = require("./routes/user.routes");
const messageApi = require("./routes/message.routes");

const router = express.Router();

router.use("/auth", userApi);
router.use("/private", messageApi);

module.exports = router;
