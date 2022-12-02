import React from 'react'

//import { Col, Divider, Row } from 'antd';

import './App.css';


//some changes
//import { Layout } from 'antd';
//import { Button } from 'antd';
import Header from './Components/Header';
import MainInterface from './Components/MainInterface';
import SideBar from './Components/SideBar';
import Meals from  './Components/ZMeals';
import LeftBar from './Components/ZLeftBar';
import ZHeader from './Components/ZHeader';
function App() {


  return (

    <div className='App'>
      <ZHeader/>
      <Meals/>

      <LeftBar/>

{/*                   
      <Header />
    
      <SideBar />
      
      <MainInterface /> */}
      
    </div>





  );
}

export default App;