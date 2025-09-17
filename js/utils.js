// Utility functions for the school schedule system
import { CONFIG } from './config.js';

// Get Hebrew day name from day letter
export function getDayName(dayLetter) {
    return CONFIG.DAY_NAMES[dayLetter] || dayLetter;
}

// Check if a course is a special course that doesn't sync
export function isSpecialCourse(courseName) {
    const specialCourses = [
        "ספרייה", 
        "ספריה", 
        "פרלמנט", 
        "פרלמנט/שעה דמוקרטית", 
        "שעת חיבורים", 
        "שעת ועדות"
    ];
    return specialCourses.includes(courseName);
}

// Check if a course creates conflicts (opposite of special courses)
export function courseCreatesConflicts(courseName) {
    return !isSpecialCourse(courseName);
}

// Create a unique key for course selection
export function createCourseKey(time, day) {
    return `${time}_${day}`;
}

// Parse course key back to time and day
export function parseCourseKey(key) {
    const [time, day] = key.split('_');
    return { time, day };
}

// Create course value string for select options
export function createCourseValue(course, variant, teacher) {
    return `${course}|${variant}|${teacher}`;
}

// Parse course value back to components
export function parseCourseValue(value) {
    const [course, variant, teacher] = value.split('|');
    return { course, variant, teacher };
}

// Format course display name with variant
export function formatCourseDisplay(course, variant, teacher) {
    const displayVariant = variant ? ` (${variant})` : '';
    return `${course}${displayVariant} - ${teacher}`;
}

// Validate time slot format
export function isValidTimeSlot(timeSlot) {
    return /^\d{2}:\d{2}-\d{2}:\d{2}$/.test(timeSlot);
}

// Validate day letter
export function isValidDayLetter(dayLetter) {
    return CONFIG.DAYS.includes(dayLetter);
}

// Validate grade level
export function isValidGradeLevel(gradeLevel) {
    return Object.keys(CONFIG.GRADE_LEVELS).includes(gradeLevel);
}

// Check if a teacher name is empty or undefined
export function hasValidTeacher(teacher) {
    return Boolean(teacher && teacher.trim() !== '');
}

// Create course object
export function createCourseObject(course, variant, teacher, isAutoSynced = false) {
    return {
        course: course,
        variant: variant,
        teacher: teacher,
        isAutoSynced: isAutoSynced
    };
}

// Calculate statistics from selected courses
export function calculateStats(selectedCourses) {
    const courses = Object.values(selectedCourses);
    const manualSelections = courses.filter(c => !c.isAutoSynced).length;
    const autoSynced = courses.filter(c => c.isAutoSynced).length;
    const uniqueCourses = new Set(courses.map(c => `${c.course}_${c.variant}`)).size;
    
    return {
        manualSelections,
        autoSynced,
        totalSlots: courses.length,
        uniqueCourses
    };
}