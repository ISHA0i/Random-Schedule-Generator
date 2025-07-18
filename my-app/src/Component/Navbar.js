import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { HomeOutlined, ScheduleOutlined } from '@ant-design/icons';

const { Header } = Layout;

function Navbar() {
  const location = useLocation();
  
  const items = [
    {
      key: '/input',
      icon: <HomeOutlined />,
      label: <Link to="/input">Home</Link>,
    },
    {
      key: '/output',
      icon: <ScheduleOutlined />,
      label: <Link to="/output">Schedule</Link>,
    },
  ];

  return (
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%', padding: '0 24px' }}>
      <div style={{ float: 'left', marginRight: '24px' }}>
        <Link to="/" style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
          Scheduler App
        </Link>
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={items}
        style={{ lineHeight: '64px' }}
      />
    </Header>
  );
}

export default Navbar;