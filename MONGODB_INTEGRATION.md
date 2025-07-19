# MongoDB Backend Integration Guide

## Backend Setup Steps

### 1. Create Node.js/Express Backend
```bash
mkdir educonnect-backend
cd educonnect-backend
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors dotenv multer
npm install -D nodemon
```

### 2. Environment Variables (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/educonnect
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### 3. MongoDB Schema Models
Create models for:
- User (name, email, password, role, avatar)
- Class (name, subject, teacher, students, inviteCode)
- Assignment (title, description, class, teacher, dueDate, maxGrade)
- Submission (assignment, student, content, grade, feedback)
- Announcement (title, content, class, teacher)

### 4. API Endpoints Structure
```
/api/auth
- POST /login
- POST /register  
- POST /logout
- GET /verify

/api/users
- GET /profile
- PUT /profile
- PUT /change-password

/api/classes
- GET / (get user's classes)
- POST / (create class)
- GET /:id (get class details)
- PUT /:id (update class)
- DELETE /:id (delete class)
- POST /join (join with invite code)

/api/assignments
- GET / (get assignments)
- POST / (create assignment)
- GET /:id (get assignment)
- PUT /:id (update assignment)
- DELETE /:id (delete assignment)

/api/submissions
- POST /:assignmentId (submit assignment)
- PUT /:id/grade (grade submission)
```

### 5. Frontend API Configuration
Update `src/services/api.ts`:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

### 6. CORS Configuration
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

## Key Implementation Notes
- Use JWT for authentication
- Hash passwords with bcryptjs
- Implement role-based authorization
- Use multer for file uploads
- Add validation middleware
- Implement proper error handling