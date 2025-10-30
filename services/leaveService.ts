import api from './api';
import { LeaveRequest, LeaveBalance } from '../types';

// Helper to normalize MongoDB data (convert _id to id)
const normalizeLeaveRequest = (data: any): LeaveRequest => {
  if (data._id && !data.id) {
    data.id = data._id.toString();
  }
  if (data.employeeId && typeof data.employeeId === 'object') {
    data.employeeId = data.employeeId._id || data.employeeId.id;
  }
  return data;
};

export const leaveService = {
  // Get all leave requests
  async getAllLeaveRequests(): Promise<LeaveRequest[]> {
    const response = await api.get('/leaves');
    return response.data.map(normalizeLeaveRequest);
  },

  // Get leave requests by employee
  async getLeaveRequestsByEmployee(employeeId: string): Promise<LeaveRequest[]> {
    const response = await api.get(`/leaves?employeeId=${employeeId}`);
    return response.data.map(normalizeLeaveRequest);
  },

  // Get leave request by ID
  async getLeaveRequestById(id: string): Promise<LeaveRequest> {
    const response = await api.get(`/leaves/${id}`);
    return normalizeLeaveRequest(response.data);
  },

  // Create leave request
  async createLeaveRequest(request: Omit<LeaveRequest, 'id' | 'status'>): Promise<LeaveRequest> {
    const response = await api.post('/leaves', request);
    return normalizeLeaveRequest(response.data);
  },

  // Update leave request status
  async updateLeaveRequestStatus(id: string, status: string): Promise<LeaveRequest> {
    const response = await api.put(`/leaves/${id}`, { status });
    return normalizeLeaveRequest(response.data);
  },

  // Delete leave request
  async deleteLeaveRequest(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/leaves/${id}`);
    return response.data;
  },

  // Get leave balance for employee
  async getLeaveBalance(employeeId: string): Promise<LeaveBalance> {
    const response = await api.get(`/leaves/balance/${employeeId}`);
    return response.data;
  },

  // Get all leave balances
  async getAllLeaveBalances(): Promise<LeaveBalance[]> {
    const response = await api.get('/leaves/balance');
    return response.data;
  },
};
