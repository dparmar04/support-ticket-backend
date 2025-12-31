const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'on-hold', 'resolved', 'rejected'],
    default: 'open',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  category: {
    type: String,
    enum: ['frontend', 'backend', 'database', 'devops', 'general'],
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  autoAssigned: {
    type: Boolean,
    default: false,
  },
  assignmentType: {
    type: String,
    enum: ['skill-match', 'related-skill', 'load-balance'],
    default: null,
  },
  assignmentConfidence: {
    type: Number, // 0–100
    default: null,
  },
  assignmentReason: {
    type: String,
    default: null,
  },
  statusHistory: [
    {
      status: String,
      changedAt: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Ticket', TicketSchema);