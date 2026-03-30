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
import { useLocalStorage } from './hooks/useLocalStorage';
import { Student, Payment } from './types';
import { getCurrentMonthKey, getMonthKeyFromDate, groupPaymentsByMonth } from './utils/paymentUtils';

function App() {
  const [students, setStudents] = useLocalStorage<Student[]>('students', []);
  const [payments, setPayments] = useLocalStorage<Payment[]>('payments', []);
  const [currentTab, setCurrentTab] = useState<'students' | 'summary'>('students');
  const [filter, setFilter] = useState<'all' | 'paid' | 'notPaid'>('all');
  const [sortOrderAsc, setSortOrderAsc] = useState(true);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedStudentForPayment, setSelectedStudentForPayment] = useState<Student | null>(null);

  const currentMonth = getCurrentMonthKey();
  const studentStatus = (student: Student) => student.lastPaidMonth === currentMonth;

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
  }, [students, filter, sortOrderAsc, currentMonth]);

  const monthlyGroups = groupPaymentsByMonth(payments);

  const paidCount = students.filter(student => student.lastPaidMonth === currentMonth).length;
  const unpaidCount = students.length - paidCount;
  const totalCollected = payments
    .filter(payment => getMonthKeyFromDate(payment.date) === currentMonth)
    .reduce((total, item) => total + item.amount, 0);

  const stats = [
    { label: 'Unpaid', value: `${unpaidCount}`, color: 'bg-rose-500', icon: '🔴' },
    { label: 'Paid', value: `${paidCount}`, color: 'bg-emerald-500', icon: '🟢' },
    { label: 'Collected', value: `$${totalCollected.toFixed(2)}`, color: 'bg-emerald-600', icon: '💰' }
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

    const now = new Date();
    const monthKey = currentMonth;
    const paymentDate = now.toISOString();

    const updatedStudent: Student = {
      ...selectedStudentForPayment,
      lastPaidMonth: monthKey,
      lastPaidAmount: amount
    };

    setStudents(prev => prev.map(s => (s.id === selectedStudentForPayment.id ? updatedStudent : s)));

    const paymentRecord: Payment = {
      id: uuidv4(),
      studentId: selectedStudentForPayment.id,
      amount,
      date: paymentDate,
      studentName: selectedStudentForPayment.name
    };

    setPayments(prev => [...prev, paymentRecord]);

    setSelectedStudentForPayment(null);
    setPaymentModalOpen(false);
  };

  const studentMap = useMemo(() => {
    const map = new Map<string, string>();
    students.forEach(student => map.set(student.id, student.name));
    return map;
  }, [students]);

  const summaryGroups = monthlyGroups.map(group => ({
    ...group,
    items: group.items.map(item => ({
      ...item,
      studentName: studentMap.get(item.studentId) ?? item.studentId
    }))
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-slate-50 to-emerald-50 text-slate-900">
      <Header
        currentMonth={currentMonth}
        selectedFilter={filter}
        onFilterChange={setFilter}
        onOpenSummary={() => setCurrentTab(prev => (prev === 'students' ? 'summary' : 'students'))}
        onSort={() => setSortOrderAsc(prev => !prev)}
        showSummary={currentTab === 'summary'}
      />

      <main className="pb-28">
        {currentTab === 'students' ? (
          <div className="space-y-4 p-4">
            <MonthlySummaryCard
              currentMonth={currentMonth}
              totalCollected={totalCollected}
              paidCount={paidCount}
              totalStudents={students.length}
            />

            <StatsRow stats={stats} />

            <FilterPills selected={filter} onChange={setFilter} />

            <div className="rounded-2xl border border-emerald-50 bg-white/70 p-3 shadow-sm">
              <StudentList
                students={filteredStudents}
                onDelete={handleDeleteStudent}
                onEdit={handleEditStudent}
                onMarkPaid={handleMarkPaid}
              />
            </div>
          </div>
        ) : (
          <MonthlySummary
            groups={summaryGroups}
            onScreenBack={() => setCurrentTab('students')}
          />
        )}
      </main>

      <button
        type="button"
        onClick={openAddModal}
        className="fixed bottom-6 right-5 z-20 rounded-full bg-brand-500 p-4 text-2xl text-white shadow-xl transition hover:bg-brand-600"
      >
        +
      </button>

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
