import type { Request, Response } from 'express';
import { Op } from 'sequelize';
import Product from '../models/product.model.js';



export const getProducts = async (req: Request, res: Response) => {
    try {
        const { sortBy, order, minPrice, maxPrice, precioMin, precioMax, name, nombre } = req.query;

        const sortableFields: Record<string, string> = {
            name: 'name',
            nombre: 'name',
            price: 'price',
            precio: 'price',
            available: 'available',
            disponibilidad: 'available',
            createdAt: 'createdAt'
        };

        const sortField = typeof sortBy === 'string' ? sortableFields[sortBy] : undefined;
        const sortOrder = typeof order === 'string' && order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        const minPriceValue = typeof minPrice === 'string'
            ? Number(minPrice)
            : typeof precioMin === 'string'
                ? Number(precioMin)
                : undefined;

        const maxPriceValue = typeof maxPrice === 'string'
            ? Number(maxPrice)
            : typeof precioMax === 'string'
                ? Number(precioMax)
                : undefined;

        const nameValue = typeof name === 'string'
            ? name
            : typeof nombre === 'string'
                ? nombre
                : undefined;

        if (minPriceValue !== undefined && Number.isNaN(minPriceValue)) {
            return res.status(400).json({ error: 'minPrice debe ser un número válido' });
        }

        if (maxPriceValue !== undefined && Number.isNaN(maxPriceValue)) {
            return res.status(400).json({ error: 'maxPrice debe ser un número válido' });
        }

        if (
            minPriceValue !== undefined
            && maxPriceValue !== undefined
            && minPriceValue > maxPriceValue
        ) {
            return res.status(400).json({ error: 'minPrice no puede ser mayor que maxPrice' });
        }

        const where: {
            price?: { [Op.gte]?: number;[Op.lte]?: number };
            name?: { [Op.iLike]: string };
        } = {};

        if (minPriceValue !== undefined || maxPriceValue !== undefined) {
            where.price = {
                ...(minPriceValue !== undefined ? { [Op.gte]: minPriceValue } : {}),
                ...(maxPriceValue !== undefined ? { [Op.lte]: maxPriceValue } : {})
            };
        }

        if (typeof nameValue === 'string' && nameValue.trim().length > 0) {
            where.name = { [Op.iLike]: `%${nameValue.trim()}%` };
        }

        const products = await Product.findAll({
            where,
            order: [[sortField ?? 'createdAt', sortOrder]],
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });

        res.json({ data: products });

    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'An error occurred while fetching products' });
    }
}

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (typeof id !== 'string') {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        const product = await Product.findByPk(id, {
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ data: product });
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ error: 'An error occurred while fetching the product' });
    }
}

export const createProduct = async (req: Request, res: Response) => {
    try {

        const { name, price, available } = req.body;
        const newProduct = await Product.create({ name, price, available });
        res.status(201).json({ data: newProduct });

    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'An error occurred while creating the product, check all the fields' });
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (typeof id !== 'string') {
            return res.status(400).json({ error: 'Invalid product ID' });
        }
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        await product.destroy();
        res.json({ message: 'Product deleted successfully', data: product });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'An error occurred while deleting the product' });
    }
}

export const putProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, price, available } = req.body;
        if (typeof id !== 'string') {
            return res.status(400).json({ error: 'Invalid product ID' });
        }
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        product.name = name ?? product.name;
        product.price = price ?? product.price;
        product.available = available ?? product.available;
        await product.save();
        res.json({ data: product });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'An error occurred while updating the product' });
    }
}