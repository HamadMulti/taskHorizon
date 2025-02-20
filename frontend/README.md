# TaskHorizon Frontend

## Introduction
TaskHorizon frontend is a web-based task management interface built using **React/Vite** with **Redux** for state management. It provides an intuitive and dynamic user interface for managing tasks, projects, and users. The frontend seamlessly interacts with the backend API to ensure smooth task tracking and project collaboration.

## Features
- **User Authentication & Role-Based Access**
  - JWT-based authentication
  - Role management for **Admins, Team Leads, and Users**
- **Task & Project Management**
  - Create, update, delete, and assign tasks
  - Organize tasks within projects
  - Real-time status updates
- **UI & Performance Enhancements**
  - Responsive design with Tailwind CSS
  - Optimized performance using Vite
  - Redux state management for seamless user interactions
- **Security & Deployment**
  - **CORS handling** for backend communication
  - **Dockerized deployment** on Vercel

## Project Structure
```
taskHorizon/frontend/
│── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Application pages
│   ├── store/             # Redux store and slices
│   ├── utils/          # API service calls
│   ├── hooks/             # Custom React hooks
│   ├── styles/            # Tailwind & global styles
│── public/
│── package.json
│── vite.config.js
│── .env
```

## Installation Guide
### Prerequisites
- **Node.js 16+**
- **Git**

### Setup Instructions
1. **Clone the Repository**
   ```sh
   git clone https://github.com/HamadMulti/taskHorizon.git
   cd taskhorizon/frontend
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

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

## Deployment
- **Vercel Hosting**: The frontend is deployed using Vercel for scalability and ease of maintenance.
- **CORS Configuration**: Ensures proper communication with the backend API hosted on Render.
- **Optimization**: Vite’s fast build time enhances performance for production deployment.

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

