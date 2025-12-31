const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');

const { getEngineerMetrics } = require('../controllers/engineer.controller');
const { updateSkills } = require('../controllers/engineer.controller');

router.get(
  '/metrics',
  verifyToken,
  authorizeRoles('engineer'),
  getEngineerMetrics
);

router.put("/skills", verifyToken, authorizeRoles('engineer'), updateSkills);

module.exports = router;
