const { codeBlockSchema } = require("./model.js");
const {resetCode} = require('./service.js');

const rooms = {}; // To track mentors and students for each room

const handleSockets = (io) => {
  io.on("connection", (socket) => {

    socket.on("join-room", (codeBlockId) => {
      socket.join(codeBlockId); // Join the room
      if (!rooms[codeBlockId]) {
        // Initialize room if not already created
        rooms[codeBlockId] = {
          mentor: null,
          students: [],
        };
      }

      // Check if a mentor is already assigned
      if (!rooms[codeBlockId].mentor) {
        rooms[codeBlockId].mentor = socket.id; // Assign the first user as the mentor
        socket.emit("role-assigned", "mentor");
      } else {
        // Add the new client as a student
        rooms[codeBlockId].students.push(socket.id);
        socket.emit("role-assigned", "student");
        io.to(codeBlockId).emit(
          "students-count",
          rooms[codeBlockId].students.length
        ); // Emit updated student count
      }

    });

    // Handle code changes and notify the room
    socket.on("code-change", (newCode, codeBlockId) => {
      socket.to(codeBlockId).emit("code-update", newCode);
    });

    // Handle code evaluation
    socket.on("evaluate-code", async ({ code, codeBlockId }) => {
      try {
        const codeBlock = await codeBlockSchema.findOne({ id: codeBlockId });
        const passed = code.trim() === codeBlock.solution.trim();
        io.in(codeBlockId).emit("evaluation-result", { passed });
      } catch (error) {
        socket.emit("evaluation-result", { passed: false });
      }
    });

    // Handle client disconnect
    socket.on("disconnect", () => {
      for (const [codeBlockId, room] of Object.entries(rooms)) {
        if (room.mentor === socket.id) {
          // If mentor leaves, notify all students to leave the room
          room.students.forEach((studentId) => {
            io.to(studentId).emit("mentor-left");
          });

          // Clean up the room
          delete rooms[codeBlockId];

          //inititate the code
          resetCode(codeBlockId);
        } else if (room.students.includes(socket.id)) {
          // If a student leaves, just remove them from the list
          room.students = room.students.filter(
            (studentId) => studentId !== socket.id
          );
          io.to(codeBlockId).emit("students-count", room.students.length); // Update student count
        }
      }
    });
  });
};

module.exports = handleSockets;
