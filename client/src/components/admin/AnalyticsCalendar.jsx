import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  TrendingUp,
  Activity,
} from "lucide-react";

const AnalyticsCalendar = ({ data = [], onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const getActivityForDate = (day) => {
    if (!data || data.length === 0) return 0;

    const dateStr = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    )
      .toISOString()
      .split("T")[0];

    const activity = data.find((d) => d.date === dateStr);
    return activity ? activity.visitors : 0;
  };

  const getActivityColor = (visitors) => {
    if (visitors === 0) return "bg-slate-800";
    if (visitors < 5) return "bg-blue-900/30";
    if (visitors < 10) return "bg-blue-700/50";
    if (visitors < 20) return "bg-blue-500/70";
    return "bg-accent";
  };

  const handleDateClick = (day) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const renderDays = () => {
    const days = [];
    const daysCount = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square p-1"></div>);
    }

    // Actual days
    for (let day = 1; day <= daysCount; day++) {
      const visitors = getActivityForDate(day);
      const dateObj = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const isToday = dateObj.toDateString() === new Date().toDateString();
      const isSelected =
        selectedDate && dateObj.toDateString() === selectedDate.toDateString();
      const isFuture = dateObj > new Date();

      days.push(
        <motion.div
          key={day}
          whileHover={{ scale: isFuture ? 1 : 1.1 }}
          className="aspect-square p-1"
        >
          <div
            onClick={() => !isFuture && handleDateClick(day)}
            className={`w-full h-full rounded-lg flex flex-col items-center justify-center transition-all ${
              isFuture
                ? "opacity-30 cursor-not-allowed"
                : "cursor-pointer hover:ring-2 hover:ring-accent"
            } ${getActivityColor(visitors)} ${
              isToday ? "ring-2 ring-white" : ""
            } ${isSelected ? "ring-2 ring-accent scale-110" : ""}`}
          >
            <span
              className={`text-xs font-medium ${
                visitors > 10 ? "text-white" : "text-slate-300"
              }`}
            >
              {day}
            </span>
            {visitors > 0 && !isFuture && (
              <span className="text-[10px] text-accent font-bold mt-0.5">
                {visitors}
              </span>
            )}
          </div>
        </motion.div>
      );
    }

    return days;
  };

  // Calculate total stats for current month
  const monthStats = data.reduce(
    (acc, day) => {
      const dayDate = new Date(day.date);
      if (
        dayDate.getMonth() === currentMonth.getMonth() &&
        dayDate.getFullYear() === currentMonth.getFullYear()
      ) {
        acc.totalVisitors += day.visitors;
        acc.activeDays += day.visitors > 0 ? 1 : 0;
      }
      return acc;
    },
    { totalVisitors: 0, activeDays: 0 }
  );

  const avgVisitors =
    monthStats.activeDays > 0
      ? Math.round(monthStats.totalVisitors / monthStats.activeDays)
      : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarIcon size={20} className="text-accent" />
            Activity Calendar
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Click any day to view detailed analytics
          </p>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-lg font-bold text-white">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={nextMonth}
          disabled={
            currentMonth.getMonth() === new Date().getMonth() &&
            currentMonth.getFullYear() === new Date().getFullYear()
          }
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Month Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Activity size={14} className="text-blue-400" />
            <p className="text-xs text-slate-400">Total Visitors</p>
          </div>
          <p className="text-xl font-bold text-white">
            {monthStats.totalVisitors}
          </p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-green-400" />
            <p className="text-xs text-slate-400">Avg per Day</p>
          </div>
          <p className="text-xl font-bold text-white">{avgVisitors}</p>
        </div>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-slate-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">{renderDays()}</div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-slate-800">
        <p className="text-xs text-slate-400 mb-3">Activity Level:</p>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-slate-800"></div>
            <span className="text-xs text-slate-500">None</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-blue-900/30"></div>
            <span className="text-xs text-slate-500">Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-blue-700/50"></div>
            <span className="text-xs text-slate-500">Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-blue-500/70"></div>
            <span className="text-xs text-slate-500">High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-accent"></div>
            <span className="text-xs text-slate-500">Very High</span>
          </div>
        </div>
      </div>

      {/* Selected Date Info */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-accent/10 border border-accent/30 rounded-lg"
        >
          <p className="text-sm text-slate-300 mb-1">
            <span className="font-bold text-accent">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </p>
          <p className="text-xs text-slate-400">
            {getActivityForDate(selectedDate.getDate())} visitors on this day
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default AnalyticsCalendar;
