export const generateTimetable = ({ subjects, hasLab, additionalInfo }) => {
    const timetableData = [];
  
    // Define time slots
    const timeSlots = [
      '07:30 to 8:25',
      '08:25 to 9:20',
      'BREAK (9:20 to 9:50)',
      '09:50 to 10:45',
      '10:45 to 11:40',
      'BREAK (11:40 to 11:50)',
      '11:50 to 12:45',
      '12:45 to 1:40',
    ];
  
    // Populate timetable data based on subjects and lab
    subjects.forEach((subject, index) => {
      if (subject) {
        const labInfo = hasLab[index] ? `${subject} Lab` : '-';
        timetableData.push({
          time: timeSlots[index],
          subjects: [subject, labInfo],
        });
      }
    });
  
    if (additionalInfo) {
      timetableData.push({
        time: 'Additional Info',
        subjects: [additionalInfo],
      });
    }
  
    return timetableData;
  };
  