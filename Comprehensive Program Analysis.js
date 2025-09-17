const cleaned = [];

// Extract JSON from all content[*].parts[*].text
const content = $('Aggregate').first().json.content;
if (content) {
  for (const c of content) {
    if (c.parts) {
      for (const p of c.parts) {
        if (p.text) {
          const match = p.text.match(/{[\s\S]*}/);
          if (match) {
            try {
              cleaned.push(JSON.parse(match[0]));
            } catch (e) {
              cleaned.push({ error: 'Invalid JSON', raw: match[0] });
            }
          }
        }
      }
    }
  }
}

// Return each cleaned item as separate workflow item
return cleaned.map(item => ({ json: item }));
