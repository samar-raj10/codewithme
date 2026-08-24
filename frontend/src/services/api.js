import axios from 'axios';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Dynamic Request Interceptor injecting Supabase Authorization Bearer Token
api.interceptors.request.use(async (config) => {
  try {
    if (isSupabaseConfigured) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } else {
      const savedDemoUser = localStorage.getItem('leetrevise_demo_user');
      if (savedDemoUser) {
        const parsedUser = JSON.parse(savedDemoUser);
        config.headers.Authorization = `Bearer demo-user-${parsedUser.id}`;
      }
    }
  } catch (err) {
    console.error('Error attaching auth token to API request:', err);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export async function fetchProblems(params = {}) {
  const response = await api.get('/problems', { params });
  return response.data;
}

export async function fetchDueProblems() {
  const response = await api.get('/problems/due');
  return response.data;
}

export async function fetchStats() {
  const response = await api.get('/problems/stats');
  return response.data;
}

export async function createProblem(problemData) {
  const response = await api.post('/problems', problemData);
  return response.data;
}

export async function reviseProblem(id, action = 'complete') {
  const response = await api.patch(`/problems/${id}/revise`, { action });
  return response.data;
}

export async function updateProblem(id, updateData) {
  const response = await api.patch(`/problems/${id}`, updateData);
  return response.data;
}

export async function deleteProblem(id) {
  const response = await api.delete(`/problems/${id}`);
  return response.data;
}

export default api;
