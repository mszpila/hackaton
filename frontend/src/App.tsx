import React, { useState } from 'react'

//import { Col, Divider, Row } from 'antd';

import './App.css';


//some changes
//import { Layout } from 'antd';
//import { Button } from 'antd';
import Header from './Components/Header'
import MainInterface from './Components/MainInterface';
import SideBar from './Components/SideBar';
import Health from './Components/Health';

//type name1 =  "MainInterface" | "health"
function App() {

  /* let renderTab = {
    MainInterface: <MainInterface />,
    health: <Health />
  } */

  const [selectedView, setSelectedView] = useState("MainInterface")

  return (
    // <ZHeader/>
    // <Meals/>

    // <LeftBar/>
  
<div className='App'>
                
      <Header setSelectedView={setSelectedView}/>   
    
      <SideBar />
 
      {selectedView === "MainInterface" ? 
          <MainInterface/> : <Health />}
   
    </div>

  );
}

export default App;