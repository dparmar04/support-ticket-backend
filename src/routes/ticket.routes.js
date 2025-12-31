const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');

const {
  createTicket,
  getMyTickets,
  getAssignedTickets,
  getAllTickets,
  assignTicket,
  updateTicketStatus,
} = require('../controllers/ticket.controller');

// SALES
router.post(
  '/',
  verifyToken,
  authorizeRoles('sales'),
  createTicket
);

router.get(
  '/my',
  verifyToken,
  authorizeRoles('sales'),
  getMyTickets
);

// ENGINEER
router.get(
  '/assigned',
  verifyToken,
  authorizeRoles('engineer'),
  getAssignedTickets
);

router.patch(
  '/:id/status',
  verifyToken,
  authorizeRoles('engineer'),
  updateTicketStatus
);

// ADMIN
router.get(
  '/all',
  verifyToken,
  authorizeRoles('admin'),
  getAllTickets
);

router.patch(
  '/:id/assign',
  verifyToken,
  authorizeRoles('admin'),
  assignTicket
);

module.exports = router;
