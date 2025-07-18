import React from 'react';
import { Table, Tag, Typography } from 'antd';

const { Title } = Typography;

function Timetable({ schedule }) {
  if (!schedule || !Array.isArray(schedule)) {
    return <Title level={4}>No schedule data available</Title>;
  }

  const columns = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      width: 150,
    },
    {
      title: 'Monday',
      dataIndex: 'MON',
      key: 'MON',
      render: (text) => text === 'FREE SLOT' ? <Tag color="blue">FREE SLOT</Tag> : text,
    },
    {
      title: 'Tuesday',
      dataIndex: 'TUE',
      key: 'TUE',
      render: (text) => text === 'FREE SLOT' ? <Tag color="blue">FREE SLOT</Tag> : text,
    },
    {
      title: 'Wednesday',
      dataIndex: 'WED',
      key: 'WED',
      render: (text) => text === 'FREE SLOT' ? <Tag color="blue">FREE SLOT</Tag> : text,
    },
    {
      title: 'Thursday',
      dataIndex: 'THU',
      key: 'THU',
      render: (text) => text === 'FREE SLOT' ? <Tag color="blue">FREE SLOT</Tag> : text,
    },
    {
      title: 'Friday',
      dataIndex: 'FRI',
      key: 'FRI',
      render: (text) => text === 'FREE SLOT' ? <Tag color="blue">FREE SLOT</Tag> : text,
    },
    {
      title: 'Saturday',
      dataIndex: 'SAT',
      key: 'SAT',
      render: (text) => text === 'FREE SLOT' ? <Tag color="blue">FREE SLOT</Tag> : text,
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={schedule.map((row, index) => ({
        ...row,
        key: index,
      }))}
      pagination={false}
      bordered
      size="middle"
    />
  );
}

export default Timetable; 