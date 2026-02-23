import { validationResult } from "express-validator";
import type { Request, Response, NextFunction } from 'express';

export const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    } catch (error) {
        console.error('Error handling input errors:', error);
        return res.status(500).json({ error: 'An error occurred while handling input errors' });
    }
    next();
}