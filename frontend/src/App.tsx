import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import ApplicationRoutes from './ApplicationRoutes';
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
      <div className='App' style={ { height: '100%' } }>
        <MainLayout>
          <ApplicationRoutes />
        </MainLayout>
      </div>
    </BrowserRouter>
  );
}

export default App;