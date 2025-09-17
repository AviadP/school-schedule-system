// Excel export functionality
import { CONFIG } from './config.js';

// Export schedule to Excel/CSV format
export function exportToExcel(selectedCourses, rawScheduleData) {
    const data = [];
    const dayNames = Object.values(CONFIG.DAY_NAMES);
    
    // Header row
    data.push(['שעה', ...dayNames]);
    
    // Data rows
    Object.keys(rawScheduleData).forEach(time => {
        const row = [time];
        
        CONFIG.DAYS.forEach(day => {
            const key = `${time}_${day}`;
            if (selectedCourses[key]) {
                const course = selectedCourses[key];
                const variant = course.variant ? ` (${course.variant})` : '';
                row.push(`${course.course}${variant} - ${course.teacher}`);
            } else {
                row.push('');
            }
        });
        
        data.push(row);
    });
    
    // Convert to CSV format
    let csv = '\ufeff'; // BOM for Hebrew support
    data.forEach(row => {
        csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    
    // Download file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = CONFIG.EXCEL.FILE_NAME.replace('.xlsx', '.csv');
    link.click();
    
    // Clean up
    URL.revokeObjectURL(link.href);
}