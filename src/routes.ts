import { Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, putProduct } from "./handlers/products.js";
import { body } from "express-validator";
import { handleInputErrors } from "./middleware/index.js";

const router: Router = Router();

router.get('/', (_req, res) => {
    res.status(200).json({ ok: true });
});

router.get('/products', getProducts);

router.get('/products/:id', getProductById);

router.post('/products',
    body('name').notEmpty().withMessage('Name is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    handleInputErrors,
    createProduct);

router.delete('/products/:id', deleteProduct);

router.put('/products/:id', putProduct);


export default router;