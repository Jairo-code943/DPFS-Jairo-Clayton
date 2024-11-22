import connection from '../database'; // Import the MySQL connection

export const getAllUsers = async (req, res) => {
    try {
        const [rows] = await connection.execute('SELECT * FROM users');
        res.json(rows); // Return all users
    } catch (error) {
        console.error('Error fetching users:', error);
        res.json({ message: error.message });
    }
};

export const getUser = async (req, res) => {
    try {
        const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(rows[0]); // Return the first matching user
    } catch (error) {
        console.error('Error fetching user:', error);
        res.json({ message: error.message });
    }
};

export const createUser = async (req, res) => {
    const { name, email, password } = req.body; // Ensure these fields exist in the body
    try {
        const [result] = await connection.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, password]
        );
        res.json({ message: 'User created', userId: result.insertId });
    } catch (error) {
        console.error('Error creating user:', error);
        res.json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const [result] = await connection.execute(
            'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
            [name, email, password, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User updated' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.json({ message: error.message });
    }
};

