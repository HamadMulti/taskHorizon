# TaskHorizon Backend API

TaskHorizon is the backend API for the TaskHorizon project, providing authentication, user management, task handling, and project organization functionalities.

## Background

The backend for TaskHorizon is designed to facilitate a structured and efficient approach to task management within a project-based environment. Built using Flask, it provides RESTful API endpoints that allow users to manage authentication, tasks, projects, and analytics efficiently. The system is designed with scalability in mind, ensuring smooth performance for different levels of users, including standard users, team leaders, and administrators.

## System Architecture

The architecture follows the **Model-View-Controller (MVC)** design pattern, separating concerns between database models, API endpoints (controllers), and front-end interactions.

### **High-Level System Architecture:**

- **Flask for the backend API**
- **PostgreSQL as the database**
- **JWT-based authentication for security**
- **Dockerized deployment using Render and Nginx as a reverse proxy**
- **CI/CD pipelines for continuous deployment**

### **Use Case Diagram**

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

## Data Flow Diagram (DFD)

1. **User Authentication** → User sends login request → System validates credentials → JWT token issued
2. **Task Creation** → User submits task data → API processes & stores in the database → Task assigned to user
3. **Task Updates** → Users update tasks → System logs history changes in `TaskHistory` table
4. **Task Archival** → Admin archives task → Task moved to `ArchivedTask` table

## API Structure

```
taskHorizon/backend/
│── app.py                    # Main Flask application
│── routes/
│   ├── auth_routes.py        # Authentication Endpoints
│   ├── user_routes.py        # User Management Endpoints
│   ├── task_routes.py        # Task Management Endpoints
│   ├── project_routes.py     # Project Management Endpoints
│   ├── analytics_routes.py   # Analytics Endpoints
│── models/
│   ├── archived_task.py      # Archived Task Model
│   ├── project.py            # Project Model
│   ├── task.py               # Task Model
│   ├── task_history.py       # Task History Model
│   ├── user.py               # User Model
│── services/
│── .env                      # Environment Variables
│── requirements.txt          # Python Dependencies
│── Dockerfile                # Docker Configuration
│── README.md                 # Backend Documentation
```

## Setup Instructions

1. Clone the repository:
   ```sh
   git clone https://github.com/HamadMulti/taskHorizon.git
   cd taskhorizon/backend
   ```
2. Create a virtual environment and install dependencies:
   ```sh
   python -m venv env
   source env/bin/activate  # On Windows use `env\\Scripts\\activate`
   pip install -r requirements.txt
   ```
3. Configure `.env` file with database and secret key settings.
4. Run the application:
   ```sh
   python app.py
   ```

## Models

### ArchivedTask

```python
class ArchivedTask(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(100))
    description = db.Column(db.Text)
    status = db.Column(db.String(20))
    assigned_to = db.Column(db.Integer, nullable=True)
    project_id = db.Column(db.Integer, nullable=True)
    deleted_by = db.Column(db.Integer, db.ForeignKey("user.id"))
    deleted_at = db.Column(db.DateTime, default=datetime.utcnow)
```

### Project

```python
class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("user.id"))
```

### Task

```python
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default="Pending")
    assigned_to = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    due_date = db.Column(db.Date, nullable=True)
```

### TaskHistory

```python
class TaskHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey("task.id"))
    updated_by = db.Column(db.Integer, db.ForeignKey("user.id"))
    old_status = db.Column(db.String(20))
    new_status = db.Column(db.String(20))
    old_assignee = db.Column(db.Integer, nullable=True)
    new_assignee = db.Column(db.Integer, nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
```

### User

```python
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    otp = db.Column(db.String(6), nullable=True)
    role = db.Column(db.String(10), default="user")
    phone = db.Column(db.String(20), nullable=True)
    location = db.Column(db.String(100), nullable=True)
    gender = db.Column(db.String(10), nullable=True)
    primary_email = db.Column(db.String(120), nullable=True)
    verified = db.Column(db.Boolean, default=False)
```

## API Routes

### Authentication (`/auth`)

- `POST /auth/register` - Register a new user
  ```json
  {
    "message": "User registered successfully" 
  }
  ```
- `POST /auth/login` - Authenticate user and obtain a token
  ```json
  { 
    "message": message,
    "access_token": token,
    "OTP sent": user=profile
  }
  ```
- `GET /auth/logout` - Logout the current user
  ```json
    { 
      "message": "Ok"
    }
    ```
- `POST /auth/send-otp` - Send OTP for verification
  ```json
  {
    "message": "OTP sent successfully"
  }
  ```
- `POST /auth/verify-otp` - Verify OTP code
  ```json
  {
    "access_token": "_xgchvjlhjoj0987769ft76r6ftf879tg08y9y0hg7XXXXXXX",
    "role": "user"
  }
  ```
- `POST /auth/forgot-password` - Initiate password reset
  ```json
  {
    "message": "Password reset email sent"
  }
  ```
- `POST /auth/reset-password` - Reset user password
  ```json
  {
    "message": "Password has been updated successfully"
  }
  ```

### User Management (`/user`)

- `PUT /user/update-profile` - Update user profile information
  ```json
  {
    "message": "Profile updated successfully"
  }
  ```
- `GET /user/profile` - Retrieve user profile details
  ```json
  {
    "user": 
      {
        "username": "John doe",
        "email": "jhonedoe@mail.com",
        "role": "user", // at the current moment we are using user as the administrator
        "phone": "+1234567890",
        "location": "london",
        "gender": "male",
        "primary_email": "doejohn@mail.com",
        "verified": "false"
      } 
    }
  ```

### Task Management (`/tasks`)

- `POST /tasks/` - Create a new task
  ```json
  {
    "message": "Task created successfully"
  }
  ```
- `GET /tasks/` - Retrieve all tasks
  ```json
  {
    "tasks": 
      [
        {
          "id": 1,
          "title": "Creating UI otp",
          "status": "pending",
          "assigned_to": "doe"
        }
      ]
  }
  ```
- `PUT /tasks/<int:task_id>` - Update a specific task
  ```json
  {
    "message": "Task updated successfully"
  }
  ```
- `PUT /tasks/<int:task_id>/assign` - Assign a task to a user
  ```json
  {
    "message": "Task assigned successfully"
  }
  ```
- `DELETE /tasks/<int:task_id>/archive` - Archive a task
  ```json
  {
    "message": "Task archived successfully"
  }
  ```
- `GET /tasks/user-tasks` - Get tasks assigned to the current user
  ```json
  {
    "tasks":
      [
        {
          "id": 1,
          "title": "OTP confirmations",
          "status": "In-progress",
          "assigned_to": "john"
        }
      ]
  }
  ```
- `GET /tasks/team-tasks` - Get team-wide tasks
  ```json
  {
    "tasks": 
      [
        {
          "id": 6,
          "title": "Otps verifications",
          "status": "in-progress",
          "assigned_to": "johndoe"
        }
      ]
  }
  ```

_Future Implementation: Tasks will be categorized under teams and admins for better management._

### Project Management (`/projects`)

- `POST /projects/` - Create a new project
  ```json
  { 
    "message": "Project created successfully"
  }
  ```
- `GET /projects/` - Retrieve all projects
  ```json
  { 
    "projects": 
      [
        {
          "id": 11, 
          "name": "Weather APP",
          "description": "Creating a terminal app for advising current weather"
        }
      ], 
    "total": 30,
    "pages": 3,
    "current_page": 1
  }
  ```
- `GET /projects/user` - Retrieve projects associated with the current user
  ```json
  {
    "my_projects":
      [
        {
          "id": 12,
          "name": "Tacker",
          "description": "A web app to track your small un-accounted expenditure"
        }
      ],
      "total": 3,
      "pages": 1,
      "current_page": 1
  }
  ```
- `PUT /projects/<int:project_id>` - Update a project
  ```json
  { 
    "message": "Project updated successfully"
  }
  ```
- `DELETE /projects/<int:project_id>` - Delete a project
  ```json
  { 
    "message": "Project deleted successfully"
  }
  ```

### Analytics (`/analytics`)

- `GET /analytics/user` - Get user activity analytics
  ```json
  { 
    "user_analytics": 
      { 
        "total_tasks": 15,
        "pending_tasks": 8, 
        "completed_tasks": 6,
        "productivity_percentage": "40%" // as a number
      }
  }
  ```
- `GET /analytics/team-leader` - Get analytics for team leaders
  ```json
  {
    "team_leader_analytics": 
      { 
        "user_id": 1,
        "username": John,
        "total_tasks": 6,
        "completed_tasks": 1,
        "due_tasks": 4,
        "productivity_percentage": 15%
      }
  }
  ```

## Deployment Considerations

### **Issues Encountered During Deployment**

- **Database Connection Limits:** Render’s free-tier PostgreSQL has limited concurrent connections, which required implementing a connection pooling mechanism.
- **CORS Policy Conflicts:** The backend had to allow cross-origin requests for smooth API integration with the frontend deployed on Vercel.
- **JWT Expiry Management:** Users were facing session expiration issues, so token refresh endpoints were added.

### **Maintenance Strategies**

- **Automated Logging:** Implemented structured logs for debugging API requests and responses.
- **Database Backups:** Automated backups to prevent data loss in case of system failures.
- **Performance Optimization:** Optimized database queries with indexing and query profiling to ensure fast response times.

## Future Enhancements

### **Role-Based Management**

Currently, the system operates with a standard user model. Future enhancements will introduce a **role-based management system** where:

- **Administrators** will have full control over user management, task assignments, and project configurations.
- **Team Leads** will have authority to manage projects and delegate tasks within their teams.
- **Standard Users** will remain responsible for managing their assigned tasks and collaborating on projects.

### **Improvements Planned**

- **Project Ownership Transfer**: Allow administrators to reassign project ownership when required.
- **Advanced Task Prioritization**: Implement priority-based task queues for enhanced productivity.
- **Notification System**: Introduce real-time email and push notifications for task updates and deadlines.
- **Audit Logging**: Maintain an audit trail for task and project modifications to improve accountability.
- **API Rate Limiting**: Implement request throttling mechanisms to prevent API abuse.

## Deployment

- **Backend API**: Hosted on **Render**
- **Database**: PostgreSQL (Render Free Tier - limited availability)
- **Dockerized Deployment**: Using **NGINX** as a reverse proxy

## License

This project is licensed under the MIT License.
