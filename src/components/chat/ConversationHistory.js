
import React, { useState } from 'react';
import './conversation.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Spin, message, Modal, Form, Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import UserAvatar from './UserAvatar';
import axios from 'axios';
 
export default function ConversationHistory({
  selectedUser,
  flag,
  history,
  user,
}) {
  const [quillText, setQuillText] = useState('');
  const [cc, setCC] = useState('');
  const [bcc, setBCC] = useState('');
  const [subject, setSubject] = useState('');
  const [attachments, setAttachments] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
 
  const appendText = (html) => {
    setQuillText(html);
  };
 
  const sendMail = async (payload) => {
    const token = localStorage.getItem('accessToken');
    const apiUrl = 'http://172.235.10.116:7000/hiring/entryLevel/sendemail';
    try {
      await axios.post(apiUrl,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }, payload});
      console.log('Mail sent');
      message.success('Mail sent');
      }
     catch (error) {
      console.error('Mail sent Failure', error);
      message.error('Unable to send mail');
    }
  };
 
  const handleButtonClick = () => {
    setShowCompose(!showCompose);
  };
 
  const handleComposeButtonClick = () => {
    if (subject !== '' && quillText !== '') {
      const payload = {
        subject: subject,
        from: localStorage.getItem('mail'),
        to: [user.email],
        body: quillText,
        cclist: [cc],
        bcclist: [bcc],
        attachments: attachments,
      };
 
      sendMail(payload);
      const displayMessage = {
        emailContent: quillText,
 
        emailAddress: user.email,
        dateAndTime: '01-12-2023',
      };
      setQuillText('');
      const message = { ...selectedUser };
      message.sent = displayMessage;
      history(message);
 
      setCC('');
      setSubject('');
      setAttachments(null);
      setShowCompose(false);
    } else {
      message.error('Please fill in the subject and message.');
    }
  };
 
  const handleFileChange = (e) => {
    const files = e.target.files;
    setAttachments(files);
  };
 
  return (
    <>
      <div className="conversation-header">
        <div className="conversation-avatar">
          {user && Object.keys(user).length > 0 && (
            <UserAvatar username={user.username} />
          )}
        </div>
        <Button
          type="primary"
          onClick={handleButtonClick}
        >
          {showCompose ? 'Compose Mail' : 'Compose Mail'}
        </Button>
      </div>
 
      <div className="conversation-history-container">
        <div className="email-list">
          <div className="spinner-container">
            {flag && <Spin style={{ transform: 'scale(2)' }} />}
          </div>
 
          {(!selectedUser || !Object.values(selectedUser).length) && !flag && (
            <div className="default-quote" style={{ padding: '20px', marginTop: '170px', marginLeft: '120px' }}>
              <h1>Click on a chat to start the conversation.</h1>
            </div>
          )}
 
          {selectedUser &&
            Object.values(selectedUser)
              .sort(
                (a, b) =>
                  new Date(a.dateAndTime) - new Date(b.dateAndTime)
              )
              .map((email, index) => (
                <div key={index} className="email-item">
                  <h2 className="user-name">
                    From: {email.emailAddress}
                  </h2>
                  <p className="date-time">
                    Date and Time: {email.dateAndTime}
                  </p>
                  <div
                    className="email-content"
                    dangerouslySetInnerHTML={{
                      __html: email.emailContent,
                    }}
                  />
                </div>
              ))}
        </div>
 
        {showCompose && (
          <Modal
            title={`Compose Email - ${user ? user.username : ''}`}
            visible={showCompose}
            onCancel={() => setShowCompose(false)}
            footer={null}
          >
            <div className="compose-email-container">
              <Form>
                <Form.Item label="Subject">
                  <Input
                    type="text"
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="CC">
                  <Input
                    type="text"
                    placeholder="cc"
                    value={cc}
                    onChange={(e) => setCC(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="BCC">
                  <Input
                    type="text"
                    placeholder="bcc"
                    value={bcc}
                    onChange={(e) => setBCC(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Attachments">
                  <Input
                    type="file"
                    onChange={(e) => handleFileChange(e)}
                    multiple
                  />
                </Form.Item>
              </Form>
 
              <ReactQuill
                theme="snow"
                className="custom-quill-editor"
                placeholder="Write something here..."
                onChange={appendText}
                value={quillText}
              />
 
              <Button
                type="primary"
                onClick={handleComposeButtonClick}
              >
                Send
                <SendOutlined />
              </Button>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
}
 