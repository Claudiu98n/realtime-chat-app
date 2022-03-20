const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: "db",
  dialect: "postgres",
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected successfully to database.");
  } catch (error) {
    console.error("Connection to databse failed:", error);
  }
})();

// Create Models
const { MessageModel } = require("../api/models/message.model");
const Message = MessageModel(sequelize);

const { RoomModel } = require("../api/models/room.model");
const Room = RoomModel(sequelize);

const { UserModel } = require("../api/models/user.model");
const User = UserModel(sequelize);

// Define the relationships between the entities

Room.hasMany(Message);
Message.belongsTo(Room);

User.hasOne(Message);
Message.belongsTo(User);

sequelize.sync().then(() => {
  console.log(`All tables synced!`);
});

module.exports = {
  Message,
  Room,
  User,
};
