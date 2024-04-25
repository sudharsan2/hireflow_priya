import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend , ResponsiveContainer} from 'recharts';

const COLORS = ['#82b6ff', '#5ad7ba', '#ffd653', '#ffb173']; // You can add more colors as needed

const customLabels = {
  zero_experience_count: 'Freshers',
  one_to_three_experience_count: '1 to 3 Years',
  four_to_six_experience_count: '4 to 6 Years',
  above_six_experience_count: '8+ Years',
};

const PieChartComponent = ({ data }) => {
  const chartData = Object.keys(data).map(name => ({
    name: customLabels[name], // Map the original label name to the custom label
    value: data[name],
  }));

  return (
    <div style={{
      height: '57vh', /* 50% of the viewport height */
      width: '27vw', /* 33.33% of the viewport width */
      position: 'relative',
      backgroundColor: 'white',
      paddingBottom: '20%', /* Adjust this value according to your need */
      borderRadius: '10px',
      margin: '10px',
      // boxShadow: '0 0 10px rgba(0,0,0,0.2)', /* Corrected the rgba syntax */
    }}>
    <ResponsiveContainer>
      <h2 style={{ textAlign: 'center', fontWeight: 'normal' }}>Experience</h2>
    <PieChart >
      <Pie
        data={chartData}
        cx="50%"
        cy="50%"
        outerRadius={'80%'}
        innerRadius={'50%'}
        fill="#8884d8"
        
      >
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
    </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
