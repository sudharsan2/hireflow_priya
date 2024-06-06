import { Upload, message } from 'antd';
import React, { useState } from 'react';
import axios from 'axios';
import './WalkinCandidate.css';

const WalkInCandidate = ({ isWalkinUpload }) => {
  // const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async ({file, onSuccess, onError}) => {
    // setIsUploading(true);
    const token = localStorage.getItem('accessToken');

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await axios.post(
        'https://hireflowapidev.focusrtech.com:90/hiring/entryLevel/walkin',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle success
      console.log(' in axios File uploaded successfully:', response.data);
      message.success(`${file.name} uploaded successfully.`);
      file.status = 'done';
      onSuccess();
    } catch (error) {
      // Handle error
      console.error('in axios Error uploading file:', error);
      message.error(`${file.name} upload failed.`);
      file.status = 'error';
      onError();
    } finally {
      // setIsUploading(false);
      isWalkinUpload(); 
    }
  };

  return (
    <div className="form">
      <h1>Walkin Candidate</h1>
      <Upload.Dragger
        name="file"
        onChange={(info) => {
          
        }}
        customRequest={handleUpload}
        // disabled={false}
      >
        <p className="ant-upload-text">Click or drag file to upload</p>
        <p className="ant-upload-hint">
          Upload walkin candidate's resume. It will reflect in Kanban.
        </p>
      </Upload.Dragger>
    </div>
  );
};

export default WalkInCandidate;
