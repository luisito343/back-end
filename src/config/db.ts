import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
import Product from '../models/product.model.js';

dotenv.config();

const db = new Sequelize(process.env.DATA_BASE_URL!,{
    dialectOptions: {
        ssl: {
            require: false,
            rejectUnauthorized: false
        }
    },
    models: [Product]
});

export default db;