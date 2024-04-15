import React, { Component } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

class RoundsGraph extends Component {
  render() {
    const col = [
      'rgb(247, 120, 120)', // dark red
      'rgb(33, 213, 168)', // dark green
      'rgb(33, 192, 213)', // dark blue
      'rgb(213, 33, 210)', // dark purple
      'rgb(213, 33, 144)', // dark magenta
      'rgb(211, 204, 126)', // dark yellow
      'rgb(231, 93, 155)', // dark maroon
      'rgb(0, 150, 150)', // dark cyan
    ];

    const { data = [], title } = this.props; // Provide default value for data prop

    // Check if data is null or undefined
    if (!data) {
      return null; // Or render an error message
    }

    const chartData = data.map(({ label, value }, index) => ({
      name: label,
      value: value,
      fill: col[index % col.length], // Ensure color alternates even if there are more data points than colors
    }));

    return (
      <div style={{
        height: '45vh', /* 50% of the viewport height */
        width: '30.33vw', /* 33.33% of the viewport width */
        position: 'relative',
        backgroundColor: 'white',
        paddingBottom: '5%', /* Adjust this value according to your need */
        borderRadius: '3px',
        margin: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.2)', /* Corrected the rgba syntax */
      }}>
        <ResponsiveContainer>
          <h2 style={{ textAlign: 'center', fontWeight: 'normal' }}>{title.toUpperCase()}</h2>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              
              
            }}
          >
            <XAxis dataKey="name" ticks={[]} />
            <CartesianGrid />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" barSize={25} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default RoundsGraph;
