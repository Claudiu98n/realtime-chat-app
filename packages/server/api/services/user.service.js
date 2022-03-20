const { User } = require("../../database/index");

const queryUserByEmail = async (email) => {
  return User.findOne({ where: { email } });
};

const queryUserByUsername = async (username) => {
  return User.findOne({ where: { username } });
};

const queryCreateUser = async (username, email, password) => {
  return User.create({ username, email, password });
};

const queryFindUsers = async () => {
  return User.findAll({
    attributes: {
      exclude: ["password", "updatedAt", "email"],
    },
  });
};

module.exports = {
  queryUserByEmail: queryUserByEmail,
  queryUserByUsername: queryUserByUsername,
  queryCreateUser: queryCreateUser,
  queryFindUsers: queryFindUsers,
};
