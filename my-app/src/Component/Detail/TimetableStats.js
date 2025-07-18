import React from 'react';
import { Card, Table, Row, Col, Statistic, Progress, Typography } from 'antd';

const { Title } = Typography;

function TimetableStats({ stats }) {
  if (!stats) {
    return <div>No statistics available</div>;
  }

  const { facultyStats, subjectStats, overallStats } = stats;

  const facultyColumns = [
    {
      title: 'Faculty Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Lectures',
      dataIndex: 'lectures',
      key: 'lectures',
    },
    {
      title: 'Labs',
      dataIndex: 'labs',
      key: 'labs',
    },
    {
      title: 'Total',
      key: 'total',
      render: (_, record) => record.lectures + record.labs,
    },
    {
      title: 'Subjects',
      dataIndex: 'subjects',
      key: 'subjects',
      render: (subjects) => subjects.join(', '),
    },
  ];

  const subjectColumns = [
    {
      title: 'Subject Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Lectures',
      dataIndex: 'lectures',
      key: 'lectures',
    },
    {
      title: 'Labs',
      dataIndex: 'labs',
      key: 'labs',
    },
    {
      title: 'Total',
      key: 'total',
      render: (_, record) => record.lectures + record.labs,
    },
  ];

  const utilization = ((overallStats.usedSlots / (overallStats.totalSlots - overallStats.breakSlots)) * 100).toFixed(2);

  return (
    <div>
      <Title level={3}>Timetable Statistics</Title>
      
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="Total Slots" value={overallStats.totalSlots} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Used Slots" value={overallStats.usedSlots} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Free Slots" value={overallStats.freeSlots} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Break Slots" value={overallStats.breakSlots} />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: 24 }}>
        <Progress 
          percent={parseFloat(utilization)} 
          status="active"
          format={percent => `Utilization: ${percent}%`}
        />
      </Card>

      <Card title="Faculty Statistics" style={{ marginBottom: 24 }}>
        <Table 
          columns={facultyColumns} 
          dataSource={facultyStats.map((stat, index) => ({ ...stat, key: index }))}
          pagination={false}
        />
      </Card>

      <Card title="Subject Statistics">
        <Table 
          columns={subjectColumns} 
          dataSource={subjectStats.map((stat, index) => ({ ...stat, key: index }))}
          pagination={false}
        />
      </Card>
    </div>
  );
}

export default TimetableStats; 