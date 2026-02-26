import express, { type Application } from 'express';
import router from './routes.js';
import db from './config/db.js';
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import fs from 'node:fs';
import path from 'node:path';
import type { CorsOptions } from 'cors';
import cors from 'cors';
import morgan from 'morgan';



async function connectDB() {
    try {
        await db.authenticate();
        db.sync();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

if (process.env.NODE_ENV !== 'test') {
    connectDB();
}
const server: Application = express();
const corsOptions: CorsOptions = {
    origin: process.env.FRONT_END_URL || 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type',
}

server.use(cors(corsOptions));

const openApiPath = path.resolve(process.cwd(), 'docs', 'openapi.yaml');
const openApiDocument = yaml.load(fs.readFileSync(openApiPath, 'utf8')) as object;

server.use(express.json());
server.use(morgan('dev'));
server.get('/api/docs/openapi.yaml', (_req, res) => {
    res.sendFile(openApiPath);
});
server.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
server.use('/api', router);

export default server;
export { db };