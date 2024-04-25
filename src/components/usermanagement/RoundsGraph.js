import React, { Component } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, Area } from 'recharts';

class SameDataComposedChart extends Component {
  render() {
    const col = [
      
      'rgb(150, 200, 255)',
      'rgb(120, 180, 255)',
      'rgb(100, 160, 255)',
      'rgb(80, 140, 255)',
      'rgb(50, 120, 255)',
      'rgb(20, 100, 255)'
    ];

    const { data = [], title } = this.props;

    if (!data) {
      return null;
    }

    const chartData = data.map(({ label, value }, index) => ({
      name: label,
      value: value,
      fill: col[index % col.length],
    }));

    return (
      <div style={{
        height: '40vh',
        width: '27vw',
        position: 'relative',
        backgroundColor: 'white',
        paddingBottom: '15%',
        borderRadius: '10px',
        margin: '10px',
      }}>
        <ResponsiveContainer>
          <h2 style={{ textAlign: 'center', fontWeight: 'normal' }}>{title}</h2>
          <ComposedChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
            }}
          >
            <XAxis dataKey="name" ticks={[]} />
            <CartesianGrid />
            <YAxis />
            {/* <Tooltip /> */}
            
            <Bar dataKey="value" fill="#8884d8" barSize={45} />
            <Line type="monotone" dataKey="value" stroke="#82ca9d" />
            <Area type="monotone" dataKey="value" fill="rgb(0,0,0,0)" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default SameDataComposedChart;
