const { DataTypes } = require("sequelize");

module.exports.MessageModel = (sequelize) => {
  return sequelize.define("Message", {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
