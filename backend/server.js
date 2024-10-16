const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/community', require('./routes/community'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
