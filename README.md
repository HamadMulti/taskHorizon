# TaskHorizon Backend & Frontend API

## Introduction

TaskHorizon is a web-based task management system designed to streamline project and task organization. Built using **Flask**, **PostgreSQL**, and **JWT-based authentication** for the backend, and **React/Vite** with **Redux** for the frontend, the system ensures efficient task tracking. The frontend interacts with the backend through **Axios** as an intermediary service, providing seamless API integration. 

This system is built with scalability, maintainability, and security in mind, following structured software engineering workflows to enhance project management efficiency. TaskHorizon is designed for teams of all sizes, allowing administrators and team leads to manage users, create and assign tasks, and oversee project progress, while standard users can efficiently track their assigned work.

## Software Engineering Workflow

The development of TaskHorizon adhered to best practices in software engineering, including:

- **Requirements Analysis**: Defined key functionalities including authentication, task assignments, and project tracking.
- **System Design**: Implemented a **Model-View-Controller (MVC)** architectural pattern.
- **Implementation**: Developed RESTful APIs with Flask and ensured security with JWT authentication.
- **Frontend Implementation**: Built with **React/Vite** and **Redux** for state management.
- **Testing**: Conducted unit and integration tests to validate API endpoints and UI functionality.
- **Deployment**: Hosted backend and frontend on Render using a Dockerized environment, with PostgreSQL as the database and Nginx as a reverse proxy.

## System Architecture

TaskHorizon follows a layered approach:

- **Backend**: Flask RESTful API
- **Frontend**: React/Vite with Redux
- **Database**: PostgreSQL
- **Authentication**: JWT-based authentication with secure token handling
- **Deployment**: Dockerized application hosted on **Render** (both backend and frontend) with CI/CD integration

### Use Case Diagram

```
        +--------------------+
        |   Administrator    |
        +--------------------+
                 |
                 | Manage Users, Projects, and Tasks
                 v
        +------------------+
        |    TaskHorizon   |
        +------------------+
                 ^
                 |
        +-----------------+       +---------------+
        |  Standard User  | ----> |   Team Lead   |
        +-----------------+       +---------------+
                  \                    /
                   -------------------
                           |
                           v
                 +----------------+
                 |   Task System  |
                 +----------------+
```

## Data Flow Diagram

1. **User Authentication** → System verifies credentials → Issues JWT token.
2. **Task Creation** → User submits task → API stores in database → Assigns to project.
3. **Task Updates** → Users modify tasks → Logs changes in `TaskHistory` table.
4. **Task Archival** → Admin archives task → Moved to `ArchivedTask` table.

## Deployment and Maintenance Challenges

### Backend Deployment Issues

- **Database Connection Limits**: Render’s free-tier PostgreSQL has limitations, requiring connection pooling.
- **CORS Policy Conflicts**: Backend adjustments were made to allow seamless frontend integration.
- **JWT Expiry Management**: Implemented token refresh strategies to enhance user sessions.

### Frontend Deployment Issues

- **State Management Complexity**: Ensured smooth Redux state transitions and minimized API call redundancy.
- **Build Optimization**: Vite was used for faster build times and better production performance.
- **Cross-Origin API Requests**: Adjusted API endpoints to support frontend-backend communication.

### Maintenance Strategies

- **Automated Logging**: Structured logs for debugging both backend and frontend.
- **Database Backups**: Automated backups to prevent data loss.
- **Performance Optimization**: Indexed database queries and optimized React rendering for efficiency.

## Future Enhancements

- **Advanced Notifications**: Real-time updates on task modifications.
- **Analytics Dashboard**: Implementation of **data-driven insights** for task and user activity.
- **Task Prioritization**: Automated priority assignment to enhance workflow.
- **Audit Logs**: Keeping track of all modifications for accountability.
- **Mobile API Support**: Expanding endpoints for mobile integration.

## Learn More

- If you want to learn more about the **Frontend**, click [here](https://github.com/HamadMulti/taskHorizon/blob/main/frontend/README.md).
- If you want to learn more about the **Backend**, click [here](https://github.com/HamadMulti/taskHorizon/blob/main/backend/README.md).

## Conclusion

TaskHorizon provides a structured and scalable backend and frontend for task management. By following software engineering best practices, it ensures a reliable, secure, and efficient system for users. Future enhancements aim to extend functionality, improve user experience, and provide a robust management solution for teams and administrators.

