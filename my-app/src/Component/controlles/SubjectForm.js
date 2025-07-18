import React from 'react';
import { 
  Form, 
  Input, 
  InputNumber, 
  Checkbox, 
  Button, 
  Card, 
  Space, 
  Typography, 
  message,
  Alert
} from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const SubjectForm = ({ form, onSubmit, onSave }) => {
  const onFinish = (values) => {
    console.log('Raw form values:', JSON.stringify(values, null, 2));
    
    try {
      // Validate subjects array
      if (!values.subjects || !Array.isArray(values.subjects) || values.subjects.length === 0) {
        message.error({
          content: 'Please add at least one subject',
          icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
        });
        return;
      }

      // Format the data for the timetable generator
      const formattedData = {
        subjects: values.subjects.map((subject, index) => {
          console.log(`Processing subject ${index + 1}:`, JSON.stringify(subject, null, 2));
          
          // Validate faculty names
          const facultyNames = Array.isArray(subject.facultyNames) 
            ? subject.facultyNames.filter(name => name && name.trim() !== '')
            : [];
          
          console.log(`Subject ${index + 1} faculty names:`, facultyNames);

          // Validate each field and show specific error messages
          if (!subject.name || !subject.name.trim()) {
            message.error({
              content: `Subject ${index + 1}: Name is required`,
              icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
            });
            throw new Error(`Subject ${index + 1}: Name is required`);
          }

          if (!facultyNames.length) {
            message.error({
              content: `Subject ${index + 1}: At least one faculty member is required`,
              icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
            });
            throw new Error(`Subject ${index + 1}: At least one faculty member is required`);
          }

          if (!subject.hours || subject.hours <= 0) {
            message.error({
              content: `Subject ${index + 1}: Hours must be greater than 0`,
              icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
            });
            throw new Error(`Subject ${index + 1}: Hours must be greater than 0`);
          }

          const formattedSubject = {
            name: subject.name.trim(),
            faculty: facultyNames,
            hours: parseInt(subject.hours),
            labs: subject.labs || false
          };

          console.log(`Formatted subject ${index + 1}:`, JSON.stringify(formattedSubject, null, 2));
          return formattedSubject;
        })
      };

      console.log('Final formatted data:', JSON.stringify(formattedData, null, 2));

      // Validate the final formatted data
      if (!formattedData.subjects.length) {
        message.error({
          content: 'No valid subjects found',
          icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
        });
        return;
      }

      // Validate total hours
      const totalHours = formattedData.subjects.reduce((sum, subject) => sum + subject.hours, 0);
      if (totalHours > 40) {
        message.error({
          content: `Total hours (${totalHours}) cannot exceed 40 hours per week`,
          icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
        });
        return;
      }

      onSubmit(formattedData);
    } catch (error) {
      console.error('Error formatting form data:', error);
      message.error({
        content: error.message || 'Error processing form data. Please try again.',
        icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
      });
    }
  };

  const handleSave = () => {
    try {
      const values = form.getFieldsValue();
      console.log('Saving form values:', JSON.stringify(values, null, 2));

      if (!values.subjects || !Array.isArray(values.subjects) || values.subjects.length === 0) {
        message.error({
          content: 'Please add at least one subject before saving',
          icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
        });
        return;
      }

      // Validate each subject before saving
      const invalidSubjects = values.subjects.filter((subject, index) => {
        const hasValidName = subject.name && subject.name.trim() !== '';
        const hasValidFaculty = Array.isArray(subject.facultyNames) && 
          subject.facultyNames.some(name => name && name.trim() !== '');
        const hasValidHours = subject.hours && subject.hours > 0;

        if (!hasValidName) {
          message.error({
            content: `Subject ${index + 1}: Name is required`,
            icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
          });
        }
        if (!hasValidFaculty) {
          message.error({
            content: `Subject ${index + 1}: At least one faculty member is required`,
            icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
          });
        }
        if (!hasValidHours) {
          message.error({
            content: `Subject ${index + 1}: Hours must be greater than 0`,
            icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
          });
        }

        return !hasValidName || !hasValidFaculty || !hasValidHours;
      });

      if (invalidSubjects.length > 0) {
        return;
      }

      onSave(values);
      message.success('Subjects saved successfully!');
    } catch (error) {
      console.error('Error saving subjects:', error);
      message.error({
        content: 'Error saving subjects. Please try again.',
        icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
      });
    }
  };

  return (
    <Form
      form={form}
      name="subject_form"
      onFinish={onFinish}
      autoComplete="off"
      layout="vertical"
      initialValues={{
        subjects: [{
          name: '',
          hours: 1,
          labs: false,
          facultyNames: ['']
        }]
      }}
    >
      <Alert
        message="Required Fields"
        description="Please fill in all required fields for each subject. Each subject must have a name, at least one faculty member, and hours per week. Total hours cannot exceed 40 per week."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Form.List name="subjects">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Card
                key={key}
                style={{ marginBottom: 16 }}
                title={`Subject ${name + 1}`}
                extra={
                  fields.length > 1 && (
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                    />
                  )
                }
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Form.Item
                    {...restField}
                    name={[name, 'name']}
                    label="Subject Name"
                    rules={[
                      { required: true, message: 'Please enter subject name' },
                      { whitespace: true, message: 'Subject name cannot be empty' }
                    ]}
                    validateTrigger={['onChange', 'onBlur']}
                  >
                    <Input 
                      placeholder="Enter subject name" 
                      status="warning"
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'hours']}
                    label="Hours per Week"
                    rules={[
                      { required: true, message: 'Please enter hours' },
                      { type: 'number', min: 1, max: 40, message: 'Hours must be between 1 and 40' }
                    ]}
                    validateTrigger={['onChange', 'onBlur']}
                  >
                    <InputNumber 
                      min={1} 
                      max={40} 
                      style={{ width: '100%' }}
                      status="warning"
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'labs']}
                    valuePropName="checked"
                  >
                    <Checkbox>Has Labs</Checkbox>
                  </Form.Item>

                  <Form.List name={[name, 'facultyNames']}>
                    {(facultyFields, { add: addFaculty, remove: removeFaculty }) => (
                      <>
                        {facultyFields.map(({ key: facultyKey, name: facultyName, ...restFacultyField }) => (
                          <Form.Item
                            key={facultyKey}
                            {...restFacultyField}
                            name={[facultyName]}
                            label={facultyName === 0 ? "Faculty Members" : ""}
                            rules={[
                              { required: true, message: 'Please enter faculty name' },
                              { whitespace: true, message: 'Faculty name cannot be empty' }
                            ]}
                            validateTrigger={['onChange', 'onBlur']}
                          >
                            <Input 
                              placeholder="Enter faculty name"
                              status="warning"
                              suffix={
                                facultyFields.length > 1 && (
                                  <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => removeFaculty(facultyName)}
                                  />
                                )
                              }
                            />
                          </Form.Item>
                        ))}
                        <Button
                          type="dashed"
                          onClick={() => addFaculty()}
                          icon={<PlusOutlined />}
                          style={{ marginBottom: 16 }}
                        >
                          Add Faculty
                        </Button>
                      </>
                    )}
                  </Form.List>
                </Space>
              </Card>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add Subject
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Generate Timetable
          </Button>
          <Button 
            type="default" 
            icon={<SaveOutlined />}
            onClick={handleSave}
          >
            Save Subjects
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default SubjectForm; 