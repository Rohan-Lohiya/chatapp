const Chatdata = require("./model/Chatdata");
const notifyUserOnline = require("./controller/notifyuseronline");
const notifyUserOffline = require("./controller/notifyuseroffline");
// userMap: Maps Google email -> socket.id
// socketToUser: Maps socket.id -> Google email
// joinedRooms: Maps socket.id -> Set of room names (optional, for tracking rooms if needed)

const userMap = new Map();
const socketToUser = new Map();
const joinedRooms = new Map();
const totalchatusers = new Map();

module.exports = function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("✅ New client connected:", socket.id);

    const cleanup = () => {
      const userID = socketToUser.get(socket.id);
      if (userID) {
        userMap.delete(userID);
        socketToUser.delete(socket.id);
        joinedRooms.delete(socket.id);
        notifyUserOffline(userID, userMap, io);
        console.log(`🔴 Cleaned up: ${socket.id} (${userID})`);
      }
    };

    // Register user with their Google ID or email
    socket.on("register-user", async ({ googleIdOrEmail, imageURL, name }) => {
      if (!googleIdOrEmail) return;

      const existingSocketId = userMap.get(googleIdOrEmail);
      if (existingSocketId && existingSocketId !== socket.id) {
        console.log(`♻️ Replacing old connection for ${googleIdOrEmail}`);
        socketToUser.delete(existingSocketId);
        joinedRooms.delete(existingSocketId);
      }
      // Update maps
      userMap.set(googleIdOrEmail, socket.id);
      socketToUser.set(socket.id, googleIdOrEmail);

      // Either create or update the user's entry
      totalchatusers.set(googleIdOrEmail, {
        googleID: googleIdOrEmail,
        imageURL,
        name,
        socketID: socket.id,
      });
      const userData = await Chatdata.findOne({ myGoogleID: googleIdOrEmail });
      if (!userData) {
        const newUser = new Chatdata({
          myGoogleID: googleIdOrEmail,
          name: name,
          image: imageURL,
          friends: [],
          messages: [],
          onlineUsers: [],
        });
        await newUser.save();
      } else {
        // Optionally update name/image if user already exists
        userData.name = name;
        userData.image = imageURL;
        await userData.save();
      }
      await notifyUserOnline(googleIdOrEmail, userMap, io);
      socket.emit("registration-complete", { googleIdOrEmail });
      console.log(`🟢 Registered or updated ${googleIdOrEmail} → ${socket.id}`);
    });

    socket.on("add-friend", async ({ friendGoogleId, imageURL, name }) => {
      const fromGoogleId = socketToUser.get(socket.id);
      console.log("🔌 add-friend event received:", {
        fromGoogleId,
        fromSocket: socket.id,
        friendGoogleId,
        imageURL,
        name,
      });

      if (!fromGoogleId || !friendGoogleId) return;

      // Add friend to the user's list
      const userData = await Chatdata.findOne({ myGoogleID: fromGoogleId });
      const frienddata = await Chatdata.findOne({ myGoogleID: friendGoogleId });
      if (userData) {
        const alreadyFriend = userData.friends.some(
          (f) => f.GoogleID === friendGoogleId
        );
        if (!alreadyFriend) {
          userData.friends.push({
            name: name,
            GoogleID: friendGoogleId,
            image: imageURL,
          });
          await userData.save();

          frienddata.friends.push({
            name: userData.name,
            GoogleID: fromGoogleId,
            image: userData.image,
          });
          await frienddata.save();
          console.log(`👫 ${fromGoogleId} added ${friendGoogleId} as a friend`);
        } else {
          console.log(
            `⚠️ ${friendGoogleId} is already a friend of ${fromGoogleId}`
          );
        }
      }
    });

    // Send a message to a user via a unique room (sorted by both users' IDs)
    socket.on("send-to-user", async ({ userroom, message }) => {
      const fromGoogleId = socketToUser.get(socket.id);
      if (!fromGoogleId || !userroom || !message) return;

      const reciever = await Chatdata.findOne({ myGoogleID: userroom });
      const sender = await Chatdata.findOne({ myGoogleID: fromGoogleId });

      const recipientSocketId = userMap.get(userroom);

      if (recipientSocketId) {
        console.log("found reciever", recipientSocketId);
        io.to(recipientSocketId).emit("receive-message", {
          from: fromGoogleId,
          to: userroom,
          text: message,
          delivered: true,
          read: false,
          timestamp: Date.now(),
        });
        sender.messages.push({
          from: fromGoogleId,
          to: userroom,
          text: message,
          delivered: true,
          read: false,
          timestamp: Date.now(),
        });
        sender.save();
        // Optionally: store the message in DB here for later retrieval
        if (reciever) {
          reciever.messages.push({
            from: fromGoogleId,
            to: userroom,
            text: message,
            delivered: true,
            read: false,
            timestamp: Date.now(),
          });
          reciever.save();
        }
        console.log(`📨 ${fromGoogleId} → ${userroom}: ${message}`);
        console.log(userMap);
      } else {
        console.log(`❌ ${userroom} is offline or not connected`);

        if (reciever) {
          reciever.messages.push({
            from: fromGoogleId,
            to: userroom,
            text: message,
            delivered: false,
            read: false,
            timestamp: Date.now(),
          });
          reciever.save();
        }
        sender.messages.push({
          from: fromGoogleId,
          to: userroom,
          text: message,
          delivered: true,
          read: false,
          timestamp: Date.now(),
        });
        sender.save();
      }
    });

    // Optionally: join a specific room
    /*socket.on("join-room", ({ userroom }) => {
      const fromGoogleId = socketToUser.get(socket.id);
      if (!fromGoogleId || !userroom) return;

      const roomName = [fromGoogleId, userroom].sort().join("-");
      socket.join(roomName);

      if (!joinedRooms.has(socket.id)) {
        joinedRooms.set(socket.id, new Set());
      }
      joinedRooms.get(socket.id).add(roomName);

      console.log(`📥 ${fromGoogleId} joined room: ${roomName}`);
    });*/

    socket.on("disconnect", cleanup);
  });
};
