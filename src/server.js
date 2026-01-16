import express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import auth from './routes/auth.js';

import categoriesRoutes from './routes/categories.js';
import { seedCategories } from './seeds/categoriesSeed.js';

const app = express();

const PORT = process.env.PORT ?? 3000;

// Middleware
app.use(logger);
app.use(express.json());
app.use(cors());

app.use(categoriesRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello in my app!' });
});

app.use(cookieParser());
app.use('/auth', auth);

// 404 і обробник помилок
app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

// підключення до MongoDB

await connectMongoDB();

await seedCategories();

// запуск сервера

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
