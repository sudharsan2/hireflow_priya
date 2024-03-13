// ResultPage.js

import React from "react";
import { Card } from "antd";
import { useSelector } from "react-redux";

const ResultPage = () => {
  const searchResults = useSelector((state) => state.search.searchResults);
  return (
    <div>
      <h1>Results Page</h1>
      {searchResults && searchResults.length > 0 ? (
        searchResults.map((item, index) => (
          <Card key={index} title={item.title} extra={item.company_name}>
            {/* Additional card content if needed */}
          </Card>
        ))
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default ResultPage;
