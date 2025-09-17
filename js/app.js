// Main application entry point
import { getScheduleData } from '../data/schedule-loader.js';
import { createScheduleTable, handleSelectionChange, clearSelections, getSelectedCourses } from './table-builder.js';
import { exportToExcel } from './excel-export.js';

// Application state
let rawScheduleData = getScheduleData('3-4');
let currentGradeLevel = '3-4';

// Initialize the application
function initializeApp() {
    // Add event listeners to buttons
    document.getElementById('processBtn34').addEventListener('click', () => createTable('3-4'));
    document.getElementById('processBtn56').addEventListener('click', () => createTable('5-6'));
    document.getElementById('processBtn79').addEventListener('click', () => createTable('7-9'));
    document.getElementById('exportBtn').addEventListener('click', handleExport);
    document.getElementById('clearBtn').addEventListener('click', clearSelections);
}

// Create schedule table for specific grade level
function createTable(gradeLevel) {
    currentGradeLevel = gradeLevel;
    rawScheduleData = getScheduleData(gradeLevel);
    createScheduleTable(rawScheduleData, gradeLevel);
}

// Handle Excel export
function handleExport() {
    const selectedCourses = getSelectedCourses();
    
    if (Object.keys(selectedCourses).length === 0) {
        alert('אין שיעורים נבחרים לייצוא');
        return;
    }
    
    exportToExcel(selectedCourses, rawScheduleData);
}

// Global function for table selection changes (called from HTML)
window.handleSelectionChange = function(time, day) {
    handleSelectionChange(time, day, rawScheduleData);
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);