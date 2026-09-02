// Tests for utility functions
import {
    getDayName,
    isSpecialCourse,
    courseCreatesConflicts,
    createCourseKey,
    parseCourseKey,
    createCourseValue,
    parseCourseValue,
    formatCourseDisplay,
    isValidTimeSlot,
    isValidDayLetter,
    isValidGradeLevel,
    hasValidTeacher,
    createCourseObject,
    calculateStats,
    escapeHtml,
    escapeCsvCell,
    isSameCourseSelection,
    isSyntheticVariant,
    SYNTHETIC_VARIANT_PREFIX,
    hasRealSection
} from '../js/utils.js';

describe('Utility Functions', () => {

    describe('getDayName()', () => {
        test('should return Hebrew day names for valid day letters', () => {
            expect(getDayName('א')).toBe('יום ראשון');
            expect(getDayName('ב')).toBe('יום שני');
            expect(getDayName('ג')).toBe('יום שלישי');
            expect(getDayName('ד')).toBe('יום רביעי');
            expect(getDayName('ה')).toBe('יום חמישי');
            expect(getDayName('ו')).toBe('יום שישי');
        });

        test('should return original value for invalid day letters', () => {
            expect(getDayName('ז')).toBe('ז');
            expect(getDayName('invalid')).toBe('invalid');
            expect(getDayName('')).toBe('');
        });
    });

    describe('isSpecialCourse()', () => {
        test('should return true for special courses', () => {
            expect(isSpecialCourse('ספרייה')).toBe(true);
            expect(isSpecialCourse('ספריה')).toBe(true);
            expect(isSpecialCourse('פרלמנט')).toBe(true);
            expect(isSpecialCourse('פרלמנט/שעה דמוקרטית')).toBe(true);
            expect(isSpecialCourse('שעת חיבורים')).toBe(true);
            expect(isSpecialCourse('שעת ועדות')).toBe(true);
        });

        test('should return false for regular courses', () => {
            expect(isSpecialCourse('אנגלית')).toBe(false);
            expect(isSpecialCourse('חשבון')).toBe(false);
            expect(isSpecialCourse('עברית')).toBe(false);
            expect(isSpecialCourse('')).toBe(false);
        });
    });

    describe('courseCreatesConflicts()', () => {
        test('should return false for special courses', () => {
            expect(courseCreatesConflicts('ספרייה')).toBe(false);
            expect(courseCreatesConflicts('פרלמנט')).toBe(false);
        });

        test('should return true for regular courses', () => {
            expect(courseCreatesConflicts('אנגלית')).toBe(true);
            expect(courseCreatesConflicts('חשבון')).toBe(true);
        });
    });

    describe('createCourseKey() and parseCourseKey()', () => {
        test('should create and parse course keys correctly', () => {
            const key = createCourseKey('08:30-09:20', 'א');
            expect(key).toBe('08:30-09:20_א');

            const parsed = parseCourseKey(key);
            expect(parsed.time).toBe('08:30-09:20');
            expect(parsed.day).toBe('א');
        });

        test('should handle empty values', () => {
            const key = createCourseKey('', '');
            expect(key).toBe('_');

            const parsed = parseCourseKey(key);
            expect(parsed.time).toBe('');
            expect(parsed.day).toBe('');
        });
    });

    describe('createCourseValue() and parseCourseValue()', () => {
        test('should create and parse course values correctly', () => {
            const value = createCourseValue('אנגלית', '1', 'מורה א');
            expect(value).toBe('אנגלית|1|מורה א');

            const parsed = parseCourseValue(value);
            expect(parsed.course).toBe('אנגלית');
            expect(parsed.variant).toBe('1');
            expect(parsed.teacher).toBe('מורה א');
        });

        test('should handle empty variant', () => {
            const value = createCourseValue('חשבון', '', 'מורה ב');
            expect(value).toBe('חשבון||מורה ב');

            const parsed = parseCourseValue(value);
            expect(parsed.course).toBe('חשבון');
            expect(parsed.variant).toBe('');
            expect(parsed.teacher).toBe('מורה ב');
        });
    });

    describe('formatCourseDisplay()', () => {
        test('should format course with variant', () => {
            const display = formatCourseDisplay('אנגלית', '1', 'מורה א');
            expect(display).toBe('אנגלית (1) - מורה א');
        });

        test('should format course without variant', () => {
            const display = formatCourseDisplay('חשבון', '', 'מורה ב');
            expect(display).toBe('חשבון - מורה ב');
        });

        test('should handle null variant', () => {
            const display = formatCourseDisplay('עברית', null, 'מורה ג');
            expect(display).toBe('עברית - מורה ג');
        });
    });

    describe('isValidTimeSlot()', () => {
        test('should validate correct time slot format', () => {
            expect(isValidTimeSlot('08:30-09:20')).toBe(true);
            expect(isValidTimeSlot('12:30-13:15')).toBe(true);
            expect(isValidTimeSlot('23:59-00:00')).toBe(true);
        });

        test('should reject invalid time slot formats', () => {
            expect(isValidTimeSlot('8:30-9:20')).toBe(false);
            expect(isValidTimeSlot('08:30-9:20')).toBe(false);
            expect(isValidTimeSlot('08:30_09:20')).toBe(false);
            expect(isValidTimeSlot('invalid')).toBe(false);
            expect(isValidTimeSlot('')).toBe(false);
        });
    });

    describe('isValidDayLetter()', () => {
        test('should validate Hebrew day letters', () => {
            expect(isValidDayLetter('א')).toBe(true);
            expect(isValidDayLetter('ב')).toBe(true);
            expect(isValidDayLetter('ו')).toBe(true);
        });

        test('should reject invalid day letters', () => {
            expect(isValidDayLetter('ז')).toBe(false);
            expect(isValidDayLetter('a')).toBe(false);
            expect(isValidDayLetter('')).toBe(false);
            expect(isValidDayLetter('1')).toBe(false);
        });
    });

    describe('isValidGradeLevel()', () => {
        test('should validate grade levels', () => {
            expect(isValidGradeLevel('3-4')).toBe(true);
            expect(isValidGradeLevel('5-6')).toBe(true);
            expect(isValidGradeLevel('7-9')).toBe(true);
        });

        test('should reject invalid grade levels', () => {
            expect(isValidGradeLevel('1-2')).toBe(false);
            expect(isValidGradeLevel('10-12')).toBe(false);
            expect(isValidGradeLevel('')).toBe(false);
            expect(isValidGradeLevel('invalid')).toBe(false);
        });
    });

    describe('hasValidTeacher()', () => {
        test('should return true for valid teacher names', () => {
            expect(hasValidTeacher('מורה א')).toBe(true);
            expect(hasValidTeacher('John Doe')).toBe(true);
            expect(hasValidTeacher('מ')).toBe(true);
        });

        test('should return false for invalid teacher names', () => {
            expect(hasValidTeacher('')).toBe(false);
            expect(hasValidTeacher('   ')).toBe(false);
            expect(hasValidTeacher(null)).toBe(false);
            expect(hasValidTeacher(undefined)).toBe(false);
        });
    });

    describe('createCourseObject()', () => {
        test('should create course object with default isAutoSynced', () => {
            const course = createCourseObject('אנגלית', '1', 'מורה א');
            expect(course).toEqual({
                course: 'אנגלית',
                variant: '1',
                teacher: 'מורה א',
                isAutoSynced: false
            });
        });

        test('should create course object with custom isAutoSynced', () => {
            const course = createCourseObject('חשבון', '2', 'מורה ב', true);
            expect(course).toEqual({
                course: 'חשבון',
                variant: '2',
                teacher: 'מורה ב',
                isAutoSynced: true
            });
        });
    });

    describe('calculateStats()', () => {
        test('should calculate statistics correctly', () => {
            const selectedCourses = {
                '08:30-09:20_א': { course: 'אנגלית', variant: '1', teacher: 'מורה א', isAutoSynced: false },
                '08:30-09:20_ב': { course: 'אנגלית', variant: '1', teacher: 'מורה א', isAutoSynced: true },
                '09:25-10:10_א': { course: 'חשבון', variant: '1', teacher: 'מורה ב', isAutoSynced: false },
                '09:25-10:10_ב': { course: 'עברית', variant: '1', teacher: 'מורה ג', isAutoSynced: true }
            };

            const stats = calculateStats(selectedCourses);
            expect(stats).toEqual({
                manualSelections: 2,
                autoSynced: 2,
                totalSlots: 4,
                uniqueCourses: 3
            });
        });

        test('should handle empty selectedCourses', () => {
            const stats = calculateStats({});
            expect(stats).toEqual({
                manualSelections: 0,
                autoSynced: 0,
                totalSlots: 0,
                uniqueCourses: 0
            });
        });

        test('should count unique courses correctly', () => {
            const selectedCourses = {
                '08:30-09:20_א': { course: 'אנגלית', variant: '1', teacher: 'מורה א', isAutoSynced: false },
                '08:30-09:20_ב': { course: 'אנגלית', variant: '1', teacher: 'מורה א', isAutoSynced: true },
                '09:25-10:10_א': { course: 'אנגלית', variant: '2', teacher: 'מורה ב', isAutoSynced: false }
            };

            const stats = calculateStats(selectedCourses);
            expect(stats.uniqueCourses).toBe(2); // אנגלית variant 1 and אנגלית variant 2
        });
    });

    describe('escapeHtml()', () => {
        test('should escape double quotes so they cannot terminate an HTML attribute', () => {
            expect(escapeHtml('חט"ב')).toBe('חט&quot;ב');
        });

        test('should escape all HTML-special characters', () => {
            expect(escapeHtml('<b>')).toBe('&lt;b&gt;');
            expect(escapeHtml("it's")).toBe('it&#39;s');
        });

        test('should escape ampersands first so entities are not double-encoded', () => {
            expect(escapeHtml('a & "b"')).toBe('a &amp; &quot;b&quot;');
        });

        test('should round-trip a real gershayim course value through a parsed attribute', () => {
            const value = 'חנ"ג בנים חט"ב|1|רוי';
            const attr = escapeHtml(value);
            expect(attr).not.toContain('"');
            // what the browser hands back after decoding the attribute
            const decoded = attr.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
            expect(decoded).toBe(value);
            expect(decoded.split('|')).toHaveLength(3);
        });

        test('should handle null and undefined without throwing', () => {
            expect(escapeHtml(null)).toBe('');
            expect(escapeHtml(undefined)).toBe('');
        });
    });

    describe('escapeCsvCell()', () => {
        test('should wrap a plain value in quotes', () => {
            expect(escapeCsvCell('מתמטיקה')).toBe('"מתמטיקה"');
        });

        test('should double embedded quotes per RFC 4180', () => {
            expect(escapeCsvCell('מנהיגות בתנ"ך')).toBe('"מנהיגות בתנ""ך"');
        });

        test('should preserve a value containing a comma', () => {
            expect(escapeCsvCell('פרלמנט, שעה דמוקרטית')).toBe('"פרלמנט, שעה דמוקרטית"');
        });

        test('should handle empty, null and undefined', () => {
            expect(escapeCsvCell('')).toBe('""');
            expect(escapeCsvCell(null)).toBe('""');
            expect(escapeCsvCell(undefined)).toBe('""');
        });
    });

    describe('isSameCourseSelection()', () => {
        const base = { course: 'פודיז', variant: '1', teacher: 'אנה' };

        test('should treat an identical triple as the same selection', () => {
            expect(isSameCourseSelection(base, { ...base })).toBe(true);
        });

        test('should treat a different TEACHER as a different selection', () => {
            // the bug this function replaces: teacher was omitted, so the same course
            // taught by someone else was silently overwritten without confirmation
            expect(isSameCourseSelection(base, { ...base, teacher: 'סמדר' })).toBe(false);
        });

        test('should treat a different course or variant as different', () => {
            expect(isSameCourseSelection(base, { ...base, course: 'מתמטיקה' })).toBe(false);
            expect(isSameCourseSelection(base, { ...base, variant: '2' })).toBe(false);
        });

        test('should ignore extra fields such as isAutoSynced', () => {
            expect(isSameCourseSelection({ ...base, isAutoSynced: true },
                                         { ...base, isAutoSynced: false })).toBe(true);
        });

        test('should return false for null or undefined operands', () => {
            expect(isSameCourseSelection(null, base)).toBe(false);
            expect(isSameCourseSelection(base, undefined)).toBe(false);
            expect(isSameCourseSelection(null, null)).toBe(false);
        });
    });

    describe('isSyntheticVariant()', () => {
        test('should recognise app-generated variants', () => {
            expect(isSyntheticVariant(SYNTHETIC_VARIANT_PREFIX + '200')).toBe(true);
        });

        test('should treat real section numbers from the data as not synthetic', () => {
            expect(isSyntheticVariant('1')).toBe(false);
            expect(isSyntheticVariant('200')).toBe(false);
            expect(isSyntheticVariant('')).toBe(false);
        });

        test('should handle non-string input', () => {
            expect(isSyntheticVariant(null)).toBe(false);
            expect(isSyntheticVariant(undefined)).toBe(false);
            expect(isSyntheticVariant(200)).toBe(false);
        });
    });

    describe('formatCourseDisplay() - synthetic variants and missing teachers', () => {
        test('should hide an app-generated variant from the label', () => {
            expect(formatCourseDisplay('ספרייה', SYNTHETIC_VARIANT_PREFIX + '203', 'חלי'))
                .toBe('ספרייה - חלי');
        });

        test('should still show a real section number', () => {
            expect(formatCourseDisplay('חשבון 4', '1', 'שרון')).toBe('חשבון 4 (1) - שרון');
        });

        test('should omit the dash when no teacher is known', () => {
            expect(formatCourseDisplay('שעת ועדות', '', '')).toBe('שעת ועדות');
            expect(formatCourseDisplay('שעת ועדות', SYNTHETIC_VARIANT_PREFIX + '229', ''))
                .toBe('שעת ועדות');
        });
    });

    describe('hasRealSection()', () => {
        test('should accept a section number that came from the data', () => {
            expect(hasRealSection('1')).toBe(true);
            expect(hasRealSection('2')).toBe(true);
        });

        test('should reject app-generated variants', () => {
            expect(hasRealSection(SYNTHETIC_VARIANT_PREFIX + '203')).toBe(false);
        });

        test('should reject a blank variant - those are separate slots, not sections', () => {
            expect(hasRealSection('')).toBe(false);
            expect(hasRealSection(null)).toBe(false);
            expect(hasRealSection(undefined)).toBe(false);
        });
    });
});