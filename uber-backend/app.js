require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const mysql = require('mysql2/promise');
const rateLimit = require('express-rate-limit');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/users');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// MySQL connection pool
const mysqlPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQL_PASSWORD,
  database: 'your_mysql_db',
});

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter); // Apply to all requests

app.use('/api/admin', adminRoutes);

app.use('/api/users', userRoutes);

// Sample route
app.get('/', (req, res) => {

  res.send('API is working!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
