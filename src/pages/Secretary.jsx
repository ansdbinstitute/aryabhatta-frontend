import React from 'react';
import SecretaryDeskHero from '../components/secretary/SecretaryDeskHero';
import SecretaryProfile from '../components/secretary/SecretaryProfile';
import SecretaryVisionValues from '../components/secretary/SecretaryVisionValues';
import SecretaryAffiliations from '../components/secretary/SecretaryAffiliations';
import SecretaryContactForm from '../components/secretary/SecretaryContactForm';
import Seo from '../components/common/Seo';

const Secretary = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-body text-slate-900 dark:text-slate-100">
      <Seo
        title="Secretary Desk | Aryabhatta National Skill Development Board"
        description="Read the ANSDB secretary’s message and vision for skill development, vocational education, and student growth in Bolpur."
        path="/secretary"
        keywords={[
          'Aryabhatta National Skill Development Board',
          'ANSDB',
          'best institute in Bolpur',
        ]}
      />
      <SecretaryDeskHero />
      <SecretaryProfile />
      <SecretaryVisionValues />
      <SecretaryAffiliations />
      <SecretaryContactForm />
    </div>
  );
};

export default Secretary;
