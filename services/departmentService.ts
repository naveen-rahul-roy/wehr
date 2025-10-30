import api from './api';
import { Department } from '../types';

// Helper to normalize MongoDB data (convert _id to id)
const normalizeDepartment = (data: any): Department => {
  if (data._id && !data.id) {
    data.id = data._id.toString();
  }
  if (data.managerId && typeof data.managerId === 'object') {
    data.managerId = data.managerId._id || data.managerId.id;
  }
  return data;
};

export const departmentService = {
  // Get all departments
  async getAllDepartments(): Promise<Department[]> {
    const response = await api.get('/departments');
    return response.data.map(normalizeDepartment);
  },

  // Get department by ID
  async getDepartmentById(id: string): Promise<Department> {
    const response = await api.get(`/departments/${id}`);
    return normalizeDepartment(response.data);
  },

  // Create new department
  async createDepartment(department: Omit<Department, 'id'>): Promise<Department> {
    const response = await api.post('/departments', department);
    return normalizeDepartment(response.data);
  },

  // Update department
  async updateDepartment(id: string, department: Partial<Department>): Promise<Department> {
    const response = await api.put(`/departments/${id}`, department);
    return normalizeDepartment(response.data);
  },

  // Delete department
  async deleteDepartment(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/departments/${id}`);
    return response.data;
  },
};
