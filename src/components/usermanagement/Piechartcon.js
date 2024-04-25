import React, { Component } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Usernav from './Usernav';

class BarChartWithApiData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      data: null,
    };
  }

  componentDidMount() {
    // Fetch data from the API
    fetch('https://hireflowapi.focusrtech.com:90/hiring/auth/overallstats')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data from the API');
        }
        return response.json();
      })
      .then(data => {
        this.setState({
          loading: false,
          data: {
            'HRR': data['review by HR'],
            'Interview': data['Scheduled For Interview'],
            'completed': data['Interview Done'],
            'Offered': data['Offer Letters Given'],
          },
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
          error: error.message,
        });
      });
  }

  render() {
    const { loading, error, data } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    const chartData = Object.entries(data).map(([label, value], index) => ({
      name: label,
      Number: value,
      fill: index % 1 === 0 ? '#8884d8' : '#82ca9d', // Alternating colors
    }));

    return (
      <div style={{ height: '300px', width: '600px' }}>
        <h3 style={{textAlign:'center'}}>Overall Report</h3>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey="name" />
            <YAxis dataKey="Number"/>
            <Tooltip />
           
            <Bar dataKey="Number" fill="#8884d8" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default BarChartWithApiData;