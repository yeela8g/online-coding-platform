# Online Coding Platform

This platform combines educational content with real-time collaboration to support students in learning JavaScript. It allows Tom, a JavaScript lecturer, to continue teaching and monitoring his students' progress, even remotely.

---

## Features

### Lobby Page
- A list of coding challenges (**code blocks**) that students and Tom can select from.
- Clicking on a challenge redirects the user to the **Code Block Page**.

### Code Block Page
- **Role Assignment**: 
  - The first user to access the page is assigned the role of **Mentor**.
  - Subsequent users are assigned as **Students**.
  
- **Real-Time Collaboration**: 
  - Students' code changes are broadcasted to all users (students and mentor) in real-time using **Socket.io**.

- **Syntax Highlighting**: 
  - The code editor supports syntax highlighting through **Monaco Editor**.

- **Student Count**: 
  - Displays the current number of students in the room.

- **Solution Validation**: 
  - A predefined solution is stored for each coding challenge.
  - When a student submits the correct code, a **smiley face** is displayed as a reward.

- **Automatic Redirection**: 
  - If the mentor leaves the code block, students are redirected back to the lobby, and the code is reset.

---

## Technologies Used

### Frontend
- **React**: For building the user interface and component management.
- **Monaco Editor**: For the code editor with syntax highlighting.
- **Socket.io**: For real-time code sharing and communication between students and mentor.

### Backend
- **Node.js** with **Express**: For the server-side logic, handling socket connections, and managing API requests.
- **MongoDB**: A NoSQL database to store code blocks and their predefined solutions.
