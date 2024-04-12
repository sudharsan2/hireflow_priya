import React, { useState, useEffect } from 'react';
import GaugeChart from 'react-gauge-chart';

const GaugeComponent = ({ value, title }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShouldRender(true);
    }, 200); // Delay rendering for 2 seconds

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (shouldRender) {
      const animationInterval = setInterval(() => {
        if (animatedValue < value * 0.01) {
          setAnimatedValue(prevValue => prevValue + 0.01);
        } else {
          clearInterval(animationInterval);
        }
      }, 20);

      return () => clearInterval(animationInterval);
    }
  }, [value, animatedValue, shouldRender]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div style={{ width: '450px', height: '300px', paddingTop: '0px', backgroundColor:'white' ,borderRadius:'3px', margin:'10px',boxShadow:'0 0 10px rgb(0,0,0,0.2)', padding:'-30px', marginRight:'40px', marginLeft:'10px'}}>
      <h2 style={{ textAlign: 'center', fontWeight: 'normal', paddingBottom: '30px' }}>{title.toUpperCase()}</h2>
      <GaugeChart
        id="gauge-chart1"
        percent={animatedValue}
        needleColor="rgb(100,100,100,0)"
        textColor="rgb(100,100,100)"
        formatTextValue={() => `${Math.round(animatedValue * 100)}%`}
        needleBaseColor="rgb(100,100,100,0)"
        needleBaseSize={3}
        needleWidth={1}
        animate={false}
        arcsLength={[animatedValue, 1 - animatedValue]}
        colors={['#23da78', 'rgb(100,100,100,0.3)']}
        fontSize='30px'
        arcPadding={0.01}
        fontWeight='bold'
      />
    </div>
  );
};

export default GaugeComponent;
