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
    
    // Time slots for the schedule
    TIME_SLOTS: [
        '08:30-09:20',
        '09:25-10:10', 
        '10:35-11:20',
        '11:30-12:15',
        '12:30-13:15',
        '13:30-14:15'
    ],
    
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
        LOADING: 'טוען...'
    }
};