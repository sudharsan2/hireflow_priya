import React from 'react';
import HRRContainer from '../components/usermanagement/HRRContainer';
import HRRHeader from '../components/usermanagement/HRRHeader';
import Techheader from '../components/usermanagement/Techheader';
import Candidatecon from '../components/usermanagement/Candidatecon';
import Cannav from '../components/usermanagement/Cannav';
import Canheader from '../components/usermanagement/Canheader';


//////////////////////////////////////////////////////////////////////////////////

const Usermanagement = () => {
  return (
    <div>
        <Cannav />
        <Canheader />
        <Candidatecon />
      
    </div>
  );
};

export default Usermanagement;