import connection from '../database'; // Import the MySQL connection
import { productsStock, productMinStock } from "../main.js";
import { sendMail } from "../mail/mail.js";

export const getAllProducts = async (req, res) => {
    try {
        const [rows] = await connection.execute('SELECT * FROM products');
        res.json(rows); // Return all products
    } catch (error) {
        console.error('Error fetching products:', error);
        res.json({ message: error.message });
    }
};

export const getProduct = async (req, res) => {
    try {
        const [rows] = await connection.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(rows[0]); // Return the first matching product
    } catch (error) {
        console.error('Error fetching product:', error);
        res.json({ message: error.message });
    }
};

export const createProduct = async (req, res) => {
    const { name, price, stock } = req.body; // Ensure `name`, `price`, and `stock` exist in the body
    try {
        const [result] = await connection.execute(
            'INSERT INTO products (name, price, stock) VALUES (?, ?, ?)',
            [name, price, stock]
        );
        res.json({ message: 'Product created', productId: result.insertId });
    } catch (error) {
        console.error('Error creating product:', error);
        res.json({ message: error.message });
    }
};

export const updateProducts = async (req, res) => {
    const { name, price, stock } = req.body;
    try {
        const [result] = await connection.execute(
            'UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?',
            [name, price, stock, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product updated' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const [result] = await connection.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.json({ message: error.message });
    }
};

export const bookProduct = async (req, res) => {
    try {
        console.log(productsStock);

        if (req.query.f === 'unbook') {
            productsStock[req.params.id]++;
            return res.json('Unbooked');
        } else if (req.query.f === 'book') {
            if (productsStock[req.params.id] == 0) return res.json('Stockout'); // Notify if stock is zero
            productsStock[req.params.id]--;
            return res.json('Booked');
        }

        res.status(400).json('Bad request');
    } catch (error) {
        console.error('Error booking product:', error);
        res.json({ message: error.message });
    }
};

const updateContent = async (product, quantity) => {
    try {
        const [stockResult] = await connection.execute(
            'SELECT stock FROM products WHERE id = ?',
            [product]
        );

        if (stockResult.length === 0) throw new Error('Product not found');
        const stock = stockResult[0].stock;

        await connection.execute(
            'UPDATE products SET stock = ? WHERE id = ?',
            [stock - quantity[product], product]
        );

        if (productMinStock[product] >= stock - quantity[product]) {
            sendMail({ id: product }); // Trigger low stock notification
        }
    } catch (error) {
        console.error('Error updating content:', error);
        throw error;
    }
};

export const buyProducts = async (req, res) => {
    try {
        console.log(req.body);
        const updates = Object.keys(req.body).map((product) =>
            updateContent(product, req.body)
        );
        await Promise.all(updates); // Wait for all updates to complete
        res.json('Successful purchase');
    } catch (error) {
        console.error('Error buying products:', error);
        res.json({ message: error.message });
    }
};

