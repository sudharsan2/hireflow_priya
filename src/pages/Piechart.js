// Dashboard.js
import React, { Component } from 'react';
import BarGraph from '../components/usermanagement/BarGraph'; // Import BarGraph component
import Usernav from '../components/usermanagement/Usernav';
import RoundsGraph from '../components/usermanagement/RoundsGraph';
import Gaugecon from '../components/usermanagement/Gauge';
import CandidateAdmin from "../components/usermanagement/CandidatesDashboard";
import PieChartComponent from '../components/usermanagement/Piechartcon';
import Adminevaldashboard from '../components/usermanagement/AdminevalDashboard';
import UserTable from '../components/usermanagement/TableDashboard';
import CandidateStatusTable from '../components/usermanagement/TableevalDashboard';


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      chartData: null,
      percent: null,
      ovraldata: null,
      expdata:null,
    };
  }

  

  componentDidMount() {
    // Fetch data from the API for chartData, percent, and ovraldata
    Promise.all([
      fetch('https://hireflowapidev.focusrtech.com:90/hiring/auth/overallstats'),
      fetch('https://hireflowapidev.focusrtech.com:90/hiring/auth/hiringPercentage'),
      fetch('https://hireflowapidev.focusrtech.com:90/hiring/auth/jobstats'),
      fetch('https://hireflowapidev.focusrtech.com:90/hiring/auth/expdata')
    ])
    .then(([response1, response2, response3, response4]) => Promise.all([response1.json(), response2.json(), response3.json(), response4.json()]))
    .then(([data1, data2, data3, data4]) => {
      this.setState({
        loading: false,
        chartData: [
          { label: 'Assigned', value: data1['review by HR'] },
          { label: 'Tech', value: data1['Scheduled For Interview'] },
          { label: 'Waiting', value: data1['Interview Done'] },
          { label: 'Sel', value: data1['Offer Letters Given'] },
        ],
        percent: data2,
        ovraldata: data3,
        expdata:data4,
      });
    })
    .catch(error => {
      this.setState({
        loading: false,
        error: error.message,
      });
    });
  }  render() {
    const { loading, error, chartData, ovraldata, percent, expdata } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div>
        <Usernav/>
       
        <div style={{ display: 'flex', marginTop: '0px', }}>
        <div style={{display:'flex', flexDirection:'column'}}>
          <RoundsGraph data={chartData} title='Overall Report' />
          <BarGraph data={ovraldata} />
          
          
        </div>
          <div style={{display: 'flex', flexDirection: 'column'}}>
          <Gaugecon value={percent} title='Hired rate'/>
          <PieChartComponent data={expdata} />
          </div>
          <div style={{display:'flex', flexDirection:'column', width:'25vw'}}>
          <UserTable/>
          <CandidateStatusTable/>
          
          
        </div>
          
        </div>
        <div style={{ display: 'flex',  }}>
          
         
        </div>
        <div style={{display:'flex', flexDirection:'row', marginLeft:'5%', marginRight:'5%' }}>
        {/* <CandidateAdmin/>
        <Adminevaldashboard /> */}

        
        // </div>
        
       
        
      </div>
    );
  }
}

export default Dashboard;
