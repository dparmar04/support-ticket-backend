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


// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://smart-support-ticket.vercel.app",
    ];

    // allow requests with no origin (Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};


dbConnect();

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // 👈 THIS LINE IS VERY IMPORTANT



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