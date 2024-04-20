import React from 'react';
import { Table, Input, Button, Space } from 'antd';
// import 'antd/dist/antd.css';

class DynamicTable extends React.Component {
  render() {
    const data = this.props.data;
    const columns = data.length > 0 ? Object.keys(data[0]).map(fieldName => ({title: fieldName, dataIndex: fieldName, key: fieldName})) : [];

    return (
      <div className="table-container">
        <Table dataSource={data} columns={columns} />
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      data: []
    };
  }

  generateMockData = query => {
    const mockData = [    {    "name": "Gayathri A",
    "email": "agayathri347@gmail.com"   },
  {
    "name": "Tushar Agrawal",
    "email": "agarwaltushar2016@gmail.com"   },
  {
    "name": "Tushar Agrawal",
    "email": "agarwaltushar2016@gmail.com"   },
  {
    "name": "Abdul Kader M",
    "email": "jobseeker3222@gmail.com"   },
  {
    "name": "Keerthana S",
    "email": "keerthuuraj129@gmail.com"   },
  {
    "name": "Gayathri A",
    "email": "agayathri347@gmail.com"   },
  {
    "name": "Gayathri A",
    "email": "agayathri347@gmail.com"   },
  {
    "name": "Gayathri A",
    "email": "agayathri347@gmail.com"   },
  {
    "name": "Tushar Agrawal",
    "email": "agarwaltushar2016@gmail.com"   },
  {
    "name": "Keerthana S",
    "email": "keerthuuraj129@gmail.com"   },
  {
    "name": "Gayathri A",
    "email": "agayathri347@gmail.com"   },
  {
    "name": "Gayathri A",
    "email": "agayathri347@gmail.com"   },
  {
    "name": "Gayathri A",
    "email": "agayathri347@gmail.com"   },
  {
    "name": "Gayathri A",
    "email": "agayathri347@gmail.com"   },
  {
    "name": "Harinath Rangasamy",
    "email": "harinathit@gmail.com"   },
  {
    "name": "Harinath Rangasamy",
    "email": "harinathit@gmail.com"   },
  {
    "name": "Gayathri A",
    "email": "agayathri347@gmail.com"   },
  {
    "name": "Tushar Agrawal",
    "email": "agarwaltushar2016@gmail.com"   }
]
    return mockData.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
  };

  fetchData = () => {
    const query = this.state.query;
    const mockData = this.generateMockData(query);
    this.setState({ data: mockData });
  };

  handleInputChange = event => {
    this.setState({ query: event.target.value });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    this.fetchData();
  };

  render() {
    return (
      <div style={{ margin: '5%' }}>
        <form onSubmit={this.handleFormSubmit}>
          <Space>
            <div style={{display: 'flex'}}>
            <Input
              placeholder="Enter your query"
              value={this.state.query}
              onChange={this.handleInputChange}
              style={{width:'73vw', marginBottom:'30px',height:'50px'}}
            />
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: 'rgb(150,150,250)', border: 'none', height:'50px', fontSize:'1.2em' }}
            >
              Search
            </Button>
            </div>
          </Space>
        </form>
        <DynamicTable data={this.state.data} />
      </div>
    );
  }
}

export default App;
