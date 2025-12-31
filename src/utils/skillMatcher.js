const calculateSkillScore = (ticketSkills, engineerSkills) => {
  if (!ticketSkills || !engineerSkills) return 0;

  let score = 0;

  ticketSkills.forEach(skill => {
    if (engineerSkills.includes(skill)) {
      score += 10; // exact match
    } else {
      // related skill heuristic
      const base = skill.split('-')[0];
      if (engineerSkills.some(es => es.includes(base))) {
        score += 5;
      }
    }
  });

  return score;
};

module.exports = calculateSkillScore;
