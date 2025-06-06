// socket/io.js

let ioInstance = null;

function setIo(io) {
  ioInstance = io;
}

function getIo() {
  if (!ioInstance) {
    throw new Error("Socket.io has not been initialized yet");
  }
  return ioInstance;
}

module.exports = { setIo, getIo };
