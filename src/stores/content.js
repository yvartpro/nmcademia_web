import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../api';

export const useContentStore = defineStore('content', () => {
  const testimonials = ref([]);
  const founders = ref([]);
  const manufacturingPartners = ref([]);
  const earningStreams = ref([]);
  const loading = ref(false);

  const fetchTestimonials = async () => {
    try {
      const res = await api.get('/testimonials');
      testimonials.value = res.data;
    } catch (err) {
      console.error('fetchTestimonials failed:', err);
    }
  };

  const fetchFounders = async () => {
    try {
      const res = await api.get('/founders');
      founders.value = res.data;
    } catch (err) {
      console.error('fetchFounders failed:', err);
    }
  };

  const fetchManufacturingPartners = async () => {
    try {
      const res = await api.get('/manufacturing-partners');
      manufacturingPartners.value = res.data;
    } catch (err) {
      console.error('fetchManufacturingPartners failed:', err);
    }
  };

  const fetchEarningStreams = async () => {
    try {
      const res = await api.get('/earning-streams');
      earningStreams.value = res.data;
    } catch (err) {
      console.error('fetchEarningStreams failed:', err);
    }
  };

  const fetchAll = async () => {
    loading.value = true;
    await Promise.all([
      fetchTestimonials(),
      fetchFounders(),
      fetchManufacturingPartners(),
      fetchEarningStreams()
    ]);
    loading.value = false;
  };

  // ---- Admin CRUD ----

  const adminCreateTestimonial = async (data) => {
    const res = await api.post('/admin/testimonials', data);
    testimonials.value.push(res.data);
    return res.data;
  };

  const adminUpdateTestimonial = async (id, data) => {
    const res = await api.put(`/admin/testimonials/${id}`, data);
    const idx = testimonials.value.findIndex(t => t.id === id);
    if (idx !== -1) testimonials.value[idx] = res.data;
    return res.data;
  };

  const adminDeleteTestimonial = async (id) => {
    await api.delete(`/admin/testimonials/${id}`);
    testimonials.value = testimonials.value.filter(t => t.id !== id);
  };

  const adminCreateFounder = async (data) => {
    const res = await api.post('/admin/founders', data);
    founders.value.push(res.data);
    return res.data;
  };

  const adminUpdateFounder = async (id, data) => {
    const res = await api.put(`/admin/founders/${id}`, data);
    const idx = founders.value.findIndex(f => f.id === id);
    if (idx !== -1) founders.value[idx] = res.data;
    return res.data;
  };

  const adminDeleteFounder = async (id) => {
    await api.delete(`/admin/founders/${id}`);
    founders.value = founders.value.filter(f => f.id !== id);
  };

  const adminCreateManufacturingPartner = async (data) => {
    const res = await api.post('/admin/manufacturing-partners', data);
    manufacturingPartners.value.push(res.data);
    return res.data;
  };

  const adminUpdateManufacturingPartner = async (id, data) => {
    const res = await api.put(`/admin/manufacturing-partners/${id}`, data);
    const idx = manufacturingPartners.value.findIndex(p => p.id === id);
    if (idx !== -1) manufacturingPartners.value[idx] = res.data;
    return res.data;
  };

  const adminDeleteManufacturingPartner = async (id) => {
    await api.delete(`/admin/manufacturing-partners/${id}`);
    manufacturingPartners.value = manufacturingPartners.value.filter(p => p.id !== id);
  };

  const adminCreateEarningStream = async (data) => {
    const res = await api.post('/admin/earning-streams', data);
    earningStreams.value.push(res.data);
    return res.data;
  };

  const adminUpdateEarningStream = async (id, data) => {
    const res = await api.put(`/admin/earning-streams/${id}`, data);
    const idx = earningStreams.value.findIndex(s => s.id === id);
    if (idx !== -1) earningStreams.value[idx] = res.data;
    return res.data;
  };

  const adminDeleteEarningStream = async (id) => {
    await api.delete(`/admin/earning-streams/${id}`);
    earningStreams.value = earningStreams.value.filter(s => s.id !== id);
  };

  return {
    testimonials,
    founders,
    manufacturingPartners,
    earningStreams,
    loading,
    fetchTestimonials,
    fetchFounders,
    fetchManufacturingPartners,
    fetchEarningStreams,
    fetchAll,
    adminCreateTestimonial,
    adminUpdateTestimonial,
    adminDeleteTestimonial,
    adminCreateFounder,
    adminUpdateFounder,
    adminDeleteFounder,
    adminCreateManufacturingPartner,
    adminUpdateManufacturingPartner,
    adminDeleteManufacturingPartner,
    adminCreateEarningStream,
    adminUpdateEarningStream,
    adminDeleteEarningStream
  };
});
