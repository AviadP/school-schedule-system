// Table building and management functionality
import { CONFIG } from './config.js';
import { getDayName, createCourseValue, calculateStats, escapeHtml, isSameCourseSelection,
         formatCourseDisplay, SYNTHETIC_VARIANT_PREFIX, hasRealSection } from './utils.js';

// Global variables for table state
let selectedCourses = {};
let variantMap = {};

// Create the main schedule table
export function createScheduleTable(rawScheduleData, gradeLevel) {
    // Clear any existing selections when switching grade levels
    selectedCourses = {};
    
    // Update button states
    document.getElementById('processBtn34').classList.toggle('active', gradeLevel === '3-4');
    document.getElementById('processBtn56').classList.toggle('active', gradeLevel === '5-6');
    document.getElementById('processBtn79').classList.toggle('active', gradeLevel === '7-9');
    
    processVariants(rawScheduleData);
    
    const output = document.getElementById('output');
    output.style.display = 'block';
    
    const gradeDisplayName = CONFIG.GRADE_LEVELS[gradeLevel] || gradeLevel;
    
    let html = `
        <div class="sync-info">
            <strong>🎓 מערכת פעילה: ${gradeDisplayName}</strong>
            <br>
            <strong>🔄 סנכרון אוטומטי:</strong> 
            כשתבחר שיעור, כל המופעים שלו במערכת יסונכרנו אוטומטית
            <br>
            <span style="background-color: ${CONFIG.COLORS.MANUAL}; padding: 2px 5px;">כתום = בחירה ידנית</span>
            <span style="background-color: ${CONFIG.COLORS.SYNCED}; padding: 2px 5px;">ירוק = סנכרון אוטומטי</span>
        </div>
        <div id="stats" class="stats"></div>
        <table id="scheduleTable">
            <thead>
                <tr>
                    <th>שעה</th>
                    <th>${CONFIG.DAY_NAMES.א}</th>
                    <th>${CONFIG.DAY_NAMES.ב}</th>
                    <th>${CONFIG.DAY_NAMES.ג}</th>
                    <th>${CONFIG.DAY_NAMES.ד}</th>
                    <th>${CONFIG.DAY_NAMES.ה}</th>
                    <th>${CONFIG.DAY_NAMES.ו}</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    Object.keys(rawScheduleData).forEach(time => {
        html += `<tr>`;
        html += `<td class="time-cell">${time}</td>`;
        
        CONFIG.DAYS.forEach(day => {
            const options = rawScheduleData[time][day];
            
            if (options && options.length > 0) {
                html += `<td>`;
                html += `<select id="select_${time}_${day}" onchange="handleSelectionChange('${time}', '${day}')">`;
                html += `<option value="">${CONFIG.MESSAGES.NO_SELECTION}</option>`;
                
                options.forEach(option => {
                    const value = createCourseValue(option.course, option.variant, option.teacher);
                    const label = formatCourseDisplay(option.course, option.variant, option.teacher);
                    html += `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`;
                });
                
                html += `</select>`;
                html += `</td>`;
            } else {
                html += `<td>-</td>`;
            }
        });
        
        html += `</tr>`;
    });
    
    html += `</tbody></table>`;
    output.innerHTML = html;
    
    updateStats();
}

// Process variants for courses
function processVariants(rawScheduleData) {
    variantMap = {};
    let variantCounter = 200;
    
    // First pass: create variant map for regular courses
    Object.keys(rawScheduleData).forEach(timeSlot => {
        Object.values(rawScheduleData[timeSlot]).forEach(options => {
            options.forEach(option => {
                // Special courses that get unique variants each time
                const specialCourses = ["ספרייה", "ספריה", "פרלמנט", "פרלמנט/שעה דמוקרטית", "שעת חיבורים", "שעת ועדות"];
                
                if (specialCourses.includes(option.course)) {
                    // every occurrence gets its own identity so they never sync or
                    // delete together
                    option.variant = SYNTHETIC_VARIANT_PREFIX + (variantCounter++);
                } else if (!option.variant) {
                    const key = `${option.course}_${option.teacher}`;
                    if (!variantMap[key]) {
                        variantMap[key] = variantCounter++;
                    }
                    option.variant = SYNTHETIC_VARIANT_PREFIX + variantMap[key];
                }
            });
        });
    });
}

// Handle selection change in dropdowns
export function handleSelectionChange(time, day, rawScheduleData) {
    const select = document.getElementById(`select_${time}_${day}`);
    const value = select.value;
    
    if (!value) {
        // Cancel selection - synchronized deletion
        handleCourseDeletion(time, day);
        updateStats();
        return;
    }
    
    const [course, variant, teacher] = value.split('|');
    const key = `${time}_${day}`;
    const incoming = { course, variant, teacher };
    
    // Check for conflicts
    const conflicts = checkForConflicts(course, variant, teacher, time, day);
    
    if (conflicts.length > 0) {
        const conflictMessages = conflicts.map(c =>
            `• ${c.course} (${c.variant}) עם ${c.teacher} ב${getDayName(c.day)} בשעה ${c.time}`
        ).join('\n');

        const message = `כבר בחרת קבוצה אחרת של "${course}":\n${conflictMessages}\n\nהאם להחליף אותה בקבוצה (${variant}) עם ${teacher}?`;
        
        if (!confirm(message)) {
            // Cancel the selection
            select.value = '';
            return;
        }
        
        // Remove conflicting courses
        conflicts.forEach(c => {
            const conflictKey = `${c.time}_${c.day}`;
            delete selectedCourses[conflictKey];
            const conflictSelect = document.getElementById(`select_${c.time}_${c.day}`);
            if (conflictSelect) {
                conflictSelect.value = '';
                conflictSelect.style.backgroundColor = '';
            }
        });
    }
    
    // Replacing the course's MANUAL anchor must also drop the copies it was synced into,
    // or they are stranded with no anchor. Replacing a synced copy needs no cascade - the
    // anchor still stands - and cascading there would silently delete cells the user kept.
    const outgoing = selectedCourses[key];
    if (outgoing && !outgoing.isAutoSynced && !isSameCourseSelection(outgoing, incoming)) {
        handleCourseDeletion(time, day, key);
    }
    
    // Save the selection
    selectedCourses[key] = {
        course: course,
        variant: variant,
        teacher: teacher,
        isAutoSynced: false
    };
    
    select.style.backgroundColor = CONFIG.COLORS.MANUAL; // Orange for manual selection
    
    // Sync related courses
    const synced = syncRelatedCourses(course, variant, teacher, time, day, true, rawScheduleData);
    
    updateStats();
    
    if (synced > 0) {
        console.log(`סונכרנו ${synced} שיעורים נוספים`);
    }
}

// Warn when the student already picked a DIFFERENT SECTION of the same course.
// Only real section numbers count: courses whose variant is blank or app-generated
// (מרחב, מפגש בוקר...) are separate slots, not alternative sections of one class.
function checkForConflicts(course, variant, teacher, currentTime, currentDay) {
    const conflicts = [];

    if (!hasRealSection(variant)) {
        return conflicts;
    }

    Object.keys(selectedCourses).forEach(key => {
        const [time, day] = key.split('_');
        const selected = selectedCourses[key];

        if (time === currentTime && day === currentDay) {
            return;
        }

        if (selected.course === course &&
            selected.variant !== variant &&
            hasRealSection(selected.variant)) {

            conflicts.push({
                course: selected.course,
                variant: selected.variant,
                teacher: selected.teacher,
                time: time,
                day: day,
                type: 'section'
            });
        }
    });

    return conflicts;
}

// Handle course deletion and all its synchronized instances.
// skipKey leaves that one cell's dropdown alone - used when replacing a selection in
// place, where the cell already displays the incoming course.
function handleCourseDeletion(time, day, skipKey = null) {
    const key = `${time}_${day}`;
    const courseToDelete = selectedCourses[key];
    
    if (!courseToDelete) return;
    
    // Delete all instances of the same course
    Object.keys(selectedCourses).forEach(courseKey => {
        if (isSameCourseSelection(selectedCourses[courseKey], courseToDelete)) {
            delete selectedCourses[courseKey];
            if (courseKey === skipKey) return;
            const [t, d] = courseKey.split('_');
            const selectElement = document.getElementById(`select_${t}_${d}`);
            if (selectElement) {
                selectElement.value = '';
                selectElement.style.backgroundColor = '';
            }
        }
    });
}

// Auto-sync identical courses
function syncRelatedCourses(course, variant, teacher, currentTime, currentDay, isManual = false, rawScheduleData) {
    let synced = 0;
    let conflicts = [];
    
    // Special cases that don't sync
    const noSyncCourses = ["ספרייה", "ספריה", "פרלמנט", "פרלמנט/שעה דמוקרטית", "שעת חיבורים", "שעת ועדות"];
    if (noSyncCourses.includes(course)) {
        return synced;
    }
    
    // First pass - collect all potential sync locations and check for conflicts
    const syncTargets = [];
    
    Object.keys(rawScheduleData).forEach(time => {
        Object.keys(rawScheduleData[time]).forEach(day => {
            // Skip current cell
            if (time === currentTime && day === currentDay) {
                return;
            }
            
            const options = rawScheduleData[time][day];
            const matchingOption = options.find(opt =>
                isSameCourseSelection(opt, {course, variant, teacher})
            );
            
            if (matchingOption) {
                const key = `${time}_${day}`;
                
                // Check if there's already a different selection here.
                // Must compare the teacher too - same course/variant taught by someone
                // else is a different choice and needs the user's confirmation.
                if (selectedCourses[key] &&
                    !isSameCourseSelection(selectedCourses[key], {course, variant, teacher})) {
                    conflicts.push({
                        time: time,
                        day: day,
                        existing: selectedCourses[key],
                        key: key
                    });
                } else {
                    syncTargets.push({time, day, key});
                }
            }
        });
    });
    
    // If we're in manual mode and there are conflicts, ask user
    if (isManual && conflicts.length > 0) {
        const conflictMessages = conflicts.map(c =>
            `• ${c.existing.course} עם ${c.existing.teacher} ב${getDayName(c.day)} בשעה ${c.time}`
        ).join('\n');

        const message = `הסנכרון של "${course}" עם ${teacher} יחליף את השיעורים הבאים:\n${conflictMessages}\n\nהאם ברצונך להחליף את כל השיעורים המתנגשים?`;
        
        if (confirm(message)) {
            // User agreed - add conflict locations to sync targets
            conflicts.forEach(c => {
                syncTargets.push({time: c.time, day: c.day, key: c.key});
            });
        } else {
            // User declined - only sync non-conflicting slots
            console.log(`סנכרון חלקי - דילגנו על ${conflicts.length} התנגשויות`);
        }
    }
    
    // Now perform the actual sync
    syncTargets.forEach(target => {
        // Displacing a different course here must also remove the copies IT was synced
        // into, or they are stranded with no manual anchor - the same orphan class as
        // replacing a cell by hand.
        const displaced = selectedCourses[target.key];
        if (displaced && !displaced.isAutoSynced &&
            !isSameCourseSelection(displaced, {course, variant, teacher})) {
            handleCourseDeletion(target.time, target.day);
        }
        
        // A cell the student already chose by hand keeps its manual status - syncing the
        // same course into it must not silently demote their deliberate pick to "auto".
        const existing = selectedCourses[target.key];
        const stayManual = Boolean(existing && !existing.isAutoSynced &&
            isSameCourseSelection(existing, {course, variant, teacher}));

        selectedCourses[target.key] = {
            course: course,
            variant: variant,
            teacher: teacher,
            isAutoSynced: !stayManual
        };
        
        const select = document.getElementById(`select_${target.time}_${target.day}`);
        if (select) {
            select.value = `${course}|${variant}|${teacher}`;
            select.style.backgroundColor = stayManual ? CONFIG.COLORS.MANUAL : CONFIG.COLORS.SYNCED;
        }
        synced++;
    });
    
    return synced;
}

// getDayName is now imported from utils.js

// Update statistics display
function updateStats() {
    const stats = calculateStats(selectedCourses);
    
    const statsDiv = document.getElementById('stats');
    if (statsDiv) {
        statsDiv.innerHTML = `
            <strong>📊 סטטיסטיקות:</strong>
            בחירות ידניות: ${stats.manualSelections} | 
            מסונכרנים: ${stats.autoSynced} | 
            סה"כ משבצות: ${stats.totalSlots} | 
            קורסים ייחודיים: ${stats.uniqueCourses}
        `;
    }
}

// Clear all selections
export function clearSelections() {
    if (confirm('האם אתה בטוח שברצונך לנקות את כל הבחירות?')) {
        selectedCourses = {};
        
        // Clear all dropdowns
        const selects = document.querySelectorAll('select[id^="select_"]');
        selects.forEach(select => {
            select.value = '';
            select.style.backgroundColor = '';
        });
        
        updateStats();
    }
}

// Get selected courses for export
export function getSelectedCourses() {
    return selectedCourses;
}