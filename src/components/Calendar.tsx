import React, { useState } from 'react';

type Props = {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  attendanceDates: Set<string>;
};

export default function Calendar({ selectedDate, onDateSelect, attendanceDates }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const month = currentMonth.getMonth();
  const year = currentMonth.getFullYear();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

  const dates = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  return (
    <div className="rounded-2xl border border-brand-50 bg-white/70 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="text-slate-600 hover:text-slate-900">‹</button>
        <h3 className="text-lg font-semibold text-slate-900">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={nextMonth} className="text-slate-600 hover:text-slate-900">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-slate-600">
            {day}
          </div>
        ))}
        {dates.map(date => {
          const dateStr = formatDate(date);
          const isCurrentMonth = date.getMonth() === month;
          const hasAttendance = attendanceDates.has(dateStr);
          const isSelected = dateStr === selectedDate;
          return (
            <button
              key={dateStr}
              onClick={() => onDateSelect(dateStr)}
              className={`p-2 text-center text-sm rounded-lg transition ${
                isCurrentMonth
                  ? isSelected
                    ? 'bg-brand-500 text-white'
                    : hasAttendance
                    ? 'bg-brand-100 text-brand-800'
                    : 'text-slate-900 hover:bg-slate-100'
                  : 'text-slate-400'
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}