const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');

const {
  getDashboardStats
} = require('../controllers/dashboard.controller');

router.get(
  '/',
  verifyToken,
  authorizeRoles('admin'),
  getDashboardStats
);

module.exports = router;
