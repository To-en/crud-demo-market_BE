import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ingredient Market API',
      version: '1.0.0',
      description: 'API for high school students to order cooking ingredients',
    },
    servers: [{ url: 'http://localhost:3001' }],
  },
  apis: ['./src/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
