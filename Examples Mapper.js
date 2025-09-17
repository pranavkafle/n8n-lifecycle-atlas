const cleaned = [];

// 1) Extract JSON from all content[*].parts[*].text
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

// 2) Build nested tree: Stage > Cluster > ProgramType, and keep one example name
const tree = { _total: 0, stages: {} };

for (const p of cleaned) {
  if (!p || p.error) continue;

  const stage   = (p.lifecycle_stage || 'Other').trim();
  const cluster = (p.cluster || 'Other').trim();
  const type    = (p.program_type || 'Other').trim();
  const program = (p.program_name || '').trim();

  if (!tree.stages[stage]) {
    tree.stages[stage] = { _total: 0, clusters: {} };
  }
  if (!tree.stages[stage].clusters[cluster]) {
    tree.stages[stage].clusters[cluster] = { _total: 0, types: {}, examples: {} };
  }
  if (!tree.stages[stage].clusters[cluster].types[type]) {
    tree.stages[stage].clusters[cluster].types[type] = 0;
  }

  tree._total += 1;
  tree.stages[stage]._total += 1;
  tree.stages[stage].clusters[cluster]._total += 1;
  tree.stages[stage].clusters[cluster].types[type] += 1;

  // Store the example program name with the largest ID for this type
  if (program) {
    const currentExample = tree.stages[stage].clusters[cluster].examples[type];
    const currentId = p.id || 0;
    
    if (!currentExample || currentId > currentExample.id) {
      tree.stages[stage].clusters[cluster].examples[type] = {
        name: program,
        id: currentId
      };
    }
  }
}

// Helpers
const stripHtml = (s) => (s || '').replace(/<[^>]*>/g, '');
const stripTrailingCount = (s) => s.replace(/\s*\(\d+\)\s*$/, '').trim();
const normalizeTypeLabel = (label) => {
  const base = stripTrailingCount(label).trim();
  if (/^campaigns?$/i.test(base)) return 'Campaign';
  if (/^newsletter$/i.test(base)) return 'Newsletter';
  if (/^transactionals?$/i.test(base)) return 'Transactional';
  return base; // fallback
};

// Try to find the single cluster context for a given type/count
const findContextForType = (tree, typeKey, expectedCount) => {
  const candidates = [];
  for (const [stageName, stageData] of Object.entries(tree.stages)) {
    for (const [clusterName, clusterData] of Object.entries(stageData.clusters)) {
      const count = clusterData.types[typeKey] || 0;
      if (!count) continue;
      if (typeof expectedCount === 'number' && expectedCount >= 0) {
        if (count === expectedCount) candidates.push({ stageName, clusterName, clusterData });
      } else {
        candidates.push({ stageName, clusterName, clusterData });
      }
    }
  }
  if (candidates.length === 1) return candidates[0];
  if (candidates.length > 1) {
    console.warn(`Example: multiple clusters match type ${typeKey} (expected=${expectedCount ?? 'n/a'}). Using first match.`);
    return candidates[0];
  }
  return null;
};

// 3) For each incoming TYPE node, create one child node with an example program name
const outputs = [];
for (const item of items) {
  const typeNode = item.json;

  const rawLabel = stripHtml(typeNode.data?.nodeView?.data?.content || '');
  const labelCountMatch = rawLabel.match(/\((\d+)\)\s*$/);
  const expectedCount = labelCountMatch ? parseInt(labelCountMatch[1], 10) : undefined;
  const typeKey = normalizeTypeLabel(rawLabel);
  const typeId = typeNode.id;

  console.log(`Example: processing type "${typeKey}" (expected count: ${expectedCount ?? 'n/a'})`);

  const context = findContextForType(tree, typeKey, expectedCount);
  if (!context) {
    console.warn(`Example: no matching context found for type ${typeKey}.`);
    continue;
  }

  const exampleData = context.clusterData.examples?.[typeKey];
  const exampleName = exampleData?.name;
  const actualCount = context.clusterData.types?.[typeKey] || 0;
  if (!exampleName || actualCount === 0) {
    console.warn(`Example: no example available or zero count for type ${typeKey}.`);
    continue;
  }

  outputs.push({
    json: {
      payload: {
        data: {
          nodeView: {
            data: {
              type: 'text',
              content: exampleName
            }
          }
        },
        parent: {
          id: typeId
        }
      }
    }
  });
}

return outputs;


