import React, { useState } from 'react'


//import { Col, Divider, Row } from 'antd';

import './App.css';


//some changes
//import { Layout } from 'antd';
//import { Button } from 'antd';
import Header from './Components/Header';
import MainInterface from './Components/MainInterface';
//import SideBar from './Components/SideBar';
import Health from './Components/Health'

export interface TypeEvents {
  title:string, 
  start?: string, 
  end?:string,
  date?: string
} 
//type name1 =  "MainInterface" | "health"
function App() {

  /* let renderTab = {
    MainInterface: <MainInterface />,
    health: <Health />
  } */

  const [selectedView, setSelectedView] = useState("MainInterface")

  const [events, setEvents] = useState<TypeEvents[]>([
                { title: 'event 1', start: '2022-12-02T10:00:00', end: '2022-12-02T12:00:00' },
                { title: 'event 2', date: '2022-12-02'}
                ])

  return (
    // <ZHeader/>
    // <Meals/>

    // <LeftBar/>
  
<div className='App'>
                
      <Header setSelectedView={setSelectedView}/>   
    
      
 
      {selectedView === "MainInterface" ? 
          (<div>
            {/* <SideBar /> */}
            <MainInterface events={events}/>
            </div>
          ) : (
          <div>
          {/* <SideBar /> */}
          <Health setEvents={setEvents}/>
          </div>
          )}
    </div>

  );
}

export default App;