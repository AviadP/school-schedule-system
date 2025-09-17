// מערכת טעינת נתוני מערכות שעות
import scheduleData34 from './schedules/schedule-3-4.js';
import scheduleData56 from './schedules/schedule-5-6.js';
import scheduleData79 from './schedules/schedule-7-9.js';

// אובייקט מרכזי של כל המערכות
const allSchedules = {
    '3-4': scheduleData34,
    '5-6': scheduleData56,
    '7-9': scheduleData79
};

// פונקציה לקבלת מערכת לפי רמת כיתה
export function getScheduleData(gradeLevel = '3-4') {
    return allSchedules[gradeLevel] || allSchedules['3-4'];
}

// פונקציה לקבלת רשימת כל רמות הכיתות הזמינות
export function getAvailableGradeLevels() {
    return Object.keys(allSchedules);
}

// פונקציה לקבלת שם תצוגה לרמת כיתה
export function getGradeLevelDisplayName(gradeLevel) {
    const displayNames = {
        '3-4': 'כיתות ג-ד',
        '5-6': 'כיתות ה-ו',
        '7-9': 'כיתות ז-ט'
    };
    return displayNames[gradeLevel] || gradeLevel;
}

// ייצוא ברירת מחדל של כל המערכות
export default allSchedules;