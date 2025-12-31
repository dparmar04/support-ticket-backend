const skillMap = require("./skillKeywordMap");
const DEBUG = true;

module.exports = (text) => {
  const lower = text.toLowerCase();
  const skills = new Set();

  for (const skill in skillMap) {
    if (skillMap[skill].some(k => lower.includes(k))) {
      skills.add(skill);
    }
  }

  if (DEBUG) {
    console.log("🧠 [Skill Extraction]");
    console.log("Text:", text);
    console.log("Extracted skills:", Array.from(skills));
  }

  return Array.from(skills);
};
