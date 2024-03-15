import React , { useState }from "react";
import { Modal, Form, Input, Button } from "antd";

const { TextArea } = Input;

const jsonData = [
  {
    id: 1,
    name: "John Doe",
    jobRole: "Software Engineer",
    resumeScore: 90,
    avatarUrl: "path/to/avatar1.jpg",
  },
  {
    id: 2,
    name: "Jane Smith",
    jobRole: "Data Scientist",
    resumeScore: 85,
    avatarUrl: "path/to/avatar2.jpg",
  },
  {
    id: 3,
    name: "Alice Johnson",
    jobRole: "Product Manager",
    resumeScore: 88,
    avatarUrl: "path/to/avatar3.jpg",
  },
  {
    id: 4,
    name: "Bob Brown",
    jobRole: "UX Designer",
    resumeScore: 92,
    avatarUrl: "path/to/avatar4.jpg",
  },
  {
    id: 5,
    name: "Eve Williams",
    jobRole: "Frontend Developer",
    resumeScore: 87,
    avatarUrl: "path/to/avatar5.jpg",
  },
  {
    id: 1,
    name: "John Doe",
    jobRole: "Software Engineer",
    resumeScore: 90,
    avatarUrl: "path/to/avatar1.jpg",
  },
  {
    id: 2,
    name: "Jane Smith",
    jobRole: "Data Scientist",
    resumeScore: 85,
    avatarUrl: "path/to/avatar2.jpg",
  },
  {
    id: 3,
    name: "Alice Johnson",
    jobRole: "Product Manager",
    resumeScore: 88,
    avatarUrl: "path/to/avatar3.jpg",
  },
  {
    id: 4,
    name: "Bob Brown",
    jobRole: "UX Designer",
    resumeScore: 92,
    avatarUrl: "path/to/avatar4.jpg",
  },
  {
    id: 5,
    name: "Eve Williams",
    jobRole: "Frontend Developer",
    resumeScore: 87,
    avatarUrl: "path/to/avatar5.jpg",
  },
  // Add more task objects as needed
];

const simulatedApiData = {
  1: {
    experience: "5 years",
    role: "Software Engineer",
    resumeScore: 90,
    hrr: "HRR Name",
    interviews: [
      { name: "Interviewer 1 Name", interviewTime: "Interview Time 1", rating: 5 },
      { name: "Interviewer 2 Name", interviewTime: "Interview Time 2", rating: 4 }
    ]
  },
  2: {
    experience: "3 years",
    role: "Data Scientist",
    resumeScore: 85,
    hrr: "HRR Name",
    interviews: [
      { name: "Interviewer 3 Name", interviewTime: "Interview Time 3", rating: 3 }
    ]
  },
  // Add more user details as needed
};
const CanCard = ({ user, onClick, onModalOpen }) => {
  const getAvatarUrl = () => {
    return process.env.PUBLIC_URL + "./img/avtr1.jpg";
  };

  return (
    <div className="user-card-can" onClick={() => onModalOpen(user)}>
      <img className="avatar" src={getAvatarUrl()} alt="User Avatar" />
      <h3>{user.name}</h3>
      <p>Job Role: {user.jobRole}</p>
      <p>Resume Score: {user.resumeScore}</p>
    </div>
  );
};

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState(null); // State to store user data

  const handleModalOpen = (user) => {
    // Set user data to be fetched
    setUserData(simulatedApiData[user.id]);
    // Open modal
    setModalVisible(true);
  };

  const handleModalClose = () => {
    // Close modal
    setModalVisible(false);
  };

  const handleFormSubmit = (values) => {
    // Handle form submission here
    console.log("Form values:", values);
    // Close modal after form submission
    setModalVisible(false);
  };

  return (
    <div>
      
      <div className="container">
        {jsonData.map((user, index) => (
          <CanCard key={user.id} user={user} onModalOpen={handleModalOpen} />
        ))}
      </div>
      <Modal
        title="User Details"
        visible={modalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {userData && (
          <Form onFinish={handleFormSubmit} initialValues={userData}>
            <Form.Item label="Experience" name="experience">
              <Input />
            </Form.Item>
            <Form.Item label="Role" name="role">
              <Input/>
            </Form.Item>
            <Form.Item label="Resume Score" name="resumeScore">
              <Input  />
            </Form.Item>
            <Form.Item label="HRR" name="hrr">
              <Input  />
            </Form.Item>
            <Form.Item>
    {userData.interviews.map((interview, index) => (
      <div key={index}>
        <Form.Item label={["Interview ",index+1]} ></Form.Item>
        <Form.Item name={['interviews', index, 'name']} noStyle>
          <Input placeholder="Name" />
        </Form.Item>
        <Form.Item name={['interviews', index, 'interviewTime']} noStyle>
          <Input placeholder="Interview Time" />
        </Form.Item>
        <Form.Item name={['interviews', index, 'rating']} noStyle>
          <Input placeholder="Rating" />
        </Form.Item>
      </div>
    ))}
  </Form.Item>
              
            
            <Form.Item label="Final Remarks" name="finalRemarks">
              <TextArea />
            </Form.Item>
            <Form.Item >
              <div style={{display:"flex",justifyContent:"space-between", paddingLeft:"20%", paddingRight:"20%"}}>
              <Button type="primary" htmlType="submit">
                Select
              </Button>
              <Button type="primary" htmlType="submit">
                On Hold
              </Button>
              <Button type="primary" htmlType="submit">
                Reject
              </Button>
              </div>
              
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default App;