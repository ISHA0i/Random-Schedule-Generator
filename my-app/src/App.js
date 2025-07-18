import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { Layout, ConfigProvider, Row, Col, message } from 'antd';
import Navbar from './Component/Navbar';
import Input from './Component/Home/Input';
import Output from './Component/Detail/Output';
import 'antd/dist/antd.min.css';

const { Content } = Layout;

function App() {
  const [timetableData, setTimetableData] = useState(null);
  const [savedSubjects, setSavedSubjects] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load saved subjects and timetable data on component mount
  useEffect(() => {
    // Load timetable data
    const savedData = localStorage.getItem('timetableData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log("Loaded timetable data:", parsedData);
        if (parsedData && parsedData.schedule) {
          setTimetableData(parsedData);
        }
      } catch (error) {
        console.error("Error parsing timetable data:", error);
        message.error("Error loading timetable data");
      }
    }

    // Load saved subjects
    const savedSubjectsData = localStorage.getItem('savedSubjects');
    if (savedSubjectsData) {
      try {
        const parsedSubjects = JSON.parse(savedSubjectsData);
        setSavedSubjects(parsedSubjects);
      } catch (error) {
        console.error("Error parsing saved subjects:", error);
        message.error("Error loading saved subjects");
      }
    }
  }, []);

  const handleGenerateTimetable = (data) => {
    try {
      if (!data || !data.subjects || !data.subjects.length) {
        message.error("Invalid timetable data");
        return;
      }

      console.log("Setting timetable data in App.js:", data);
      setTimetableData(data);
      localStorage.setItem('timetableData', JSON.stringify(data));
      // Trigger a refresh of the Output component
      setRefreshKey(prevKey => prevKey + 1);
      message.success('Timetable generated successfully!');
    } catch (error) {
      console.error("Error generating timetable:", error);
      message.error("Failed to generate timetable");
    }
  };

  const handleSaveSubjects = (subjects) => {
    try {
      if (!subjects || !subjects.subjects || !subjects.subjects.length) {
        message.error("Invalid subjects data");
        return;
      }

      // Add timestamp to the saved data
      const subjectsWithTimestamp = {
        ...subjects,
        savedAt: new Date().toISOString(),
        id: Date.now() // Unique identifier
      };

      // Update saved subjects
      const updatedSubjects = [...savedSubjects, subjectsWithTimestamp];
      setSavedSubjects(updatedSubjects);
      localStorage.setItem('savedSubjects', JSON.stringify(updatedSubjects));
      message.success('Subjects saved successfully!');
    } catch (error) {
      console.error("Error saving subjects:", error);
      message.error('Failed to save subjects');
    }
  };

  const handleLoadSubjects = (savedSubjectData) => {
    try {
      if (!savedSubjectData || !savedSubjectData.subjects) {
        message.error("Invalid saved subject data");
        return;
      }

      // Remove the timestamp and id before using the data
      const { savedAt, id, ...subjectsData } = savedSubjectData;
      handleGenerateTimetable(subjectsData);
      message.success('Subjects loaded successfully!');
    } catch (error) {
      console.error("Error loading subjects:", error);
      message.error('Failed to load subjects');
    }
  };

  const handleDeleteSubjects = (subjectId) => {
    try {
      const updatedSubjects = savedSubjects.filter(subject => subject.id !== subjectId);
      setSavedSubjects(updatedSubjects);
      localStorage.setItem('savedSubjects', JSON.stringify(updatedSubjects));
      message.success('Subjects deleted successfully!');
    } catch (error) {
      console.error("Error deleting subjects:", error);
      message.error('Failed to delete subjects');
    }
  };

  return (
    <ConfigProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Layout style={{ minHeight: '100vh' }}>
          <Navbar />
          <Content style={{ padding: '24px', marginTop: 64 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/input" replace />} />
              <Route 
                path="/input" 
                element={
                  <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12}>
                      <div style={{ 
                        height: 'calc(100vh - 120px)', 
                        overflowY: 'auto',
                        padding: '16px',
                        backgroundColor: '#f0f2f5',
                        borderRadius: '8px'
                      }}>
                        <Input 
                          onGenerate={handleGenerateTimetable}
                          onSaveSubjects={handleSaveSubjects}
                          onLoadSubjects={handleLoadSubjects}
                          onDeleteSubjects={handleDeleteSubjects}
                          savedSubjects={savedSubjects}
                        />
                      </div>
                    </Col>
                    <Col xs={24} lg={12}>
                      <div style={{ 
                        height: 'calc(100vh - 120px)', 
                        overflowY: 'auto',
                        padding: '16px',
                        backgroundColor: '#f0f2f5',
                        borderRadius: '8px'
                      }}>
                        {timetableData && timetableData.schedule && (
                          <Output 
                            key={refreshKey}
                            timetableData={timetableData} 
                          />
                        )}
                      </div>
                    </Col>
                  </Row>
                } 
              />
              <Route 
                path="/output" 
                element={
                  timetableData && timetableData.schedule ? (
                    <Row gutter={[24, 24]}>
                      <Col xs={24} lg={12}>
                        <div style={{ 
                          height: 'calc(100vh - 120px)', 
                          overflowY: 'auto',
                          padding: '16px',
                          backgroundColor: '#f0f2f5',
                          borderRadius: '8px'
                        }}>
                          <Input 
                            onGenerate={handleGenerateTimetable}
                            onSaveSubjects={handleSaveSubjects}
                            onLoadSubjects={handleLoadSubjects}
                            onDeleteSubjects={handleDeleteSubjects}
                            savedSubjects={savedSubjects}
                          />
                        </div>
                      </Col>
                      <Col xs={24} lg={12}>
                        <div style={{ 
                          height: 'calc(100vh - 120px)', 
                          overflowY: 'auto',
                          padding: '16px',
                          backgroundColor: '#f0f2f5',
                          borderRadius: '8px'
                        }}>
                          <Output 
                            key={refreshKey}
                            timetableData={timetableData} 
                          />
                        </div>
                      </Col>
                    </Row>
                  ) : (
                    <Navigate to="/input" replace />
                  )
                } 
              />
            </Routes>
          </Content>
        </Layout>
      </Router>
    </ConfigProvider>
  );
}

export default App;