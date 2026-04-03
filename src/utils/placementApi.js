import axios from 'axios';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || '';

const placementApi = {
  getPartners: async () => {
    try {
      const response = await axios.get(`${STRAPI_URL}/api/placement-partners`, {
        params: {
          filters: { isActive: true },
          sort: ['displayOrder:asc', 'createdAt:desc'],
          populate: ['logo']
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching partners:', error);
      return { data: [] };
    }
  },

  getTestimonials: async () => {
    try {
      const response = await axios.get(`${STRAPI_URL}/api/student-testimonials`, {
        params: {
          filters: { isActive: true },
          sort: ['displayOrder:asc', 'createdAt:desc'],
          populate: ['student', 'student.profileImage', 'course', 'batch']
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return { data: [] };
    }
  }
};

export default placementApi;
