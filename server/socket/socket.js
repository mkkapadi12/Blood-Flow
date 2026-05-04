const { Server } = require("socket.io");

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Global room for all dispatchers
    socket.on("join-dispatcher", () => {
      socket.join("dispatchers");
      console.log(`Socket ${socket.id} joined dispatchers room`);
    });

    // Global room for specific requester
    socket.on("join-requester", (userId) => {
      if (!userId) return;
      socket.join(`requester_${userId}`);
      console.log(`Socket ${socket.id} joined room requester_${userId}`);
    });

    socket.on("join-request", (requestId) => {
      if (!requestId) return;
      const room = `request_${requestId}`;
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
    });

    socket.on("leave-request", (requestId) => {
      if (!requestId) return;
      const room = `request_${requestId}`;
      socket.leave(room);
      console.log(`Socket ${socket.id} left room ${room}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

// Global Notification System Helpers
const notifyNewRequest = (request) => {
  if (!io) return;
  io.to("dispatchers").emit("new_request", request);
};

const notifyRequestUpdate = (request) => {
  if (!io) return;
  const payload = {
    requestId: request._id,
    status: request.status,
    request,
  };
  // Notify specific request room (if viewing details)
  io.to(`request_${request._id}`).emit("status_update", payload);
  
  // Notify specific requester globally
  if (request.requester) {
    const requesterId = request.requester._id || request.requester;
    io.to(`requester_${requesterId}`).emit("status_update", payload);
  }
  
  // Notify dispatchers globally (to update their lists)
  io.to("dispatchers").emit("status_update", payload);
};

const notifyArrived = (request) => {
  if (!io) return;
  const payload = {
    requestId: request._id,
    status: request.status,
    deliveryPin: request.deliveryPin,
    request,
  };
  // Notify specific request room
  io.to(`request_${request._id}`).emit("arrival_update", payload);
  
  // Notify specific requester globally
  if (request.requester) {
    const requesterId = request.requester._id || request.requester;
    io.to(`requester_${requesterId}`).emit("arrival_update", payload);
  }
};

const notifyLocationUpdate = (dispatcherId, lat, lng) => {
  if (!io) return;
  io.to("dispatchers").emit("dispatcher_location_update", {
    dispatcherId,
    lat,
    lng,
  });
};

module.exports = { 
  initSocket, 
  getIO, 
  notifyNewRequest, 
  notifyRequestUpdate, 
  notifyArrived,
  notifyLocationUpdate,
};
