import React, { Component } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend,  CartesianGrid,ResponsiveContainer } from 'recharts';

class RoundsGraph extends Component {

    
  render() {

    const col = [
        'rgb(200, 0, 0)', // dark red
        'rgb(0, 150, 100)', // dark green
        'rgb(0, 100, 150)', // dark blue
        'rgb(150, 0, 150)', // dark purple
        'rgb(200, 0, 150)', // dark magenta
        'rgb(150, 150, 0)', // dark yellow
        'rgb(150, 0, 0)', // dark maroon
        'rgb(0, 150, 150)', // dark cyan
      ];
       const { data } = this.props;
    const { title } = this.props;
    const chartData = data.map(({ label, value }, index) => ({
      name: label,
      value: value,
      fill: col[index], // Alternating colors
    }));

    return (
      <div style={{ height: '300px', width: '400px', position:'relative', backgroundColor:'rgb(255,255,255)', paddingBottom:'60px', margin:'10px',marginTop:'20px', borderRadius:'3px', boxShadow:'0 0 10px rgb(0,0,0,0.2)' }}>
        <ResponsiveContainer>
            <h2 style={{textAlign:'center', fontWeight:'normal', }}>{title}</h2>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey="name" ticks={[]}/>
            {/* <CartesianGrid strokeDasharray="7 7" /> */}
            <CartesianGrid />
            <YAxis  />
            <Tooltip />
            
            <Bar dataKey="value" fill="#8884d8" barSize={25} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default RoundsGraph;
