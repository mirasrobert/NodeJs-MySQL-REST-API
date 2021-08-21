const express = require('express');
const db = require('./database/database');

const app = express();

// Load config env
require('dotenv').config();

// Database Connection
db.authenticate()
	.then(() => console.log('Database is Connected...'))
	.catch(err => console.error(err));

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// API Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/articles', require('./routes/api/articles'));

// If there is no env port then use port 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`${process.env.NODE_ENV} server started on PORT ${PORT}`));