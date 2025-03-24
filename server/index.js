import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './db/conn.js';
import recipeAuthRoutes from './routes/recipes/recipeAuthroutes.js';
import userAuthRoutes from './routes/users/userAuthroutes.js';
import reviewAuthRoutes from './routes/reviews/reviewAuthRoutes.js';
import adminAuthRoutes from './routes/Admin/adminAuthroutes.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: 'Authorization, Content-Type'
}));

// routes
app.use("/admin/api", adminAuthRoutes);
app.use("/user/api", userAuthRoutes);
app.use("/recipe/api", recipeAuthRoutes);
app.use("/review/api", reviewAuthRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});