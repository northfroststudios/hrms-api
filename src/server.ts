import express from 'express';
import userRoutes from './Routes/userRoutes'
import dotenv from 'dotenv';
import { connectDB } from './Db/db';
dotenv.config();

connectDB()

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes)
const port = process.env.PORT || 3000;



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});