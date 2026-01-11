const Ticket = require('../models/Ticket.model');
const autoAssignEngineer = require('../services/assignment.service');
const User = require('../models/User.model');
const extractSkillsFromText = require("../utils/extractSkillsFromText");
/**
 * SALES → Create Ticket
 */
const createTicket = async (req, res) => {
  try {
    const { title, description, priority, category } = req.body;

    // 1️⃣ Derive ticket skills
    const categorySkillMap = {
      frontend: ['react', 'javascript'],
      backend: ['node', 'express'],
      database: ['mongodb', 'sql'],
      devops: ['docker', 'aws'],
      general: [],
    };

    console.log("\n📝 [Ticket Creation]");
    console.log({
      title,
      description,
      category,
    });

    const textSkills = extractSkillsFromText(
      `${title} ${description}`
    );

    // category is fallback ONLY
    const requiredSkills =
      textSkills.length > 0
        ? textSkills
        : category !== "general"
          ? categorySkillMap[category] || []
          : [];

    console.log("🎯 Derived skills from text:", textSkills);
    console.log("🧩 Final skills used for assignment:", requiredSkills);


    // 2️⃣ Auto assign engineer (ONLY ONCE)
    const assignment = await autoAssignEngineer(requiredSkills);

    let assignedTo = null;
    let assignmentMeta = {};

    if (assignment) {
      assignedTo = assignment.engineer._id;

      assignmentMeta = {
        autoAssigned: true,
        assignmentType: assignment.assignmentType,
        assignmentConfidence: assignment.confidence,
        assignmentReason: assignment.reason,
      };
      if (assignment) {
        console.log("🤝 Assigned Engineer:", {
          name: assignment.engineer.name,
          type: assignment.assignmentType,
          confidence: assignment.confidence,
          reason: assignment.reason,
        });
      } else {
        console.log("⚠️ No engineer assigned");
      }

      // increment engineer load
      await User.findByIdAndUpdate(assignedTo, {
        $inc: { activeTickets: 1 },
      });
    }

    // 3️⃣ Create ticket
    const ticket = await Ticket.create({
      title,
      description,
      priority,
      category,
      createdBy: req.user.id,
      status: 'open',
      assignedTo,
      ...assignmentMeta,
    });

    res.status(201).json({
      message: 'Ticket created successfully',
      ticket,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * SALES → View own tickets
 */
const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ createdBy: req.user.id }).populate("assignedTo", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ tickets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ENGINEER → View assigned tickets
 */
const getAssignedTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ assignedTo: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({ tickets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ADMIN → View all tickets
 */
const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate('createdBy', 'name role')
      .populate('assignedTo', 'name role')
      .sort({ createdAt: -1 });

    res.status(200).json({ tickets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ADMIN → Assign ticket to engineer
 */
const assignTicket = async (req, res) => {
  try {
    const { engineerId } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { assignedTo: engineerId, status: 'in-progress' },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json({
      message: 'Ticket assigned successfully',
      ticket,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ENGINEER → Update ticket status
 */
const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      'in-progress',
      'on-hold',
      'resolved',
      'rejected',
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status update' });
    }

    const ticket = await Ticket.findOne({
      _id: req.params.id,
      assignedTo: req.user.id,
    });

    if (!ticket) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (ticket.status === 'open' && status !== 'in-progress') {
      return res.status(400).json({
        message: 'Ticket must be in-progress before resolving or holding',
      });
    }

    ticket.status = status;
    await ticket.save();

    if (status === 'resolved' || status === 'rejected') {
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { activeTickets: -1 },
      });
    }

    res.status(200).json({
      message: 'Ticket status updated',
      ticket,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTicket,
  getMyTickets,
  getAssignedTickets,
  getAllTickets,
  assignTicket,
  updateTicketStatus,
};
