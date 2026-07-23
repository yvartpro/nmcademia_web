export const joinGroup = (settingsStore, type) => {
  const groupLink = type === 'new-to-mlm' ? 
  settingsStore.settings?.whatsapp_new_to_mlm_group_link : 
  settingsStore.settings?.whatsapp_mentorship_group_link;

  if (groupLink) {
    window.open(groupLink, '_blank');
  } else {
    console.error('No WhatsApp group link found in stores.');
  }
}