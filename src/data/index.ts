import { db } from "../server.js";
import { exit } from "node:process";

const clearDB = async () => {
    try {
        await db.sync({ force: true });
        console.log('Database cleaned successfully.');
        exit(0);
    } catch (error) {
        console.error('Error cleaning the database:', error);
        exit(1);
    }
};

if(process.argv[2] === 'clear') {
    clearDB();
}