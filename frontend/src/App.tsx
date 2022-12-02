
import './App.css';
import React from 'react';


import { Layout } from 'antd';
import { Button, Space } from 'antd';

function App() {
  return (
 

    <React.Fragment>
      <Layout>
                <div className='App'>
      <h1>Hello Hackathon</h1>
        </div>
      </Layout>
    
    
      <Space wrap>
        <Button type="primary">Primary Button</Button>
        <Button>Default Button</Button>
        <Button type="dashed">Dashed Button</Button>


      </Space>
    
    </React.Fragment>





  );
}

export default App;