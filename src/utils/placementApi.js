import axios from 'axios';
import { getApiBaseUrl } from '../erp/utils/helpers';

const STRAPI_URL = getApiBaseUrl();

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
          populate: '*'
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
