import express from 'express';
import paytmRoutes from './routes/Routes'
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';


const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json())
app.use(cors())
app.use('/api/v1', paytmRoutes);

const prisma = new PrismaClient();

// Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Paytm Clone API',
        version: '1.0.0',
        description: 'A node.js Express API',
    },
};
const options = {
    swaggerDefinition,
    apis: ['./src/controllers/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Write the Swagger specification to a JSON file
import fs from 'fs';
fs.writeFileSync('./swagger-spec.json', JSON.stringify(swaggerSpec, null, 2), 'utf-8');


const dbConnect = async() => {
    try {
        await prisma.$connect();
        console.log('Connected to the database');
    }
    catch(error) {
        console.log('Databse connection error: ', error);
        process.exit(1);
    }
};

dbConnect();

app.listen(PORT, () => {
    console.log(`Server started successfully at ${PORT}`);
});

process.on('beforeExit', async() => {
    await prisma.$disconnect();
    console.log('Disconnected from database');
});

process.on('SIGNIN', async () => {
    await prisma.$disconnect();
    console.log('Disconnected from database');
    process.exit(0);
});