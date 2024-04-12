import React, { Component } from 'react';
import HRRContainer from '../components/usermanagement/HRRContainer';
import HRRHeader from '../components/usermanagement/HRRHeader';
import Techheader from '../components/usermanagement/Techheader';
import Candidatecon from '../components/usermanagement/Candidatecon';
import Cannav from '../components/usermanagement/Cannav';
import Canheader from '../components/usermanagement/Canheader';
import BarGraphWithApiData from '../components/usermanagement/Piechartcon';
import Usernav from '../components/usermanagement/Usernav';
import RoundsGraph from '../components/usermanagement/RoundsGraph';
// import Gaugecon from '../components/usermanagement/Gauge';



//////////////////////////////////////////////////////////////////////////////////

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      chartData: null,
      title:null,
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
          chartData: [
            { label: 'HRR', value: data['review by HR'] },
            { label: 'Interview', value: data['Scheduled For Interview'] },
            { label: 'Completed', value: data['Interview Done'] },
            { label: 'HRR', value: data['review by HR'] },
            
            
          ],
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
    const { loading, error, chartData } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div>
        <Usernav/>
      <div style={{display:'flex'}}>
        
        <RoundsGraph data={chartData} title='Overall Report' />
        <RoundsGraph data={chartData} title='Overall Report' />
        {/* <Gaugecon val='50'/> */}
        
      </div>
      <div style={{display:'flex', paddingTop:'50px'}}>
        
      <RoundsGraph data={chartData} title='Overall Report' />
      <RoundsGraph data={chartData} title='Overall Report' />
      <RoundsGraph data={chartData} title='Overall Report' />
      
    </div>
    </div>
    );
  }
}

export default Dashboard;