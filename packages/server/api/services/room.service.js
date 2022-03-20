const { Room } = require("../../database/index");

const queryByName = async (name) => {
  return Room.findOne({ where: { name } });
};

const queryCreateRoom = async (name) => {
  return Room.create({ name });
};

module.exports = {
  queryByName: queryByName,
  queryCreateRoom: queryCreateRoom,
};
