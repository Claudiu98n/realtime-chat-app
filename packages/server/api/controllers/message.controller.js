const { queryByRoom } = require("../services/message.service");
const { queryByName } = require("../services/room.service");

const getMessages = async (req, res) => {
  const { room } = req.query;

  const dbRoom = await queryByName(room).catch((err) => {
    console.log("Error: ", err);
  });;

  const messages = await queryByRoom(dbRoom.id).catch((err) => {
    console.log("Error: ", err);
  });;

  res.json(messages);
};

module.exports = {
  getMessages: getMessages,
};
