import { Gauge } from '@mui/x-charts/Gauge';


const Gaugecon = (val) =>{
    return (
        <div>
            <Gauge
                value={val}
                startAngle={0}
                endAngle={360}
                innerRadius="80%"
                outerRadius="100%"
                // ...
            />
        </div>
    )
}
export default Gaugecon