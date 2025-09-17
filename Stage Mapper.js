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

  // Simple mindmap nodes for Miro - stage names connected to central node (with counts)
  const createMiroMindmapNodes = (tree, parentNodeId) => {
    const mindmapNodes = [];
    
    // Create mindmap node for each stage, connected to the central node
    for (const [stageName, stageData] of Object.entries(tree.stages)) {
      mindmapNodes.push({
        payload: {
          data: {
            nodeView: {
              data: {
                type: "text",
                content: `${stageName} (${stageData._total})`
              }
            }
          },
          parent: {
            id: parentNodeId
          }
        }
      });
    }
    
    return mindmapNodes;
  };

// Get the parent node ID from the input
const parentNodeId = $input.first().json.id;

const mindmapNodes = createMiroMindmapNodes(tree, parentNodeId);

// Return Miro-ready mindmap node payloads
return mindmapNodes.map(node => ({ json: node }));
