const User = require("../models/User.model");
const Ticket = require("../models/Ticket.model");

const getAdminOverview = async (req, res) => {
  try {
    // Sales users with ticket count
    const sales = await User.aggregate([
      { $match: { role: "sales" } },
      {
        $lookup: {
          from: "tickets",
          localField: "_id",
          foreignField: "createdBy",
          as: "tickets",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          totalTickets: { $size: "$tickets" },
        },
      },
    ]);

    // Engineers with skills & ticket stats
    const engineers = await User.aggregate([
      { $match: { role: "engineer" } },
      {
        $lookup: {
          from: "tickets",
          localField: "_id",
          foreignField: "assignedTo",
          as: "tickets",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          skills: 1,
          totalAssigned: { $size: "$tickets" },
          resolved: {
            $size: {
              $filter: {
                input: "$tickets",
                as: "t",
                cond: { $eq: ["$$t.status", "resolved"] },
              },
            },
          },
          open: {
            $size: {
              $filter: {
                input: "$tickets",
                as: "t",
                cond: { $ne: ["$$t.status", "resolved"] },
              },
            },
          },
        },
      },
    ]);

    res.json({ sales, engineers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdminOverview };