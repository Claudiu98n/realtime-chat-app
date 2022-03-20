const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  queryUserByEmail,
  queryCreateUser,
  queryUserByUsername,
  queryFindUsers,
} = require("../services/user.service");

const login = async (req, res) => {
  const { email, password } = req.body;

  const userWithEmail = await queryUserByEmail(email).catch((err) => {
    console.log("Error: ", err);
  });

  if (!userWithEmail) return res.status(400).json({ message: "Email or password does not match!" });

  bcrypt.compare(password, userWithEmail.password, (err, doesMatch) => {
    if (err) {
      console.log(err);
    }
    if (doesMatch) {
      const jwtToken = jwt.sign(
        { id: userWithEmail.id, email: userWithEmail.email },
        process.env.JWT_SECRET
      );
      res.json({
        message: "Welcome Back!",
        token: jwtToken,
        username: userWithEmail.username,
        id: userWithEmail.id,
      });
    } else {
      return res.status(400).json({ message: "Email or password does not match!" });
    }
  });
};

const register = async (req, res) => {
  const { username, email, password } = req.body;

  const alreadyExistsUserEmail = await queryUserByEmail(email).catch((err) => {
    console.log("Error: ", err);
  });

  const alreadyExistsUsername = await queryUserByUsername(username).catch((err) => {
    console.log("Error: ", err);
  });

  if (alreadyExistsUserEmail) {
    return res.status(409).json({ message: "User with this email already exists!" });
  }

  if (alreadyExistsUsername) {
    return res.status(409).json({ message: "User with this username already exists!" });
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const savedUser = await queryCreateUser(username, email, hash).catch((err) => {
    console.log("Error: ", err);
    res.status(500).json({ error: "Cannot register user at the moment!" });
  });

  if (savedUser) res.json({ message: "Thanks for registering" });
};

const getUsers = async (req, res) => {
  const userId = req.user.dataValues.id;

  let users = await queryFindUsers().catch((err) => {
    console.log("Error: ", err);
  });

  users = users.filter((user) => user.id !== userId);

  res.json(users);
};

module.exports = {
  login: login,
  register: register,
  getUsers: getUsers,
};
