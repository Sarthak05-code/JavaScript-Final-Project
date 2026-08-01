let io = null;

function setIO(socketIO) {
  io = socketIO;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.IO has not been initialized.");
  }

  return io;
}

module.exports = {
  setIO,
  getIO,
};