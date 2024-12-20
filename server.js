const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Get all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const allTasks = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
        res.json(allTasks.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Create a task
app.post('/api/tasks', async (req, res) => {
    try {
        const { title } = req.body;
        const newTask = await pool.query(
            'INSERT INTO tasks (title) VALUES($1) RETURNING *',
            [title]
        );
        res.json(newTask.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Toggle task completion
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const task = await pool.query(
            'UPDATE tasks SET completed = NOT completed WHERE id = $1 RETURNING *',
            [id]
        );
        res.json(task.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
