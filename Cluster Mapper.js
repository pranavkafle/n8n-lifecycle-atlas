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

  // Ensure stage exists
  if (!tree.stages[stage]) {
    tree.stages[stage] = { _total: 0, clusters: {} };
  }

  // Ensure cluster exists under stage
  if (!tree.stages[stage].clusters[cluster]) {
    tree.stages[stage].clusters[cluster] = { _total: 0, types: {} };
  }

  // Ensure type counter exists under cluster
  if (!tree.stages[stage].clusters[cluster].types[type]) {
    tree.stages[stage].clusters[cluster].types[type] = 0;
  }

  // Increment counts at all levels
  tree._total += 1;
  tree.stages[stage]._total += 1;
  tree.stages[stage].clusters[cluster]._total += 1;
  tree.stages[stage].clusters[cluster].types[type] += 1;
}

// 3) Create cluster mindmap nodes for a specific stage only
const createClustersForStage = (tree, stageName, stageId) => {
  const clusterNodes = [];
  
  // Find the stage data in the tree
  const stageData = tree.stages[stageName];
  
  if (!stageData) {
    console.warn(`Stage "${stageName}" not found in tree`);
    console.warn(`Available stages:`, Object.keys(tree.stages));
    return [];
  }
  
  console.log(`Found ${Object.keys(stageData.clusters).length} clusters for stage "${stageName}"`);
  
  // Create mindmap node for each cluster under this stage
  for (const [clusterName, clusterData] of Object.entries(stageData.clusters)) {
    clusterNodes.push({
      payload: {
        data: {
          nodeView: {
            data: {
              type: "text",
              content: `${clusterName} (${stageData.clusters[clusterName]._total})`
            }
          }
        },
        parent: {
          id: stageId
        }
      }
    });
  }
  
  return clusterNodes;
};

// 4) Process ALL incoming stage nodes and create clusters for each
const outputs = [];
for (const item of items) {
  const stageNode = item.json;

  // Extract stage name from the content (remove HTML + trailing counts like " (86)")
  const stageContent = stageNode.data?.nodeView?.data?.content || '';
  const stageName = stageContent
    .replace(/<[^>]*>/g, '')     // strip HTML
    .replace(/\s*\(\d+\)\s*$/, '') // strip trailing count
    .trim();
  const stageId = stageNode.id;

  // Debug logging per stage
  console.log(`Processing stage: "${stageName}" (ID: ${stageId})`);
  console.log(`Available stages in tree:`, Object.keys(tree.stages));

  const clusterNodes = createClustersForStage(tree, stageName, stageId);

  console.log(`Generated ${clusterNodes.length} clusters for stage "${stageName}"`);
  if (clusterNodes.length > 0) {
    console.log(`Cluster names:`, clusterNodes.map(n => n.payload.data.nodeView.data.content));
  }

  for (const node of clusterNodes) {
    outputs.push({ json: node });
  }
}

// Return Miro-ready cluster mindmap node payloads for ALL stages
return outputs;
