import express from 'express';
import userRoutes from './Routes/userRoutes';
import authRoutes from './Routes/auth';

// import verificationRouter from './Routes/verificationRoutes';
import dotenv from 'dotenv';
import { connectDB } from './Db/db';
dotenv.config();

connectDB()

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes)
// app.use('/api/verify', verificationRouter);
app.use('/api/auth',authRoutes )
const port = process.env.PORT || 3000;



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});