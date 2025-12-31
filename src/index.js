const express = require('express');
require('dotenv').config();
const dbConnect = require('./config/dbConnect.js')
const auth = require('./routes/auth.routes.js')
const userRoutes = require('./routes/user.routes.js')
const ticketRoutes = require('./routes/ticket.routes.js')
const dashboardRoutes = require('./routes/dashboard.routes')
const engineerRoutes = require('./routes/engineer.routes');
const cors = require('cors');


const app = express();

dbConnect();

// Middleware

app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.FRONTEND_URL
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use("/api/auth", auth);
app.use("/api/users", userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/engineer', engineerRoutes);


// Start the server
const PORT = process.env.PORT || 7002;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});