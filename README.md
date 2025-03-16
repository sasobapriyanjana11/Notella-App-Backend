# Notella - A Modern MERN Notes App Backend 🚀

<h1 align="center">
    <img src="https://readme-typing-svg.herokuapp.com/?font=Righteous&size=35&center=true&vCenter=true&width=1100&height=70&duration=4000&lines=Notella+Backend+&color=078179" />
</h1>

The **Notella Backend** is a robust and secure backend service for the Notella Notes application, built using the MERN (MongoDB, Express, React, Node.js) stack. This backend provides API endpoints for user authentication, note management, and search functionality.

## 🚀 Features
- User Authentication (Sign Up, Login, Logout)
- Secure Password Hashing with bcrypt
- JWT-based Authentication & Authorization
- CRUD operations for Notes (Create, Read, Update, Delete)
- Pin/unpin important notes
- Search functionality for notes
- MongoDB database integration using Mongoose
- CORS support for seamless frontend-backend interaction

## 🛠 Technologies Used
- **Node.js**: JavaScript runtime for building scalable applications.
- **Express.js**: Fast and minimal web framework for Node.js.
- **MongoDB**: NoSQL database for storing user and note data.
- **Mongoose**: ODM (Object Data Modeling) for MongoDB.
- **bcrypt**: Password hashing for user security.
- **jsonwebtoken (JWT)**: Secure user authentication.
- **cors**: Middleware to enable CORS support.
- **dotenv**: Environment variable management.

## 📌 Project Setup
### 1️⃣ Requirements
- Node.js (>=16.x)
- MongoDB (Local or Atlas Cloud)

### 2️⃣ Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/sasobapriyanjana11/Notella-App-Backend.git
   ```
2. Navigate to the backend directory:
   ```bash
   cd Notella-Backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file and add the following variables:
   ```env
   ACCESS_TOKEN_SECRET=your_token_key
   ```

### 3️⃣ Run the Server
```bash
npm start
```
The backend server will start at `http://localhost:8000`.

## 📌 API Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/create-account` | Register a new user |
| POST | `/login` | Authenticate and login user |
| GET | `/get-all-notes` | Get all notes for the logged-in user |
| POST | `/add-note` | Create a new note |
| PUT | `/edit-note/:id` | Update a note |
| DELETE | `/delete-note/:id` | Delete a note |
| PUT | `/update-note-pinned/:id` | Toggle pin/unpin note |
| GET | `/search-notes?query=keyword` | Search for notes |

## 🔐 Authentication & Security
- JWT-based authentication ensures secure API access.
- Passwords are hashed using bcrypt before being stored in the database.
- API routes are protected using authentication middleware.

## 🎯 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 📌 Related Repositories
- [Frontend Repository](https://github.com/sasobapriyanjana11/Notella-App-Frontend)

Stay organized with **Notella**! 🚀

