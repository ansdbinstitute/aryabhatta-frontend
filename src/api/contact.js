const CONTACT_EMAIL = 'info@ansdb.org';
const DIRECTOR_EMAIL = 'director@ansdb.org';

const formatField = (label, value) => `${label}: ${value || 'Not provided'}`;

export const submitContactForm = async ({ source, fullName, phone, course, message, recipient }) => {
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

  const mailtoUrl = `mailto:${recipient || CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoUrl;

  alert(`Your message has been prepared in your email client for ${recipient || CONTACT_EMAIL}. Please clicks "Send" in your email app to finish.`);

  return { success: true };
};
