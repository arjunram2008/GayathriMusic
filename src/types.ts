export type PaymentMethod = 'Bank of America' | 'PayPal';

export type ClassType = 'Thursday - First Class' | 'Thursday - Second Class' | 'Friday - First Class' | 'Friday - Second Class' | 'Friday - Third Class';

export type Student = {
  id: string;
  name: string;
  parentName?: string;
  phone?: string;
  paymentMethod: PaymentMethod;
  classType?: ClassType;
  lastPaidMonth?: string;
  lastPaidAmount?: number;
};

export type Payment = {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  studentName?: string;
};

export type AttendanceRecord = {
  date: string; // YYYY-MM-DD
  classType: ClassType;
  students: {
    studentId: string;
    status: 'present' | 'absent';
  }[];
};

export type MonthlyGroup = {
  monthKey: string;
  items: Payment[];
  total: number;
  paidStudents: number;
};
