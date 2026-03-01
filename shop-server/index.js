const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { connectDB } = require('./config/db');
const initScheduler = require('./cron/scheduler');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 8000;

// Middleware
const corsOptions = {
  optionsSuccessStatus: 200,
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


app.get("/", (req, res) => {
  res.json({ message: 'Hello!' });
});

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// Start Server
connectDB().then(() => {
    // Init Scheduler
    initScheduler();

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});
