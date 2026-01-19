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
import summaryRoutes from './routes/summary.js';
import transactionRoutes from './routes/transactions.js';
import { seedCategories } from './seeds/categoriesSeed.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

const app = express();

const PORT = process.env.PORT ?? 3000;

// Middleware
app.use(logger);
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/auth', auth);
app.use(categoriesRoutes);
app.use(summaryRoutes);
app.use('/transactions', transactionRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello in my app!' });
});

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
  console.log(`Documentation Swagger: http://localhost:${PORT}/api-docs`);
});
