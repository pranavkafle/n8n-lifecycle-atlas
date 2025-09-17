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

// 2) Build nested tree: Stage > Cluster > ProgramType
const tree = { _total: 0, stages: {} };

for (const p of cleaned) {
  if (!p || p.error) continue;

  const stage   = (p.lifecycle_stage || 'Other').trim();
  const cluster = (p.cluster || 'Other').trim();
  const type    = (p.program_type || 'Other').trim();

  if (!tree.stages[stage]) {
    tree.stages[stage] = { _total: 0, clusters: {} };
  }
  if (!tree.stages[stage].clusters[cluster]) {
    tree.stages[stage].clusters[cluster] = { _total: 0, types: {} };
  }
  if (!tree.stages[stage].clusters[cluster].types[type]) {
    tree.stages[stage].clusters[cluster].types[type] = 0;
  }

  tree._total += 1;
  tree.stages[stage]._total += 1;
  tree.stages[stage].clusters[cluster]._total += 1;
  tree.stages[stage].clusters[cluster].types[type] += 1;
}

// Helpers
const stripHtml = (s) => (s || '').replace(/<[^>]*>/g, '');
const stripTrailingCount = (s) => s.replace(/\s*\(\d+\)\s*$/, '').trim();

const findClusterContext = (tree, clusterName, expectedTotal) => {
  const matches = [];
  for (const [stageName, stageData] of Object.entries(tree.stages)) {
    const c = stageData.clusters[clusterName];
    if (!c) continue;
    if (typeof expectedTotal === 'number' && c._total !== expectedTotal) continue;
    matches.push({ stageName, clusterData: c });
  }
  if (matches.length === 1) return matches[0];
  if (matches.length > 1) {
    console.warn(`Cluster name "${clusterName}" matched multiple stages; using the first deterministic match.`);
    return matches[0];
  }
  return null;
};

// 3) For each incoming cluster node, create Newsletter/Campaigns/Transactional child nodes with counts
const outputs = [];
for (const item of items) {
  const clusterNode = item.json;

  const rawLabel = stripHtml(clusterNode.data?.nodeView?.data?.content || '');
  const labelCountMatch = rawLabel.match(/\((\d+)\)\s*$/);
  const expectedTotal = labelCountMatch ? parseInt(labelCountMatch[1], 10) : undefined;
  const clusterName = stripTrailingCount(rawLabel);
  const clusterId = clusterNode.id;

  console.log(`Types: processing cluster "${clusterName}" (expected total: ${expectedTotal ?? 'n/a'})`);

  const context = findClusterContext(tree, clusterName, expectedTotal);
  if (!context) {
    console.warn(`Types: cluster "${clusterName}" not found in tree.`);
    continue;
  }

  const types = context.clusterData.types || {};
  const typeMappings = [
    { key: 'Newsletter', label: 'Newsletter' },
    { key: 'Campaign', label: 'Campaigns' },
    { key: 'Transactional', label: 'Transactional' },
  ];

  for (const { key, label } of typeMappings) {
    const count = types[key] || 0;
    if (!count) continue;

    outputs.push({
      json: {
        payload: {
          data: {
            nodeView: {
              data: {
                type: 'text',
                content: `${label} (${count})`
              }
            }
          },
          parent: {
            id: clusterId
          }
        }
      }
    });
  }
}

return outputs;


