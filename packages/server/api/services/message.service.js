const { Message } = require("../../database/index");

const queryByRoom = async (RoomId) => {
  return Message.findAll({ where: { RoomId } });
};

const queryCreateMessage = async (text, RoomId, UserId) => {
  return Message.create({ text, RoomId, UserId });
};

module.exports = {
  queryByRoom: queryByRoom,
  queryCreateMessage: queryCreateMessage,
};
