import client from './api/client';

const partners = [
  { name: 'Samsung', file: 'samsung.png', website: 'https://www.samsung.com', order: 1 },
  { name: 'Xiaomi', file: 'xiaomi.png', website: 'https://www.xiaomi.com', order: 2 },
  { name: 'OPPO', file: 'oppo.png', website: 'https://www.oppo.com', order: 3 },
  { name: 'Sony', file: 'sony.png', website: 'https://www.sony.co.in', order: 4 },
  { name: 'Indus Net Technologies', file: 'indus-net.png', website: 'https://indusnettech.com', order: 5 },
  { name: 'Khosla Electronics', file: 'khosla.png', website: 'https://khoslaelectronics.com', order: 6 },
  { name: 'Maity Innovations', file: 'maity.png', website: '', order: 7 },
  { name: 'Syscentric', file: 'syscentric.png', website: '', order: 8 },
];

const TOKEN = localStorage.getItem('erp_token') || localStorage.getItem('token');

async function uploadAndCreatePartners() {
  if (!TOKEN) {
    console.error('No authentication token found. Please login to ERP first.');
    return;
  }

  client.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}`;

  for (const partner of partners) {
    try {
      // Upload image
      const imageFormData = new FormData();
      const imageBlob = await fetch(`/images/partners/${partner.file}`).then(r => r.blob());
      imageFormData.append('files', new File([imageBlob], partner.file, { type: 'image/png' }));

      const uploadRes = await client.post('/upload', imageFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const imageId = uploadRes.data[0]?.id;
      if (!imageId) {
        console.error(`Failed to upload ${partner.file}`);
        continue;
      }

      // Create partner
      const partnerData = {
        companyName: partner.name,
        website: partner.website,
        displayOrder: partner.order,
        isActive: true,
        logo: imageId
      };

      const createRes = await client.post('/placement-partners', { data: partnerData });
      console.log(`Created: ${partner.name}`, createRes.data);

    } catch (err) {
      console.error(`Error creating ${partner.name}:`, err.response?.data || err.message);
    }
  }
}

uploadAndCreatePartners();
