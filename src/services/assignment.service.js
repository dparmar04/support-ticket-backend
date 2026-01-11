const User = require("../models/User.model");
const calculateSkillScore = require("../utils/skillMatcher");
const DEBUG = true;

const assignEngineer = async (ticketSkills) => {
  const engineers = await User.find({ role: "engineer" });

  if (DEBUG) {
    console.log("\n📥 [Assignment Start]");
    console.log("Ticket skills:", ticketSkills);
    console.log("Available engineers:", engineers.map(e => ({
      name: e.name,
      skills: e.skills,
      activeTickets: e.activeTickets,
    })));
  }

  if (!engineers.length) {
    return null;
  }

  const scored = engineers.map(engineer => {
    const score = calculateSkillScore(ticketSkills, engineer.skills || []);
    return {
      engineer,
      score,
      activeTickets: engineer.activeTickets || 0,
    };
  });

  if (DEBUG) {
    console.log("\n📊 [Engineer Scoring]");
    scored.forEach(e => {
      console.log({
        engineer: e.engineer.name,
        skills: e.engineer.skills,
        score: e.score,
        activeTickets: e.activeTickets,
      });
    });
  }

  // filter only real skill matches
  const skilled = scored.filter(e => e.score > 0);

  // STRICT RULE: only engineers with required skills are eligible
  if (!skilled.length) {
    if (DEBUG) {
      console.log("\n❌ [Assignment Blocked]");
      console.log("No engineer has required skills:", ticketSkills);
    }

    return {
      engineer: null,
      assignmentType: "unassigned",
      confidence: 0,
      reason: "No engineer with required skills available",
    };
  }

  // Load-balance ONLY among skilled engineers
  skilled.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.activeTickets - b.activeTickets;
  });

  const selected = skilled[0];
  const assignmentType = "skill-based-load-balanced";

  if (DEBUG) {
    console.log("\n🏆 [Assignment Result]");
    console.log({
      selectedEngineer: selected.engineer.name,
      assignmentType,
      confidence: Math.min(100, selected.score * 15),
      reason: skilled.length
        ? `Matched skills: ${ticketSkills.join(", ")}`
        : "Load-based fallback",
    });
  }

  return {
    engineer: selected.engineer,
    assignmentType,
    confidence: Math.min(100, selected.score * 15),
    reason: `Assigned based on skill match (${ticketSkills.join(", ")}) and workload`,
  };

};

module.exports = assignEngineer;
