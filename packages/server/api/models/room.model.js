const { DataTypes } = require("sequelize");

module.exports.RoomModel = (sequelize) => {
   return sequelize.define("Room", {
      name: {
         type: DataTypes.STRING,
         allowNull: false,
         unique: true,
      },
   });
};
