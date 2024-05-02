import React from 'react';
import LongCardTable from './LongCardTable'; // Assuming LongCardTable component is in a separate file

function MyPage() {
  return (
    <div className="container">
      <h1 className="pageTitle">Selected Candidates</h1>
      <LongCardTable
        apiUrl="http://172.235.10.116:7000/hiring/auth/getselectedCandidate"
        columns={['RES-ID', 'Name', 'HRR', 'Interviewers', 'finalRemarks']}
      />
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
        }
        .pageTitle {
          font-size: 24px;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
}

export default MyPage;
