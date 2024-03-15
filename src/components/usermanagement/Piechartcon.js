import React, { Component } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import Usernav from './Usernav';

class PieChartWithApiData extends Component {
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
    fetch('http://172.235.10.116:7000/hiring/auth/overallstats')
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
            'In Review by HRR': data['review by HR'],
            'Scheduled for Interview': data['Scheduled For Interview'],
            'Interview done': data['Interview Done'],
            'Offer Letter given': data['Offer Letters Given'],
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

    const chartData = Object.entries(data).map(([label, value]) => ({
      value,
      label,
    }));

    return (
      <div>
        <Usernav />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '80px' }}>
          <div style={{ float: 'left', marginRight: '50px', marginLeft: '50px', marginTop: '20px', fontSize: '20px', border: '1px solid', borderRadius: '10px', padding: '20px', borderColor: '#7a7a7a' }}>
            {Object.entries(data).map(([key, value]) => (
              <p key={key}>
                {key}: {value}
              </p>
            ))}
          </div>
          <div style={{ float: 'left', height: '600px', width: '800px', fontSize: '20px' }}>
            <PieChart
              data={chartData}
              series={[
                {
                  data: chartData,
                  innerRadius: 150,
                  outerRadius: 250,
                  paddingAngle: 2,
                  cornerRadius: 5,
                  startAngle: 0,
                  endAngle: 360,
                  cx: 270,
                  cy: 250,
                }
              ]}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default PieChartWithApiData;
