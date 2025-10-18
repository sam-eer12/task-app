# Task Manager App

A full-stack task management application built with React, Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Task Management**: Create, read, update, and delete tasks with deadlines
- **Unique Task IDs**: Each task gets a unique ID in format DD-YYYY-NNN (e.g., 18-2025-001)
  - Date-based numbering resets daily
  - Easy reference and tracking
- **Search Functionality**: Powerful search bar to find tasks by:
  - Task ID
  - Title
  - Description
- **Task Status Tracking**: Track tasks through three states:
  - Pending
  - In Progress
  - Completed
- **Task Filtering**: Filter tasks by status
- **Deadline Management**: Set deadlines for tasks with visual indicators for overdue tasks
- **Creation Timestamps**: View when each task was created
- **Completion Score**: Automatic score calculation showing percentage of time saved or exceeded
  - Shows if completed early or late
  - Displays number of days early/late
  - Visual feedback with green (early) or red (late) indicators
- **Modern UI**: Beautiful, responsive interface built with TailwindCSS
- **Real-time Updates**: Instant task updates without page refresh

## Tech Stack

### Frontend
- React 19
- React Router DOM
- TailwindCSS
- Axios
- React Hot Toast

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas account)
- npm or yarn package manager

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd task-app
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file in the server directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 3. Setup Frontend

```bash
cd ../client
npm install
```

Create a `.env` file in the client directory:

```env
VITE_BACKEND_URL=http://localhost:5000
```

## Running the Application

### Start the Backend Server

```bash
cd server
npm run dev
```

The server will start on `http://localhost:5000`

### Start the Frontend Development Server

```bash
cd client
npm run dev
```

The client will start on `http://localhost:5173` (or another port if 5173 is busy)

## Usage

1. **Sign Up**: Create a new account with your email, full name, and password
2. **Login**: Sign in with your credentials
3. **Create Tasks**: Click the "+ New Task" button to create a new task with title and description
4. **Update Status**: Click on status buttons (Pending, In Progress, Complete) to change task status
5. **Filter Tasks**: Use the filter buttons to view tasks by status
6. **Delete Tasks**: Click the trash icon to delete a task

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/check` - Check authentication status

### Tasks
- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update task status
- `DELETE /api/tasks/:id` - Delete a task

## Project Structure

```
task-app/
├── client/                 # Frontend React application
│   ├── context/           # React Context (Auth)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── libs/          # Utility functions
│   │   ├── App.jsx        # Main App component
│   │   └── main.jsx       # Entry point
│   └── package.json
│
└── server/                # Backend Node.js application
    ├── controllers/       # Request handlers
    ├── models/           # MongoDB models
    ├── routes/           # API routes
    ├── middleware/       # Custom middleware
    ├── lib/              # Utility functions
    ├── server.js         # Entry point
    └── package.json
```

## Security Features

- Password hashing using bcryptjs
- JWT token-based authentication
- Protected API routes
- CORS enabled for cross-origin requests

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License
