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
import Gaugecon from '../components/usermanagement/Gauge';



//////////////////////////////////////////////////////////////////////////////////

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      chartData: null,
      chartDataScheduled: null,
      chartDataHR: null,
      chartDataIntdone: null,
      chartDataSelect:null,
      title:null,
      percent:null
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
            { label: 'TECH', value: data['Scheduled For Interview'] },
            { label: 'HR', value: data['Interview Done'] },
            { label: 'SEL', value: data['Offer Letters Given'] },
           
            
            
          ],
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
          error: error.message,
        });
      });






      fetch('http://172.235.10.116:7000/hiring/auth/reviewbyHR')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data from the reviewbyHR API');
        }
        return response.json();
      })
      .then(data => {
        this.setState({
          chartDataHR: [
            { label: 'OAT', value: data["Oracle Apps Technical Consultant"] },
            { label: 'JFSD', value: data["Java Full Stack developer"] },
            { label: 'OFFC', value: data["Oracle Finance Functional Consultant"] },
            { label: 'OHC', value: data["Oracle HRMS consultant"] },
            { label: 'OSC', value: data["Oracle SCM consultant"] },
            { label: 'ODBA', value: data["Oracle Apps DBA"] },
            { label: 'FRS', value: data["Fresher"] },
          ],
          loading: false,
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
          error: error.message,
        });
      });






      fetch('http://172.235.10.116:7000/hiring/auth/assigned')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data from the reviewbyHR API');
        }
        return response.json();
      })
      .then(data => {
        this.setState({
          chartDataScheduled: [
            // Assuming the structure of data from reviewbyHR API is similar
            { label: 'OAT', value: data["Oracle Apps Technical Consultant"] },
            { label: 'JFSD', value: data["Java Full Stack developer"] },
            { label: 'OFFC', value: data["Oracle Finance Functional Consultant"] },
            { label: 'OHC', value: data["Oracle HRMS consultant"] },
            { label: 'OSC', value: data["Oracle SCM consultant"] },
            { label: 'ODBA', value: data["Oracle Apps DBA"] },
            { label: 'FRS', value: data["Fresher"] },
          ],
          loading: false,
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
          error: error.message,
        });
      });



      fetch('http://172.235.10.116:7000/hiring/auth/interviewdone')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data from the reviewbyHR API');
        }
        return response.json();
      })
      .then(data => {
        this.setState({
          chartDataIntdone: [
            // Assuming the structure of data from reviewbyHR API is similar
            { label: 'OAT', value: data["Oracle Apps Technical Consultant"] },
            { label: 'JFSD', value: data["Java Full Stack developer"] },
            { label: 'OFFC', value: data["Oracle Finance Functional Consultant"] },
            { label: 'OHC', value: data["Oracle HRMS consultant"] },
            { label: 'OSC', value: data["Oracle SCM consultant"] },
            { label: 'ODBA', value: data["Oracle Apps DBA"] },
            { label: 'FRS', value: data["Fresher"] },
          ],
          loading: false,
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
          error: error.message,
        });
      });


      
      fetch('http://172.235.10.116:7000/hiring/auth/selected')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data from the reviewbyHR API');
        }
        return response.json();
      })
      .then(data => {
        this.setState({
          chartDataSelect: [
            // Assuming the structure of data from reviewbyHR API is similar
            { label: 'OAT', value: data["Oracle Apps Technical Consultant"] },
            { label: 'JFSD', value: data["Java Full Stack developer"] },
            { label: 'OFFC', value: data["Oracle Finance Functional Consultant"] },
            { label: 'OHC', value: data["Oracle HRMS consultant"] },
            { label: 'OSC', value: data["Oracle SCM consultant"] },
            { label: 'ODBA', value: data["Oracle Apps DBA"] },
            { label: 'FRS', value: data["Fresher"] },
          ],
          loading: false,
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
          error: error.message,
        });
      });

      fetch('http://172.235.10.116:7000/hiring/auth/hiringPercentage')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch hiring percentage data');
        }
        return response.json(); // Parse response data as JSON
      })
      .then(data => {
        this.setState({
          percent: data,
          loading: false,
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
    const { loading, error, chartData,  chartDataHR, chartDataScheduled, chartDataIntdone, chartDataSelect, percent } = this.state;

    if (loading) {
      return <div></div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div>
     
        <Usernav/>
        <div style={{display:'flex', flexDirection:'column',alignItems:'center', justifyContent:'center'}}></div>
      <div style={{display:'flex', marginTop:'25px'}}>
        
        <RoundsGraph data={chartData} title='Overall Report' />
        <RoundsGraph data={chartDataHR} title='Reviewed by HR' />
        <Gaugecon value={percent} title='Hired %'/>
        
      </div>
      <div style={{display:'flex', paddingTop:'15px'}}>
        
      <RoundsGraph data={chartDataScheduled} title='Assigned' />
      <RoundsGraph data={chartDataIntdone} title='Interview done' />
      <RoundsGraph data={chartDataSelect} title='Selected' />
      
    </div>
    </div>
    );
  }
}

export default Dashboard;