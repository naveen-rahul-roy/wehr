import api from './api';
import { Employee } from '../types';

// Helper to normalize MongoDB data (convert _id to id)
const normalizeEmployee = (data: any): Employee => {
  if (data._id && !data.id) {
    data.id = data._id.toString();
  }
  if (data.departmentId && typeof data.departmentId === 'object') {
    data.departmentId = data.departmentId._id || data.departmentId.id;
  }
  return data;
};

export const employeeService = {
  // Get all employees
  async getAllEmployees(): Promise<Employee[]> {
    const response = await api.get('/employees');
    return response.data.map(normalizeEmployee);
  },

  // Get employee by ID
  async getEmployeeById(id: string): Promise<Employee> {
    const response = await api.get(`/employees/${id}`);
    return normalizeEmployee(response.data);
  },

  // Create new employee
  async createEmployee(employee: Omit<Employee, 'id'>): Promise<Employee> {
    const response = await api.post('/employees', employee);
    // Backend returns { employee: ..., message: ... }, so extract the employee
    const employeeData = response.data.employee || response.data;
    return normalizeEmployee(employeeData);
  },

  // Update employee
  async updateEmployee(id: string, employee: Partial<Employee>): Promise<Employee> {
    const response = await api.put(`/employees/${id}`, employee);
    return normalizeEmployee(response.data);
  },

  // Delete employee
  async deleteEmployee(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  // Get employees by department
  async getEmployeesByDepartment(departmentId: string): Promise<Employee[]> {
    const response = await api.get(`/employees?departmentId=${departmentId}`);
    return response.data.map(normalizeEmployee);
  },
};
