import request from "supertest";
import server, { db } from "../../server.js";


describe('testing API', () => {

    // POST /products validation tests
    it('should return 400 if name is missing', async () => {
        const newProduct = {
            price: 499.99
        };
        const response = await request(server).post('/api/products').send(newProduct);
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 if price is missing', async () => {
        const newProduct = {
            name: 'Hp Laptop Gamer'
        };
        const response = await request(server).post('/api/products').send(newProduct);
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 if price is not a number', async () => {
        const newProduct = {
            name: 'Hp Laptop Gamer',
            price: "sdas"
        };

        const response = await request(server).post('/api/products').send(newProduct);

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors[0]).toMatchObject({
            value: "sdas",
            msg: 'Price must be a positive number',
            path: 'price',
            location: 'body'
        });
    });

    it('should return 400 if price is zero or negative', async () => {
        const newProduct = {
            name: 'Hp Laptop Gamer',
            price: 0
        };
        const response = await request(server).post('/api/products').send(newProduct);
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 if price is negative', async () => {
        const newProduct = {
            name: 'Hp Laptop Gamer',
            price: -99.99
        };
        const response = await request(server).post('/api/products').send(newProduct);
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });

    it('should create a new product with valid data', async () => {
        const newProduct = {
            name: 'Hp Laptop Gamer',
            price: 499.99
        };
        const response = await request(server).post('/api/products').send(newProduct);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data.name).toBe(newProduct.name);
        expect(response.body.data.price).toBe(newProduct.price);
    });

    it('should create a product with available field defaulting to true', async () => {
        const newProduct = {
            name: 'Dell Monitor 27"',
            price: 299.99
        };
        const response = await request(server).post('/api/products').send(newProduct);
        expect(response.statusCode).toBe(201);
        expect(response.body.data.available).toBe(true);
    });

    // GET /products tests
    it('should return an array of products', async () => {
        const response = await request(server).get('/api/products');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter products by minPrice', async () => {
        const response = await request(server).get('/api/products?minPrice=400');
        expect(response.statusCode).toBe(200);
        expect(response.body.data.every((p: any) => p.price >= 400)).toBe(true);
    });

    it('should filter products by maxPrice', async () => {
        const response = await request(server).get('/api/products?maxPrice=300');
        expect(response.statusCode).toBe(200);
        expect(response.body.data.every((p: any) => p.price <= 300)).toBe(true);
    });

    it('should filter products by price range', async () => {
        const response = await request(server).get('/api/products?minPrice=200&maxPrice=500');
        expect(response.statusCode).toBe(200);
        expect(response.body.data.every((p: any) => p.price >= 200 && p.price <= 500)).toBe(true);
    });

    it('should return 400 if minPrice is not a valid number', async () => {
        const response = await request(server).get('/api/products?minPrice=invalid');
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if maxPrice is not a valid number', async () => {
        const response = await request(server).get('/api/products?maxPrice=invalid');
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if minPrice is greater than maxPrice', async () => {
        const response = await request(server).get('/api/products?minPrice=500&maxPrice=200');
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it('should filter products by name', async () => {
        const response = await request(server).get('/api/products?name=Hp');
        expect(response.statusCode).toBe(200);
        expect(response.body.data.every((p: any) => p.name.toLowerCase().includes('hp'))).toBe(true);
    });

    it('should support alternative spelling precioMin', async () => {
        const response = await request(server).get('/api/products?precioMin=300');
        expect(response.statusCode).toBe(200);
        expect(response.body.data.every((p: any) => p.price >= 300)).toBe(true);
    });

    it('should support alternative spelling precioMax', async () => {
        const response = await request(server).get('/api/products?precioMax=400');
        expect(response.statusCode).toBe(200);
        expect(response.body.data.every((p: any) => p.price <= 400)).toBe(true);
    });

    it('should support alternative spelling nombre', async () => {
        const response = await request(server).get('/api/products?nombre=Dell');
        expect(response.statusCode).toBe(200);
        expect(response.body.data.every((p: any) => p.name.toLowerCase().includes('dell'))).toBe(true);
    });

    it('should sort products by price in descending order by default', async () => {
        const response = await request(server).get('/api/products?sortBy=price');
        expect(response.statusCode).toBe(200);
        if (response.body.data.length > 1) {
            for (let i = 0; i < response.body.data.length - 1; i++) {
                expect(response.body.data[i].price).toBeGreaterThanOrEqual(response.body.data[i + 1].price);
            }
        }
    });

    it('should sort products by price in ascending order', async () => {
        const response = await request(server).get('/api/products?sortBy=price&order=ASC');
        expect(response.statusCode).toBe(200);
        if (response.body.data.length > 1) {
            for (let i = 0; i < response.body.data.length - 1; i++) {
                expect(response.body.data[i].price).toBeLessThanOrEqual(response.body.data[i + 1].price);
            }
        }
    });

    // GET /products/:id tests
    it('should return a product by id', async () => {
        const response = await request(server).get(`/api/products/1`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data.id).toBe(1);
    });

    it('should return 404 if product not found', async () => {
        const response = await request(server).get(`/api/products/9999`);
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('error', 'Product not found');
    });

    // PUT /products/:id tests
    it('should update a product with all fields', async () => {
        const updatedProduct = {
            name: 'Hp Laptop Gamer Pro',
            price: 599.99
        };
        const response = await request(server).put(`/api/products/1`).send(updatedProduct);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data.name).toBe(updatedProduct.name);
        expect(response.body.data.price).toBe(updatedProduct.price);
    });

    it('should update only name field', async () => {
        const updatedProduct = {
            name: 'Updated Laptop Name'
        };
        const response = await request(server).put(`/api/products/1`).send(updatedProduct);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.name).toBe(updatedProduct.name);
    });

    it('should update only price field', async () => {
        const updatedProduct = {
            price: 799.99
        };
        const response = await request(server).put(`/api/products/1`).send(updatedProduct);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.price).toBe(updatedProduct.price);
    });

    it('should return 404 if product to update does not exist', async () => {
        const updatedProduct = {
            name: 'Non-existent Product',
            price: 199.99
        };
        const response = await request(server).put(`/api/products/9999`).send(updatedProduct);
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('error', 'Product not found');
    });

    it('should update available status', async () => {
        const updatedProduct = {
            available: false
        };
        const response = await request(server).put(`/api/products/1`).send(updatedProduct);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.available).toBe(false);
    });

    // DELETE /products/:id tests
    it('should delete a product', async () => {
        // First create a product to delete
        const newProduct = {
            name: 'Product to Delete',
            price: 99.99
        };
        const createResponse = await request(server).post('/api/products').send(newProduct);
        const productId = createResponse.body.data.id;

        const response = await request(server).delete(`/api/products/${productId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Product deleted successfully');
        expect(response.body).toHaveProperty('data');
    });

    it('should return 404 when trying to delete non-existent product', async () => {
        const response = await request(server).delete(`/api/products/9999`);
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('error', 'Product not found');
    });

    // Root endpoint test
    it('should return 200 on root API endpoint', async () => {
        const response = await request(server).get('/api/');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('ok', true);
    });

    afterAll(async () => {
        await db.close();
    });
});