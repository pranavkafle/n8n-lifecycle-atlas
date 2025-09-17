// n8n Function node (not Function Item)
// Purpose: Normalize incoming JSON into per-program packages (lean)
// - Exclude campaigns with state: archived, stopped, draft
// - Messages assigned to exactly one parent (campaign -> newsletter -> transactional)
// - Remove null/undefined fields, output_id, can_segment_on_variation from messages
// - Only campaigns include program_state; newsletters/transactionals do not

function parseIncoming(item) {
  let raw = item?.json?.body ?? item?.json?.data ?? item?.json;

  // File upload (binary) support
  if (item?.binary && typeof item.binary === 'object') {
    const uploadFile = item.binary['Upload_File'] || item.binary['Upload File'];
    if (uploadFile?.data) {
      const fileContent = Buffer.from(uploadFile.data, 'base64').toString('utf8');
      return JSON.parse(fileContent);
    }
  }

  if (typeof raw === 'string') return JSON.parse(raw);
  if (raw && typeof raw === 'object') {
    if (raw.body && typeof raw.body === 'string') return JSON.parse(raw.body);
    return raw;
  }
  throw new Error('No usable input found.');
}

// Remove null/undefined; also drop output_id and can_segment_on_variation
function cleanMessage(msg) {
  const cleaned = {};
  for (const [k, v] of Object.entries(msg)) {
    if (
      v !== null &&
      v !== undefined &&
      k !== 'output_id' &&
      k !== 'can_segment_on_variation'
    ) {
      cleaned[k] = v;
    }
  }
  return cleaned;
}

function buildPrograms(data) {
  const programs = [];

  const campaignMessagesMap = {};
  const newsletterMessagesMap = {};
  const transactionalMessagesMap = {};

  // Assign each message to exactly one parent
  (data.messages || []).forEach((msg) => {
    const cleaned = cleanMessage(msg);
    if (msg.campaign_id) {
      (campaignMessagesMap[msg.campaign_id] ||= []).push(cleaned);
    } else if (msg.newsletter_id) {
      (newsletterMessagesMap[msg.newsletter_id] ||= []).push(cleaned);
    } else if (msg.transactional_message_id) {
      (transactionalMessagesMap[msg.transactional_message_id] ||= []).push(cleaned);
    }
  });

  // Branch messages belong only to campaigns
  (data.branch_messages || []).forEach((bmsg) => {
    if (!bmsg.campaign_id) return;
    const cleaned = cleanMessage(bmsg);
    (campaignMessagesMap[bmsg.campaign_id] ||= []).push(cleaned);
  });

  // Campaigns (exclude archived, stopped, draft)
  (data.campaigns || []).forEach((c) => {
    const state = (c.state || '').toLowerCase();
    if (['archived', 'stopped', 'draft'].includes(state)) return;

    programs.push({
      program_type: 'Campaign',
      program_id: c.id,
      program_name: c.name,
      program_state: c.state ?? null,
      messages: campaignMessagesMap[c.id] || [],
    });
  });

  // Newsletters (no program_state key)
  (data.newsletters || []).forEach((n) => {
    programs.push({
      program_type: 'Newsletter',
      program_id: n.id,
      program_name: n.name,
      messages: newsletterMessagesMap[n.id] || [],
    });
  });

  // Transactionals (no program_state key)
  (data.transactional_messages || []).forEach((t) => {
    programs.push({
      program_type: 'Transactional',
      program_id: t.id,
      program_name: t.name,
      messages: transactionalMessagesMap[t.id] || [],
    });
  });

  return programs;
}

// Entrypoint
return items.map((item) => {
  const data = parseIncoming(item);
  const programs = buildPrograms(data);
  return { json: { programs } };
});
