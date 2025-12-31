const calculateSkillScore = (ticketSkills = [], engineerSkills = []) => {
  if (!ticketSkills.length || !engineerSkills.length) return 0;

  // normalize everything
  const normalizedTicketSkills = ticketSkills.map(s =>
    s.toLowerCase().trim()
  );

  const normalizedEngineerSkills = engineerSkills.map(s =>
    s.toLowerCase().trim()
  );

  let score = 0;

  normalizedTicketSkills.forEach(skill => {
    if (normalizedEngineerSkills.includes(skill)) {
      score += 10; // exact match
    } else {
      const base = skill.split("-")[0];
      if (normalizedEngineerSkills.some(es => es.includes(base))) {
        score += 5; // related match
      }
    }
  });

  return score;
};

module.exports = calculateSkillScore;
