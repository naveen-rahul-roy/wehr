import api from './api';
import { AttendanceRecord } from '../types';

export interface ClockInResponse {
  record: AttendanceRecord;
  message: string;
}

export interface ClockOutResponse {
  record: AttendanceRecord;
  message: string;
}

// Helper to normalize MongoDB data (convert _id to id)
const normalizeAttendance = (data: any): AttendanceRecord => {
  if (data._id && !data.id) {
    data.id = data._id.toString();
  }
  if (data.employeeId && typeof data.employeeId === 'object') {
    data.employeeId = data.employeeId._id || data.employeeId.id;
  }
  // Convert date to string format if it's a Date object
  if (data.date && typeof data.date === 'object') {
    data.date = new Date(data.date).toISOString().split('T')[0];
  }
  return data;
};

export const attendanceService = {
  // Get all attendance records
  async getAllAttendance(): Promise<AttendanceRecord[]> {
    const response = await api.get('/attendance');
    return response.data.map(normalizeAttendance);
  },

  // Get attendance by employee ID
  async getAttendanceByEmployee(employeeId: string): Promise<AttendanceRecord[]> {
    const response = await api.get(`/attendance/employee/${employeeId}`);
    return response.data.map(normalizeAttendance);
  },

  // Get attendance for date range
  async getAttendanceByDateRange(startDate: string, endDate: string): Promise<AttendanceRecord[]> {
    const response = await api.get('/attendance/range', {
      params: { startDate, endDate }
    });
    return response.data.map(normalizeAttendance);
  },

  // Clock in
  async clockIn(): Promise<ClockInResponse> {
    const response = await api.post('/attendance/clock-in');
    return {
      ...response.data,
      record: normalizeAttendance(response.data.record)
    };
  },

  // Clock out
  async clockOut(): Promise<ClockOutResponse> {
    const response = await api.post('/attendance/clock-out');
    return {
      ...response.data,
      record: normalizeAttendance(response.data.record)
    };
  },

  // Create attendance record (admin)
  async createAttendanceRecord(record: Omit<AttendanceRecord, 'id'>): Promise<AttendanceRecord> {
    const response = await api.post('/attendance', record);
    return normalizeAttendance(response.data);
  },

  // Update attendance record
  async updateAttendanceRecord(id: string, record: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    const response = await api.put(`/attendance/${id}`, record);
    return normalizeAttendance(response.data);
  },

  // Delete attendance record
  async deleteAttendanceRecord(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/attendance/${id}`);
    return response.data;
  },

  // Get today's attendance for current user
  async getTodayAttendance(): Promise<AttendanceRecord | null> {
    const response = await api.get('/attendance/today');
    return response.data ? normalizeAttendance(response.data) : null;
  },
};
