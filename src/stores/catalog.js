import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../api';

export const useCatalogStore = defineStore('catalog', () => {
  const countries = ref([]);
  const packages = ref([]);
  const products = ref([]);
  const selectedCountryCode = ref(localStorage.getItem('selected_country') || 'NG');
  const loading = ref(false);

  const selectedCountry = computed(() => {
    return countries.value.find(c => c.code === selectedCountryCode.value) || countries.value[0];
  });

  const fetchCountries = async () => {
    try {
      const response = await api.get('/countries');
      countries.value = response.data;
    } catch (err) {
      console.error('Fetch countries failed:', err);
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await api.get('/packages');
      packages.value = response.data;
    } catch (err) {
      console.error('Fetch packages failed:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      products.value = response.data;
    } catch (err) {
      console.error('Fetch products failed:', err);
    }
  };

  const selectCountry = (code) => {
    selectedCountryCode.value = code;
    localStorage.setItem('selected_country', code);
  };

  // Admin CRUD for Countries
  const adminFetchCountries = async () => {
    const response = await api.get('/admin/countries');
    countries.value = response.data;
  };

  const adminCreateCountry = async (data) => {
    const response = await api.post('/admin/countries', data);
    countries.value.push(response.data);
  };

  const adminUpdateCountry = async (id, data) => {
    const response = await api.put(`/admin/countries/${id}`, data);
    const idx = countries.value.findIndex(c => c.id === id);
    if (idx !== -1) countries.value[idx] = response.data;
  };

  const adminDeleteCountry = async (id) => {
    await api.delete(`/admin/countries/${id}`);
    countries.value = countries.value.filter(c => c.id !== id);
  };

  // Admin CRUD for Products
  const adminCreateProduct = async (data) => {
    const response = await api.post('/admin/products', data);
    products.value.push(response.data);
  };

  const adminUpdateProduct = async (id, data) => {
    const response = await api.put(`/admin/products/${id}`, data);
    const idx = products.value.findIndex(p => p.id === id);
    if (idx !== -1) products.value[idx] = response.data;
  };

  const adminDeleteProduct = async (id) => {
    await api.delete(`/admin/products/${id}`);
    products.value = products.value.filter(p => p.id !== id);
  };

  // Admin CRUD for Packages
  const adminCreatePackage = async (data) => {
    const response = await api.post('/admin/packages', data);
    packages.value.push(response.data);
  };

  const adminUpdatePackage = async (id, data) => {
    const response = await api.put(`/admin/packages/${id}`, data);
    const idx = packages.value.findIndex(p => p.id === id);
    if (idx !== -1) packages.value[idx] = response.data;
  };

  const adminDeletePackage = async (id) => {
    await api.delete(`/admin/packages/${id}`);
    packages.value = packages.value.filter(p => p.id !== id);
  };

  return {
    countries,
    packages,
    products,
    selectedCountryCode,
    selectedCountry,
    loading,
    fetchCountries,
    fetchPackages,
    fetchProducts,
    selectCountry,
    adminFetchCountries,
    adminCreateCountry,
    adminUpdateCountry,
    adminDeleteCountry,
    adminCreateProduct,
    adminUpdateProduct,
    adminDeleteProduct,
    adminCreatePackage,
    adminUpdatePackage,
    adminDeletePackage
  };
});
