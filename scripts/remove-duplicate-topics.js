const fs = require('fs');
const path = require('path');

// Read topics.json
const topicsPath = path.join(__dirname, '..', 'data', 'topics.json');
const topics = JSON.parse(fs.readFileSync(topicsPath, 'utf8'));

console.log(`Total topics before cleanup: ${topics.length}`);

// Group topics by subject + grade + quarter
const grouped = {};
topics.forEach(topic => {
  const key = `${topic.subject}-${topic.grade}-${topic.quarter}`;
  if (!grouped[key]) {
    grouped[key] = [];
  }
  grouped[key].push(topic);
});

// Find duplicates (where there are 2+ topics for same grade+quarter+subject)
const toRemove = [];
Object.entries(grouped).forEach(([key, topicsInGroup]) => {
  if (topicsInGroup.length > 1) {
    // Sort by order
    topicsInGroup.sort((a, b) => a.order - b.order);

    // Keep only the first one, mark others for removal
    const toKeep = topicsInGroup[0];
    const toDelete = topicsInGroup.slice(1);

    console.log(`\n${key}:`);
    console.log(`  ✓ Keeping: "${toKeep.title}" (order: ${toKeep.order})`);
    toDelete.forEach(t => {
      console.log(`  ✗ Removing: "${t.title}" (order: ${t.order})`);
      toRemove.push(t.id);
    });
  }
});

// Filter out duplicates
const cleanedTopics = topics.filter(t => !toRemove.includes(t.id));

console.log(`\n\nTotal topics after cleanup: ${cleanedTopics.length}`);
console.log(`Removed ${toRemove.length} duplicate topics`);

// Save cleaned topics
fs.writeFileSync(topicsPath, JSON.stringify(cleanedTopics, null, 2), 'utf8');
console.log(`\n✓ Cleaned topics.json saved!`);
