const express = require('express');
const { connectDB } = require('./config/database.js');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

// Initialize Express app
const app = express();
const axios = require('axios');



connectDB();
app.use(express.json());

app.use('/api/users', userRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
