import axios from 'axios';

// Axios instance for all collector API calls (timeout for reliability)
export const apiClient = axios.create({
  timeout: 10000,
});

/*
  API Client abstraction for collectors
  - Handles GET requests with error logging
  - Used by all collector modules for external API calls
*/
export const get = async <T>(url: string, params?: Record<string, any>): Promise<T> => {
  try {
    const response = await apiClient.get<T>(url, { params });
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching from API: ${url}`, error.message);
    throw error;
  }
};
