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
        url: 'http://localhost:3000',
        description: 'Local development server',
      },

      {
        url: 'https://spendy-expence-tracker-api.onrender.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header. Format: "Bearer {token}"',
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
    // Global authentication for all protected endpoints
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: [
    './src/routes/*.js', // Основные роуты — здесь вся документация
    './src/controllers/*.js', // Если часть описаний в контроллерах
    // './src/models/*.js',       // Опционально — для схем моделей
  ],
};

const specs = swaggerJsdoc(options);

export default specs;
