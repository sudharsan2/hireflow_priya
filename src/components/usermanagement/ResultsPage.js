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
          <Card key={index} title={item.title} extra={item.company_name} style={{ margin: '16px', backgroundColor:'#eaf8fc' }}>
            {/* Additional Field: related_links.link */}
            <p>Location: {item.location}</p>
            <p>Related Link: <a href={item.related_links[0].link} target="_blank" rel="noopener noreferrer">{item.related_links[0].text}</a></p>
          </Card>
        ))
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default ResultPage;
