import React from 'react';
import { Typography, Tag, Space } from 'antd';

const { Title, Text } = Typography;

function FreeSlots({ freeSlots }) {
  if (!freeSlots || Object.keys(freeSlots).length === 0) {
    return <Text>No free slots available</Text>;
  }

  const formatFreeSlots = () => {
    const formattedSlots = [];
    for (const [day, slots] of Object.entries(freeSlots)) {
      if (slots && slots.length > 0) {
        formattedSlots.push(
          <div key={day}>
            <Text strong>{day}: </Text>
            <Space wrap>
              {slots.map((slot, index) => (
                <Tag key={index} color="blue">{slot}</Tag>
              ))}
            </Space>
          </div>
        );
      }
    }
    return formattedSlots;
  };

  return (
    <div>
      <Title level={4}>Free Slots</Title>
      <Space direction="vertical" size="small">
        {formatFreeSlots()}
      </Space>
    </div>
  );
}

export default FreeSlots; 