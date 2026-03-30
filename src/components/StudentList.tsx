import React from 'react';
import { Student } from '../types';
import StudentCard from './StudentCard';

type Props = {
  students: Student[];
  onDelete: (id: string) => void;
  onEdit: (student: Student) => void;
  onMarkPaid: (student: Student) => void;
};

export default function StudentList({ students, onDelete, onEdit, onMarkPaid }: Props) {
  if (!students.length) {
    return (
      <div className="mx-4 mt-8 rounded-3xl border border-amber-100 bg-amber-50/70 p-8 text-center shadow-sm">
        <div className="mb-3 text-4xl">🎵</div>
        <h3 className="text-xl font-semibold text-emerald-800">No students yet</h3>
        <p className="mt-2 text-sm text-slate-600">Tap the + button to add your first student and start tracking payments.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4">
      {students.map(student => (
        <StudentCard key={student.id} student={student} onDelete={onDelete} onEdit={onEdit} onMarkPaid={onMarkPaid} />
      ))}
    </div>
  );
}
