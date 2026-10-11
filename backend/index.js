const express = require('express');
const cors = require('cors');
const config = require('./config');
const mongoose = require('mongoose');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(config.database.dbConnectionString, {})
    .then(() => {
        console.log("Connected to MongoDB")
    }).catch((err) => {
        console.error("Error connecting to MongoDB:", err)
    })
// Routes
const authRoutes = require('./routes/AuthRoutes');
const adminRoutes = require('./routes/AdminRoutes');
const ownerRoutes = require('./routes/OwnerRoutes');
// const tenantRoutes = require('./routes/TenantRoutes');
const maintenanceFlagMiddleware = require('./utility/maintenanceFlagMiddleware');
const mediaRoutes = require('./routes/media');

app.use('/api/auth', maintenanceFlagMiddleware, authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/owner', maintenanceFlagMiddleware, ownerRoutes);
app.use('/api/media', mediaRoutes);

// app.use('/api/tenant', maintenanceFlagMiddleware, tenantRoutes);


// Initialize cron jobs
require('./utility/cronJobs');
require("./utility/rentOverdueCron");

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'VocaRent API is running', version: '1.0.0' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = config.http.port;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});