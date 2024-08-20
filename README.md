# Taaskify - Task Management Web Application

## Overview

**Taaskify** is a full-stack task management (Kanban) SaaS platform designed to provide users with a highly customizable and efficient way to manage tasks and projects. Built with the modern MERN stack, TypeScript, Tailwind CSS, and Sass, Taaskify offers a seamless and dynamic user experience.

## Features

- **Kanban Boards**: Create, manage, and customize your task boards.
- **Customizable Tasks**: Tailor tasks to fit your workflow with a variety of options and settings.
- **Notifications**: Stay updated with real-time notifications for task changes and updates.
- **Responsive Design**: Access your tasks on any device with a responsive interface.
- **Secure Authentication**: Secure user authentication and authorization using JWT.
- **Password Resets**: Users can reset their passwords whether they are logged in or not as long as they have access to their email address.




## Technology Stack

### Frontend
- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A statically typed superset of JavaScript that enhances the development experience.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Sass**: A preprocessor scripting language that is interpreted or compiled into CSS.

### Backend
- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express**: A fast, minimalist web framework for Node.js.
- **MongoDB**: A NoSQL database for storing task data.
- **Mongoose**: An elegant MongoDB object modeling for Node.js.

## Installation

1. **Clone the repository:**
    ```bash
    git clone <github-url>
    cd <foldername>
    ```

2. **Install frontend dependencies:**
    ```bash
    cd frontend
    npm install
    ```

3. **Install backend dependencies**

   Navigate to the `backend` folder and run to install the typescript compatible with the typescript:

   Install peer dependency using the run script:
   ```sh
    npm install --legacy-peer-deps
   ```

   Install nodemon dependency globally using the run script:
   ```sh
    npm install -g nodemon
   ```

   Install typescript dependency using the run script:
   ```sh
    npm install typescript ts-node --save-dev
   ```

## Running the Application

1. **Start the backend server:**
    ```bash
    cd backend
    npm run server
    ```

2. **Start the frontend development server:**
    ```bash
    cd ../frontend
    npm run dev
    ```

3. Open your browser and navigate to `http://localhost:5173` to view the application.

## Configuration

### Environment Variables

Create a `.env` file in the `server` directory and add the following environment variables:

```
MONGO_CONNECTION_STRING=your_mongodb_connection_string
PORT=DEFINE YOUR PORT
SERVER_HOSTNAME=DEFINE YOUR HOSTNAME
SERVER_TOKEN_EXPIRETIME=DEFINE YOUR TOKEN EXPIRATION TIME
SERVER_TOKEN_ISSUER=DEFINE YOUR ISSUER
SERVER_TOKEN_SECRET=DEFINE YOUR SECRET
RESEND_EMAIL_API_KEY=DEFINE YOUR API KEY FOR RESEND
NODE_ENV=DEFINE YOUR NODE ENV
FRONTEND_BASE_URL=DEFINE YOUR FRONTEND BASE URL
```

## Contributing

1. **Fork the repository**
2. **Create a new branch:**
    ```bash
    git checkout -b feature/your-feature-name
    ```
3. **Make your changes and commit them:**
    ```bash
    git commit -m 'Add some feature'
    ```
4. **Push to the branch:**
    ```bash
    git push origin feature/your-feature-name
    ```
5. **Create a new Pull Request**

## License

This project is licensed under the MIT License.

---

Thank you for using Taaskify! If you have any questions or need further assistance, please feel free to reach out.



