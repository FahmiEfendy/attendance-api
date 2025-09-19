## 🚀 Attendance API
Backend api service for employee attendance and HR monitoring. This API handle authentication, employee management, and attendance tracking.


## 🔑 Features
- **User Authentication** → Register & login with secure access
- **Employee Attendance** → Check-in, check-out, with photo proof
- **User Management** → View, edit, and delete employees
- **Password Security** → Encrypted with bcrypt hashing
- **Data Validation** → Validate requests using Joi
- **JWT Authorization** → Protect routes with token-based auth
- **File Uploads** → Manage attendance photos with Multer


## 📌 Tech Stack
🔑 **Bcrypt** → Password hashing & verification  
🌐 **Cors** → Cross-origin resource sharing  
⏰ **Day.js** → Date & time handling  
⚙️ **Dotenv** → Environment variable management  
⚡ **Express** → Web framework for Node.js  
✅ **Joi** → Schema validation library  
🔒 **Jsonwebtoken (JWT)** → Token-based authentication  
📤 **Multer** → File upload middleware  
🐬 **Mysql** → Relational database system  
🗄️ **Sequelize** → ORM for SQL databases  
🔷 **Typescript** -> Typed language  
🆔 **Uuid** → Unique ID generator  


## 📬 API Documentation
You can import the Postman collection located at: `/docs/Attendance API.postman_collection.json`


## ⚙️ Setup & Installation
1. Clone this repo
```bash
git clone https://github.com/FahmiEfendy/attendance-api.git
cd attendance-api
```
2. Install dependencies
```bash
npm run install
```
3. Copy .env value
```bash
PORT=5000
DB_USER=root
DB_PASS=
DB_NAME=attendance-api
DB_HOST=127.0.0.1
```
4. Run db migration and seeder
```bash
npm run init-db
```
5. Run development server
```bash
npm run dev
```
