import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import Usernav from './Usernav';

class PieChartWithJsonData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonData: {
        total: 100,
        divisions: {
          "In Review by HRR": 20,
          "Scheduled for Interview": 30,
          "Interview done": 25,
          "Offer Letter given": 25
        }
      },
    };
  }

  render() {
    const { divisions } = this.state.jsonData;
    const data = Object.entries(divisions).map(([label, value]) => ({
      value,
      label,
    }));

    return (
      <div>
        <Usernav/>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '80px' }}>
        <div style={{ float: 'left', marginRight: '50px', marginLeft: '50px', marginTop: '20px', fontSize: '20px', border: '1px solid', borderRadius: '10px', padding:"20px", borderColor: "#7a7a7a"}}>

            {Object.entries(divisions).map(([key, value]) => (
              <p key={key}>
                {key}: {value}
              </p>
            ))}
          </div>
          <div style={{ float: 'left', height: '600px', width: '800px', fontSize: '20px' }}>
            <PieChart
              data={data}
              series={[
                {
                  data,
                  innerRadius: 150,
                  outerRadius: 250,
                  paddingAngle: 2,
                  cornerRadius: 5,
                  startAngle: 0,
                  endAngle: 360,
                  cx: 270,
                  cy:250,
                }
              ]}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default PieChartWithJsonData;
