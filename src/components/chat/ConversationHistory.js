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
  const [mailSending, setMailsending] = useState(false);
  const handleUserClick = (user) => {
    // Handle user selection
    console.log("Selected user:", user);
    
  };

  const appendText = (html) => {
    setQuillText(html);
  };

  const sendMail = async (payload) => {
    const token = localStorage.getItem('accessToken');
    const apiUrl = "https://hireflowapidev.focusrtech.com:90/hiring/entryLevel/sendemail";

    try {
      const response = await axios.post(apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Mail sent');
      message.success('Mail sent');
    } catch (error) {
      console.error('Mail sent Failure:', error);
      message.error('Unable to send mail');
    }
    finally {
      setShowCompose(false);
    }
  };

  const handleButtonClick = () => {
    setShowCompose(!showCompose);
  };

  const handleComposeButtonClick = () => {
    

    if (subject !== '' && quillText !== '') {
      setMailsending(!mailSending);
      const displayMessage = {
        emailContent: quillText,
        emailAddress: user.email,
        dateAndTime: '01-12-2023'
      };

      const payload = {
        subject: subject,
        from: localStorage.getItem('mail'),
        to: [user.email],
        body: quillText,
        cclist: [cc],
        bcclist: [bcc],
        attachments: attachments,
      };

      setQuillText('');
      setCC('');
      setSubject('');

      const messageData = { ...selectedUser };
      messageData.sent = displayMessage;
      history(messageData);

      console.log(payload);
      sendMail(payload);
      setMailsending(false);
    } else {
      message.error('Please fill in the subject and message.');
    }
  };


  const handleFileChange = (e) => {
    const files = e.target.files;
    setAttachments(files);
  };

  const EmailAnimation = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" width="80" height="80" style={{ shapeRendering: 'geometricPrecision', textRendering: 'geometricPrecision', imageRendering: 'optimizeQuality', fillRule: 'evenodd', clipRule: 'evenodd' }} viewBox="0 0 6.827 6.827">
        <defs>
          <style>
            {`
              .fil1{fill:none;}
              .bounce {
                animation: bounce 0.8s infinite alternate;
              }
              @keyframes bounce {
                0% {
                  transform: translateY(0);
                }
                100% {
                  transform: translateY(-20%);
                }
              }
            `}
          </style>
        </defs>
        <g id="Layer_x0020_1">
          <path style={{ fill: '#fbe9e7' }} d="M.853 3.062h5.12v2.415H.853z" />
          <g id="_491470088">
            <path id="_491469776" className="fil1" d="M0 0h6.827v6.827H0z" />
            <path id="_491469728" className="fil1" d="M.853.853h5.12v5.12H.853z" />
          </g>
          <path className="fil1" d="M.853.853h5.12v5.12H.853z" />
          <path style={{ fill: '#1e88e5' }} d="m3.413 4.589 2.56-1.277v2.661H.853V3.312z" />
          <path style={{ fill: '#64b5f6' }} d="M3.413 1.341.853 2.62v.688h5.12v-.688z" className="bounce" />
          <path className="fil1" d="M0 0h6.827v6.827H0z" />
        </g>
      </svg>
    );
  };

  
  const imgurl2 = require("../../media/nomail.jpg");


  return (
    <>
      <div className="conversation-header">
        <div className="conversation-avatar">
          {user && Object.keys(user).length > 0 && (
            <>
              <UserAvatar username={user.username} />
            </>
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
          
            {flag && <div className="spinner-container"><EmailAnimation /></div>}
         

          {(!selectedUser || !Object.values(selectedUser).length) && !flag && (
            <div className="default-quote" style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'100px',}}>
             <img src={imgurl2} alt="No Email" style={{ width: '300px', height: '300px' }}/>
              
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
              {!mailSending ? (
                <Button type="primary" onClick={handleComposeButtonClick}>
                  Send <SendOutlined />
                </Button>
              ) : (
                <Button disabled>sending...</Button>
              )}
            </div>
          </Modal>
        )}
      </div>
    </>
  );
}