# CoreInventory

## Overview
## Features
## Tech Stack
## Architecture
## Frontend Development
## Backend Development
## Installation & Setup
## API Endpoints
## Screenshots / Demo
## Team Members

# Smart Task Manager

A full-stack web application developed during the Odoo x Indus University Hackathon '26 that allows users to manage tasks, collaborate with teams, and track project progress in real time.

The system consists of a React-based frontend and a Node.js + Express backend with MongoDB database.

## Tech Stack

Frontend:
- React.js
- Tailwind CSS

Backend:
- Node.js
- Express.js

Database:
- MongoDB

Client (React) → REST API (Express.js) → Database (MongoDB)

## Frontend Development

This frontend was built using the React.js and utilizing Tailwind CSS to create a responsive user interface.
Axios was used to communicate with backend APIs.

## Frontend Example (HTML)

```html
<!DOCTYPE html>
<html>
<head>
  <title>Hackathon Project</title>
</head>
<body>

<h1>Welcome to Our Website</h1>

<button onclick="getMessage()">Click Me</button>

<p id="output"></p>

<script>
function getMessage() {
  document.getElementById("output").innerText = "Frontend is working!";
}
</script>

</body>
</html>
```

export default AddTask;

## Backend Development

The backend server was built using Node.js and Express.  
It provides REST APIs for task management.

## Backend Example (Node.js + Express)

```javascript
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

module.exports = mongoose.model("Task", taskSchema);

git clone [https://github.com/username/project-name](https://github.com/Suraj-Pamnani/CoreInventory-Hackers)
cd project-name

## Install dependencies
npm install

## Run backend
node server.js

## Run frontend
npm start

| Method | Endpoint | Description |
|------|------|------|
| POST | /api/tasks | Create task |
| GET | /api/tasks | Get tasks |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |

## Hackathon Information

Event: Odoo x Indus University Hackathon '26
Team Size: 4  
Development Time: 8 hours
