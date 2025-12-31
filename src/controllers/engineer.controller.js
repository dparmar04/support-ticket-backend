const { default: mongoose } = require('mongoose');
const Ticket = require('../models/Ticket.model');
const User = require('../models/User.model');

const getEngineerMetrics = async (req, res) => {
  try {
    const engineerId = new mongoose.Types.ObjectId(req.user.id);

    const user = await User.findById(engineerId).select("skills");

    const total = await Ticket.countDocuments({ assignedTo: engineerId });

    const byStatus = await Ticket.aggregate([
      { $match: { assignedTo: new mongoose.Types.ObjectId(engineerId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      totalAssigned: total,
      statusBreakdown: byStatus,
      skills: user.skills || [],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSkills = async (req, res) => {
  const { skills } = req.body;

  const user = await User.findById(req.user.id);

  if (!user || user.role !== "engineer") {
    return res.status(403).json({ message: "Not allowed" });
  }

  user.skills = skills;
  await user.save();

  res.json({ success: true, skills: user.skills });
};


module.exports = { getEngineerMetrics, updateSkills };
