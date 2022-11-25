import express, { Express } from 'express';
import { Server, createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// Import DB Connection
import { connectDB } from './config/db';

// Create Express APP
const app: Express = express();

// Initialize DB
connectDB();

app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(express.json());
app.use(cors());

// Define Routes Here
import authRoutes from './routes/auth.routes';
app.use('/api/v1/auth', authRoutes);

import langRoutes from './routes/language.routes';
app.use('/api/v1/languages', langRoutes);

import userRoutes from './routes/user.routes';
app.use('/api/v1/users', userRoutes);

// Define HTTP Server (used with Socket IO)
const server: Server = createServer(app);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`⚡️[server]: Listening on port ${PORT}`);
});

export default { app };
