import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Controlled as CodeMirror } from "react-codemirror2";
import { debounce } from "lodash";
import io from "socket.io-client";
import MonacoEditor from "@monaco-editor/react";
import { subjectsList } from "../utils/subjectList";


export const BlockCode = () => {
  const [code, setCode] = useState("");
  const [role, setRole] = useState(""); // 'mentor' or 'student'
  const [studentsCount, setStudentsCount] = useState(0);
  const [showSmiley, setShowSmiley] = useState(false);
  const [socket, setSocket] = useState(null);


  let codeBlockId = useParams(); // Capture the code block ID from URL
  codeBlockId = codeBlockId.blockcodeId;
  const currentBlock = subjectsList.find(
    (item) => item.id === parseInt(codeBlockId)
  );

  const fetchData = async () => {
    try {
      const res = await fetch(
        `https://online-coding-platform.onrender.com/blockcode/${codeBlockId}`
      );
      if (res.status !== 200) {
        return alert("can not get codeBlock data");
      }
      const serialized_res = await res.json();
      setCode(serialized_res.code);
    } catch (error) {
      alert("could not get blockCode");
    }
  };

  const updateCodeBlock = async (newCode) => {
    try {
      const res = await fetch(
        `https://online-coding-platform.onrender.com/blockcode/${codeBlockId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: newCode }), // Send the new code as the body
        }
      );

      if (res.status !== 200) {
        alert("Failed to update the code block");
      }
    } catch (error) {
      alert("Could not update the blockCode");
    }
  };

  useEffect(() => {

    const socket = io("https://online-coding-platform.onrender.com", { transports: ["websocket"] })
    setSocket(socket);

    fetchData();

    // Listen for role assignment (mentor/student)
    socket.on("role-assigned", (role) => {
      setRole(role);
    });

    // Listen for real-time code updates
    socket.on("code-update", (newCode) => {
      setCode(newCode); 
    });

    // Listen for the evaluation result from the server
    socket.on("evaluation-result", (result) => {
      setShowSmiley(result.passed);
    });

    // Track students in the room
    socket.on("students-count", (count) => {
      setStudentsCount(count);
    });

    // Redirect if mentor leaves
    socket.on("mentor-left", () => {
      window.location.href = "/";
    });

    
    // On joining the room
    socket.emit("join-room", codeBlockId);

    return () => {
      socket.disconnect();
    };
  },[]);

  // Handle code change
  const handleCodeChange = debounce((value) => {
    setCode(value);
    updateCodeBlock(value); // Call the PUT request to update the code block on the server
    socket.emit("code-change", value, codeBlockId);
    socket.emit("evaluate-code", { code: value, codeBlockId });
  }, 500);

  // Handle back to lobby
  const handleBackToLobby = () => {
    if (socket) socket.disconnect();
    window.location.href = "/"; // Redirect to the lobby
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-green-200 flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold my-4">{currentBlock.title}</h1>

      <div className="text-lg text-gray-100 font-medium mb-6">
        Role: <span className=" pr-1">{role}</span> |{" "}
        <span className="mx-2 border text-white rounded-md border-gray-50 pr-1">
          👁️ {studentsCount}
        </span>
      </div>

      <div className="w-3/4 bg-white p-4 rounded-lg shadow-lg">
        {role === "student" ? (
          <MonacoEditor
            height="500px"
            language="javascript"
            theme="vs-dark"
            value={code}
            onChange={handleCodeChange}
            options={{
              readOnly: false,
              automaticLayout: true,
            }}
          />
        ) : (
          <MonacoEditor
            height="500px"
            language="javascript"
            theme="vs-dark"
            value={code}
            options={{
              readOnly: true, // Make it read-only for mentor
              automaticLayout: true,
            }}
          />
        )}
      </div>

      {showSmiley && (
        <div className="text-9xl font-bold font-mono mt-6 absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <span role="img" aria-label="smiley face">
            😄
          </span>
        </div>
      )}

      <div className="mt-6 mb-4 flex space-x-4">
        <button
          onClick={handleBackToLobby}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          Back to Lobby
        </button>
      </div>
    </div>
  );
};
