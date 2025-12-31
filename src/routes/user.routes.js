const express = require('express');
const verifyToken = require('../middlewares/auth.middleware.js')
const authorizeRoles = require('../middlewares/role.middleware.js');
const User = require('../models/User.model.js');
const { getAdminOverview } = require('../controllers/admin.controller.js');
const router = express.Router();

// Only Admin Can Access this routes
router.get('/admin', verifyToken, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" })
})

router.get(
  "/admin/overview",
  verifyToken,
  authorizeRoles("admin"),
  getAdminOverview
);

// Both Admin And Manager can Access this routes
router.get('/engineer', verifyToken, authorizeRoles("admin", "Engineer"), (req, res) => {
  res.json({ message: "Welcome Engineer" })
})
// Admin only – get engineers
router.get(
  '/engineers',
  verifyToken,
  authorizeRoles('admin'),
  async (req, res) => {
    const engineers = await User.find(
      { role: 'engineer' },
      { name: 1 }
    );
    res.json(engineers);
  }
);

// All can Access this routes
router.get('/sales', verifyToken, authorizeRoles("admin", "Engineer", "sales"), (req, res) => {
  res.json({ message: "Welcome Sales" })
})

module.exports = router;