import { Payment, MonthlyGroup } from '../types';

export const MINIMUM_DATE = new Date('2026-04-05T00:00:00');

export const getAprilStartDate = (): string => MINIMUM_DATE.toISOString();

export const getAprilStartMonthKey = (): string => {
  const d = MINIMUM_DATE;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export const getCurrentMonthKey = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const getMonthKeyFromDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export const formatDate = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

export const isAfterStartDate = (date: string): boolean => {
  const d = new Date(date);
  return d >= MINIMUM_DATE;
};

export const groupPaymentsByMonth = (payments: Payment[]): MonthlyGroup[] => {
  const map = new Map<string, Payment[]>();

  payments.forEach(payment => {
    const key = getMonthKeyFromDate(payment.date);
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(payment);
  });

  const result: MonthlyGroup[] = [];

  for (const [monthKey, items] of map.entries()) {
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    const paidStudents = new Set(items.map(item => item.studentId)).size;

    result.push({
      monthKey,
      items: items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      total,
      paidStudents
    });
  }

  return result.sort((a, b) => (a.monthKey < b.monthKey ? 1 : -1));
};
