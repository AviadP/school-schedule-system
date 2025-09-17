// Tests for configuration constants
import { CONFIG } from '../js/config.js';

describe('CONFIG constants', () => {
    
    test('should have all required top-level properties', () => {
        expect(CONFIG.DAYS).toBeDefined();
        expect(CONFIG.DAY_NAMES).toBeDefined();
        expect(CONFIG.TIME_SLOTS).toBeDefined();
        expect(CONFIG.GRADE_LEVELS).toBeDefined();
        expect(CONFIG.COLORS).toBeDefined();
        expect(CONFIG.EXCEL).toBeDefined();
        expect(CONFIG.MESSAGES).toBeDefined();
    });

    describe('DAYS array', () => {
        test('should contain exactly 6 Hebrew days', () => {
            expect(CONFIG.DAYS).toHaveLength(6);
            expect(CONFIG.DAYS).toEqual(['א', 'ב', 'ג', 'ד', 'ה', 'ו']);
        });
    });

    describe('DAY_NAMES mapping', () => {
        test('should have names for all days', () => {
            CONFIG.DAYS.forEach(day => {
                expect(CONFIG.DAY_NAMES[day]).toBeDefined();
                expect(typeof CONFIG.DAY_NAMES[day]).toBe('string');
            });
        });

        test('should contain proper Hebrew day names', () => {
            expect(CONFIG.DAY_NAMES['א']).toBe('יום ראשון');
            expect(CONFIG.DAY_NAMES['ב']).toBe('יום שני');
            expect(CONFIG.DAY_NAMES['ו']).toBe('יום שישי');
        });
    });

    describe('TIME_SLOTS array', () => {
        test('should contain 6 time periods', () => {
            expect(CONFIG.TIME_SLOTS).toHaveLength(6);
        });

        test('should have proper time format', () => {
            CONFIG.TIME_SLOTS.forEach(slot => {
                expect(slot).toMatch(/^\d{2}:\d{2}-\d{2}:\d{2}$/);
            });
        });

        test('should start with morning period', () => {
            expect(CONFIG.TIME_SLOTS[0]).toBe('08:30-09:20');
        });
    });

    describe('GRADE_LEVELS mapping', () => {
        test('should have all three grade levels', () => {
            expect(Object.keys(CONFIG.GRADE_LEVELS)).toHaveLength(3);
            expect(CONFIG.GRADE_LEVELS['3-4']).toBeDefined();
            expect(CONFIG.GRADE_LEVELS['5-6']).toBeDefined();
            expect(CONFIG.GRADE_LEVELS['7-9']).toBeDefined();
        });

        test('should have Hebrew display names', () => {
            expect(CONFIG.GRADE_LEVELS['3-4']).toBe('כיתות ג-ד');
            expect(CONFIG.GRADE_LEVELS['5-6']).toBe('כיתות ה-ו');
            expect(CONFIG.GRADE_LEVELS['7-9']).toBe('כיתות ז-ט');
        });
    });

    describe('COLORS configuration', () => {
        test('should have all required color properties', () => {
            expect(CONFIG.COLORS.SYNCED).toBeDefined();
            expect(CONFIG.COLORS.MANUAL).toBeDefined();
            expect(CONFIG.COLORS.CONFLICT).toBeDefined();
            expect(CONFIG.COLORS.PRIMARY).toBeDefined();
            expect(CONFIG.COLORS.SECONDARY).toBeDefined();
        });

        test('should have valid hex color codes', () => {
            Object.values(CONFIG.COLORS).forEach(color => {
                expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
            });
        });
    });

    describe('EXCEL configuration', () => {
        test('should have sheet name and file name', () => {
            expect(CONFIG.EXCEL.SHEET_NAME).toBeDefined();
            expect(CONFIG.EXCEL.FILE_NAME).toBeDefined();
            expect(typeof CONFIG.EXCEL.SHEET_NAME).toBe('string');
            expect(typeof CONFIG.EXCEL.FILE_NAME).toBe('string');
        });
    });

    describe('MESSAGES configuration', () => {
        test('should have all required message properties', () => {
            expect(CONFIG.MESSAGES.NO_SELECTION).toBeDefined();
            expect(CONFIG.MESSAGES.EXPORT_SUCCESS).toBeDefined();
            expect(CONFIG.MESSAGES.CLEAR_SUCCESS).toBeDefined();
            expect(CONFIG.MESSAGES.LOADING).toBeDefined();
        });

        test('should have Hebrew messages', () => {
            expect(CONFIG.MESSAGES.NO_SELECTION).toBe('לא נבחר');
            expect(typeof CONFIG.MESSAGES.EXPORT_SUCCESS).toBe('string');
        });
    });
});