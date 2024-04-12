// import { Gauge } from '@mui/x-charts/Gauge';
import GaugeChart from 'react-gauge-chart'


const Gaugecon = ({val}) =>{
    return (
        <div>
           <GaugeChart id="gauge-chart1" 
            nrOfLevels={1} 
            colors={["#71cbff", "#004cff"]} 
            arcWidth={0.05} 
            percent={val*0.01} 
            />
        </div>
    )
}
export default Gaugecon