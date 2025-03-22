// Class to handle faculty and lab information for a subject
class SubjectDetails {
  constructor(facultyNames, hasLab) {
    this.facultyNames = facultyNames;
    this.hasLab = hasLab;
  }
}

// Class to represent a subject
class Subject {
  constructor(subjectName, facultyNames, hasLab) {
    this.subjectName = subjectName;
    this.details = new SubjectDetails(facultyNames, hasLab);
  }
}

// Class to handle schedule logic
class Schedule {
  constructor(daysOfWeek, timeSlots) {
    this.daysOfWeek = daysOfWeek;
    this.timeSlots = timeSlots;
    this.schedule = this.initializeSchedule();
  }

  // Initialize an empty schedule
  initializeSchedule() {
    const schedule = {};
    this.daysOfWeek.forEach((day) => {
      schedule[day] = this.timeSlots.map(() => '-');
    });
    return schedule;
  }

  // Assign subjects randomly to slots
  assignSubjects(subjects) {
    subjects.forEach((subject) => {
      const availableSlots = this.getAvailableSlots();
      if (availableSlots.length > 0) {
        const randomSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
        const { day, timeIndex } = randomSlot;

        // Assign subject, faculty, and lab
        const faculty =
          subject.details.facultyNames.length > 0
            ? subject.details.facultyNames[
                Math.floor(Math.random() * subject.details.facultyNames.length)
              ]
            : 'TBD';

        const labInfo = subject.details.hasLab ? `${subject.subjectName} Lab` : '';
        this.schedule[day][timeIndex] = `${subject.subjectName} - ${faculty}${labInfo ? ` | ${labInfo}` : ''}`;
      }
    });
  }

  // Get available slots for assigning
  getAvailableSlots() {
    const availableSlots = [];
    this.daysOfWeek.forEach((day) => {
      this.schedule[day].forEach((slot, index) => {
        if (slot === '-') {
          availableSlots.push({ day, timeIndex: index });
        }
      });
    });
    return availableSlots;
  }

  // Return final schedule
  getSchedule() {
    return this.schedule;
  }
}

// Main class to generate timetable
export const generateTimetable = ({ subjects = [], facultyNames = [], hasLab = [] }) => {
  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
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

  console.log('Subjects:', subjects);
  console.log('Faculty Names:', facultyNames);
  console.log('Has Lab:', hasLab);

  // Create subject objects with details
  const subjectObjects = subjects.map(
    (subject, index) => new Subject(subject, facultyNames[index] || [], hasLab[index])
  );

  console.log('Subject Objects:', subjectObjects);

  // Initialize schedule and assign subjects
  const schedule = new Schedule(daysOfWeek, timeSlots);
  schedule.assignSubjects(subjectObjects);

  // Prepare timetable data for Output
  const timetableData = timeSlots.map((timeSlot, index) => {
    const row = { time: timeSlot };
    daysOfWeek.forEach((day) => {
      row[day] = schedule.schedule[day][index];
    });
    return row;
  });

  return timetableData;
};
  