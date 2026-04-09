const CONTACT_EMAIL = 'info@ansdb.org';

const formatField = (label, value) => `${label}: ${value || 'Not provided'}`;

export const submitContactForm = async ({ source, fullName, phone, course, message }) => {
  const subject = `${source} enquiry from ${fullName || 'Website Visitor'}`;
  const body = [
    'A new enquiry was submitted from the ANSDB website.',
    '',
    formatField('Source', source),
    formatField('Full Name', fullName),
    formatField('Phone Number', phone),
    formatField('Interested Course', course),
    '',
    'Message:',
    message || 'No message provided',
  ].join('\n');

  const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoUrl;

  return { success: true };
};
