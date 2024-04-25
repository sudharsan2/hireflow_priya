import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer ,Legend, Tooltip} from 'recharts';


const customLabels = {
  'Oracle Apps Technical Consultant': 'Orc Tech',
  'Java Full Stack developer': 'Java FSD',
  'Oracle Apps DBA': 'Orc DBA',
  'Oracle Finance Functional Consultant': 'Orc Fininance',
  'Oracle HRMS consultant': 'Orc HRMS',
  'Oracle SCM consultant': 'Orc SCM',
  'Fresher': 'Fresher',

};


const SpecifiedDomainRadarChart = ({ data }) => {
  // Convert data object to an array of objects
  const chartData = Object.keys(data).map(corner => ({
    corner: customLabels[corner],
    ...data[corner],
  }));

  return (
    <div style={{
      height: '50vh', /* 50% of the viewport height */
      width: '27vw', /* 33.33% of the viewport width */
      position: 'relative',
      backgroundColor: 'white',
      paddingBottom:'17%',/* Adjust this value according to your need */
      borderRadius: '10px',
      margin: '10px',
      // boxShadow: '0 0 10px rgba(0,0,0,0.2)', /* Corrected the rgba syntax */
    }}>
      <ResponsiveContainer>
      <h2 style={{ textAlign: 'center', fontWeight: 'normal',padding:'-10px' }}>Job status</h2>
        <RadarChart   outerRadius="80%" data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="corner" />
          <PolarRadiusAxis />
          <Radar name="Assigned" dataKey="review by HR" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
          <Radar name="Tech" dataKey="Scheduled For Interview" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.2} />
          <Radar name="HR" dataKey="Interview Done" stroke="#ffc658" fill="#ffc658" fillOpacity={0.2} />
          <Radar name="Selected" dataKey="Offer Letters Given" stroke="#ff7300" fill="#ff7300" fillOpacity={0.2} />
          <Tooltip/>
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpecifiedDomainRadarChart;
