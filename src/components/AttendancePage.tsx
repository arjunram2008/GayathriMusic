import React, { useState, useMemo } from 'react';
import { Student, AttendanceRecord, ClassType } from '../types';
import Calendar from './Calendar';

type Props = {
  students: Student[];
  attendance: AttendanceRecord[];
  onUpdateAttendance: (attendance: AttendanceRecord[]) => void;
};

const classTypes: ClassType[] = [
  'Thursday - First Class',
  'Thursday - Second Class',
  'Thursday - Third Class',
  'Friday - First Class',
  'Friday - Second Class',
  'Friday - Third Class'
];

export default function AttendancePage({ students, attendance, onUpdateAttendance }: Props) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const attendanceDates = useMemo(() => {
    const dates = new Set<string>();
    attendance.forEach(record => dates.add(record.date));
    return dates;
  }, [attendance]);

  const groupedStudents = useMemo(() => {
    const groups: Record<ClassType, Student[]> = {
      'Thursday - First Class': [],
      'Thursday - Second Class': [],
      'Thursday - Third Class': [],
      'Friday - First Class': [],
      'Friday - Second Class': [],
      'Friday - Third Class': []
    };
    students.filter(s => s.classType).forEach(student => {
      groups[student.classType!].push(student);
    });
    return groups;
  }, [students]);

  const getAttendanceForDateAndClass = (date: string, classType: ClassType) => {
    return attendance.find(record => record.date === date && record.classType === classType);
  };

  const parseDateToLocal = (iso: string) => {
    const [year, month, day] = iso.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const selectedDay = parseDateToLocal(selectedDate).getDay();
  const isClassEnabled = (classType: ClassType) =>
    (selectedDay === 4 && classType.startsWith('Thursday')) ||
    (selectedDay === 5 && classType.startsWith('Friday'));

  const updateAttendance = (date: string, classType: ClassType, studentId: string, status: 'present' | 'absent') => {
    const existingRecord = getAttendanceForDateAndClass(date, classType);
    let newAttendance = [...attendance];

    if (existingRecord) {
      const updatedRecord = {
        ...existingRecord,
        students: existingRecord.students.map(s =>
          s.studentId === studentId ? { ...s, status } : s
        )
      };
      newAttendance = newAttendance.map(record =>
        record === existingRecord ? updatedRecord : record
      );
    } else {
      const studentsInClass = groupedStudents[classType].map(student => ({
        studentId: student.id,
        status: student.id === studentId ? status : 'absent' as const
      }));
      newAttendance.push({
        date,
        classType,
        students: studentsInClass
      });
    }

    onUpdateAttendance(newAttendance);
  };

  const markAllPresent = (date: string, classType: ClassType) => {
    const studentsInClass = groupedStudents[classType].map(student => ({
      studentId: student.id,
      status: 'present' as const
    }));

    const existingRecord = getAttendanceForDateAndClass(date, classType);
    let newAttendance = [...attendance];

    if (existingRecord) {
      const updatedRecord = { ...existingRecord, students: studentsInClass };
      newAttendance = newAttendance.map(record =>
        record === existingRecord ? updatedRecord : record
      );
    } else {
      newAttendance.push({
        date,
        classType,
        students: studentsInClass
      });
    }

    onUpdateAttendance(newAttendance);
  };

  const getStudentStatus = (date: string, classType: ClassType, studentId: string) => {
    const record = getAttendanceForDateAndClass(date, classType);
    return record?.students.find(s => s.studentId === studentId)?.status;
  };

  const studentSummaries = useMemo(() => {
    const summaries: Record<string, { present: number; total: number; percentage: number }> = {};
    students.forEach(student => {
      if (!student.classType) return;
      const classAttendance = attendance.filter(record => record.classType === student.classType);
      const total = classAttendance.length;
      const present = classAttendance.filter(record =>
        record.students.find(s => s.studentId === student.id)?.status === 'present'
      ).length;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
      summaries[student.id] = { present, total, percentage };
    });
    return summaries;
  }, [students, attendance]);

  return (
    <div className="p-4 space-y-6">
      <Calendar
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        attendanceDates={attendanceDates}
      />

      <div className="flex items-center gap-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Selected Date</span>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </label>
      </div>

      {classTypes.map(classType => {
        if (!isClassEnabled(classType)) return null;
        const studentsInClass = groupedStudents[classType];
        if (studentsInClass.length === 0) return null;

        return (
          <div key={classType} className="rounded-2xl border border-brand-50 bg-white/70 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">{classType}</h3>
              <button
                onClick={() => markAllPresent(selectedDate, classType)}
                className="rounded-lg bg-brand-500 px-3 py-1 text-sm text-white hover:bg-brand-600"
              >
                Mark All Present
              </button>
            </div>
            <div className="space-y-2">
              {studentsInClass.map(student => {
                const status = getStudentStatus(selectedDate, classType, student.id);
                const summary = studentSummaries[student.id];
                return (
                  <div key={student.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                    <div>
                      <span className="font-medium text-slate-900">{student.name}</span>
                      {summary && (
                        <div className="text-xs text-slate-600">
                          {summary.present}/{summary.total} ({summary.percentage}%)
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateAttendance(selectedDate, classType, student.id, 'present')}
                        className={`rounded-lg px-3 py-1 text-sm font-semibold transition ${
                          status === 'present'
                            ? 'bg-brand-500 text-white'
                            : status === 'absent'
                            ? 'bg-slate-200 text-slate-700 hover:bg-brand-100'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        ✅ Present
                      </button>
                      <button
                        onClick={() => updateAttendance(selectedDate, classType, student.id, 'absent')}
                        className={`rounded-lg px-3 py-1 text-sm font-semibold transition ${
                          status === 'absent'
                            ? 'bg-red-500 text-white'
                            : status === 'present'
                            ? 'bg-slate-200 text-slate-700 hover:bg-red-100'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        ❌ Absent
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}