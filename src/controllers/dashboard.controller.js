const Ticket = require('../models/Ticket.model');

const getDashboardStats = async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();

    const statusCounts = await Ticket.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const ticketsPerEngineer = await Ticket.aggregate([
      { $match: { assignedTo: { $ne: null } } },
      {
        $group: {
          _id: "$assignedTo",
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      totalTickets,
      statusCounts,
      ticketsPerEngineer
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDashboardStats
};
