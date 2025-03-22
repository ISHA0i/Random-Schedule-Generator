// Class to handle faculty and lab information for a subject
class SubjectDetails {
  constructor(facultyNames, hasLab, lectureCount = 2) {
    this.facultyNames = facultyNames;
    this.hasLab = hasLab;
    this.lectureCount = lectureCount;
  }
}

// Class to represent a subject
class Subject {
  constructor(subjectName, facultyNames, hasLab, lectureCount = 2) {
    this.subjectName = subjectName;
    this.details = new SubjectDetails(facultyNames, hasLab, lectureCount);
    this.labAssigned = false;
    this.lecturesAssigned = 0;
  }
}

// Class to handle statistics
class TimetableStats {
  constructor() {
    this.facultyStats = {};
    this.subjectStats = {};
    this.totalSlots = 0;
    this.usedSlots = 0;
    this.breakSlots = 0;
  }

  // Update faculty statistics
  updateFacultyStats(faculty, subject, isLab) {
    if (!this.facultyStats[faculty]) {
      this.facultyStats[faculty] = {
        totalLectures: 0,
        totalLabs: 0,
        subjects: new Set()
      };
    }
    
    if (isLab) {
      this.facultyStats[faculty].totalLabs++;
    } else {
      this.facultyStats[faculty].totalLectures++;
    }
    
    this.facultyStats[faculty].subjects.add(subject);
  }

  // Update subject statistics
  updateSubjectStats(subject, isLab) {
    if (!this.subjectStats[subject]) {
      this.subjectStats[subject] = {
        totalLectures: 0,
        totalLabs: 0
      };
    }
    
    if (isLab) {
      this.subjectStats[subject].totalLabs++;
    } else {
      this.subjectStats[subject].totalLectures++;
    }
  }

  // Get faculty statistics in a formatted way
  getFacultyStats() {
    const stats = [];
    
    for (const [faculty, data] of Object.entries(this.facultyStats)) {
      stats.push({
        name: faculty,
        lectures: data.totalLectures,
        labs: data.totalLabs,
        subjects: Array.from(data.subjects)
      });
    }
    
    return stats;
  }

  // Get subject statistics in a formatted way
  getSubjectStats() {
    const stats = [];
    
    for (const [subject, data] of Object.entries(this.subjectStats)) {
      stats.push({
        name: subject,
        lectures: data.totalLectures,
        labs: data.totalLabs
      });
    }
    
    return stats;
  }

  // Get overall statistics
  getOverallStats() {
    return {
      totalSlots: this.totalSlots,
      usedSlots: this.usedSlots,
      freeSlots: this.totalSlots - this.usedSlots - this.breakSlots,
      breakSlots: this.breakSlots
    };
  }
}

// Class to handle schedule logic
class Schedule {
  constructor(daysOfWeek, timeSlots, visitingFaculty = []) {
    this.daysOfWeek = daysOfWeek;
    this.timeSlots = timeSlots;
    this.visitingFaculty = visitingFaculty;
    this.schedule = this.initializeSchedule();
    this.stats = new TimetableStats();
    
    // Calculate total slots
    this.stats.totalSlots = daysOfWeek.length * timeSlots.length;
    
    // Assign visiting faculty first
    this.assignVisitingFaculty();
  }

  // Initialize an empty schedule
  initializeSchedule() {
    const schedule = {};
    this.daysOfWeek.forEach((day) => {
      schedule[day] = this.timeSlots.map((slot) => {
        // Mark break slots as 'BREAK' to prevent assignments
        if (slot.includes('BREAK')) {
          this.stats.breakSlots++;
          return 'BREAK';
        }
        return '-';
      });
    });
    return schedule;
  }

  // Get available slots for assigning, excluding breaks
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

  // Assign visiting faculty to their preferred slots
  assignVisitingFaculty() {
    for (const faculty of this.visitingFaculty) {
      const day = faculty.day;
      const timeIndex = this.timeSlots.findIndex(slot => slot === faculty.timeSlot);
      
      if (timeIndex !== -1 && this.schedule[day][timeIndex] === '-') {
        this.schedule[day][timeIndex] = `${faculty.subject} - ${faculty.name} (Visiting)`;
        this.stats.usedSlots++;
        
        // Update statistics
        this.stats.updateFacultyStats(faculty.name, faculty.subject, false);
        this.stats.updateSubjectStats(faculty.subject, false);
      }
    }
  }

  // Assign subjects to fill the timetable
  assignSubjects(subjects) {
    // First, ensure each subject gets its required number of lectures
    for (const subject of subjects) {
      // Assign labs for subjects that need them
      if (subject.details.hasLab && !subject.labAssigned) {
        this.assignLab(subject);
      }
      
      // Assign required lectures for each subject
      while (subject.lecturesAssigned < subject.details.lectureCount) {
        if (!this.assignSubjectOnce(subject)) {
          break; // No more slots available
        }
      }
    }
    
    // Fill remaining slots
    this.fillRemainingSlots(subjects);
  }
  
  // Assign a subject once to ensure it appears in the timetable
  assignSubjectOnce(subject) {
    const availableSlots = this.getAvailableSlots();
    if (availableSlots.length > 0) {
      const randomSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
      const { day, timeIndex } = randomSlot;
      
      const faculty = this.selectRandomFaculty(subject);
      this.schedule[day][timeIndex] = `${subject.subjectName} - ${faculty}`;
      subject.lecturesAssigned++;
      this.stats.usedSlots++;
      
      // Update statistics
      this.stats.updateFacultyStats(faculty, subject.subjectName, false);
      this.stats.updateSubjectStats(subject.subjectName, false);
      
      return true;
    }
    return false;
  }
  
  // Assign a lab session for a subject
  assignLab(subject) {
    const availableSlots = this.getAvailableSlots();
    if (availableSlots.length > 0) {
      const randomSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
      const { day, timeIndex } = randomSlot;
      
      const faculty = this.selectRandomFaculty(subject);
      this.schedule[day][timeIndex] = `${subject.subjectName} Lab - ${faculty}`;
      subject.labAssigned = true;
      this.stats.usedSlots++;
      
      // Update statistics
      this.stats.updateFacultyStats(faculty, subject.subjectName, true);
      this.stats.updateSubjectStats(subject.subjectName, true);
      
      return true;
    }
    return false;
  }
  
  // Fill remaining empty slots with subjects
  fillRemainingSlots(subjects) {
    let availableSlots = this.getAvailableSlots();
    
    // Continue filling slots until no more slots are available or we've tried too many times
    let attempts = 0;
    while (availableSlots.length > 0 && attempts < 100) {
      const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
      const randomSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
      const { day, timeIndex } = randomSlot;
      
      const faculty = this.selectRandomFaculty(randomSubject);
      this.schedule[day][timeIndex] = `${randomSubject.subjectName} - ${faculty}`;
      this.stats.usedSlots++;
      
      // Update statistics
      this.stats.updateFacultyStats(faculty, randomSubject.subjectName, false);
      this.stats.updateSubjectStats(randomSubject.subjectName, false);
      
      // Update available slots
      availableSlots = this.getAvailableSlots();
      attempts++;
    }
  }
  
  // Helper to select a random faculty for a subject
  selectRandomFaculty(subject) {
    return subject.details.facultyNames.length > 0
      ? subject.details.facultyNames[Math.floor(Math.random() * subject.details.facultyNames.length)]
      : 'TBD';
  }

  // Return final schedule
  getSchedule() {
    return this.schedule;
  }
  
  // Get statistics
  getStats() {
    return {
      facultyStats: this.stats.getFacultyStats(),
      subjectStats: this.stats.getSubjectStats(),
      overallStats: this.stats.getOverallStats()
    };
  }
}

// Main function to generate timetable
export const generateTimetable = ({ 
  subjects = [], 
  facultyNames = [], 
  hasLab = [], 
  lectureCount = [],
  visitingFaculty = []
}) => {
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
  console.log('Lecture Count:', lectureCount);
  console.log('Visiting Faculty:', visitingFaculty);

  // Create subject objects with details
  const subjectObjects = subjects.map(
    (subject, index) => new Subject(
      subject, 
      facultyNames[index] || [], 
      hasLab[index],
      lectureCount[index] || 2
    )
  );

  // Initialize schedule and assign subjects
  const schedule = new Schedule(daysOfWeek, timeSlots, visitingFaculty);
  schedule.assignSubjects(subjectObjects);

  // Get statistics
  const stats = schedule.getStats();

  // Prepare timetable data for Output
  const timetableData = {
    schedule: timeSlots.map((timeSlot, index) => {
      const row = { time: timeSlot };
      daysOfWeek.forEach((day) => {
        row[day] = schedule.schedule[day][index];
      });
      return row;
    }),
    stats: stats
  };

  return timetableData;
};
  