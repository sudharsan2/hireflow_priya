import React from 'react';
import HRRContainer from '../components/usermanagement/HRRContainer';
import HRRHeader from '../components/usermanagement/HRRHeader';
import Techheader from '../components/usermanagement/Techheader';
import Techcontainer from '../components/usermanagement/Techcontainer';
import Usernav from '../components/usermanagement/Usernav';

const Usermanagement = () => {
  return (
    <div>
        <Usernav />
        <HRRHeader />
       <HRRContainer />
       <Techheader />
       <Techcontainer />
      
    </div>
  );
};

export default Usermanagement;