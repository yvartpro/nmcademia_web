import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../api';

export const useContentStore = defineStore('content', () => {
  const testimonials = ref([]);
  const founders = ref([]);
  const manufacturingPartners = ref([]);
  const earningStreams = ref([]);
  const ways = ref([]);
  const faqs = ref([]);
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

  const fetchEarningStreamsAdmin = async () => {
    try {
      const res = await api.get('/admin/earning-streams');
      earningStreams.value = res.data;
    } catch (err) {
      console.error('fetchEarningStreamsAdmin failed:', err);
    }
  };

  const fetchWays = async () => {
    try {
      const res = await api.get('/ways');
      ways.value = res.data;
    } catch (err) {
      console.error('fetchWays failed:', err);
    }
  };

  const fetchWaysAdmin = async () => {
    try {
      const res = await api.get('/admin/ways');
      ways.value = res.data;
    } catch (err) {
      console.error('fetchWaysAdmin failed:', err);
    }
  };

  const fetchFAQs = async () => {
    try {
      const res = await api.get('/faqs');
      faqs.value = res.data;
    } catch (err) {
      console.error('fetchFAQs failed:', err);
    }
  };

  const fetchAll = async () => {
    loading.value = true;
    await Promise.all([
      fetchTestimonials(),
      fetchFounders(),
      fetchManufacturingPartners(),
      fetchEarningStreams(),
      fetchWays(),
      fetchFAQs()
    ]);
    loading.value = false;
  };

  const fetchAllAdmin = async () => {
    loading.value = true;
    await Promise.all([
      fetchTestimonials(),
      fetchFounders(),
      fetchManufacturingPartners(),
      fetchEarningStreamsAdmin(),
      fetchWaysAdmin(),
      fetchFAQs()
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

  const adminCreateWay = async (data) => {
    const res = await api.post('/admin/ways', data);
    ways.value.push(res.data);
    return res.data;
  };

  const adminUpdateWay = async (id, data) => {
    const res = await api.put(`/admin/ways/${id}`, data);
    const idx = ways.value.findIndex(w => w.id === id);
    if (idx !== -1) ways.value[idx] = res.data;
    return res.data;
  };

  const adminDeleteWay = async (id) => {
    await api.delete(`/admin/ways/${id}`);
    ways.value = ways.value.filter(w => w.id !== id);
  };

  const adminCreateFAQ = async (data) => {
    const res = await api.post('/admin/faqs', data);
    faqs.value.push(res.data);
    faqs.value.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return res.data;
  };

  const adminUpdateFAQ = async (id, data) => {
    const res = await api.put(`/admin/faqs/${id}`, data);
    const idx = faqs.value.findIndex(f => f.id === id);
    if (idx !== -1) faqs.value[idx] = res.data;
    faqs.value.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return res.data;
  };

  const adminDeleteFAQ = async (id) => {
    await api.delete(`/admin/faqs/${id}`);
    faqs.value = faqs.value.filter(f => f.id !== id);
  };

  return {
    testimonials,
    founders,
    manufacturingPartners,
    earningStreams,
    ways,
    faqs,
    loading,
    fetchTestimonials,
    fetchFounders,
    fetchManufacturingPartners,
    fetchEarningStreams,
    fetchEarningStreamsAdmin,
    fetchFAQs,
    fetchAll,
    fetchAllAdmin,
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
    adminDeleteEarningStream,
    adminCreateWay,
    adminUpdateWay,
    adminDeleteWay,
    adminCreateFAQ,
    adminUpdateFAQ,
    adminDeleteFAQ
  };
});
