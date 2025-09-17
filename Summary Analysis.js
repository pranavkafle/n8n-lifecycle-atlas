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

// 3) Create flat cluster rows with hardcoded stage columns
const createFlatClusterRows = (tree) => {
  const clusters = new Set();
  
  // Collect all unique clusters
  for (const [stageName, stageData] of Object.entries(tree.stages)) {
    for (const [clusterName, clusterData] of Object.entries(stageData.clusters)) {
      clusters.add(clusterName);
    }
  }
  
  // Create one row per cluster with hardcoded stage columns
  return Array.from(clusters).sort().map(cluster => {
    const row = {
      cluster: cluster,
      "Onboarding": 0,
      "Retention": 0,
      "Reactivation and Win-back": 0,
      "Activation and Conversion": 0,
      "Loyalty and Advocacy": 0,
      "Engagement": 0,
      "Consideration": 0,
      "Awareness": 0,
      "Total": "=SUM(INDIRECT(\"B\"&ROW()&\":I\"&ROW()))"
    };
    
    // Fill in actual values
    for (const [stageName, stageData] of Object.entries(tree.stages)) {
      if (stageData.clusters[cluster]) {
        row[stageName] = stageData.clusters[cluster]._total;
      }
    }
    
    return row;
  });
};

const flatRows = createFlatClusterRows(tree);

// Create a totals row with dynamic column sum formulas (excluding current row)
const totalsRow = {
  cluster: "TOTAL",
  "Onboarding": "=SUM(INDIRECT(\"B2:B\"&(ROW()-1)))",
  "Retention": "=SUM(INDIRECT(\"C2:C\"&(ROW()-1)))", 
  "Reactivation and Win-back": "=SUM(INDIRECT(\"D2:D\"&(ROW()-1)))",
  "Activation and Conversion": "=SUM(INDIRECT(\"E2:E\"&(ROW()-1)))",
  "Loyalty and Advocacy": "=SUM(INDIRECT(\"F2:F\"&(ROW()-1)))",
  "Engagement": "=SUM(INDIRECT(\"G2:G\"&(ROW()-1)))",
  "Consideration": "=SUM(INDIRECT(\"H2:H\"&(ROW()-1)))",
  "Awareness": "=SUM(INDIRECT(\"I2:I\"&(ROW()-1)))",
  "Total": "=SUM(INDIRECT(\"J2:J\"&(ROW()-1)))"
};

// Return each cluster row as separate workflow item, plus totals row
return [
  ...flatRows.map(row => ({ json: row })),
  { json: totalsRow }
];
