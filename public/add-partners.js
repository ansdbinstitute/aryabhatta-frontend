// Copy and paste this ENTIRE script in browser console after logging into ERP
// Make sure you're on the ERP dashboard page

(async () => {
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

  const token = localStorage.getItem('erp_token') || localStorage.getItem('token');
  if (!token) { alert('Please login to ERP first!'); return; }

  const API = 'http://localhost:1337/api';

  for (const p of partners) {
    try {
      const blob = await fetch(`/images/partners/${p.file}`).then(r => r.blob());
      const file = new File([blob], p.file, { type: 'image/png' });
      const formData = new FormData();
      formData.append('files', file);

      const upload = await fetch(`${API}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const uploadData = await upload.json();
      const imageId = uploadData[0]?.id;
      if (!imageId) throw new Error('Upload failed');

      const create = await fetch(`${API}/placement-partners`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: { companyName: p.name, website: p.website, displayOrder: p.order, isActive: true, logo: imageId }
        })
      });
      const createData = await create.json();
      console.log(`✓ ${p.name} created`);
    } catch (err) {
      console.error(`✗ ${p.name}:`, err.message);
    }
  }
  alert('Done! Check the Career page.');
})();
