// src/config/swagger.js  (или просто src/swagger.js)

import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Spendy | Finance Tracker API',
      version: '1.0.0',
      description: 'Expense and income tracker',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Локальная разработка',
      },
    ],
  },
  // Пути, где Swagger ищет JSDoc-комментарии с @swagger
  apis: [
    './src/routes/*.js', // все файлы роутов
    './src/controllers/*.js', // если документация в контроллерах
    // При необходимости добавь другие папки, например:
    // './src/middlewares/*.js',
  ],
};

const specs = swaggerJsdoc(options);

export default specs;
