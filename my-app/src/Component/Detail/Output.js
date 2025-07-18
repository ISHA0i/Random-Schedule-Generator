import React, { useState } from 'react';
import { Card, Typography, Space, Button, message } from 'antd';
import { ReloadOutlined, DownloadOutlined, PrinterOutlined } from '@ant-design/icons';
import TimetableStats from './TimetableStats';
import Timetable from './Timetable';
import FreeSlots from './FreeSlots';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const { Title } = Typography;

function Output({ timetableData }) {
  const [localTimetableData, setLocalTimetableData] = useState(timetableData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate a refresh delay
    setTimeout(() => {
      setLocalTimetableData(timetableData);
      setIsRefreshing(false);
      message.success('Timetable refreshed successfully!');
    }, 500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    if (!localTimetableData || !localTimetableData.schedule) {
      message.error('No timetable data available to download');
      return;
    }

    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Generated Timetable', 14, 15);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);

    // Prepare table data
    const tableData = localTimetableData.schedule.map(row => 
      Object.values(row).map(cell => cell || '')
    );

    // Add timetable table
    doc.autoTable({
      head: [['Time', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']],
      body: tableData,
      startY: 35,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    // Add free slots
    const freeSlotsY = doc.lastAutoTable.finalY + 15;
    doc.text('Free Slots', 14, freeSlotsY);
    
    const freeSlotsData = Object.entries(localTimetableData.freeSlots).map(([day, slots]) => 
      [day, slots.join(', ')]
    );
    
    doc.autoTable({
      head: [['Day', 'Free Slots']],
      body: freeSlotsData,
      startY: freeSlotsY + 5,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    // Add statistics
    const statsY = doc.lastAutoTable.finalY + 15;
    doc.text('Statistics', 14, statsY);
    
    const statsData = [
      ['Total Subjects', localTimetableData.stats.totalSubjects],
      ['Total Faculty', localTimetableData.stats.totalFaculty],
      ['Total Hours', localTimetableData.stats.totalHours],
      ['Lab Subjects', localTimetableData.stats.labSubjects],
      ['Free Slots', localTimetableData.stats.freeSlots]
    ];
    
    doc.autoTable({
      body: statsData,
      startY: statsY + 5,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    // Save the PDF
    doc.save('timetable.pdf');
    message.success('Timetable downloaded successfully!');
  };

  if (!localTimetableData) {
    return (
      <Card>
        <Title level={4}>No timetable data available</Title>
      </Card>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0 }}>
            Generated Timetable
          </Title>
          <Space>
            <Button
              icon={<ReloadOutlined spin={isRefreshing} />}
              onClick={handleRefresh}
              loading={isRefreshing}
            >
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleDownloadPDF}
            >
            </Button>
            <Button
              icon={<PrinterOutlined />}
              onClick={handlePrint}
            >
            </Button>
          </Space>
        </div>
        <TimetableStats stats={localTimetableData.stats} />
      </Card>

      <Card>
        <Timetable schedule={localTimetableData.schedule} />
      </Card>

      <Card>
        <FreeSlots freeSlots={localTimetableData.freeSlots} />
      </Card>
    </Space>
  );
}

export default Output;
