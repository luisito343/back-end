import express, { type Application } from 'express';
import router from './routes.js';
import db from './config/db.js';



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

server.use(express.json());
server.use('/api', router);

export default server;
export { db };