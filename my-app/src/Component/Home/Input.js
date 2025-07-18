import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Space, Button, Modal, List, Popconfirm, message, Form } from 'antd';
import { SaveOutlined, HistoryOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import SubjectForm from '../controlles/SubjectForm';
import { generateTimetable } from '../controlles/Generatetimetable';

const { Title } = Typography;

function Input({ onGenerate, onSaveSubjects, onLoadSubjects, onDeleteSubjects, savedSubjects }) {
  const navigate = useNavigate();
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = (formData) => {
    console.log("Input.js received form data:", JSON.stringify(formData, null, 2));
    
    try {
      // Validate form data
      if (!formData || !formData.subjects || !Array.isArray(formData.subjects) || formData.subjects.length === 0) {
        message.error({
          content: "Invalid form data. Please check your inputs.",
          icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
        });
        return;
      }

      // Log each subject's data
      formData.subjects.forEach((subject, index) => {
        console.log(`Subject ${index + 1} data:`, {
          name: subject.name,
          faculty: subject.faculty,
          hours: subject.hours,
          labs: subject.labs
        });
      });

      // Generate timetable with the form data
      console.log("Generating timetable with data:", JSON.stringify(formData, null, 2));
      const timetableData = generateTimetable(formData);
      console.log("Generated timetable data:", JSON.stringify(timetableData, null, 2));
      
      if (!timetableData || !timetableData.schedule) {
        message.error({
          content: "Failed to generate timetable. Please check your inputs and try again.",
          icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
        });
        return;
      }
      
      // Pass the generated data up to App.js
      onGenerate(timetableData);
      
      // Navigate to the output page
      navigate('/output');
      message.success("Timetable generated successfully!");
    } catch (error) {
      console.error("Error generating timetable:", error);
      message.error({
        content: error.message || "Failed to generate timetable. Please try again.",
        icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
      });
    }
  };

  const handleSave = (formData) => {
    console.log("Saving form data:", JSON.stringify(formData, null, 2));
    onSaveSubjects(formData);
  };

  const handleLoad = (savedData) => {
    console.log("Loading saved data:", JSON.stringify(savedData, null, 2));
    try {
      // Validate saved data
      if (!savedData || !savedData.subjects || !Array.isArray(savedData.subjects)) {
        message.error({
          content: "Invalid saved data format",
          icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
        });
        return;
      }

      // Set the form values with the saved data
      form.setFieldsValue(savedData);
      
      // Generate timetable with the loaded data
      console.log("Generating timetable from saved data:", JSON.stringify(savedData, null, 2));
      const timetableData = generateTimetable(savedData);
      console.log("Generated timetable from saved data:", JSON.stringify(timetableData, null, 2));
      
      if (!timetableData || !timetableData.schedule) {
        message.error({
          content: "Failed to generate timetable from saved data",
          icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
        });
        return;
      }
      
      // Pass the generated data up to App.js
      onGenerate(timetableData);
      
      // Close the modal
      setIsHistoryModalVisible(false);
      
      // Navigate to the output page
      navigate('/output');
      message.success("Subjects loaded successfully!");
    } catch (error) {
      console.error("Error loading subjects:", error);
      message.error({
        content: error.message || "Failed to load subjects. Please try again.",
        icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
      });
    }
  };

  const handleDelete = (subjectId) => {
    console.log("Deleting subject with ID:", subjectId);
    onDeleteSubjects(subjectId);
  };

  const showHistoryModal = () => {
    setIsHistoryModalVisible(true);
  };

  const hideHistoryModal = () => {
    setIsHistoryModalVisible(false);
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0 }}>
            Timetable Generator
          </Title>
          <Space>
            <Button 
              icon={<HistoryOutlined />} 
              onClick={showHistoryModal}
              type="default"
            >
              Saved Subjects
            </Button>
          </Space>
        </div>
        <SubjectForm 
          form={form}
          onSubmit={handleSubmit} 
          onSave={handleSave}
        />
      </Card>

      <Modal
        title="Saved Subjects"
        open={isHistoryModalVisible}
        onCancel={hideHistoryModal}
        footer={null}
        width={800}
      >
        <List
          dataSource={savedSubjects}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button 
                  type="primary" 
                  onClick={() => handleLoad(item)}
                >
                  Load
                </Button>,
                <Popconfirm
                  title="Are you sure you want to delete this saved subject?"
                  onConfirm={() => handleDelete(item.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button 
                    danger 
                    icon={<DeleteOutlined />}
                  >
                    Delete
                  </Button>
                </Popconfirm>
              ]}
            >
              <List.Item.Meta
                title={`Saved on ${new Date(item.savedAt).toLocaleString()}`}
                description={`${item.subjects?.length || 0} subjects`}
              />
            </List.Item>
          )}
        />
      </Modal>
    </Space>
  );
}

export default Input;
