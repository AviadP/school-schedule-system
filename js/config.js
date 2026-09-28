// Configuration constants for the school schedule system

export const CONFIG = {
    // Days of the week in Hebrew
    DAYS: ['א', 'ב', 'ג', 'ד', 'ה', 'ו'],
    
    // Day names in Hebrew (full names)
    DAY_NAMES: {
        'א': 'יום ראשון',
        'ב': 'יום שני', 
        'ג': 'יום שלישי',
        'ד': 'יום רביעי',
        'ה': 'יום חמישי',
        'ו': 'יום שישי'
    },
    
    // Clock time of each period (schedule hour key -> time), 2026-27 timetable.
    // Hour 0 is the morning meeting; hour 8 does not exist and hour 10 has no published time.
    PERIOD_TIMES: {
        '0': '08:15-08:25',
        '1': '08:30-09:10',
        '2': '09:15-09:55',
        '3': '10:20-11:00',
        '4': '11:05-11:45',
        '5': '11:55-12:35',
        '6': '12:40-13:20',
        '7': '13:30-14:10',
        '9': '14:50-15:30'
    },
    
    // Grade level display names
    GRADE_LEVELS: {
        '3-4': 'כיתות ג-ד',
        '5-6': 'כיתות ה-ו', 
        '7-9': 'כיתות ז-ט'
    },
    
    // Colors for UI elements
    COLORS: {
        SYNCED: '#e8f5e9',      // Light green for synced courses
        MANUAL: '#fff3e0',      // Light orange for manual selection
        CONFLICT: '#ffebee',    // Light red for conflicts
        PRIMARY: '#4CAF50',     // Primary green
        SECONDARY: '#2196F3'    // Secondary blue
    },
    
    // Excel export settings
    EXCEL: {
        SHEET_NAME: 'מערכת שעות',
        FILE_NAME: 'schedule.xlsx'
    },
    
    // UI messages in Hebrew
    MESSAGES: {
        NO_SELECTION: 'לא נבחר',
        EXPORT_SUCCESS: 'המערכת יוצאה בהצלחה',
        CLEAR_SUCCESS: 'הבחירות נוקו',
        CONFIRM_REBUILD: 'יש לך בחירות קיימות. יצירת המערכת מחדש תמחק אותן. להמשיך?',
        LOADING: 'טוען...'
    }
};