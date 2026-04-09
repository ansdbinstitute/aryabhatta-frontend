import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Aryabhatta National Skill Development Board';
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://www.ansdb.org';
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

const defaultOrganizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: SITE_NAME,
  alternateName: 'ANSDB',
  url: SITE_URL,
  logo: DEFAULT_IMAGE,
  email: 'info@ansdb.org',
  telephone: '+91 90464 42337',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Natunpukur, 2nd Rabindra Sarani Lane',
    addressLocality: 'Bolpur',
    addressRegion: 'West Bengal',
    postalCode: '731204',
    addressCountry: 'India',
  },
};

const Seo = ({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  keywords = [],
  schema = [],
}) => {
  const canonicalUrl = new URL(path, SITE_URL).toString();
  const schemas = [
    defaultOrganizationSchema,
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url: canonicalUrl,
    },
    ...schema,
  ];

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en" />
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 ? <meta name="keywords" content={keywords.join(', ')} /> : null}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <link rel="canonical" href={canonicalUrl} />
      <script type="application/ld+json">{JSON.stringify(schemas)}</script>
    </Helmet>
  );
};

export default Seo;
