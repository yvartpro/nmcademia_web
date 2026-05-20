import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../api';

export const useLeadsStore = defineStore('leads', () => {
  const leads = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchLeads = async (filters = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('/admin/leads', { params: filters });
      leads.value = response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch leads';
    } finally {
      loading.value = false;
    }
  };

  const submitLead = async (leadData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/leads', leadData);
      return response.data.lead;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to submit details';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateLeadStatus = async (id, status) => {
    try {
      const response = await api.put(`/admin/leads/${id}/status`, { status });
      const idx = leads.value.findIndex(l => l.id === id);
      if (idx !== -1) {
        leads.value[idx] = response.data.lead;
      }
      return true;
    } catch (err) {
      console.error('Failed to update status:', err);
      return false;
    }
  };

  const deleteLead = async (id) => {
    try {
      await api.delete(`/admin/leads/${id}`);
      leads.value = leads.value.filter(l => l.id !== id);
      return true;
    } catch (err) {
      console.error('Failed to delete lead:', err);
      return false;
    }
  };

  return {
    leads,
    loading,
    error,
    fetchLeads,
    submitLead,
    updateLeadStatus,
    deleteLead
  };
});
