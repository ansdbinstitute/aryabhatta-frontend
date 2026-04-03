import React from 'react';
import SecretaryDeskHero from '../components/secretary/SecretaryDeskHero';
import SecretaryProfile from '../components/secretary/SecretaryProfile';
import SecretaryVisionValues from '../components/secretary/SecretaryVisionValues';
import SecretaryAffiliations from '../components/secretary/SecretaryAffiliations';
import SecretaryContactForm from '../components/secretary/SecretaryContactForm';

const Secretary = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-body text-slate-900 dark:text-slate-100">
      <SecretaryDeskHero />
      <SecretaryProfile />
      <SecretaryVisionValues />
      <SecretaryAffiliations />
      <SecretaryContactForm />
    </div>
  );
};

export default Secretary;
