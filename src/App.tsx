import React, { useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/Header';
import MonthlySummaryCard from './components/MonthlySummaryCard';
import StatsRow from './components/StatsRow';
import FilterPills from './components/FilterPills';
import StudentList from './components/StudentList';
import AddStudentModal from './components/AddStudentModal';
import PaymentModal from './components/PaymentModal';
import MonthlySummary from './components/MonthlySummary';
import AttendancePage from './components/AttendancePage';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Student, Payment, AttendanceRecord } from './types';
import { getCurrentMonthKey, getMonthKeyFromDate, groupPaymentsByMonth } from './utils/paymentUtils';

function App() {
  const [students, setStudents] = useLocalStorage<Student[]>('students', []);
  const [payments, setPayments] = useLocalStorage<Payment[]>('payments', []);
  const [attendance, setAttendance] = useLocalStorage<AttendanceRecord[]>('attendance', []);
  const [currentTab, setCurrentTab] = useState<'students' | 'summary' | 'attendance'>('students');
  const [filter, setFilter] = useState<'all' | 'paid' | 'notPaid'>('all');
  const [sortOrderAsc, setSortOrderAsc] = useState(true);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedStudentForPayment, setSelectedStudentForPayment] = useState<Student | null>(null);

  const currentMonth = getCurrentMonthKey();
  const startMonth = '2026-03';
  const [selectedPaymentMonth, setSelectedPaymentMonth] = useState<string>(startMonth);

  const monthOptions = useMemo(() => {
    const options = [] as { key: string; label: string }[];
    const [startYear, startMonthIndex] = startMonth.split('-').map(Number);
    const [currentYear, currentMonthIndex] = currentMonth.split('-').map(Number);

    let year = currentYear;
    let monthIdx = currentMonthIndex - 1;
    while (year > startYear || (year === startYear && monthIdx >= startMonthIndex - 1)) {
      const d = new Date(year, monthIdx, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      options.push({ key, label });
      monthIdx -= 1;
      if (monthIdx < 0) {
        monthIdx = 11;
        year -= 1;
      }
    }

    return options;
  }, [currentMonth, startMonth]);

  const getMonthlyPayment = (studentId: string, month: string) => {
    const record = payments.find(payment => getMonthKeyFromDate(payment.date) === month && payment.studentId === studentId);
    return record ? record.amount : 0;
  };

  const studentStatus = (student: Student) => getMonthlyPayment(student.id, selectedPaymentMonth) > 0;

  const filteredStudents = useMemo(() => {
    const base = students.filter(student => {
      if (filter === 'paid') return studentStatus(student);
      if (filter === 'notPaid') return !studentStatus(student);
      return true;
    });

    return [...base].sort((a, b) => {
      if (sortOrderAsc) return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });
  }, [students, filter, sortOrderAsc, selectedPaymentMonth]);

  const monthlyGroups = useMemo(() => {
    const raw = groupPaymentsByMonth(payments);
    const map = new Map(raw.map(group => [group.monthKey, group]));
    return monthOptions.map(option =>
      map.get(option.key) ?? { monthKey: option.key, items: [], total: 0, paidStudents: 0 }
    );
  }, [payments, monthOptions]);

  const paidCount = students.filter(student => getMonthlyPayment(student.id, selectedPaymentMonth) > 0).length;
  const unpaidCount = students.length - paidCount;
  const totalCollected = payments
    .filter(payment => getMonthKeyFromDate(payment.date) === selectedPaymentMonth)
    .reduce((total, item) => total + item.amount, 0);

  const stats = [
    { label: 'Unpaid', value: `${unpaidCount}`, color: 'bg-red-400', icon: '🔴' },
    { label: 'Paid', value: `${paidCount}`, color: 'bg-brand-500', icon: '🟢' },
    { label: 'Collected', value: `$${totalCollected.toFixed(2)}`, color: 'bg-brand-600', icon: '💰' }
  ];

  const openAddModal = () => {
    setEditStudent(null);
    setAddModalOpen(true);
  };

  const handleSaveStudent = (studentInput: Omit<Student, 'id' | 'lastPaidMonth' | 'lastPaidAmount'>) => {
    if (editStudent) {
      setStudents(prev => prev.map(item => item.id === editStudent.id ? { ...item, ...studentInput } : item));
      setEditStudent(null);
    } else {
      const newStudent: Student = {
        id: uuidv4(),
        ...studentInput,
      };
      setStudents(prev => [...prev, newStudent]);
    }
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(prev => prev.filter(item => item.id !== id));
    setPayments(prev => prev.filter(payment => payment.studentId !== id));
  };

  const handleEditStudent = (student: Student) => {
    setEditStudent(student);
    setAddModalOpen(true);
  };

  const handleMarkPaid = (student: Student) => {
    setSelectedStudentForPayment(student);
    setPaymentModalOpen(true);
  };

  const handlePaymentSave = (amount: number) => {
    if (!selectedStudentForPayment) return;

    const monthKey = selectedPaymentMonth;
    const paymentDate = `${monthKey}-01T00:00:00.000Z`;

    const updatedStudent: Student = {
      ...selectedStudentForPayment,
      lastPaidMonth: monthKey,
      lastPaidAmount: amount
    };

    setStudents(prev => prev.map(s => (s.id === selectedStudentForPayment.id ? updatedStudent : s)));

    setPayments(prev => {
      const otherPayments = prev.filter(p => !(p.studentId === selectedStudentForPayment.id && getMonthKeyFromDate(p.date) === monthKey));
      const paymentRecord: Payment = {
        id: uuidv4(),
        studentId: selectedStudentForPayment.id,
        amount,
        date: paymentDate,
        studentName: selectedStudentForPayment.name
      };
      return [...otherPayments, paymentRecord];
    });

    setSelectedStudentForPayment(null);
    setPaymentModalOpen(false);
  };

  const handlePaymentUpdate = (studentId: string, amount: number) => {
    const monthKey = selectedPaymentMonth;
    const paymentDate = `${monthKey}-01T00:00:00.000Z`;
    const student = students.find(s => s.id === studentId);

    if (!student) return;

    const updatedStudent: Student = {
      ...student,
      lastPaidMonth: monthKey,
      lastPaidAmount: amount
    };

    setStudents(prev => prev.map(s => (s.id === studentId ? updatedStudent : s)));

    setPayments(prev => {
      const otherPayments = prev.filter(p => !(p.studentId === studentId && getMonthKeyFromDate(p.date) === monthKey));
      if (amount === 0) return otherPayments;
      const paymentRecord: Payment = {
        id: uuidv4(),
        studentId,
        amount,
        date: paymentDate,
        studentName: student.name
      };
      return [...otherPayments, paymentRecord];
    });
  };

  const studentMonthlyAmounts = useMemo(() => {
    const map = new Map<string, number>();
    students.forEach(student => {
      map.set(student.id, getMonthlyPayment(student.id, selectedPaymentMonth));
    });
    return map;
  }, [students, payments, selectedPaymentMonth]);

  const studentMap = useMemo(() => {
    const map = new Map<string, string>();
    students.forEach(student => map.set(student.id, student.name));
    return map;
  }, [students]);

  const summaryGroups = monthOptions.map(option => {
    const paymentsByMonth = payments.filter(payment => getMonthKeyFromDate(payment.date) === option.key);

    const paymentMap = new Map(paymentsByMonth.map(payment => [payment.studentId, payment]));

    const items = students.map(student => {
      const payment = paymentMap.get(student.id);
      return {
        id: payment ? payment.id : `${option.key}-${student.id}`,
        studentId: student.id,
        studentName: student.name,
        amount: payment ? payment.amount : 0,
        date: payment ? payment.date : `${option.key}-01T00:00:00.000Z`
      };
    });

    const total = items.reduce((sum, item) => sum + item.amount, 0);
    const paidStudents = items.filter(item => item.amount > 0).length;

    return {
      monthKey: option.key,
      items,
      total,
      paidStudents
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-brand-100 to-brand-200 text-slate-900">
      <Header
        currentMonth={currentMonth}
        selectedFilter={filter}
        onFilterChange={setFilter}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onSort={() => setSortOrderAsc(prev => !prev)}
      />

      <main className="pb-28">
        {currentTab === 'students' ? (
          <div className="space-y-4 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-brand-100 bg-white/80 p-4 shadow-sm">
            <div>
              <p className="text-sm font-medium text-slate-600">Payment Month</p>
              <select
                value={selectedPaymentMonth}
                onChange={e => setSelectedPaymentMonth(e.target.value)}
                className="mt-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              >
                {monthOptions.map(option => (
                  <option key={option.key} value={option.key}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Selected month total</p>
              <p className="text-lg font-semibold text-brand-800">{selectedPaymentMonth}</p>
            </div>
          </div>

          <MonthlySummaryCard
              currentMonth={selectedPaymentMonth}
              totalCollected={totalCollected}
              paidCount={paidCount}
              totalStudents={students.length}
            />

            <StatsRow stats={stats} />

            <FilterPills selected={filter} onChange={setFilter} />

            <div className="rounded-2xl border border-brand-50 bg-white/70 p-3 shadow-sm">
              <StudentList
                students={filteredStudents}
                onDelete={handleDeleteStudent}
                onEdit={handleEditStudent}
                onMarkPaid={handleMarkPaid}
                monthlyAmounts={studentMonthlyAmounts}
              />
            </div>
          </div>
        ) : currentTab === 'summary' ? (
          <MonthlySummary
            groups={summaryGroups}
            selectedMonth={selectedPaymentMonth}
            students={students}
            onPaymentUpdate={handlePaymentUpdate}
            monthLabel={monthOptions.find(opt => opt.key === selectedPaymentMonth)?.label}
            onMonthChange={setSelectedPaymentMonth}
            monthOptions={monthOptions}
          />
        ) : (
          <AttendancePage
            students={students}
            attendance={attendance}
            onUpdateAttendance={setAttendance}
          />
        )}
      </main>

      {currentTab === 'students' && (
        <button
          type="button"
          onClick={openAddModal}
          className="fixed bottom-6 right-5 z-20 rounded-full bg-brand-500 p-4 text-2xl text-white shadow-xl transition hover:bg-brand-600"
        >
          +
        </button>
      )}

      <AddStudentModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleSaveStudent}
        editStudent={editStudent}
      />

      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        student={selectedStudentForPayment}
        onSave={handlePaymentSave}
      />
    </div>
  );
}

export default App;
