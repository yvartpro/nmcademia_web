/**
 * Known site settings grouped for the admin CMS.
 * Keys not listed here still appear under "Other / custom settings".
 */
export const SETTING_GROUPS = [
  {
    id: 'contact',
    title: 'Videos & contact',
    hint: 'Upload or pick your own video assets, plus WhatsApp number for trainer CTAs.',
    keys: [
      { key: 'video_url', label: 'Presentation video (site video asset)', type: 'video' },
      { key: 'video_thumbnail', label: 'Presentation video thumbnail image', type: 'image' },
      { key: 'nm_video_url', label: '"What is network marketing" video (site video asset)', type: 'video' },
      { key: 'nm_video_thumbnail', label: '"What is NM" video thumbnail image', type: 'image' },
      { key: 'risk_video', label: 'Risk / compliance short video (site video asset)', type: 'video' },
      { key: 'risk_video_thumbnail', label: 'Risk video thumbnail image', type: 'image' },
      { key: 'whatsapp_number', label: 'Trainer WhatsApp number', type: 'text' },
      { key: 'landing_cta_text', label: 'Landing hero button text', type: 'text' },
      { key: 'coaching_cta_text', label: 'Already-in-NM path button text', type: 'text' },
      { key: 'logo_url', label: 'Site logo image URL or media path', type: 'image' }
    ]
  },
  {
    id: 'landing',
    title: 'Landing page copy',
    keys: [
      { key: 'landing_hero_text', label: 'Hero confrontation text', type: 'textarea' },
      { key: 'mission_statement', label: 'Mission', type: 'textarea' },
      { key: 'objectives_statement', label: 'Objectives', type: 'textarea' },
      { key: 'vision_statement', label: 'Vision', type: 'textarea' },
      { key: 'landing_journeys', label: 'Journey cards (JSON array)', type: 'json' }
    ]
  },
  {
    id: 'wizard',
    title: 'Signup wizard',
    hint: 'JSON array fields: one item per line, or valid JSON array.',
    keys: [
      { key: 'segment_options', label: '“Which best describes you?” options', type: 'json' },
      { key: 'list_options', label: 'New / exploring checklist options', type: 'json' },
      { key: 'already_in_nm_message', label: 'Already in NM — welcome message', type: 'textarea' },
      { key: 'new_exploring_message', label: 'New / exploring — welcome message', type: 'textarea' },
      { key: 'nm_why_fail_reasons', label: 'Why distributors fail (bullets)', type: 'json' },
      { key: 'nm_coaching_benefits', label: 'Why coaching matters (bullets)', type: 'json' }
    ]
  },
  {
    id: 'partner',
    title: 'Partner company (presentation)',
    keys: [
      { key: 'partner_company_name', label: 'Partner company name', type: 'text' },
      { key: 'partner_company_intro', label: 'Partner intro', type: 'textarea' },
      { key: 'partner_company_profile', label: 'Company profile', type: 'textarea' }
    ]
  },
  {
    id: 'presentation',
    title: 'Presentation slides text',
    keys: [
      { key: 'dream_section_text', label: '“What is your dream?” section', type: 'textarea' },
      { key: 'cashflow_quadrant_explanation', label: 'Cashflow quadrant intro', type: 'textarea' },
      { key: 'cashflow_quadrant_image', label: 'Cashflow Quadrant Image URL / Media Path', type: 'image' },
      { key: 'binary_tree_video', label: 'Binary Tree Diagram Explainer Video', type: 'video' },
      { key: 'binary_system_explanation', label: 'Binary / MSB explanation', type: 'textarea' },
      { key: 'how_to_join_note', label: 'How to join — pioneer / shipping note', type: 'textarea' }
    ]
  }
];

export const JSON_SETTING_KEYS = new Set(
  SETTING_GROUPS.flatMap(g => g.keys.filter(k => k.type === 'json').map(k => k.key))
);

export const getSettingMeta = (key) => {
  for (const group of SETTING_GROUPS) {
    const found = group.keys.find(k => k.key === key);
    if (found) return found;
  }
  return null;
};
