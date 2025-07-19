// server/server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';

// Config
import connectDB from './config/db.js';
import { upload } from './middleware/upload.js';
import { authMiddleware } from './middleware/auth.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import classRoutes from './routes/classRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';

// Init
const app = express();
dotenv.config();
connectDB();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Static Uploads Folder
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Upload route (optional utility)
app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json({ filePath: `/uploads/${req.file.filename}` });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('🚀 EduConnect API Running');
});

// Socket.IO Setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', credentials: true }
});

io.on('connection', (socket) => {
  console.log('✅ Socket connected:', socket.id);

  socket.on('send_announcement', (data) => {
    io.emit('receive_announcement', data);
  });

  socket.on('chat_message', (msg) => {
    io.emit('chat_message', msg);
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected:', socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
