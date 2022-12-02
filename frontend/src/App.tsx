import React from 'react'

//import { Col, Divider, Row } from 'antd';

import './App.css';
import Header from './Components/Header';
import MainInterface from './Components/MainInterface';
import SideBar from './Components/SideBar';

function App() {


  return (
    <div className='App'>
      

      <Header />
      

      <SideBar />

      

      <MainInterface />

    </div>
  );
}

export default App;
