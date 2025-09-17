// Tests for schedule data loading functionality
import { 
    getScheduleData, 
    getAvailableGradeLevels, 
    getGradeLevelDisplayName 
} from '../data/schedule-loader.js';
import { CONFIG } from '../js/config.js';

describe('Schedule Loader Functions', () => {

    describe('getScheduleData()', () => {
        test('should return schedule data for valid grade level', () => {
            const schedule34 = getScheduleData('3-4');
            const schedule56 = getScheduleData('5-6');
            const schedule79 = getScheduleData('7-9');

            expect(schedule34).toBeDefined();
            expect(schedule56).toBeDefined();
            expect(schedule79).toBeDefined();
            expect(typeof schedule34).toBe('object');
            expect(typeof schedule56).toBe('object');
            expect(typeof schedule79).toBe('object');
        });

        test('should return default schedule (3-4) for invalid grade level', () => {
            const defaultSchedule = getScheduleData('3-4');
            const invalidSchedule = getScheduleData('invalid-grade');
            
            expect(invalidSchedule).toEqual(defaultSchedule);
        });

        test('should return default schedule when no parameter provided', () => {
            const defaultSchedule = getScheduleData('3-4');
            const noParamSchedule = getScheduleData();
            
            expect(noParamSchedule).toEqual(defaultSchedule);
        });

        test('should contain time slots matching CONFIG.TIME_SLOTS', () => {
            const schedule = getScheduleData('3-4');
            
            CONFIG.TIME_SLOTS.forEach(timeSlot => {
                expect(schedule[timeSlot]).toBeDefined();
            });
        });

        test('should contain day data for each time slot', () => {
            const schedule = getScheduleData('5-6');
            
            Object.keys(schedule).forEach(timeSlot => {
                CONFIG.DAYS.forEach(day => {
                    expect(schedule[timeSlot][day]).toBeDefined();
                    expect(Array.isArray(schedule[timeSlot][day])).toBe(true);
                });
            });
        });

        test('should have course objects with required properties', () => {
            const schedule = getScheduleData('3-4');
            
            // Find first non-empty course array
            let foundCourse = false;
            Object.values(schedule).forEach(timeSlot => {
                Object.values(timeSlot).forEach(courses => {
                    if (courses.length > 0) {
                        const course = courses[0];
                        expect(course).toHaveProperty('course');
                        expect(course).toHaveProperty('variant');
                        expect(course).toHaveProperty('teacher');
                        expect(typeof course.course).toBe('string');
                        expect(typeof course.teacher).toBe('string');
                        foundCourse = true;
                    }
                });
            });
            expect(foundCourse).toBe(true);
        });
    });

    describe('getAvailableGradeLevels()', () => {
        test('should return all three grade levels', () => {
            const gradeLevels = getAvailableGradeLevels();
            
            expect(gradeLevels).toHaveLength(3);
            expect(gradeLevels).toContain('3-4');
            expect(gradeLevels).toContain('5-6');
            expect(gradeLevels).toContain('7-9');
        });

        test('should return an array', () => {
            const gradeLevels = getAvailableGradeLevels();
            expect(Array.isArray(gradeLevels)).toBe(true);
        });
    });

    describe('getGradeLevelDisplayName()', () => {
        test('should return correct Hebrew names for valid grade levels', () => {
            expect(getGradeLevelDisplayName('3-4')).toBe('כיתות ג-ד');
            expect(getGradeLevelDisplayName('5-6')).toBe('כיתות ה-ו');
            expect(getGradeLevelDisplayName('7-9')).toBe('כיתות ז-ט');
        });

        test('should return original value for invalid grade level', () => {
            expect(getGradeLevelDisplayName('invalid')).toBe('invalid');
            expect(getGradeLevelDisplayName('1-2')).toBe('1-2');
        });

        test('should handle undefined input gracefully', () => {
            expect(getGradeLevelDisplayName(undefined)).toBe(undefined);
            expect(getGradeLevelDisplayName(null)).toBe(null);
        });
    });

    describe('Data Structure Validation', () => {
        test('all schedules should have consistent structure', () => {
            const gradeLevels = getAvailableGradeLevels();
            
            gradeLevels.forEach(gradeLevel => {
                const schedule = getScheduleData(gradeLevel);
                
                // Check time slots
                CONFIG.TIME_SLOTS.forEach(timeSlot => {
                    expect(schedule[timeSlot]).toBeDefined();
                    
                    // Check days
                    CONFIG.DAYS.forEach(day => {
                        expect(schedule[timeSlot][day]).toBeDefined();
                        expect(Array.isArray(schedule[timeSlot][day])).toBe(true);
                    });
                });
            });
        });

        test('should not have any undefined courses', () => {
            const gradeLevels = getAvailableGradeLevels();
            
            gradeLevels.forEach(gradeLevel => {
                const schedule = getScheduleData(gradeLevel);
                
                Object.values(schedule).forEach(timeSlot => {
                    Object.values(timeSlot).forEach(courses => {
                        courses.forEach(course => {
                            expect(course).toBeDefined();
                            expect(course.course).toBeDefined();
                            expect(course.teacher).toBeDefined();
                            // variant can be empty string but should be defined
                            expect(course.hasOwnProperty('variant')).toBe(true);
                        });
                    });
                });
            });
        });
    });
});