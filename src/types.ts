export type PaymentMethod = 'Bank of America' | 'PayPal';

export type Student = {
  id: string;
  name: string;
  phone?: string;
  paymentMethod: PaymentMethod;
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

export type MonthlyGroup = {
  monthKey: string;
  items: Payment[];
  total: number;
  paidStudents: number;
};
