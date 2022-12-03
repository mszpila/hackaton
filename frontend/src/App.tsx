import React, { useState } from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import ApplicationRoutes from './ApplicationRoutes';
import Header from './Components/Header';
import Health from './Components/Health';
import MainInterface from './Components/MainInterface';
import MainLayout from './components/MainLayout';

export interface TypeEvents {
  title: string,
  start?: string,
  end?: string,
  date?: string
}

function App() {

  const [selectedView, setSelectedView] = useState('MainInterface');
  return (
    <BrowserRouter>
      <div className='App'>
        <MainLayout>
          <ApplicationRoutes />
        </MainLayout>
      </div>
    </BrowserRouter>
  );
}

export default App;