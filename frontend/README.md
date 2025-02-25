# TaskHorizon Frontend

## Introduction

TaskHorizon frontend is a web-based task management interface built using **React/Vite** with **Redux** for state management. It provides an intuitive and dynamic user interface for managing tasks, projects, and users. The frontend seamlessly interacts with the backend API to ensure smooth task tracking and project collaboration. All calls to the backend API are handled through **Axios** as an intermediate service.

Designed for teams and individuals, TaskHorizon streamlines project management by offering real-time updates, a responsive UI, and seamless authentication. It supports role-based access control, ensuring that different users have appropriate permissions for managing tasks and projects. The frontend integrates closely with the backend to provide a secure and efficient task-tracking experience. Whether you are an admin creating projects or a team member viewing assigned tasks, TaskHorizon provides a structured and user-friendly interface to enhance productivity.

## Features

- **User Authentication & Role-Based Access**
  - JWT-based authentication
  - Role management for **Admins, Team Leads, and Users**
  - Admins and Team Leads can add new users
- **Task & Project Management**
  - Admins and Team Leads can create, update, delete, and assign tasks
  - Admins and Team Leads can create and manage projects
  - Users can only view assigned tasks and projects
  - Real-time status updates
- **UI & Performance Enhancements**
  - Responsive design with Tailwind CSS
  - Optimized performance using Vite
  - Redux state management for seamless user interactions
- **Security & Deployment**
  - **CORS handling** for backend communication
  - **Dockerized deployment** on Render

## Project Structure

```
taskHorizon/frontend/
│── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Application pages
│   ├── store/             # Redux store
│   ├── utils/             # API service calls using Axios
│   ├── hooks/             # Custom React hooks
│   ├── features/          # Redux calls actions for slice
│── public/
│── package.json
│── vite.config.js
│── tailwind.config.ts
│── .env
```

## Installation Guide

### Prerequisites

- **Node.js 18+**
- **Git**

### Setup Instructions

1. **Clone the Repository**
   ```sh
   git clone https://github.com/HamadMulti/taskHorizon.git
   cd taskHorizon/frontend
   ```
2. **Install Dependencies**
   ```sh
   npm install
   ```
3. **Configure Environment Variables**
   Create a `.env` file and set up the backend API URL:
   ```sh
   VITE_API_URL=https://your-backend-api.com
   ```
4. **Run the Development Server**
   ```sh
   npm run dev
   ```
5. **Build for Production**
   ```sh
   npm run build
   ```

## Deployment

- **Dockerized Deployment on Render**: The frontend is now deployed using Docker on Render for better stability.
- **CORS Configuration**: Ensures seamless communication with the backend API hosted on Render.
- **Optimization**: Vite’s fast build time enhances performance for production deployment.

### **Deploying with Docker on Render**
1. **Create a `Dockerfile` in the frontend directory** (if not already present):
   ```dockerfile
   # Use an official Node runtime as a parent image
   FROM node:18-alpine AS builder

   WORKDIR /app
   COPY package.json package-lock.json ./
   RUN npm install

   COPY . .
   RUN npm run build

   # Use an Nginx image to serve the built files
   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html

   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Ensure your `.env` file includes the correct API URL for the backend**:
   ```sh
   VITE_API_URL=https://your-backend-api.onrender.com
   ```

3. **Push your code to GitHub** and link it to Render.

4. **Create a new Web Service on Render**, selecting the repository.

5. **Set up the build and start commands**:
   - Build Command: _(Handled via Dockerfile)_
   - Start Command: _(Handled via Dockerfile)_

6. **Deploy and access your application on Render**

This setup eliminates the "pages not found" issue that occurred with Vercel.

## Future Enhancements

- **OAuth Authentication** (Google/GitHub integration)
- **Real-time Notifications** for task updates
- **Analytics Dashboard** for project insights
- **Mobile API Endpoints** for cross-platform support
- **Improved Error Handling** with centralized Redux error management

## Learn More

- If you want to learn more about the **Backend**, click [here](https://github.com/HamadMulti/taskHorizon/blob/main/backend/README.md).

## Conclusion

The TaskHorizon frontend provides a user-friendly and efficient interface for task and project management. With continuous improvements in UI/UX, security, and performance, the system is designed to enhance productivity and collaboration for users of all roles.

## License

This project is licensed under the MIT License. Feel free to use and modify it!

