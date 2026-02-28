const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/db');
const initScheduler = require('./cron/scheduler');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

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

// Start Server
connectDB().then(() => {
    // Init Scheduler
    initScheduler();

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});
