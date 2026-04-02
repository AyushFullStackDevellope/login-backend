require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Route imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const instituteRoutes = require('./routes/institutes');
const roleRoutes = require('./routes/roles');
const mappingRoutes = require('./routes/user-institute-roles');
const tenantRoutes = require('./routes/tenants');

// Middleware imports
const { verifyAccessToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors({ origin: "*" }));

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Route mounting
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/institutes', instituteRoutes);
app.use('/roles', roleRoutes);
app.use('/user-institute-roles', mappingRoutes);
app.use('/tenants', tenantRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'SchoolCoreOS Backend API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

