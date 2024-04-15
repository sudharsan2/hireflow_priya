import React, { useState, useEffect } from 'react';
import GaugeChart from 'react-gauge-chart';

const GaugeComponent = ({ value, title }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShouldRender(true);
    }, 0); // Delay rendering for 2 seconds

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
    <div style={{
      height: '45vh', /* 50% of the viewport height */
      width: '30.33vw', /* 33.33% of the viewport width */
      position: 'relative',
      backgroundColor: 'white',
      paddingBottom: '5%', /* Adjust this value according to your need */
      borderRadius: '3px',
      margin: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.2)', /* Corrected the rgba syntax */
    }}>
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
        fontSize='50px'
        arcPadding={0.01}
        fontWeight='bold'
      />
    </div>
  );
};

export default GaugeComponent;
