// src/config/swagger.js

import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Tracker API',
      version: '1.0.0',
      description:
        'REST API for tracking personal income and expenses, categories, monthly summaries, and user management.',
    },
    servers: [
      {
        url: 'https://spendy-expense-tracker-api.onrender.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
          description: 'Authentication via HTTP-only cookie. After successful login or registration, the accessToken is automatically set in cookies. No manual authorization required when using Swagger UI in browser.',
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Unauthorized - invalid or missing token',
                  },
                },
              },
            },
          },
        },
        ValidationError: {
          description: 'Input validation failed',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Invalid input data',
                  },
                  details: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['"email" must be a valid email address'],
                  },
                },
              },
            },
          },
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Internal server error',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [
    './src/routes/*.js', // Основные роуты — здесь вся документация
    './src/controllers/*.js', // Если часть описаний в контроллерах
    // './src/models/*.js',       // Опционально — для схем моделей
  ],
};

const specs = swaggerJsdoc(options);

export default specs;
